import * as Honeycomb from 'honeycomb-grid/src/honeycomb'

import {
  scenarioInit,
  scenarioLoad
}                     from './board.scenarioLoad'
import {
  boardClick,
  boardMouseLeave,
  boardMousemove
}                     from './board.events'
import {
  generatePiecesFromLayoutString
}                     from './board.functions'
import {editor}       from '../editor/editor'
import {scenarioList} from '../scenarios'


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
  mousemove: boardMousemove,
  mouseleave: boardMouseLeave
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
  loadScenario: id => {
    if (board.scenario !== null) {
      board.unload()
    }

    let scenario
    if (id === 'editor') {
      scenario = editor
    } else {
      scenario = scenarioList[id]
    }

    if (scenario.load) {
      scenario.load()
    }

    scenarioInit()

    if (scenario.layout) {
      generatePiecesFromLayoutString(scenario.layout)
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
  },
  style: {
    // hexes: {
    //   fill: '#000'
    // },
    // noHexes: {
    //   line: '#222'
    // },
    // wallHexes: {
    //   fill: '#00f4'
    // },
    hexHover: '#32005080',
    noHexHover: '#58002460',
    // thinWalls: {
    //   line: '#f00',
    //   width: 8
    // }
  }
}
