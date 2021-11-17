

const template = document.createElement('template')
template.innerHTML = `
<div id="container">

  <h2 id="messageH2"></h2>
  <h2 id="questionH2"></h2>
  <input id="questInput" type="text">
  <button>Submit Answer</button>
  <div id = "questionButtons"></div>
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
      this.form = this.shadowRoot.querySelector('form')
      this.questionButtons = this.shadowRoot.querySelector('#questionButtons')
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
          button.addEventListener('click', () => {
            this.sendAnswer(key)
          })
          this.questionButtons.appendChild(button)
        }
      }
    }

    async sendAnswer (theAnswer) {
      const postAnswer = await window.fetch(this.nextURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer: theAnswer })
      })

      const postAnswerObj = await postAnswer.json()
      console.log(postAnswerObj)
      this.nextURL = postAnswerObj.nextURL
      this.message.innerText = postAnswerObj.message
      this.getQuestion()
    }

    static get observedAttributes () {

    }

    attributeChangedCallback (name, oldValue, newValue) {

    }

    connectedCallback () {
      this.getQuestion()
      this.button.addEventListener('click', () => {
        const value = this.input.value
        this.sendAnswer(value)
      })
    }
  })
