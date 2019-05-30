import editorControlsHTML from './editor.controls.html'
import {
  createPieceBtnClick,
  tileListBtnClick,
  updateEditorControls
}                         from './editor.controls'
import {
  editorDocumentClick,
  editorDocumentMousedown,
  editorDocumentMousemove,
  editorDocumentMouseup
}                         from './editor.events'
import {board}            from '../board/board'
import {pieceList}        from '../board/board.pieces'
import {stopPropagation}  from '../index'


export const editor = {
  dragging: false,
  events: {
    click: editorDocumentClick
  },
  load: () => {
    board.editor = true

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

    editorControls.addEventListener('click', stopPropagation)
    editorControls.addEventListener('mousedown', stopPropagation)

    document.addEventListener('mousedown', editorDocumentMousedown)
    document.addEventListener('mousemove', editorDocumentMousemove)
    document.addEventListener('mouseup', editorDocumentMouseup)
    document.body.classList.add('editor-open')

    if (
      window.location.hash &&
      window.location.hash.substr(0, 2) === '#:'
    ) {
      editor.layout = window.location.hash.substr(2)
      setTimeout(updateEditorControls)
    }
  },
  unload: () => {
    board.editor = false

    document.body.removeChild(document.getElementById('editor-controls-wrap'))
    document.removeEventListener('mousedown', editorDocumentMousedown)
    document.removeEventListener('mousemove', editorDocumentMousemove)
    document.removeEventListener('mouseup', editorDocumentMouseup)
    document.body.classList.remove('editor-open')

    const dragShadow = document.getElementById('drag-shadow')
    if (dragShadow) {
      document.body.removeChild(dragShadow)
    }
  }
}
