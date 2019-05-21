import editorHTML         from './editor.html'
import editorControlsHTML from './editor.controls.html'
import {
  createPieceBtnClick,
  editorControlPaneHandler,
  tileListBtnClick
}                         from './editor.controls'
import {pieceList}        from './editor.pieces'
import {
  editorDocumentClick,
  editorDocumentMousedown,
  editorDocumentMousemove,
  editorDocumentMouseup
}                         from './editor.events'


export const editorGridDefaultHeight = 40
export const editorGridDefaultWidth = 40
export const editorPieces = []
export const editor = {
  blueprint: '',
  dragging: false,
  events: {
    click: editorDocumentClick
  },
  load: () => {
    // Add editor html which contains the draggable pieces
    const editor = document.createElement('div')
    editor.id = 'editor'
    editor.innerHTML = editorHTML
    document.body.appendChild(editor)

    // Add controls for editor
    const editorControls = document.createElement('div')
    editorControls.id = 'editor-controls-wrap'
    editorControls.innerHTML = editorControlsHTML
    document.body.appendChild(editorControls)

    // Add event listener and list of available pieces
    const tileButtons = document.getElementById('tile-btns')
    tileButtons.addEventListener('click', createPieceBtnClick)
    Object.keys(pieceList).forEach(key => {
      const addPieceBtn = document.createElement('button')
      addPieceBtn.innerText = key
      addPieceBtn.dataset['piece'] = key
      tileButtons.appendChild(addPieceBtn)
    })

    // Add event listener for list of used pieces
    document.getElementById('tile-list').addEventListener('click', tileListBtnClick)

    document.getElementById('editor-controls').addEventListener('click', editorControlPaneHandler)
    document.getElementById('editor-controls').addEventListener('mousedown', editorControlPaneHandler)

    document.addEventListener('mousedown', editorDocumentMousedown)
    document.addEventListener('mousemove', editorDocumentMousemove)
    document.addEventListener('mouseup', editorDocumentMouseup)
    document.body.classList.add('editor-open')
  },
  unload: () => {
    editorPieces.length = 0
    document.body.removeChild(document.getElementById('editor'))
    document.body.removeChild(document.getElementById('editor-controls-wrap'))
    document.removeEventListener('mousedown', editorDocumentMousedown)
    document.removeEventListener('mousemove', editorDocumentMousemove)
    document.removeEventListener('mouseup', editorDocumentMouseup)
    document.body.classList.remove('editor-open')
  },
  grid: {
    height: editorGridDefaultHeight,
    width: editorGridDefaultWidth
  },
  style: {
    // hexes: {
    //   fill: '#000'
    // },
    // noHexes: {
    //   line: hex => (
    //     hex.x === 0 ||
    //     hex.y === 0 ||
    //     hex.x === board.gridSize.width - 1 ||
    //     hex.y === board.gridSize.height - 1
    //   ) ? '#0000' : '#222'
    // },
    // wallHexes: {
    //   fill: '#00f4'
    // },
    hexHover: '#32005080',
    noHexHover: '#50003280',
    // thinWalls: {
    //   line: '#f00',
    //   width: 8
    // }
  }
}
