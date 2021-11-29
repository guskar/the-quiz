

const template = document.createElement('template')
template.innerHTML = `
<h1></h1>
`

customElements.define('my-counter',
  class extends HTMLElement {
    totalTimeLeft = 0
    count
    score = 0
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
      this.timeoutID = setTimeout(() => {
        this.counter.innerText = --this.count
        if (this.count === 0) {
          this.dispatchEvent(new window.CustomEvent('zero'))
          clearTimeout(this.timeoutID)
          return
        }
        if (this.count <= 4) {
          this.counter.style.color = 'red'
        } else {
          this.counter.style.color = 'black'
        }
        this.score++
        this.startCountdown()
      }, 1000)
    }

    clearCountdown() {
      clearTimeout(this.timeoutID)
    }
  })
