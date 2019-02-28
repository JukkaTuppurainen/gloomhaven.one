import controlHTML from './editor.controls.html'
import {scenarioLoad} from '../lib/Board.scenarioLoad'
import {render} from '../index'


const editorChange = () => {
  let newHeight = parseInt(document.getElementById('grid-height').value, 10)
  let newWidth = parseInt(document.getElementById('grid-width').value, 10)
  if (newHeight > 100) {
    newHeight = 100
  }
  if (newWidth > 100) {
    newWidth = 100
  }
  scenario.grid = {
    height: newHeight,
    width: newWidth
  }
  scenarioLoad(scenario)
  render()
}

let defaultHeight = 8
let defaultWidth = 12

export const scenario = {
  load: () => {
    const controls = document.createElement('div')
    controls.id = 'editor-controls'
    controls.innerHTML = controlHTML

    document.body.appendChild(controls)

    const gh = document.getElementById('grid-height')
    gh.value = scenario.grid.height
    gh.addEventListener('change', editorChange)

    const gw = document.getElementById('grid-width')
    gw.value = scenario.grid.width
    gw.addEventListener('change', editorChange)
  },
  unload: () => {
    document.body.removeChild(document.getElementById('editor-controls'))
  },
  grid: {
    height: defaultHeight,
    width: defaultWidth
  },
  noHexes: [],
  wallHexes: [],
  style: {
    hexes: {
      line: '#ccc'
    },
    noHexes: {
      line: '#888'
    },
    walls: {
      fill: '#0008',
      line: '#888'
    }
  }
}
