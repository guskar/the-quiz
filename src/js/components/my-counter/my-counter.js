

const template = document.createElement('template')
template.innerHTML = `
<h1></h1>
`

customElements.define('my-counter',
class extends HTMLElement {

    constructor() {
      super()

      this.count = 20

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      this.counter = this.shadowRoot.querySelector('h1')
    }

    static get observedAttributes () {

    }

    attributeChangedCallback (name, oldValue, newValue) {
        
       
    }

    connectedCallback () {
      this.counter.innerText = this.count
      this.startCountdown()
    }

    startCountdown () {
      this.intervalID = setTimeout(() => {
        this.counter.innerText = this.count--
        this.startCountdown()
      }, 1000)
    }

    clearCountdown () {
      clearTimeout(this.intervalID)
    }
  })
