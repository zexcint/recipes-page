export { displayPreparation, resetPreparationValues, startClosingAnimation }
import { createFragment, timeOut } from "./main.js"
import { URL, getDetailsById, getFlags } from "./apiFunctions.js"
import { DOM, CLASS } from "./global.js"
const { jsPDF } = window.jspdf;

const defaultBtn = () => DOM.TEMPLATE[4].cloneNode(true)
const downloadBtn = () => DOM.TEMPLATE[6].cloneNode(true)

const displayPreparation = async () => {
  const json = await getFlags()

  const fragment = createFragment(1)[0]
  const arr = Object.entries(getDetailsById())
  const arr2 = arr.filter(
    (elm) =>
      elm[0].startsWith("strIngredient") &&
      elm[1] !== "" &&
      elm[1] !== " " &&
      elm[1] !== null
  )
  const measure = arr.filter(
    (elm) =>
      elm[0].startsWith("strMeasure") &&
      elm[1] !== "" &&
      elm[1] !== " " &&
      elm[1] !== null
  )
  const ingredient = Array.from(new Set(arr2.map((elm) => elm[1])))

  for (let index = 0; index < ingredient.length; index++) {
    const li = document.createElement("li")
    const img = document.createElement("img")

    li.textContent = `${ingredient?.[index]} - ${measure?.[index]?.[1]}`
    img.src = `${URL.THUMB_INGREDIENT}${ingredient?.[index]}-Small.png`

    if (li.textContent.includes("undefined")) {
      li.textContent = li.textContent.replace("undefined", "")
    }

    fragment.append(li, img)
  }

  DOM.RECIPE_PREPARATION_OL().append(fragment)

  DOM.RECIPE_PREPARATION_ASIDE.append(defaultBtn())

  DOM.RECIPE_PREPARATION_ASIDE.append(downloadBtn())

  DOM.RECIPES().classList.add(CLASS.JS_HIDE)

  DOM.NAVBAR().classList.add(CLASS.JS_HIDE)

  DOM.RECIPE_PREPARATION().classList.remove(CLASS.JS_HIDE)

  DOM.RECIPE_PREPARATION_H2().textContent = getDetailsById().strMeal
  // test
  DOM.RECIPE_PREPARATION_H2().dataset.id = getDetailsById().strMeal

  // DOM.RECIPE_PREPARATION_TEXTAREA().value = getDetailsById().strInstructions
  formatText()

  DOM.RECIPE_PREPARATION_THUMB().src = getDetailsById().strMealThumb

  DOM.RECIPE_PREPARATION_CATEGORY().textContent = getDetailsById().strCategory ?? "empity"

  DOM.RECIPE_PREPARATION_AREA().textContent = getDetailsById().strArea ?? "empity"

  DOM.RECIPE_PREPARATION_TAGS().textContent = getDetailsById().strTags ?? "empity"

  DOM.RECIPE_PREPARATION_LINK().href = getDetailsById().strYoutube

  for (let index = 0; index < json.flags.length; index++) {
    if (json.flags[index].hasOwnProperty(getDetailsById().strArea)) {
      DOM.RECIPE_PREPARATION_AREA().textContent += ` ${
        json.flags[index][getDetailsById().strArea]
      }`
      break
    }
  }

  DOM.RECIPE_PREPARATION_DOWNLOAD().addEventListener("click", saveToPdf)
}

// reset
const resetPreparationValues = () => {
  DOM.RECIPE_PREPARATION_OL().innerHTML = ""
  DOM.RECIPE_PREPARATION_H2().textContent = ""
  DOM.RECIPE_PREPARATION_CATEGORY().textContent = " "
  DOM.RECIPE_PREPARATION_AREA().textContent = ""
  DOM.RECIPE_PREPARATION_TAGS().textContent = ""
  // DOM.RECIPE_PREPARATION_TEXTAREA().value = ""
  DOM.RECIPE_PREPARATION_SECTION().innerHTML = ""
  DOM.RECIPE_PREPARATION_THUMB().src = ""
  DOM.RECIPE_PREPARATION_LINK().href = ""
  // DOM.RECIPE_PREPARATION_ASIDE.removeChild(DOM.RECIPE_PREPARATION_ASIDE.lastElementChild)
  // DOM.RECIPE_PREPARATION_ASIDE.removeChild(DOM.RECIPE_PREPARATION_ASIDE.firstElementChild)
  const buttons = [...DOM.RECIPE_PREPARATION_ASIDE.children].filter(elm => elm.nodeName === "BUTTON")

  for (let index = 0; index < buttons.length; index++) {
    DOM.RECIPE_PREPARATION_ASIDE.removeChild(buttons[index])
    // console.log(buttons[index]);
  }
}

const startClosingAnimation = async () => {
  DOM.RECIPE_PREPARATION().classList.add(CLASS.CLOSE_TAB)
  await timeOut(250)
  DOM.RECIPE_PREPARATION().classList.remove(CLASS.CLOSE_TAB)
  DOM.RECIPE_PREPARATION().classList.add(CLASS.JS_HIDE)
  DOM.RECIPES().classList.remove(CLASS.JS_HIDE)
  DOM.NAVBAR().classList.remove(CLASS.JS_HIDE)
}


// function saveToPdf() {
//   const newWindow = window.open()
//   const head = document.createElement("head")
//   const html = document.createElement("html")
//   const body = document.createElement("body")
//   const title = document.createElement("title")
//   const h1 = document.createElement("h1")
//   const ol = document.createElement("ol")
//   const article = document.createElement("article")

//   h1.textContent = `${DOM.RECIPE_PREPARATION_H2().dataset.id.toUpperCase()}:`
//   title.textContent = DOM.RECIPE_PREPARATION_H2().dataset.id.toUpperCase()
//   head.append(title)

//   for (let index = 0; index < DOM.RECIPE_PREPARATION_OL().childElementCount; index++) {
//     const li = document.createElement("li")
//     li.textContent = `${DOM.RECIPE_PREPARATION_OL().children[index].textContent}`
//     if (li.textContent !== "") {
//       ol.append(li)
//     }
//   }

//   const paragraph  = [...DOM.RECIPE_PREPARATION_SECTION().children]
//   paragraph.forEach(p => {
//     article.append(p)
//   })

//   body.append(h1, ol, article)
//   html.append(head, body)
//   newWindow.document.write(html.innerHTML)
//   newWindow.document.close()
//   newWindow.print()
//   newWindow.close()
// }

function saveToPdf() {
  const doc = new jsPDF();
  const longitude = DOM.RECIPE_PREPARATION_OL().childElementCount
  let name = `${DOM.RECIPE_PREPARATION_H2().dataset.id.toUpperCase()}:\n`
  let ingredients = ""
  let preparation = ""

  for (let i = 0; i < longitude; i++) {
    ingredients  += `${DOM.RECIPE_PREPARATION_OL().children[i].textContent}\n`
  }

  const paragraph  = [...DOM.RECIPE_PREPARATION_SECTION().children]

  paragraph.forEach(p => {
    preparation += `${p.textContent}\n`
  })

  doc.text(name, 10, 10, { maxWidth: 200 });
  doc.text(ingredients, 10, 30, { maxWidth: 200 });
  doc.addPage()
  doc.text(preparation, 10, 10, { maxWidth: 200 });

  doc.save(name)
}

const formatText = () => {
  const text = getDetailsById().strInstructions
  const textModified = []
  let arr = []

  for(let i = 0; i < text.length; i++) {
    if(text[i] === ".") {
      arr.push(i)
    }
  }

  let position = 0
  for(let i = 0; i < arr.length; i++) {
    textModified.push(text.slice(position, arr[i]))
    position = arr[i] + 1
  }

  const fragment = new DocumentFragment()
  for (let i = 0; i < textModified.length; i++) {
    const p = document.createElement("p")
    if ((i + 1) < 10) {
      p.textContent = `0${i + 1}: ${textModified[i].trim()}.`
    } else {
      p.textContent = `${i + 1}: ${textModified[i].trim()}.`
    }
    fragment.append(p)
  }
  DOM.RECIPE_PREPARATION_SECTION().append(fragment)
}