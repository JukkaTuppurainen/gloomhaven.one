import './toggle.css'


const options = [{
  color: 'orange',
  name: 'Play'
}]

if (/* global ENV_isAlpha */ ENV_isAlpha) {
  options.push({
    color: '#74dc6d',
    name: 'Monsters'
  })
}

options.push({
  color: '#aaf',
  name: 'Editor'
})

const toggleContainer = document.getElementById('q')

const toggleTitle = document.createElement('div')
toggleTitle.classList.add('tt')
toggleTitle.innerText = 'Mode'

const toggleElement = document.createElement('div')
toggleElement.classList.add('t')

const toggleVisual = document.createElement('div')
toggleVisual.classList.add('tv')
toggleVisual.style.backgroundColor = options[0].color
toggleElement.appendChild(toggleVisual)

const radioButtons = document.createElement('div')
radioButtons.id = 'tr'
radioButtons.addEventListener('change', event => {
  const value = event.target.value
  const valueIndex = options.findIndex(o => o.name === value)
  toggleVisual.style.backgroundColor = options[valueIndex].color
  toggleVisual.style.left = (2 + (44 * valueIndex)) + 'px'
})
toggleElement.appendChild(radioButtons)

const scenarioSelect = document.getElementById('s')

let currentOptions

const updateCurrentOptions = () => {
  currentOptions = options.filter(o => {
    if (o.name === 'Editor') {
      return scenarioSelect.value === 'editor'
    }
    return true
  })
}

const updateRadioButtons = () => {
  updateCurrentOptions()

  radioButtons.innerHTML = ''
  toggleVisual.style.backgroundColor = options[0].color
  toggleVisual.style.left = '2px'

  currentOptions.forEach((option, i) => {
    const radioElement = document.createElement('input')
    radioElement.id = `tr_${i}`
    radioElement.name = 'tr_'
    radioElement.title = option.name
    radioElement.type = 'radio'
    radioElement.value = option.name

    if (i === 0) {
      radioElement.checked = true
    }

    radioButtons.appendChild(radioElement)
  })

  toggleElement.style.width = ((currentOptions.length - 1) * 44 + 32) + 'px'
  toggleContainer.style.display = currentOptions.length < 2 ? 'none' : 'flex'
}

setTimeout(updateRadioButtons)

toggleContainer.appendChild(toggleTitle)
toggleContainer.appendChild(toggleElement)

scenarioSelect.addEventListener('change', updateRadioButtons)

document.addEventListener('keydown', event => {
  updateCurrentOptions()

  let key = parseInt(event.key, 10)

  if (!isNaN(key)) {
    --key

    const currentMode = document.querySelector('[name=tr_]:checked').value
    const currentModeIndex = options.findIndex(o => o.name === currentMode)

    if (key >= 0 && key < currentOptions.length && key !== currentModeIndex) {
      const radioButton = document.getElementById(`tr_${key}`)
      radioButton.checked = true
      radioButton.focus()
      radioButton.dispatchEvent(new Event('change', {bubbles: true}))
    }
  }
})
