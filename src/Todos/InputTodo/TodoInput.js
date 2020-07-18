import {
  button,
  addNode,
  form,
  textbox,
  label,
  createReactiveModel,
  numberBox,
} from "../../reactive-model.js"

const [name, setName, addNameChangeListener] = createReactiveModel("")
const [age, setAge] = createReactiveModel(0)

addNameChangeListener(console.log)

const children = []

// Name
children.push(label`content=${"Name :"} for=${"txt-name"}`)
children.push(
  textbox`id=${"txt-name"} value=${name.value} onKeyUp=${(e) => {
    setName(e.target.value)
  }}`
)

// Age
children.push(label`content=${"Age :"} for=${"txt-age"}`)
children.push(
  numberBox`id=${"txt-age"} value=${age.value} onKeyUp=${(e) => {
    setAge(e.target.value)
  }}`
)


// Submit Button
children.push(
  button`content=${"Submit"} onClick=${(e) => {
    console.log({ name, age })
  }}`
)

const attachNode = () =>
  addNode(
    document.getElementById("todo-input-box"),
    form`content=${""} children=${children}`
  )

export { attachNode }
