import {scenarioList} from '../../src/scenarios'


export const initGlobalMocks = () => {
  scenarioList['test1'] = ['', '1aN1a']

  const boardElement = document.createElement('div')
  const canvasElement = document.createElement('div')
  boardElement.id = 'board'
  canvasElement.id = 'c'
  document.body.appendChild(boardElement)
  document.body.appendChild(canvasElement)
}
