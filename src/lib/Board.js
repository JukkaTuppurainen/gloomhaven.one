import * as Honeycomb from 'honeycomb-grid/src/honeycomb'

import {scenarioLoad} from './Board.scenarioLoad'
import {scenarioList} from '../scenarios'


const hexSize = 60
const orientation = 'flat' // 'pointy'

const Grid = Honeycomb.defineGrid(Honeycomb.extendHex({
  size: hexSize,
  orientation
}))

const board = {
  grid: null,
  loadScenario: async id => {
    if (board.scenario !== null) {
      board.unload()
    }

    const scenario = (await scenarioList[id].file).scenario

    if (scenario.load) {
      scenario.load()
    }
    scenarioLoad(scenario)
  },
  losMode: false,
  mouseHex: {
    x: null,
    y: null
  },
  unload: () => {
    if (board.scenario && board.scenario.unload) {
      board.scenario.unload()
    }
    const canvasBackground = document.getElementById('b')
    canvasBackground
      .getContext('2d')
      .clearRect(0, 0, canvasBackground.width, canvasBackground.height)
    board.mouseHex = {
      x: null,
      y: null
    }
  },
  scenario: null,
  settings: {
    hexSize,
    orientation
  }
}

export {
  board,
  Grid
}
