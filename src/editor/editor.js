import editorControlsHTML from './editor.controls.html'
import {
  editorToggleChange,
  setEditorOff,
  tileSelectChange,
  updateTileSelectOptions
}                         from './editor.controls'
import {deleteAllPieces}  from './editor.functions'
import {
  editorClick,
  editorDocumentMousedown,
  editorDocumentMousemove,
  editorDocumentMouseup,
  editorTouchend,
  editorTouchmove,
  editorTouchstart
}                         from './editor.events'
import {board}            from '../board/board'
import {stopPropagation}  from '../index'


export const editor = {
  dragging: false,
  events: {
    click: editorClick
  },
  hoverPiece: -1,
  load: () => {
    board.editor = true

    // Add controls for editor
    const editorControls = document.getElementById('e')
    editorControls.innerHTML = editorControlsHTML

    // Tile creation select
    const tileSelect = document.getElementById('tile-select')
    tileSelect.addEventListener('change', tileSelectChange)
    setTimeout(updateTileSelectOptions)

    document.getElementById('dt').addEventListener('click', deleteAllPieces)
    document.getElementById('tr').addEventListener('change', editorToggleChange)

    editorControls.addEventListener('click', stopPropagation)
    editorControls.addEventListener('mousedown', stopPropagation)

    document.addEventListener('mousedown', editorDocumentMousedown)
    document.addEventListener('mousemove', editorDocumentMousemove)
    document.addEventListener('mouseup', editorDocumentMouseup)
    document.addEventListener('touchend', editorTouchend)
    document.addEventListener('touchmove', editorTouchmove, {passive: false})
    document.addEventListener('touchstart', editorTouchstart)
    document.body.classList.add('editor-open')

    if (editor.layout) {
      setTimeout(() => window.location.hash = `:${editor.layout}`)
    }

    if (
      window.location.hash &&
      window.location.hash.substr(0, 2) === '#:'
    ) {
      editor.layout = window.location.hash.substr(2)
    }
  },
  unload: () => {
    board.editor = false
    editor.layout = window.location.hash.substr(2)
    setEditorOff()
    const editorControls = document.getElementById('e')
    editorControls.innerHTML = ''
    editorControls.removeEventListener('click', stopPropagation)
    editorControls.removeEventListener('mousedown', stopPropagation)
    document.removeEventListener('mousedown', editorDocumentMousedown)
    document.removeEventListener('mousemove', editorDocumentMousemove)
    document.removeEventListener('mouseup', editorDocumentMouseup)
    document.removeEventListener('touchend', editorTouchend)
    document.removeEventListener('touchmove', editorTouchmove)
    document.removeEventListener('touchstart', editorTouchstart)
    document.body.classList.remove('editor-open', 'editor-on')

    const dragShadow = document.getElementById('drag-shadow')
    if (dragShadow) {
      document.body.removeChild(dragShadow)
    }
  }
}
