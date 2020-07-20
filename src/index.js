import { h1, addNode } from "../bin/reactive-model.js"

if (location.pathname === "/index.html") {
  addNode(document.getElementById("page-heading"), h1`content=${"Todos"}`)
  loadTodo()
} else if (location.pathname === "/simple-watch.html") {
  addNode(
    document.getElementById("page-heading"),
    h1`content=${"Simple Watch"}`
  )
  loadWatch()
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
