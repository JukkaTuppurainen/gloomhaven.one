import {
  hexHeight,
  hexWidth
}                     from './board.constants'
import {
  boardClick,
  boardMouseLeave,
  boardMousemove
}                     from './board.events'
import {
  generatePiecesFromLayoutString
}                     from './board.functions'
import {
  scenarioInit,
  scenarioLoad
}                     from './board.scenarioLoad'
import {scenarioList} from '../scenarios'


export const cornersCoordinates = {
  0: {x: hexWidth,       y: hexHeight / 2},
  1: {x: hexWidth * .75, y: hexHeight},
  2: {x: hexWidth * .25, y: hexHeight},
  3: {x: 0,              y: hexHeight / 2},
  4: {x: hexWidth * .25, y: 0},
  5: {x: hexWidth * .75, y: 0}
}

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
  items: [],
  loadScenario: id => {
    if (board.scenario !== null) {
      board.unload()
    }

    let scenarioPromise

    if (id === 'editor') {
      scenarioPromise = import('../editor/editor').then(s => s.editor)
    } else {
      scenarioPromise = Promise.resolve({
        name: scenarioList[id][0],
        layout: scenarioList[id][1]
      })
    }

    return scenarioPromise.then(scenario => {
      if (scenario.load) {
        scenario.load()
      }

      scenarioInit()

      if (scenario.layout) {
        generatePiecesFromLayoutString(scenario.layout)
      }

      scenarioLoad(scenario)

      return scenario
    })
  },
  losMode: false,
  mouseHex: {
    x: null,
    y: null
  },
  pxOffset: 0,
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
  style: {
    hexHover: '#32005080',
    noHexHover: '#58002460'
  }
}
