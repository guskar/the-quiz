
/**
 * The my-counter web component module.
 *
 * @author Gustav Karlberg <gk222iv@student.lnu.se>
 */

const template = document.createElement('template')
template.innerHTML = `
<h1></h1>
`

customElements.define('my-counter',
  /**
   * Represents a my-counter element.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.count = 0
      this.score = 0
      this.counter = this.shadowRoot.querySelector('h1')
    }

    /**
     * Watches the attribute "limit" for changes on the element.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['limit']
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'limit') {
        this.count = newValue
      }
    }

    /**
     * Called when the element is added to the DOM.
     */
    connectedCallback () {
      this.counter.innerText = this.count
    }

    /**
     * Sets the limit on the counter.
     *
     * @param {number} limit A number that represents the limit of the counter.
     */
    // setCount (limit = 20) {
    //   this.count = limit
    // }

    /**
     * Starts the counter and dispatches the zero event.
     */
    startCountdown () {
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

    /**
     * Clears Timeout.
     */
    clearCountdown () {
      clearTimeout(this.timeoutID)
    }
  })
