

const template = document.createElement('template')
template.innerHTML = `
<h1></h1>
`

customElements.define('my-counter',
  class extends HTMLElement {
    count
    constructor() {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      this.counter = this.shadowRoot.querySelector('h1')
    }

    static get observedAttributes() {

    }

    attributeChangedCallback(name, oldValue, newValue) {


    }

    connectedCallback() {

    }

    setCount(limit = 20) {
      this.count = limit
    }

    startCountdown() {
      this.intervalID = setTimeout(() => {
        this.counter.innerText = this.count--
        this.startCountdown()
      }, 1000)
      if (this.count === -1) {
        this.dispatchEvent(new window.CustomEvent('zero'))
      }
    }

    clearCountdown() {
      clearTimeout(this.intervalID)
    }
  })
