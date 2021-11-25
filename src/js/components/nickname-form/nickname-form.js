



const template = document.createElement('template')
template.innerHTML = `
<div id="container">
  <label>Please choose a nickname and press Submit to start the game</label>
  <input type="text">
  <button>Submit</button>
  <h2><h2>
</div>
 
`

customElements.define('nickname-form',
  class extends HTMLElement {

    nameInput
    userNickname

    constructor() {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.nicknameInput = this.shadowRoot.querySelector('input')
      this.namelabel = this.shadowRoot.querySelector('label')
      this.button = this.shadowRoot.querySelector('button')
      this.h2 = this.shadowRoot.querySelector('h2')
      this.container = this.shadowRoot.querySelector('#conatainer')

      this.button.addEventListener('click', (event) => {
        this.dispatchEvent(new window.CustomEvent('start'))
        this.userNickname = this.nicknameInput.value
        this.h2.innerText = `Welcome ${this.userNickname}! Let´s play!`
      })
    }

    static get observedAttributes() {

    }

    attributeChangedCallback(name, oldValue, newValue) {


    }

    connectedCallback() {

    }
  })
