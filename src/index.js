import { h1, addNode } from "../bin/reactive-model.js"
import { addTodInputBox, todoListView } from "./Todos/TodoInput.js"
import { startClock } from "./DigitalWatch/index.js"

addNode(document.getElementById("page-heading"), h1`content=${"Todos"}`)

addTodInputBox()
todoListView()
startClock()
