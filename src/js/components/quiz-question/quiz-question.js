

const template = document.createElement('template')
template.innerHTML = `
<div id="container">

  <h2 id="messageH2"></h2>
  <h2 id="questionH2"></h2>
  <input id="questInput" type="text">
  <button>Submit Answer</button>
  <div id = "questionButtons"></div>
  <my-counter></my-counter>
</div>

`

customElements.define('quiz-question',
  class extends HTMLElement {
   
    nextURL = 'https://courselab.lnu.se/quiz/question/1'


    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.button = this.shadowRoot.querySelector('button')
      this.quest = this.shadowRoot.querySelector('#questionH2')
      this.message = this.shadowRoot.querySelector('#messageH2')
      this.input = this.shadowRoot.querySelector('#questInput')
      this.container = this.shadowRoot.querySelector('#container')
      this.questionButtons = this.shadowRoot.querySelector('#questionButtons')
      this.counter = this.shadowRoot.querySelector('my-counter')
    }

    async getQuestion () {
      const resp = await window.fetch(this.nextURL)
      const respObj = await resp.json()
      console.log(respObj)
      this.quest.innerText = respObj.question
      this.nextURL = respObj.nextURL
      this.input.style.display = 'block'
      this.button.style.display = 'block'
      this.questionButtons.innerHTML = ''
      this.input.value = ''

      if (respObj.alternatives) {
        this.input.style.display = 'none'
        this.button.style.display = 'none'

        for (const key in respObj.alternatives) {
          const button = document.createElement('button')
          button.innerText = respObj.alternatives[key]
          button.addEventListener('click', (event) => {
            this.sendAnswer(key)
          })
          this.questionButtons.appendChild(button)
        }
      }
      this.counter.setCount(respObj.limit)
      this.counter.startCountdown()
    }

    async sendAnswer (theAnswer) {
      const postAnswer = await window.fetch(this.nextURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer: theAnswer })
      })
        console.log(postAnswer)
    
      const postAnswerObj = await postAnswer.json()
      if (postAnswer.status === 400) {
        this.quest.innerText = 'GAME OVER'
        console.log('hej')
      }
      if (!postAnswerObj.nextURL && postAnswer.status === 200) {
        this.quest.innerText = 'CONGRATS! All questions answered and your score is ?'
      }
      
      console.log(postAnswerObj)
      this.nextURL = postAnswerObj.nextURL
      this.message.innerText = postAnswerObj.message
      this.counter.clearCountdown()
      this.getQuestion()
    }

    static get observedAttributes () {

    }

    attributeChangedCallback (name, oldValue, newValue) {

    }

    connectedCallback () {
      this.getQuestion()
      this.button.addEventListener('click', (event) => {
        const value = this.input.value
        this.sendAnswer(value)
      })
      this.counter.addEventListener('zero', (event) => {
        this.counter.clearCountdown()
        this.message.innerText = 'GAME OVER'
        this.quest.innerText = 'Better luck next time!'
      })
    }
  })
