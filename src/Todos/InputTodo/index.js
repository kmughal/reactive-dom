import { h1, addNode } from "../../reactive-model.js"
import { attachNode as createTodInputBox } from "../InputTodo/TodoInput.js"

addNode(document.getElementById("page-heading"), h1`content=${"Todos"}`)
createTodInputBox()
