
/**
 * The nickname-form web component module.
 *
 * @author Gustav Karlberg <gk222iv@student.lnu.se>
 */

// Define template
const template = document.createElement('template')
template.innerHTML = `
<div id="container">
  <label>Please choose a nickname and press Start Game</label>
  <input type="text">
  <button>Start Game</button>
  <h2><h2>
</div>
 
`

customElements.define('nickname-form',
/**
 * Represents a quiz-application element.
 */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.nameInput = ''
      this.userNickname = ''

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
  })
