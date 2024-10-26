import { DOM, CLASS } from "./global.js";
import { displayRecipes } from "./main.js";
import {
  URL,
  setCategoryName,
  setCategoryId,
  resetCategoryId,
  resetCategoryName,
} from "./apiFunctions.js";

import {resetPreparationValues} from "./displayPreparation.js"
import {resetStates, getStates} from "./navBar.js"

const MESSAGE = "Not found";
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
];

DOM.INPUT_OPTIONS.forEach((elm) => {
  elm.addEventListener("change", (event) => {
    const target = event.target;
    if (target === DOM.INPUT_OPTIONS[0]) {
      DOM.IMPUT_SEARCH.disabled = false;
      DOM.SELECT.classList.add(CLASS.HIDE_ELM);
      DOM.SELECT.innerHTML = "";
    }

    if (target === DOM.INPUT_OPTIONS[1]) {
      const fragment = document.createDocumentFragment();
      // reset
      DOM.IMPUT_SEARCH.disabled = true;
      DOM.IMPUT_SEARCH.value = "";
      DOM.SELECT.innerHTML = "";

      for (let i = 0; i < LETTERS.length; i++) {
        const option = document.createElement("option");
        option.textContent = LETTERS[i];
        option.value = LETTERS[i];
        fragment.append(option);
      }
      DOM.SELECT.append(fragment);
      DOM.SELECT.classList.remove(CLASS.HIDE_ELM);
    }
  });
});

DOM.FORM.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (event.submitter === DOM.SEARCH_BTN) {
    const search = DOM.IMPUT_SEARCH.value.toLowerCase();
    const input = DOM.INPUT_OPTIONS;

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
            DOM.SELECT.innerHTML = "";
            for (let i = 0; i < longitude; i++) {
              const option = document.createElement("option");
              option.textContent = searchFilter[i];
              option.value = searchFilter[i];
              fragment.append(option);
            }
            fragment.prepend(DOM.TEMPLATE[3].cloneNode(true));
            DOM.SELECT.append(fragment);
            DOM.SELECT.classList.remove(CLASS.HIDE_ELM);
          } else {
            DOM.IMPUT_SEARCH.value = MESSAGE;
          }
        }
      })();
    }
  }

  if (event.submitter === DOM.FILTER_BTN) {
    DOM.FILTER_BY.classList.toggle(CLASS.HIDE_ELM);
  }
});

// reset
DOM.FORM.addEventListener("input", async (event) => {
  event.preventDefault();
  if (event.target.value === "") {
    DOM.SELECT.classList.add(CLASS.HIDE_ELM);
    DOM.SELECT.innerHTML = "";
  }
});

// reset
DOM.IMPUT_SEARCH.addEventListener("click", () => {
  DOM.IMPUT_SEARCH.value = "";
});

DOM.SELECT.addEventListener("change", async (event) => {
  if (DOM.SELECT.innerHTML !== "") {
    const name = event.target.value;

    if (DOM.RECIPES().innerHTML !== "") {
      DOM.RECIPES().innerHTML = "";
      resetStates()
      DOM.BTN_NEXT.disabled = true
      DOM.BTN_PREV.disabled = true
    }

    if (!DOM.RECIPE_PREPARATION().classList.contains(CLASS.JS_HIDE)) {
      resetPreparationValues();
      DOM.RECIPE_PREPARATION().classList.add(CLASS.JS_HIDE);
      console.log("inside");
    }

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
      );
      const data = await response.json();
      if (data) {
        const meal = data.meals[0];
        const mealName = [meal.strMeal]; // arr
        const mealThumb = [meal.strMealThumb]; // arr
        const mealId = [meal.idMeal]; // arr

        resetCategoryId();
        resetCategoryName();
        setCategoryId(mealId[0]); // string
        setCategoryName(mealName[0]); // string
        displayRecipes(mealName, mealThumb, 0, 1); // 2 arr
      }
    } catch (error) {
      console.error("api by name", error);
    }
  }
});
