import '../nickname-form/index.js'
import '../my-counter/index.js'

const template = document.createElement('template')
template.innerHTML = `
<div id="container">
  <nickname-form id="nickname"></nickname-form>   
  <h2 id="messageH2"></h2>
  <h2 id="questionH2"></h2>
  <input id="questInput" type="text">
  <form id="multiChoiceForm"></form>    
  <button>Submit Answer</button>
  <my-counter></my-counter>
  <ol id="highscorelist"></ol>
  
</div>
`

customElements.define('quiz-application',
  class extends HTMLElement {
    nextURL = 'https://courselab.lnu.se/quiz/question/1'
    highscoreList = []

    constructor() {
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

      this.nicknameForm.addEventListener('start', (event) => this.startGame())
      this.button.addEventListener('click', (event) => this.submitRadiobutton())
      this.input.addEventListener('keypress', (event) => this.useEnterToSubmit(event))
      this.counter.addEventListener('zero', (event) => this.gameOver())
    }

    static get observedAttributes() {

    }

    attributeChangedCallback(name, oldValue, newValue) {

    }

    connectedCallback() {

    }

    async getQuestion() {
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
      }
      this.counter.setCount(respObj.limit)
    }

    async sendAnswer(theAnswer) {
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
      this.getQuestion()
    }

    submitRadiobutton() {
      const radioChecked = this.shadowRoot.querySelector('input[name="multichoice"]:checked')
      if (radioChecked) {
        const value = radioChecked.id
        this.sendAnswer(value)
      } else {
        const value = this.input.value
        this.sendAnswer(value)
      }
    }

    useEnterToSubmit(event) {
      if (event.key === 'Enter') {
        const value = this.input.value
        this.sendAnswer(value)
      }
    }

    storeResultAndNickname(nickname, score) {
      const nameAndScore = { name: nickname, score: score }
      this.highscoreList.push(nameAndScore)
      localStorage.setItem('highscore', JSON.stringify(this.highscoreList))
      this.highscore = JSON.parse(localStorage.getItem('highscore'))
      this.highscore.forEach(element => {
        const highscoreElement = document.createElement('li')
        highscoreElement.innerText = `Name: ${element.name}, Score: ${element.score}`
        this.ol.appendChild(highscoreElement)
      })
      this.dispatchEvent(new window.CustomEvent('updated'))
    }

    startGame() {
      this.getQuestion()
      this.counter.startCountdown()
    }

    gameOver() {
      this.counter.clearCountdown()
      this.nextURL = 'https://courselab.lnu.se/quiz/question/1'
      this.message.innerText = 'GAME OVER'
      this.quest.innerText = 'Better luck next time!'
      this.input.style.display = 'none'
      this.button.style.display = 'none'
      this.counter.style.display = 'none'
      this.counter.score = 0
    }

    allQuestionsAnswered() {
      this.counter.clearCountdown()
      this.counter.style.display = 'none'
      this.multiChoiceForm.innerHTML = ''
      this.nicknameForm.textContent = ''
      this.button.style.display = 'none'
      this.nextURL = 'https://courselab.lnu.se/quiz/question/1'

      this.quest.innerText = `CONGRATS ${this.nicknameForm.userNickname}! All questions answered and your score is: ${this.counter.score}`
      this.storeResultAndNickname(this.nicknameForm.userNickname, this.counter.score)
      this.counter.score = 0
    }
  })
