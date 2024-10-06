import { createCard } from "./generateCard.js"
import { template, parent, btn_prev, btn_next } from "./globalVar.js"

const URL_CATEGORIES = "https://www.themealdb.com/api/json/v1/1/categories.php"
const URL_BY_CATEGORY = "https://www.themealdb.com/api/json/v1/1/filter.php?c="
const URL_INGREDIENTS = "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
const URL_FILTER_BY_INGREDIENT = "https://www.themealdb.com/api/json/v1/1/filter.php?i="
const URL_THUMB_INGREDIENT = "https://www.themealdb.com/images/ingredients/"

// All Categories
const categoriesId = []
const categories = []
const categoriesDescription = []
const categoriesThumb = []

// Single Category
let categoryId = []
export let categoryName = []
export let categoryThumb = []

// All Ingredients
const ingredientsId = []
const ingredients = []
const ingredientsDescription = []

const getCategories = async () => {
  try {
    const response = await fetch(URL_CATEGORIES)
    const data = await response.json()
    if (data) {
      // idCategory
      // strCategory
      // strCategoryDescription
      // strCategoryThumb
      for (const { idCategory, strCategory, strCategoryDescription, strCategoryThumb } of data.categories) {
        categoriesId.push(idCategory)
        categories.push(strCategory)
        categoriesDescription.push(strCategoryDescription)
        categoriesThumb.push(strCategoryThumb)
      }
    }
  } catch (error) {
    console.error("getCategories", error)
  }
}

const displayCategories = () => {
  const fragment1 = document.createDocumentFragment()
  const fragment2 = document.createDocumentFragment()
  const fragment3 = document.createDocumentFragment()
  const fragment4 = document.createDocumentFragment()

  const [card1, card2, card3, card4] = document.querySelectorAll(".cards")

  for (const [index, value] of categories.entries()) {
    const container = template[2].cloneNode(true)
    const [a, div, section, textarea] = container.children
    const [img] = div.children
    section.classList.add("showInfoCategory")

    a.textContent = value
    img.src = categoriesThumb[index]
    img.alt = value
    textarea.value = categoriesDescription[index]

    a.append(div)

    switch (index) {
      case 0:
      case 1:
      case 2:
      case 3:
        fragment1.append(container)
        break;
      case 4:
      case 5:
      case 6:
      case 7:
        fragment2.append(container)
        break;
      case 8:
      case 9:
      case 10:
      case 11:
        fragment3.append(container)
        break;
      case 12:
      case 13:
        fragment4.append(container)
        break;
      default:
        console.log(undefined)
        break;
    }
  }

  card1.append(fragment1)
  card2.append(fragment2)
  card3.append(fragment3)
  card4.append(fragment4)
}

const setCategory = () => {
  const categoriesOptions = Array.from(document.querySelectorAll(".cards")).flatMap(element => Array.from(element.querySelectorAll("a")))
console.log(categoriesOptions);
  categoriesOptions.forEach(element => {
    element.addEventListener("click", (event) => {
      const target = event.currentTarget
        const selectedCategory = target.firstChild.textContent
        filterByCategory(selectedCategory)
      
    })
  })
}

const filterByCategory = async (prop) => {
  try {
    const response = await fetch(URL_BY_CATEGORY + prop)
    const data = await response.json()
    if (data) {
      // reset
      categoryId = []
      categoryName = []
      categoryThumb = []
      btn_prev.disabled = true

      for (const { idMeal, strMeal, strMealThumb } of data.meals) {
        categoryId.push(idMeal)
        categoryName.push(strMeal)
        categoryThumb.push(strMealThumb)
      }

      if (categoryName.length > 4) {
        btn_next.disabled = false
      } else {
        btn_next.disabled = true
      }

      displayRecipes(categoryName, 0, 4)
    }
  } catch (error) {
    console.error("filterByCategory", error)
  }
}

const displayRecipes = (arr, start, end) => {
  parent.innerHTML = ""
  let fragment = document.createDocumentFragment()

  for (let index = start; index < end; index++) {
    if (arr[index] === undefined) {
      break
    }
    createCard(arr, categoryThumb, fragment, index)
  }
  parent.append(fragment)
}

const getIngredients = async () => {
  try {
    const response = await fetch(URL_INGREDIENTS)
    const data = await response.json()
    if (data) {
      // idIngredient
      // strIngredient
      // strDescription
      for (const { idIngredient, strIngredient, strDescription } of data.meals) {
        ingredientsId.push(idIngredient)
        ingredients.push(strIngredient)
        ingredientsDescription.push(strDescription)
      }
    }
  } catch (error) {
    console.error("getIngredients", error)
  }
}

const handleCardNavigation = () => {
  const [btn1, btn2] = document.querySelectorAll(".moreBtn")
  const buttons = [btn1, btn2]
  const [card1, card2, card3, card4] = document.querySelectorAll(".cards")
  const cards = [card1, card2, card3, card4]
  let countClick = 0
  const MAX_CLICK = 2
  const MIN_CLICK = 0

  buttons.forEach(btn => {
    btn.addEventListener("click", (event) => {
      const currentTarget = event.currentTarget

      if (currentTarget === btn2) {
        cards[countClick].style.display = "none"
        countClick++
        cards[countClick].style.display = "grid"
      } else {
        countClick--
        cards[countClick + 1].style.display = "none"
        cards[countClick].style.display = "grid"
      }

      btn1.disabled = countClick <= MIN_CLICK
      btn2.disabled = countClick > MAX_CLICK
    })
  })
}

const run = async () => {
  await getCategories()
  displayCategories()
  setCategory()
  // await getIngredients()
  handleCardNavigation()
  // crear el showmore
  displayInfoOfCategory()
}

run()

const displayInfoOfCategory = () => {
  const arr = Array.from(document.querySelectorAll('.showInfoCategory'))
  arr.forEach((elm, index) => {
    const btn = elm.firstElementChild
    btn.addEventListener("click", (event) => {
      const target = event.currentTarget
      console.log(document.querySelectorAll(".cards"))
      if (target.parentElement.nextElementSibling.hidden === true) {
        target.parentElement.nextElementSibling.hidden = false
        target.parentElement.parentElement.classList.add("cardsSwitchMode")
      } else {
        target.parentElement.nextElementSibling.hidden = true
        target.parentElement.parentElement.classList.remove("cardsSwitchMode")
      }
    })
  })
}