import { h1, addNode } from "../bin/reactive-model.js"

if (location.href.toString().endsWith("simple-watch.html")) {
  addNode(
    document.getElementById("page-heading"),
    h1`content=${"Simple Watch"}`
  )
  loadWatch()
} else {
  addNode(document.getElementById("page-heading"), h1`content=${"Todos"}`)
  loadTodo()
}

function loadTodo() {
  import("./Todos/TodoInput.js").then((m) => {
    m.addTodInputBox()
    m.todoListView()
  })
}

function loadWatch() {
  import("./DigitalWatch/index.js")
    .then((module) => {
      module.startClock()
    })
    .catch((e) => console.log(e, e.stack))
}
