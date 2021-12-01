/**
 * The high-score web component module.
 *
 * @author Gustav Karlberg <gk222iv@student.lnu.se>
 */

import '../quiz-application/index.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
  #container{
    display: flex;
    flex-direction: column;
    align-items: center;
    border: .3px solid black;
    box-shadow: 2px 2px 1px;
    
  }
</style>
<div id="container">
      <h1>Highscore</h1>
      <ol id ="highscoreList"></ol>
      
</div>
`

customElements.define('high-score',
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
      this.highscoreElements = []
      this.ol = this.shadowRoot.querySelector('#highscoreList')
      this.updateHighscoreList()
    }

    /**
     * Gets the highscore from local storage and creates list elements to present highscore on screen.
     */
    updateHighscoreList () {
      this.ol.innerHTML = ''
      const topFive = localStorage.getItem('highscore') ? JSON.parse(localStorage.getItem('highscore')) : []
      topFive.forEach(element => {
        const highscoreElement = document.createElement('li')
        highscoreElement.innerText = `Name: ${element.name}, Score: ${element.score}`
        this.ol.appendChild(highscoreElement)
      })
    }
  })
