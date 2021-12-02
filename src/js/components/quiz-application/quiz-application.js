
/**
 * The quiz-application web component module.
 *
 * @author Gustav Karlberg <gk222iv@student.lnu.se>
 */

import '../nickname-form/index.js'
import '../my-counter/index.js'

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  #container{
    font-family: 'Roboto', sans-serif;
    font-family: 'Source Sans Pro', sans-serif;
    width: 600px;
    height: auto;
    border: .3px solid black;
    display: grid;
    padding: 2em;
    background-color: white;
    }

    #nickname {
      display: grid;
      font-size: 25px;
    }

  #multiChoiceForm {
    display: block;
  }

  #counter {
    font-size: 30px;
  }

  #submitBtn {
    height: 40px;
  }

  #questInput {
    height: 40px;
  }
    
</style>
<div id="container">
  <h1>The Quiz</h1>
  <nickname-form id="nickname"></nickname-form>   
  <h2 id="messageH2"></h2>
  <h2 id="questionH2"></h2>
  <my-counter id="counter"></my-counter>
  <input id="questInput" type="text">
  <form id="multiChoiceForm"></form>    
  <button id="submitBtn">Submit Answer</button>
  <slot></slot>
  
</div>
`

customElements.define('quiz-application',
  /**
   * Represents a quiz-application element.
   */
  class extends HTMLElement {
    nextURL = 'https://courselab.lnu.se/quiz/question/1'

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.button = this.shadowRoot.querySelector('button')
      this.quest = this.shadowRoot.querySelector('#questionH2')
      this.message = this.shadowRoot.querySelector('#messageH2')
      this.input = this.shadowRoot.querySelector('#questInput')
      this.container = this.shadowRoot.querySelector('#container')
      this.multiChoiceForm = this.shadowRoot.querySelector('#multiChoiceForm')
      this.counter = this.shadowRoot.querySelector('my-counter')
      this.nicknameForm = this.shadowRoot.querySelector('#nickname')
      this.ol = this.shadowRoot.querySelector('#highscorelist')

      // Add listeners.
      this.nicknameForm.addEventListener('start', (event) => this.startGame())
      this.button.addEventListener('click', (event) => this.submitAnswer())
      this.input.addEventListener('keypress', (event) => this.useEnterToSubmit(event))
      this.counter.addEventListener('zero', (event) => this.gameOver())
    }

    /**
     * Called when the element is added to the DOM.
     */
    connectedCallback () {
      this.highscorelist = localStorage.getItem('highscore') ? JSON.parse(localStorage.getItem('highscore')) : []
    }

    /**
     * Fetches the next question and creates radiobuttons i the answer has alternatives. It also
     * sends the limit to the counter.
     */
    async getQuestion () {
      const resp = await window.fetch(this.nextURL)
      const respObj = await resp.json()
      this.quest.innerText = respObj.question
      this.nextURL = respObj.nextURL
      this.input.style.display = 'block'
      this.button.style.display = 'block'
      this.counter.style.display = 'block'
      this.multiChoiceForm.innerHTML = ''
      this.input.value = ''

      // radiobuttons if alternatives
      if (respObj.alternatives) {
        this.input.style.display = 'none'

        for (const key in respObj.alternatives) {
          const label = document.createElement('label')
          const radioButton = document.createElement('input')

          label.innerText = respObj.alternatives[key]

          radioButton.type = 'radio'
          radioButton.name = 'multichoice'
          radioButton.id = key

          this.multiChoiceForm.appendChild(radioButton)
          this.multiChoiceForm.appendChild(label)
        }
      } if (!respObj.limit) {
        this.counter.setAttribute('limit', 20)
      } else {
        this.counter.setAttribute('limit', respObj.limit)
      }
    }

    /**
     * Posts the answer sent from the input or radiobuttons and invokes the gameOver and allQuestionsAnswered functions.
     *
     * @param {string} theAnswer A  string representing the users answer.
     */
    async sendAnswer (theAnswer) {
      const postAnswer = await window.fetch(this.nextURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer: theAnswer })
      })

      const postAnswerObj = await postAnswer.json()

      // Game over
      if (postAnswer.status === 400) {
        this.gameOver()
        return
      }
      // user made it
      if (!postAnswerObj.nextURL && postAnswer.status === 200) {
        this.allQuestionsAnswered()
        return
      }

      this.nextURL = postAnswerObj.nextURL
      this.message.innerText = postAnswerObj.message
      try {
        this.getQuestion()
      } catch (error) {
        console.log(error.message)
      }
    }

    /**
     * Sends the value from the checked radiobutton as the users answer.
     */
    submitAnswer () {
      const radioChecked = this.shadowRoot.querySelector('input[name="multichoice"]:checked')
      if (radioChecked) {
        const value = radioChecked.id
        this.sendAnswer(value)
      } else {
        const value = this.input.value
        this.sendAnswer(value)
      }
    }

    /**
     * Sends the answer from the input if user uses enter to submit.
     *
     * @param {object} event and object that represents the current event.
     */
    useEnterToSubmit (event) {
      if (event.key === 'Enter') {
        const value = this.input.value
        this.sendAnswer(value)
      }
    }

    /**
     * Stores the user information and score to local storage.
     *
     * @param {string} nickname  A string that represents the user nickname.
     * @param  {number} score  A number that represents the users score.
     */
    storeResultAndNickname (nickname, score) {
      const nameAndScore = { name: nickname, score: score }
      this.highscorelist.push(nameAndScore)
      this.highscorelist.sort((a, b) => a.score - b.score)
      console.log(this.highscorelist)
      const topFive = this.highscorelist.slice(0, 5)
      localStorage.setItem('highscore', JSON.stringify(topFive))
      this.dispatchEvent(new window.CustomEvent('updated'))
    }

    /**
     * Starts the game and the counter.
     */
    startGame () {
      this.getQuestion()
      this.counter.startCountdown()
    }

    /**
     * If the user dont answer in time or sends the wrong answer this function presents a Game over text prepares everything
     * to be ready for the next game.
     */
    gameOver () {
      this.counter.clearCountdown()
      this.nextURL = 'https://courselab.lnu.se/quiz/question/1'
      this.message.innerText = 'GAME OVER'
      this.quest.innerText = 'Better luck next time! \n press Start Game to play again'
      this.input.style.display = 'none'
      this.button.style.display = 'none'
      this.counter.style.display = 'none'
      this.multiChoiceForm.innerHTML = ''
      this.counter.score = 0
    }

    /**
     * If the user answer all the questions this function presents a text and handles everything to start a new game
     * and sends informatione to be stored.
     */
    allQuestionsAnswered () {
      this.counter.clearCountdown()
      this.counter.style.display = 'none'
      this.multiChoiceForm.innerHTML = ''
      this.nicknameForm.textContent = ''
      this.message.innerText = ''
      this.button.style.display = 'none'
      this.nextURL = 'https://courselab.lnu.se/quiz/question/1'

      this.quest.innerText = `CONGRATS ${this.nicknameForm.userNickname}! All questions answered and your score is: ${this.counter.score}. Please press Start Game to play again!`
      this.storeResultAndNickname(this.nicknameForm.userNickname, this.counter.score)
      this.counter.score = 0
    }
  })
