export {
  getFullDetailsById,
  getCategories,
  getIngredients,
  getCategoryId,
  getCategoryName,
  getCategoryThumb,
  getDetailsById,
  getFlags,
  setCategoryId,
  setCategoryName,
  setCategoryThumb,
  resetAllCategories,
  resetCategoryId,
  resetCategoryName,
  categoriesId,
  categories,
  categoriesDescription,
  categoriesThumb,
  URL,
  //test
  setDetailsById,
  resetDetailsById
}

const URL = {
  CATEGORIES: "https://www.themealdb.com/api/json/v1/1/categories.php",
  BY_CATEGORY: "https://www.themealdb.com/api/json/v1/1/filter.php?c=",
  INGREDIENTS: "https://www.themealdb.com/api/json/v1/1/list.php?i=list",
  FILTER_BY_NAME: "https://www.themealdb.com/api/json/v1/1/search.php?s=",
  FILTER_BY_ID: "https://www.themealdb.com/api/json/v1/1/lookup.php?i=",
  FILTER_BY_FIRST_LETTER: "https://www.themealdb.com/api/json/v1/1/search.php?f=",
  THUMB_INGREDIENT: "https://www.themealdb.com/images/ingredients/",
}

// All Categories
const categoriesId = []
const categories = []
const categoriesDescription = []
const categoriesThumb = []
const detailsById = []

// Single Category
let categoryId = []
let categoryName = []
let categoryThumb = []

const getCategoryId = () => categoryId
const getCategoryName = () => categoryName
const getCategoryThumb = () => categoryThumb
const getDetailsById = () => detailsById[0]

const setCategoryId = (str) => categoryId.push(str)
const setCategoryName = (str) => categoryName.push(str)
const setCategoryThumb = (str) => categoryThumb.push(str)
// test
const setDetailsById = (obj) => detailsById.push(obj)
const resetDetailsById = () => detailsById.length = 0


// reset F
const resetAllCategories = () => {
  categoryId = []
  categoryName = []
  categoryThumb = []
}

const resetCategoryId = () => (categoryId = [])
const resetCategoryName = () => (categoryName = [])

// All Ingredients
const ingredientsId = []
const ingredients = []
const ingredientsDescription = []

const getCategories = async () => {
  try {
    const response = await fetch(URL.CATEGORIES)
    const data = await response.json()
    if (data) {
      // idCategory
      // strCategory
      // strCategoryDescription
      // strCategoryThumb
      for (const {
        idCategory,
        strCategory,
        strCategoryDescription,
        strCategoryThumb,
      } of data.categories) {
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

const getIngredients = async () => {
  try {
    const response = await fetch(URL.INGREDIENTS)
    const data = await response.json()
    if (data) {
      // idIngredient
      // strIngredient
      // strDescription
      for (const {
        idIngredient,
        strIngredient,
        strDescription,
      } of data.meals) {
        ingredientsId.push(idIngredient)
        ingredients.push(strIngredient)
        ingredientsDescription.push(strDescription)
      }
    }
  } catch (error) {
    console.error("getIngredients", error)
  }
}

const getFullDetailsById = async (id) => {
  try {
    const response = await fetch(URL.FILTER_BY_ID + id)
    const data = await response.json()
    if (data) {
      // reset
      detailsById.length = 0

      detailsById.push(data.meals[0])
    }
  } catch (error) {
    console.error("getDetailIngredientsById", error)
  }
}

const getFlags = async () => {
  try {
    const response = await fetch("./country_code.json")
    const data = await response.json()
    if (data) {
      return data
    }
  } catch (error) {
    console.error("getFlags", error)
  }
}
