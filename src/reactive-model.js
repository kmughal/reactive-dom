function createReactiveModel(defaultValue = null) {
  const list = []

  function publish(_v) {
    for (const i in list) {
      if (Object.is(list[i].reference, _v)) {
        list[i].callback(_v.value)
        if (list[i].attachEvents) {
          for (let e in list[i].attachEvents) {
            document
              .getElementById(list[i].attachEvents[e].id)
              .addEventListener(
                list[i].attachEvents[e].event,
                list[i].attachEvents[e].method
              )
          }
        }
      }
    }
  }

  return new (function () {
    let _value = { value: defaultValue }

    function addSubscriber(markupFunc, parentId, eleId) {
      var sameref = false
      for (let i in list) {
        var f = Object.is(list[i].reference, _value)
        if (f) sameref = true
      }

      if (sameref) return
      list.push({
        reference: _value,
        callback: function (data) {
          const html = markupFunc(data)
          if (!parentId && !eleId) return
          const parent = document.getElementById(parentId)
          if (parent) addNode(parent, html)
          else {
            const ele = document.getElementById(eleId)
            addNode(null, html, ele)
          }
        },
      })
    }
    function updater(value) {
      _value.value = value
      publish(_value)
    }
    return [_value, updater, addSubscriber]
  })()
}

const createElement = (tagName, subType) => (strings, ...args) => {
  const events = []
  const props = []
  if (String(strings).indexOf("=") === -1) {
    props.push({ name: "content", value: strings.join("").trim() })
  } else
    for (let index in strings) {
      var part = String(strings[index]).replace("=", "").replace(" ", "")
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
    if (
      prop.name !== "children" &&
      prop.value &&
      String(prop.value).trim()?.length
    )
      ele.setAttribute(prop.name, prop.value)
    else if (prop.name === "children") children = prop
  }

  const contents = findPropertyWithValue(component.props, "content")
  if (contents.length && String(contents[0].value).trim().length > 0)
    ele.textContent = contents[0].value

  for (let event of component.events) {
    ele.addEventListener(event.name, event.handler)
  }

  if (children) {
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
const numberBox = createElement("input" , "number")
const form = createElement("form")

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
  form
}
