import * as Honeycomb from 'honeycomb-grid/src/honeycomb'

import {scenarioLoad} from './board.scenarioLoad'
import {
  boardClick,
  boardMousemove
}                     from './board.events'
import {editor}       from '../editor/editor'


const hexSize = 45
const orientation = 'flat' // 'pointy'

export const Hex = Honeycomb.extendHex({
  size: hexSize,
  orientation
})

const exampleHex = Hex()
export const Grid = Honeycomb.defineGrid(Hex)

export const cornersCoordinates = exampleHex.corners()
export const hexHeight = exampleHex.height()
export const hexWidth = exampleHex.width()

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

export const board = {
  events: eventHandler,
  grid: null,
  loadScenario: () => {
    if (board.scenario !== null) {
      board.unload()
    }

    const scenario = editor

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
