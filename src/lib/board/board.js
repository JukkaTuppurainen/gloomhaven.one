import * as Honeycomb from 'honeycomb-grid/src/honeycomb'

import {scenarioLoad} from './board.scenarioLoad'
import {scenarioList} from '../../scenarios'
import {
  boardClick,
  boardMousemove
}                     from './board.events'


const hexSize = 60
const orientation = 'flat' // 'pointy'

const Grid = Honeycomb.defineGrid(Honeycomb.extendHex({
  size: hexSize,
  orientation
}))

const defaultEvents = {
  click: boardClick,
  mousemove: boardMousemove
}

const eventHandler = (eventName, event) => {
  if (
    board.scenario &&
    board.scenario.events &&
    board.scenario.events[eventName]
  ) {
    board.scenario.events[eventName](event)
  } else if (defaultEvents[eventName]) {
    defaultEvents[eventName](event)
  }
}

const board = {
  events: eventHandler,
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
    delete board.playerHex
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
