import { createReactiveModel, div, addNode } from "../../bin/reactive-model.js"

const [watch, setWatch, addSubscriber] = createReactiveModel(new Date())

function renderWatch(date, init = false) {
  const parent = init ? document.getElementById("watch-container") : null
  addNode(parent, div`content=${date.toString()} id=${"watch"}`)
}

addSubscriber(renderWatch)

const startClock = () => {
  renderWatch(watch.value, true)

  setInterval(() => {
    setWatch(new Date())
  }, 10)
}

export { startClock }
