const normalise = (str) =>
  String(str)
    .trim()
    .replace(/[\r\n]+/gm, "")
    .replace(" ", "")

function ReactiveValue(value) {
  this.value = value
}

// TODO In order to share reference this can be done in a different way just for the sake of pub/sub
let _listOfSubscribers = null
function createReactiveModel(defaultValue = null) {
  const list = []
  // TODO reference assignment should be avoided
  _listOfSubscribers = list
  function publish(_v) {
    for (const i in list) {
      if (Object.is(list[i].reference, _v)) {
        const callbacks = list[i].callback
        for (let cb of callbacks) {
          cb(_v.value)
        }
      }
    }
  }

  return new (function () {
    let _value = new ReactiveValue(defaultValue)

    function addSubscriber(callback) {
      // var sameref = false

      const lookup = list.filter((x) => Object.is(x.reference, _value))
      if (lookup.length === 0) {
        list.push({ reference: _value, callback: [callback] })
      } else {
        lookup[0].callback.push(callback)
      }
    }

    function isObject(value) {
      return value !== undefined && value.constructor === Object
    }

    function updater(value) {
      if (Array.isArray(_value.value)) {
        _value.value.length = 0
        value.forEach((v) => {
          _value.value.push(new ReactiveValue(v.value))
        })
      } else if (isObject(_value.value))
        _value.value = { ..._value.value, ...value }
      else _value.value = value

      publish(_value)
    }
    return [_value, updater, addSubscriber]
  })()
}

const createElement = (tagName, subType) => (strings, ...args) => {
  const events = []
  const props = []
  if (String(strings).indexOf("=") === -1) {
    props.push({ name: "content", value: trim(strings.join("")) })
  } else
    for (let index in strings) {
      var part = String(strings[index]).replace("=", "")
      part = normalise(part)
      if (part.length === 0) continue
      part = String(part).toLocaleLowerCase()
      if (part.startsWith("on")) {
        events.push({ name: part.replace("on", ""), handler: args[index] })
      } else {
        props.push({ name: part, value: args[index] })
      }
    }
  if (subType) props.push({ name: "type", value: subType })
  return {
    type: tagName,
    events,
    props,
  }
}

function addNode(parentEl, component, ele = null) {
  let id = null
  const searchId = findPropertyWithValue(component.props, "id")

  if (searchId.length) {
    id = searchId[0].value
    ele = document.getElementById(id)
  }

  if (!ele) {
    ele = document.createElement(component.type)
    parentEl.appendChild(ele)
  }

  let children = null
  for (let prop of component.props) {
    prop.name = normalise(prop.name)
    if (
      prop.name !== "value" &&
      prop.name !== "children" &&
      prop.value &&
      String(prop.value).trim()?.length
    )
      ele.setAttribute(prop.name, prop.value)
    else if (prop.name === "children") children = prop
    else if (
      prop.name === "value" &&
      prop.value.constructor === ReactiveValue
    ) {
      // TODO dangerous!

      const lookup = _listOfSubscribers.filter((x) =>
        Object.is(x.reference, prop.value)
      )

      if (lookup.length) {
        lookup[0].callback.push((data) => {
          // TODO Check this for Radio, Checkbox, Select, File controls
          ele.value = data
        })
      }
    }
  }

  const contents = findPropertyWithValue(component.props, "content")
  if (contents.length && String(contents[0].value).trim().length > 0)
    ele.textContent = contents[0].value

  for (let event of component.events) {
    ele.addEventListener(event.name, event.handler)
  }

  if (children) {
    ele.textContent = null
    for (let child of children.value) {
      addNode(ele, child)
    }
  }

  function findPropertyWithValue(_props, _nameOfProperty) {
    return (
      (_props &&
        _props.push &&
        _props.filter((x) => x.name === _nameOfProperty)) ??
      []
    )
  }
}

const h1 = createElement("h1")
const p = createElement("p")
const div = createElement("div")
const button = createElement("button")
const section = createElement("section")
const textbox = createElement("input", "text")
const label = createElement("label")
const numberBox = createElement("input", "number")
const form = createElement("form")
const ul = createElement("ul")
const ol = createElement("ol")
const li = createElement("li")

export {
  addNode,
  createReactiveModel,
  h1,
  p,
  button,
  section,
  textbox,
  div,
  label,
  numberBox,
  form,
  ul,
  li,
  ol,
}
