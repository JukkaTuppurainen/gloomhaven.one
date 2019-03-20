const hooks = {}

export const addAction = (action, f) => {
  if (!hooks[action]) {
    hooks[action] = []
  }

  hooks[action].push(f)
}

export const doAction = (action, ...b) => {
  if (hooks[action]) {
    hooks[action].forEach(f => f(...b))
  }
}

export const removeAction = (action, f) => {
  if (!hooks[action]) {
    return
  }

  hooks[action] = hooks[action].filter(a => a !== f)
}
