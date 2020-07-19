import {
  button,
  addNode,
  form,
  textbox,
  label,
  createReactiveModel,
  div,
  ul,
  li,
} from "../../../bin/reactive-model.js"

const [todoList, setTodoList, addTdoListChangeListener] = createReactiveModel(
  []
)
const [
  singleTodo,
  setSingleTodo,
  addSingleTodoChangeListener,
] = createReactiveModel("")

addSingleTodoChangeListener((data) => console.log("single value : ", data))
addSingleTodoChangeListener(console.log)

addTdoListChangeListener(console.log)
addTdoListChangeListener((data) => {
  const lis = data.map(({ value }) => li`content=${value}`)
  addNode(null, ul`children=${lis}`, document.getElementById("todo-list-view"))
})

const children = []

// Todo Title
children.push(label`content=${"Title :"} for=${"todo-title"}`)
children.push(
  textbox`id=${"todo-title"} 
  name=${"todo-title"}
  value=${singleTodo}
  onKeyUp=${(e) => {
    setSingleTodo(e.target.value)
  }}`
)

// Submit Button
children.push(
  button`content=${"Add"} onClick=${(e) => {
    setTodoList([...todoList.value, singleTodo])
    setSingleTodo("")
    e.preventDefault()
  }}`
)

const addTodInputBox = () =>
  addNode(
    document.getElementById("todo-input-box"),
    form`content=${""} children=${children}`
  )

const todoListView = () => {
  addNode(
    document.getElementById("todo-list-view"),
    div`content=${"Todo List View"}`
  )
}

export { addTodInputBox, todoListView }
