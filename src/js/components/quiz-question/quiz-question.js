

const template = document.createElement('template')
template.innerHTML = `
<div id="container">
<h2 id="messageH2"></h2>
<h2 id="questionH2"></h2>
<input id="questInput" type="text">
<button>Submit Answer</button>

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
    }

    async getQuestion () {
      const resp = await window.fetch(this.nextURL)
      const respObj = await resp.json()
      console.log(respObj)
      this.quest.innerText = respObj.question
      this.nextURL = respObj.nextURL

      if (respObj.alternatives) {
        this.input.style.display = 'none'
        this.button.style.display = 'none'
        const radioSubmitButton = document.createElement('button')
        radioSubmitButton.innerText = 'submit Answer'
        this.container.appendChild(radioSubmitButton)

        for (const key in respObj.alternatives) {
          const radiobox = document.createElement('input')
          radiobox.type = 'radio'
          radiobox.name = 'answer'
          radiobox.value = respObj.alternatives.key
          this.container.appendChild(radiobox)
          const label = document.createElement('label')
          label.innerText = respObj.alternatives[key]
          this.container.appendChild(label)
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
