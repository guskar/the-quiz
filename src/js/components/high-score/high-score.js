import '../quiz-application/index.js'



const template = document.createElement('template')
template.innerHTML = `
<div>
   
      <ol id ="highscoreList"></ol>
      
</div>
`

customElements.define('high-score',
  class extends HTMLElement {
    highscoreElements = []

    constructor() {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.ol = this.shadowRoot.querySelector('#highscoreList')
      //this.addEventListener('updated', (event) => this.updateHighscoreList())
    }

    static get observedAttributes() {

    }

    attributeChangedCallback(name, oldValue, newValue) {

    }

    connectedCallback() {

    }

    updateHighscoreList () {
      console.log('hej')
      this.highscoreElements.push(JSON.parse(localStorage.getItem('highscore')).name)
      for (let i = 0; i < this.highscoreElements.length; i++) {
        const highscoreElement = document.createElement('li')
        highscoreElement.innerText = this.highscoreElements[i]
        this.ol.appendChild(highscoreElement)
      }
    }
  })
