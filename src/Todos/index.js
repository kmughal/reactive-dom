import { h1, addNode } from "../../bin/reactive-model.js"
import { addTodInputBox, todoListView } from "../Todos/InputTodo/TodoInput.js"

addNode(document.getElementById("page-heading"), h1`content=${"Todos"}`)
addTodInputBox()
todoListView()
