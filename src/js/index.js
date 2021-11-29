/**
 * The main script file of the application.
 *
 * @author // TODO: YOUR NAME <YOUR EMAIL>
 * @version 1.1.0
 */

import './components/quiz-application/index.js'
import './components/my-counter/index.js'
import './components/nickname-form/index.js'
import './components/high-score/index.js'

const highscore = document.querySelector('high-score')
highscore.addEventListener('updated', (event) => this.updateHighscorelist())
