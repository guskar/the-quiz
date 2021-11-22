

const template = document.createElement('template')
template.innerHTML = `
<div id="container">
  <h2 id="messageH2"></h2>
  <h2 id="questionH2"></h2>
  <input id="questInput" type="text">
  <form id="multiChoiceForm"></form>
  <button>Submit Answer</button>
  <my-counter></my-counter>
</div>
`

customElements.define('quiz-question',
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
      this.counter.startCountdown()
    }

    async sendAnswer(theAnswer) {
      // better clear countdown right away, so we dont fail game while fetch is happening...
      this.counter.clearCountdown()

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
        return
      }
      if (!postAnswerObj.nextURL && postAnswer.status === 200) {
        console.log('Total score: ', this.counter.totalTimeLeft)
        this.quest.innerText = 'CONGRATS! All questions answered and your score is: ' + (97 - this.counter.totalTimeLeft)
        return
      }

      // game isn't lost, and we didn't win the game, so get next question etc.

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
      this.getQuestion()

      this.input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          const value = this.input.value
          this.sendAnswer(value)
        }
      })

      this.button.addEventListener('click', (event) => {
        const radioChecked = this.shadowRoot.querySelector('input[name="multichoice"]:checked')
        if (radioChecked) {
          const value = radioChecked.id
          this.sendAnswer(value)
        } else {
          const value = this.input.value
          this.sendAnswer(value)
        }
      })

      this.counter.addEventListener('zero', (event) => {
        this.counter.clearCountdown()
        this.message.innerText = 'GAME OVER'
        this.quest.innerText = 'Better luck next time!'
      })
    }
  })
