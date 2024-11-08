import { DOM, CLASS } from "./global.js"
import { displayRecipes, createFragment, timeOut } from "./main.js"
import {
  URL,
  setCategoryName,
  setCategoryId,
  getCategoryId,
  getCategoryName,
  resetCategoryId,
  resetCategoryName,
} from "./apiFunctions.js"

import { resetPreparationValues } from "./displayPreparation.js"
import { resetStates, getStates } from "./navBar.js"

const loading = document.querySelector("form:first-child span")

const MESSAGE = {
  notFoundName: "No recipes found with this name.",
  notFoundLetter: " - No recipes found starting with this letter.",
  total: " - Total: ",
}
const LETTERS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
]

DOM.INPUT_OPTIONS.forEach((elm) => {
  elm.addEventListener("change", (event) => {
    const target = event.target

    if (target === DOM.INPUT_OPTIONS[0]) {
      // DOM.IMPUT_SEARCH.disabled = false;
      // DOM.SELECT.classList.add(CLASS.HIDE_ELM);
      // DOM.SELECT.innerHTML = "";
      // reset
      if (DOM.IMPUT_SEARCH.disabled === true) {
        DOM.IMPUT_SEARCH.disabled = false
      }

      if (!DOM.SELECT.classList.contains(CLASS.HIDE_ELM)) {
        DOM.SELECT.classList.add(CLASS.HIDE_ELM)
      }

      if (DOM.SELECT.innerHTML !== "") {
        DOM.SELECT.innerHTML = ""
      }
    }

    if (target === DOM.INPUT_OPTIONS[1]) {
      const fragment = createFragment(1)[0]

      // reset
      if (DOM.IMPUT_SEARCH.disabled === false) {
        DOM.IMPUT_SEARCH.disabled = true
      }

      if (DOM.IMPUT_SEARCH.value !== "") {
        DOM.IMPUT_SEARCH.value = ""
      }

      if (DOM.SELECT.innerHTML !== "") {
        DOM.SELECT.innerHTML = ""
      }

      for (let i = 0; i < LETTERS.length; i++) {
        const option = document.createElement("option")
        option.textContent = LETTERS[i].toUpperCase()
        option.value = LETTERS[i]
        fragment.append(option)
      }
      DOM.SELECT.append(fragment)
      DOM.SELECT.prepend(DOM.TEMPLATE[3].cloneNode(true))
      DOM.SELECT.classList.remove(CLASS.HIDE_ELM)
    }
  })
})

DOM.FORM.addEventListener("submit", async (event) => {
  event.preventDefault()

  if (event.submitter === DOM.SEARCH_BTN) {
    const search = DOM.IMPUT_SEARCH.value.toLowerCase()
    const input = DOM.INPUT_OPTIONS // arr

    if (search !== "" && input[0].checked === true) {
      ;(async function () {
        const response = await fetch(URL.CATEGORIES)
        const data = await response.json()
        if (data) {
          const name = data.categories.map((elm) => elm["strCategory"])
          let allMeals = []

          async function x(i) {
            const response = await fetch(URL.BY_CATEGORY + name[i])
            const data = response.json()
            if (data) {
              return data
            }
          }

          const apiData = name.map((e, i) => x(i))

          try {
            for await (const value of apiData) {
              allMeals.push(value)
            }
          } catch (error) {
            console.error(error)
          }

          allMeals = allMeals
            .flatMap((elm) => elm.meals)
            .map((elm) => elm["strMeal"].toLowerCase())

          const searchFilter = allMeals.filter((elm) => elm.startsWith(search))
          const countElements = searchFilter.length
          const result = DOM.TEMPLATE[3].cloneNode(true)
          result.textContent += `${countElements}`

          if (searchFilter.length > 0) {
            const fragment = document.createDocumentFragment()
            DOM.SELECT.innerHTML = ""
            for (let i = 0; i < searchFilter.length; i++) {
              const option = document.createElement("option")
              option.textContent = searchFilter[i]
              option.value = searchFilter[i]
              fragment.append(option)
            }
            fragment.prepend(result)
            DOM.SELECT.append(fragment)
            DOM.SELECT.classList.remove(CLASS.HIDE_ELM)
          } else {
            DOM.IMPUT_SEARCH.value = MESSAGE.notFoundName
            DOM.SELECT.innerHTML = ""
            // DOM.SELECT.hidden = true
            DOM.SELECT.classList.add(CLASS.HIDE_ELM)
            DOM.IMPUT_SEARCH.disabled = true
            await timeOut(1000)
            DOM.IMPUT_SEARCH.value = ""
            DOM.IMPUT_SEARCH.disabled = false
          }
        }
      })()
    }
  }

  if (event.submitter === DOM.FILTER_BTN) {
    DOM.FILTER_BY.classList.toggle(CLASS.HIDE_ELM)
    // if (DOM.RECIPES().innerHTML !== "") {
    //   DOM.RECIPES().innerHTML = "";
    // }
  }

  if (event.submitter === DOM.SHOWFAV_BTN) {
    DOM.FAVCONTAINER.classList.toggle(CLASS.JS_HIDE)
  }
})

// reset
DOM.FORM.addEventListener("input", async (event) => {
  event.preventDefault()
  if (event.target.value === "") {
    DOM.SELECT.classList.add(CLASS.HIDE_ELM)
    DOM.SELECT.innerHTML = ""
    if (DOM.RECIPES().innerHTML !== "") {
      DOM.RECIPES().innerHTML = ""
    }
  }
})

// reset
// DOM.IMPUT_SEARCH.addEventListener("click", () => {
//   DOM.IMPUT_SEARCH.value = "";
// });

DOM.SELECT.addEventListener("change", async (event) => {
  event.preventDefault()
  const longitude = event.target.value.length

  if (isSelectNotEmpty() && longitude > 1) {
    const name = event.target.value

    if (DOM.RECIPES().innerHTML !== "") {
      DOM.RECIPES().innerHTML = ""
      resetStates()
      DOM.BTN_NEXT.disabled = true
      DOM.BTN_PREV.disabled = true
    }

    if (!DOM.RECIPE_PREPARATION().classList.contains(CLASS.JS_HIDE)) {
      resetPreparationValues()
      DOM.RECIPE_PREPARATION().classList.add(CLASS.JS_HIDE)
    }

    try {
      const response = await fetch(URL.FILTER_BY_NAME + name)
      const data = await response.json()
      if (data) {
        let meal = data.meals

        if (meal.length > 1) {
          meal = meal.filter((meal) => meal.strMeal.toLowerCase() === name)[0]
        } else {
          meal = data.meals[0]
        }

        const mealName = [meal.strMeal] // arr
        const mealThumb = [meal.strMealThumb] // arr
        const mealId = [meal.idMeal] // arr

        resetCategoryId()
        resetCategoryName()
        setCategoryId(mealId[0]) // string
        setCategoryName(mealName[0]) // string
        displayRecipes(mealName, mealThumb, 0, 1) // 2 arr
        await timeOut(1000)
        DOM.MAIN_SECTION.scrollIntoView({behavior: "smooth"})
      }
    } catch (error) {
      console.error("api by name", error)
    }
  } else if (isSelectNotEmpty() && longitude === 1) {
    const selectedLetter = event.target.value
    const currentTarget = [...DOM.SELECT.childNodes].filter(
      (option) => option.value === selectedLetter
    )[0]

    // reset
    resetDefault()

    // start
    turnOffSearch()
    try {
      const response = await fetch(URL.FILTER_BY_FIRST_LETTER + selectedLetter)
      const data = await response.json()

      if (data.meals !== null) {
        const meals = data.meals
        const mealsName = []
        const mealsThumb = []
        const mealsId = []
        try {
          async function x(i) {
            const response = await fetch(URL.FILTER_BY_ID + meals[i].idMeal)
            const data = response.json()
            if (data) {
              return data
            }
          }

          const apiData = meals.map((e, i) => x(i))

          for await (const value of apiData) {
            // strMeal
            // strMealThumb
            mealsName.push(value.meals[0].strMeal)
            mealsThumb.push(value.meals[0].strMealThumb)
            mealsId.push(value.meals[0].idMeal)

            setCategoryName(value.meals[0].strMeal) // string
            setCategoryId(value.meals[0].idMeal) // string
          }
        } catch (error) {
          console.error("api by letter", error)
        }

        // console.log(mealsName);
        // console.log(mealsThumb);
        // console.log(mealsId);
        const countElements = mealsName.length

        currentTarget.textContent = `${selectedLetter.toUpperCase()}${MESSAGE.total}${countElements}`

        await displayRecipes(mealsName, mealsThumb, 0, countElements)

        turnOnSearch()

        DOM.MAIN_SECTION.scrollIntoView({behavior: "smooth"})
      } else {
        currentTarget.textContent = `${selectedLetter.toUpperCase()}${MESSAGE.notFoundLetter}`
        turnOnSearch()
      }
    } catch (error) {
      console.error(error)
    }
    // end
  }
})


const isSelectNotEmpty = () => {
  return DOM.SELECT.innerHTML !== ""
}

const turnOnSearch = () => {
  const elementsToEnable = document.querySelectorAll(".cards :is(a, button), form:first-child :is(button, input, select)")

  elementsToEnable.forEach(element => {
    if (element.nodeName === "INPUT") {
      element.disabled = false
    }
    element.classList.remove(CLASS.DISABLED_POINTER)
  })

  loading.classList.remove(CLASS.LOADING)
}

const turnOffSearch = () => {
  const inputsToDisable = document.querySelectorAll(".cards :is(a, button), form:first-child :is(button, input, select)")

  loading.classList.add(CLASS.LOADING)

  inputsToDisable.forEach(element => {
    if (element.nodeName === "INPUT") {
      element.disabled = true
    }
    element.classList.add(CLASS.DISABLED_POINTER)
   })
}

const resetDefault = () => {
  if (DOM.RECIPES().innerHTML !== "") {
    DOM.RECIPES().innerHTML = ""
    resetStates()
    DOM.BTN_NEXT.disabled = true
    DOM.BTN_PREV.disabled = true
  }

  if (getCategoryId().length > 0) {
    resetCategoryId()
  }

  if (getCategoryName().length > 0) {
    resetCategoryName()
  }
}