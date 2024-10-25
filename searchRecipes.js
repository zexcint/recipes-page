import { template } from "./globalVar.js";
import { displayRecipes, resetRecipePreparation, classLists, domElements } from "./main.js";
import {
  URL,
  getFullDetailsById,
  getDetailsById,
  setCategoryName,
  setCategoryId,
  getCategoryName,
  resetCategoryId,
  resetCategoryName,
} from "./apiFunctions.js";
import { createCard } from "./setCards.js";

const $ = (element) => document.querySelector(element);
const $$ = (elements) => document.querySelectorAll(elements);
const element = {
  form: "header > nav > form",
  inputSearch: "form > fieldset > input[type='search']",
  filterBy: "form > fieldset.containerFilterBy",
  searchBtn: "button.search-btn",
  filterBtn: "button.filter-btn",
  select: "header > nav > form > fieldset > select",
  input: "input[name='options']",
  recipes: ".recipes",
};

const message = "Not found";
const letters = [
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
];

$$(element.input).forEach((elm) => {
  elm.addEventListener("change", (event) => {
    const target = event.target;
    if (target === $$(element.input)[0]) {
      $(element.inputSearch).disabled = false;
      $(element.select).classList.add("hideElm");
      $(element.select).innerHTML = "";
    }

    if (target === $$(element.input)[1]) {
      const fragment = document.createDocumentFragment();
      // reset
      $(element.inputSearch).disabled = true;
      $(element.inputSearch).value = "";
      $(element.select).innerHTML = "";

      for (let i = 0; i < letters.length; i++) {
        const option = document.createElement("option");
        option.textContent = letters[i];
        option.value = letters[i];
        fragment.append(option);
      }
      $(element.select).append(fragment);
      $(element.select).classList.remove("hideElm");
    }
  });
});

$(element.form).addEventListener("submit", async (event) => {
  event.preventDefault();

  if (event.submitter === $(element.searchBtn)) {
    const search = $(element.inputSearch).value.toLowerCase();
    const input = $$(element.input);

    if (search !== "" && input[0].checked === true) {
      (async function () {
        const response = await fetch(URL.CATEGORIES);
        const data = await response.json();
        if (data) {
          const name = data.categories.map((elm) => elm["strCategory"]);
          let allMeals = [];

          async function x(i) {
            const response = await fetch(URL.BY_CATEGORY + name[i]);
            const data = response.json();
            if (data) {
              return data;
            }
          }

          const apiData = name.map((e, i) => x(i));

          try {
            for await (const value of apiData) {
              allMeals.push(value);
            }
          } catch (error) {
            console.error(error);
          }

          allMeals = allMeals
            .flatMap((elm) => elm.meals)
            .map((elm) => elm["strMeal"].toLowerCase());

          const searchFilter = allMeals.filter((elm) => elm.startsWith(search));

          const longitude = searchFilter.length;

          if (longitude > 0) {
            const fragment = document.createDocumentFragment();
            $(element.select).innerHTML = "";
            for (let i = 0; i < longitude; i++) {
              const option = document.createElement("option");
              option.textContent = searchFilter[i];
              option.value = searchFilter[i];
              fragment.append(option);
            }
            fragment.prepend(template[3].cloneNode(true));
            $(element.select).append(fragment);
            $(element.select).classList.remove("hideElm");
          } else {
            $(element.inputSearch).value = message;
          }
        }
      })();
    }
  }

  if (event.submitter === $(element.filterBtn)) {
    $(element.filterBy).classList.toggle("hideElm");
  }
});

// reset
$(element.form).addEventListener("input", async (event) => {
  event.preventDefault();
  if (event.target.value === "") {
    $(element.select).classList.add("hideElm");
    $(element.select).innerHTML = "";
  }
});

// reset
$(element.inputSearch).addEventListener("click", () => {
  $(element.inputSearch).value = "";
});

// const showSearchResults = () => {};

$(element.select).addEventListener("change", async (event) => {
  if ($(element.select).innerHTML !== "") {
    const name = event.target.value;
    $(domElements.RECIPES).innerHTML = "";
    $(domElements.RECIPE_PREPARATION).classList.add(classLists.JS_HIDE);
    resetRecipePreparation()

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
      );
      const data = await response.json();
      if (data) {
        const meal = data.meals[0];
        const mealName = [meal.strMeal];
        const mealThumb = [meal.strMealThumb];
        const id = [meal.idMeal];

        resetCategoryId();
        resetCategoryName();
        setCategoryId(id[0]);
        setCategoryName(mealName[0]);
        // await getFullDetailsById(id[0]);
        displayRecipes(mealName, mealThumb, 0, 1);
      }
    } catch (error) {
      console.error("api by name", error);
    }
  }
});
