import {
  button,
  addNode,
  form,
  textbox,
  label,
  createReactiveModel,
  div,
  ol,
  li,
  p,
} from "../../../bin/reactive-model.js"

const [todoList, setTodoList, addTdoListChangeListener] = createReactiveModel(
  []
)
const [
  singleTodo,
  setSingleTodo,
  addSingleTodoChangeListener,
] = createReactiveModel("")
const noTodActions = p`content=${"No actions added"} class=${"no-action-message"}`

addSingleTodoChangeListener((data) => console.log("single value : ", data))
addSingleTodoChangeListener(console.log)

addTdoListChangeListener(console.log)
addTdoListChangeListener((data) => {
  if (data.length === 0) {
    addNode(
      null,
      noTodActions,
      document.getElementById("todo-list-view")
    )
    return
  }

  const lis = data.map(
    ({ value }) =>
      li`content=${value} class=${"list-style"} children=${[
        p`content=${value}`,
        button`content=${"Delete this"} onClick=${(e) =>
          setTodoList(todoList.value.filter((x) => x.value !== value))}`,
      ]}`
  )

  addNode(null, ol`children=${lis}`, document.getElementById("todo-list-view"))
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
    noTodActions
  )
}

export { addTodInputBox, todoListView }
