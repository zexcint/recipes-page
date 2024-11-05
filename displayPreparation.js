export { displayPreparation, resetPreparationValues, startClosingAnimation }
import { createFragment, timeOut } from "./main.js"
import { URL, getDetailsById, getFlags } from "./apiFunctions.js"
import { DOM, CLASS } from "./global.js"

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

  DOM.RECIPE_PREPARATION_TEXTAREA().value = getDetailsById().strInstructions

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
  DOM.RECIPE_PREPARATION_TEXTAREA().value = ""
  DOM.RECIPE_PREPARATION_THUMB().src = ""
  DOM.RECIPE_PREPARATION_LINK().href = ""
  // DOM.RECIPE_PREPARATION_ASIDE.removeChild(DOM.RECIPE_PREPARATION_ASIDE.lastElementChild)
  // DOM.RECIPE_PREPARATION_ASIDE.removeChild(DOM.RECIPE_PREPARATION_ASIDE.firstElementChild)
  const buttons = [...DOM.RECIPE_PREPARATION_ASIDE.children].filter(elm => elm.nodeName === "BUTTON")

  for (let index = 0; index < buttons.length; index++) {
    DOM.RECIPE_PREPARATION_ASIDE.removeChild(buttons[index])
    console.log(buttons[index]);
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


function saveToPdf() {
  const newWindow = window.open()
  let name = ""
  let ingredients = ""
  let preparation = ""

  name = `<b>${DOM.RECIPE_PREPARATION_H2().textContent.toUpperCase()}</b>: <br> <br>`

  for (let index = 0; index < DOM.RECIPE_PREPARATION_OL().childElementCount; index++) {
    ingredients += `${DOM.RECIPE_PREPARATION_OL().children[index].textContent} <br>`
  }

  preparation = `${DOM.RECIPE_PREPARATION_TEXTAREA().value}`

  newWindow.document.write(name)
  newWindow.document.write(ingredients)
  newWindow.document.write(preparation)
  newWindow.document.close()
  newWindow.print()
  newWindow.close()
}