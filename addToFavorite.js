export { toggleFavorite, initializeFavorites }
import { DOM, CLASS} from "./global.js"
import { URL, setDetailsById, resetDetailsById } from "./apiFunctions.js"
import { displayPreparation } from "./displayPreparation.js"
import { resetAllStates, timeOut } from "./main.js"

const NODE_TARGET = DOM.RECIPE_PREPARATION_ASIDE
const CONFIG = {
  childList: true,
  subtree: true,
}

const favNotChecked = DOM.TEMPLATE[4].cloneNode(true).firstElementChild
const favChecked = DOM.TEMPLATE[5].cloneNode(true)

const toggleFavorite = () => {
  const observer = new MutationObserver((event) => {
    observer.disconnect()

    if (event[0].addedNodes[0] && event[0].addedNodes[0].nodeType === 1) {
      const favButton = event[0].addedNodes[0]
      const favContainer = favButton.closest("section")
      const favName = favContainer.firstElementChild.textContent

      if (window.localStorage.length > 0) {
        const data = Object.values(window.localStorage)
        if (data.includes(favName)) {
          favButton.innerHTML = ""
          favButton.append(favChecked)
        }
      }

      DOM.RECIPE_PREPARATION_FAVORITE().addEventListener("click", () => {
        if (favButton.firstElementChild.innerHTML === favNotChecked.innerHTML) {
          favButton.innerHTML = ""
          favButton.append(favChecked)
          localStorage.setItem(favName, favName)
          toggleFavoriteList(favName, true)
        } else {
          favButton.innerHTML = ""
          favButton.append(favNotChecked)
          localStorage.removeItem(favName)
          toggleFavoriteList(favName, false)
        }
      })
    }
    observer.observe(NODE_TARGET, CONFIG)
  })

  observer.observe(NODE_TARGET, CONFIG)
}

const toggleFavoriteList = (data, value) => {
  if (value) {
    const fragment = document.createDocumentFragment()

    for (let index = 0; index < 1; index++) {
      const li = document.createElement("li")
      li.textContent = data
      fragment.append(li)
    }

    const itemList = [...DOM.LIST_OF_FAVORITES().children]
    const exists = itemList.some((li) => li.textContent === data)
    if (!exists) {
      DOM.LIST_OF_FAVORITES().prepend(fragment)
      getAndDisplayFavorite()
      DOM.FAV_H2.textContent = `Favorites: ${DOM.LIST_OF_FAVORITES().childElementCount}`
    }
  } else {
    const itemList = [...DOM.LIST_OF_FAVORITES().children]
    const item = itemList.filter((li) => li.textContent === data)
    if (item.length > 0) {
      DOM.LIST_OF_FAVORITES().removeChild(item[0])
      DOM.FAVORITE_THUMB().innerHTML = ""
      DOM.FAV_H2.textContent = `Favorites: ${DOM.LIST_OF_FAVORITES().childElementCount}`
    }
  }
}

const initializeFavorites = () => {
  if (window.localStorage.length > 0) {
    const data = Object.values(window.localStorage)
    const fragment = document.createDocumentFragment()

    for (let index = 0; index < data.length; index++) {
      const li = document.createElement("li")
      li.textContent = data[index]
      fragment.append(li)
    }
    DOM.LIST_OF_FAVORITES().prepend(fragment)
    DOM.FAV_H2.textContent = `Favorites: ${data.length}`
    getAndDisplayFavorite()
  }
}

const getAndDisplayFavorite = () => {
  const items = [...DOM.LIST_OF_FAVORITES().children]

  if (items.length > 0) {
    items.forEach((li) => {
      if (!li.hasAttribute("clicked")) {
        li.addEventListener("click", async () => {
          try {
            const response = await fetch(URL.FILTER_BY_NAME + li.textContent)
            const data = await response.json()
            if (data) {
              const thumb = document.createElement("img")
              let obj = data.meals

              if (obj.length > 1) {
                obj = obj.filter((meal) => meal.strMeal === li.textContent)
              }

              thumb.src = obj[0].strMealThumb
              DOM.FAVORITE_THUMB().innerHTML = ""
              DOM.FAVORITE_THUMB().append(thumb)

              DOM.FAVORITE_THUMB().firstElementChild.addEventListener(
                "click",
                async () => {
                  resetAllStates()
                  resetDetailsById()
                  DOM.BTN_NEXT.disabled = true
                  DOM.BTN_PREV.disabled = true
                  setDetailsById(obj[0])
                  displayPreparation()
                  DOM.FAVCONTAINER.classList.toggle(CLASS.JS_HIDE)
                  await timeOut(1000)
                  DOM.MAIN_SECTION.scrollIntoView({ behavior: "smooth" })
                }
              )
            }
          } catch (error) {
            console.error(error)
          }
        })
        li.setAttribute("clicked", "")
      }
    })
  }
}
