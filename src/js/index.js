/**
 * The main script file of the application.
 *
 * @author Gustav Karlberg <gk222iv@student.lnu.se>
 * @version 1.1.0
 */

import './components/quiz-application/index.js'
import './components/high-score/index.js'

const application = document.querySelector('quiz-application')
const highscore = document.querySelector('high-score')
application.addEventListener('updated', (event) => {
  highscore.updateHighscoreList()
})
