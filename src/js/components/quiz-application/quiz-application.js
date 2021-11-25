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
  
</div>
`

customElements.define('quiz-application',
  class extends HTMLElement {
    nextURL = 'https://courselab.lnu.se/quiz/question/1'

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
      this.nicknameForm.addEventListener('start', (event) => this.startGame())
      this.button.addEventListener('click', (event) => this.submitRadiobutton())
      this.input.addEventListener('keypress', (event) => this.useEnterToSubmit(event))
      this.counter.addEventListener('zero', (event) => this.counterAtZero())
    }

    async getQuestion() {
      const resp = await window.fetch(this.nextURL)
      const respObj = await resp.json()
      console.log(respObj)
      this.quest.innerText = respObj.question
      this.nextURL = respObj.nextURL
      this.input.style.display = 'block'
      this.button.style.display = 'block'
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
      // this.counter.startCountdown()
    }

    async sendAnswer(theAnswer) {
      // this.counter.clearCountdown()

      const postAnswer = await window.fetch(this.nextURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer: theAnswer })
      })

      console.log(postAnswer)
      // user failed
      const postAnswerObj = await postAnswer.json()
      if (postAnswer.status === 400) {
        this.quest.innerText = 'GAME OVER'
        return
      }
      // user made it
      if (!postAnswerObj.nextURL && postAnswer.status === 200) {
        this.counter.clearCountdown()
        this.counter.style.display = 'none'
        this.multiChoiceForm.innerHTML = ''
        this.button.style.display = 'none'

        const score = 97 - this.counter.totalTimeLeft
        this.quest.innerText = `CONGRATS ${this.nicknameForm.userNickname}! All questions answered and your score is: ${score}`
        this.storeResultAndNickname(this.nicknameForm.userNickname, score)
        return
      }

      console.log(postAnswerObj)
      this.nextURL = postAnswerObj.nextURL
      this.message.innerText = postAnswerObj.message
      this.getQuestion()
    }

    static get observedAttributes() {

    }

    attributeChangedCallback(name, oldValue, newValue) {

    }

    connectedCallback() {
     
    }

    counterAtZero() {
     // this.counter.clearCountdown()
      this.message.innerText = 'GAME OVER'
      this.quest.innerText = 'Better luck next time!'
      this.input.style.display = 'none'
      this.button.style.display = 'none'
     // this.counter.style.display = 'none'
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

    storeResultAndNickname (nickname, score) {
      const highscoreList = []
      
      const nameAndScore = { name: nickname, score: score }
      highscoreList.push(nameAndScore)
      localStorage.setItem('highscore', JSON.stringify(highscoreList))
      //JSON.parse(localStorage.getItem('highscore'))
    
      console.log(highscoreList)
      this.dispatchEvent(new window.CustomEvent('highscoreUpdated'))
    }

    startGame () {
      this.getQuestion()
      this.counter.startCountdown()
    }
  })
