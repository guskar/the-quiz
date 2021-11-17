

const template = document.createElement('template')
template.innerHTML = `

<h2 id="messageH2"></h2>
<h2 id="questionH2"></h2>
<input id="questInput" type="text">
<button>Submit Answer</button>

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
    }

    async getQuestion () {
      const resp = await window.fetch(this.nextURL)
      const respObj = await resp.json()
      console.log(respObj)
      this.quest.innerText = respObj.question
      this.nextURL = respObj.nextURL
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
