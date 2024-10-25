export { displayRecipes, createFragment,resetRecipePreparation, domElements, classLists, $, $$ };

import { template, btn_prev, btn_next } from "./globalVar.js";
import {
  getFullDetailsById,
  getIngredients,
  getCategoryId,
  getCategoryName,
  getCategoryThumb,
  getDetailsById,
  getCategories,
  getFlags,
  setCategoryId,
  setCategoryName,
  setCategoryThumb,
  resetAllCategories,
  categories,
  categoriesThumb,
  categoriesDescription,
  URL,
} from "./apiFunctions.js";
import { displayPreparation } from "./displayPreparation.js";
import { createCard } from "./setCards.js";
import { resetStates } from "./navBar.js";

const $ = (element) => document.querySelector(element);
const $$ = (elements) => document.querySelectorAll(elements);

const domElements = {
  MAIN_SECTION: ".main-section",
  RECIPES: ".recipes",
  CARDS: ".cards",
  NAVBAR: ".navbar",
  LOADING: ".loading",
  TOGGLE_CARD_BTN: ".toggleCardBtn",
  RECIPE_BTN: ".recipe-btn",
  NAV_BTN: ".navBtn",
  RECIPE_PREPARATION: ".recipePreparation",
};

const classLists = {
  CARDS_SWITCH_MODE: "cardsSwitchMode",
  JS_SHOW: "js-show",
  JS_HIDE: "js-hide",
  MAIN_SECTION: "main-section",
};

const createFragment = (count) => {
  const arr = [];
  for (let index = 0; index < count; index++) {
    const fragment = document.createDocumentFragment();
    arr.push(fragment);
  }
  return arr;
};

const showLoading = (ms) => {
  return new Promise((resolve) => {
    $(domElements.LOADING).hidden = false;
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const timeOut = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const resetAllStates = () => {
  resetAllCategories();
  resetStates();
  btn_prev.disabled = true;
  $(domElements.RECIPES).innerHTML = "";
  $(domElements.RECIPES).classList.add(classLists.JS_HIDE);
  $(domElements.NAVBAR).classList.add(classLists.JS_HIDE);

  $$(`${domElements.CARDS} div.cardsSwitchMode`).forEach((elm) => {
    elm.lastElementChild.hidden = true;
    elm.classList.remove("cardsSwitchMode");
  });

  if ($(`${domElements.RECIPE_PREPARATION} > h2`).textContent !== "") {
    $(`${domElements.RECIPE_PREPARATION} > h2`).textContent = "";
    $(`${domElements.RECIPE_PREPARATION} > textarea`).value = "";
    $(`${domElements.RECIPE_PREPARATION} > aside > span.thumb > img`).src = "";
    $(
      `${domElements.RECIPE_PREPARATION} > aside > span.category > p + p`
    ).textContent = "";
    $(
      `${domElements.RECIPE_PREPARATION} > aside > span.area > p + p`
    ).textContent = "";
    // $(`${domElements.RECIPE_PREPARATION} > aside > span.area`).innerHTML = "";
    $(
      `${domElements.RECIPE_PREPARATION} > aside > span.tags > p + p`
    ).textContent = "";
    $(`${domElements.RECIPE_PREPARATION} > aside > span.ytb > a`).href = "";
    $(`${domElements.RECIPE_PREPARATION} > ol`).innerHTML = "";
    $(domElements.RECIPE_PREPARATION).classList.add(classLists.JS_HIDE);
  }
};

const displayCategories = () => {
  const [f1, f2, f3, f4] = createFragment(4);
  const [card1, card2, card3, card4] = $$(domElements.CARDS);

  for (const [index, value] of categories.entries()) {
    const container = template[2].cloneNode(true);
    const [a, div, section, textarea] = container.children;
    const [img] = div.children;

    a.textContent = value;
    img.src = categoriesThumb[index];
    img.alt = value;
    textarea.value = categoriesDescription[index];

    a.append(div);

    switch (index) {
      case 0:
      case 1:
      case 2:
      case 3:
        f1.append(container);
        break;
      case 4:
      case 5:
      case 6:
      case 7:
        f2.append(container);
        break;
      case 8:
      case 9:
      case 10:
      case 11:
        f3.append(container);
        break;
      case 12:
      case 13:
        f4.append(container);
        break;
      default:
        console.log(undefined);
        break;
    }
  }

  card1.append(f1);
  card2.append(f2);
  card3.append(f3);
  card4.append(f4);
};

const setCategory = () => {
  const categoriesOptions = $$(`${domElements.CARDS} > div > a`);

  categoriesOptions.forEach((element) => {
    element.addEventListener("click", async (event) => {
      timeOut(1000);
      // reset
      resetAllStates();

      const target = event.currentTarget;
      const selectedCategory = target.firstChild.textContent;
      filterByCategory(selectedCategory);
    });
  });
};

const filterByCategory = async (prop) => {
  try {
    const response = await fetch(URL.BY_CATEGORY + prop);
    const data = await response.json();
    if (data) {
      for (const { idMeal, strMeal, strMealThumb } of data.meals) {
        // categoryId.push(idMeal);
        // categoryName.push(strMeal);
        // categoryThumb.push(strMealThumb);
        setCategoryId(idMeal);
        setCategoryName(strMeal);
        setCategoryThumb(strMealThumb);
      }
      btn_next.disabled = getCategoryName().length <= 4;
      displayRecipes(getCategoryName(), getCategoryThumb(), 0, 4);
    }
  } catch (error) {
    console.error("filterByCategory", error);
  }
};

const displayRecipes = (arr, arr2, start, end) => {
  const [fragment] = createFragment(1);

  for (let index = start; index < end; index++) {
    if (arr[index] === undefined) {
      break;
    }
    // getCategoryThumb()
    createCard(arr, arr2, fragment, index);
  }
  $(domElements.RECIPES).append(fragment);
};

const handleCardNavigation = () => {
  const buttons = $$(domElements.TOGGLE_CARD_BTN);
  const cards = $$(domElements.CARDS);
  const MAX_CLICK = buttons.length;
  const MIN_CLICK = 0;
  let countClick = 0;

  buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const currentTarget = event.currentTarget.dataset.id;

      if (currentTarget === "next") {
        cards[countClick].style.display = "none";
        cards[countClick + 1].style.display = "grid";
        countClick++;
      } else {
        countClick--;
        cards[countClick + 1].style.display = "none";
        cards[countClick].style.display = "grid";
      }

      buttons[0].disabled = countClick <= MIN_CLICK;
      buttons[1].disabled = countClick > MAX_CLICK;
    });
  });
};

const displayInfoCategory = () => {
  const buttons = document.querySelectorAll(domElements.RECIPE_BTN);

  buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const target = event.currentTarget;
      const parent = target.closest("div");
      const textarea = parent.lastElementChild;
      textarea.hidden = textarea.hidden === false;
      parent.classList.toggle(classLists.CARDS_SWITCH_MODE);
    });
  });
};

// here

const run = async () => {
  await getCategories();
  displayCategories();
  setCategory();
  // await getIngredients()
  handleCardNavigation();
  displayInfoCategory();
  // getIngredients()

  const buttons = $$(domElements.NAV_BTN);
  const config = {
    childList: true,
    subtree: true,
    characterData: true,
  };

  const observer = new MutationObserver(async (event) => {
    if (event[0].target.parentElement.className === classLists.MAIN_SECTION) {
      await showLoading(1000);

      $(domElements.LOADING).hidden = true;
      $(domElements.RECIPES).classList.remove(classLists.JS_HIDE);
      $(domElements.NAVBAR).classList.remove(classLists.JS_HIDE);

      $$(`${domElements.RECIPES} > article`).forEach((article) => {
        article.addEventListener("click", async (event) => {
          const target = event.currentTarget.textContent.trim();
          const id = getCategoryName().indexOf(target);
          await getFullDetailsById(getCategoryId()[id]);
          displayPreparation();
          // console.log(id);
          // console.log(getCategoryId());
          // console.log(getDetailsById());
        });
      });
    }
  });

  observer.observe($(domElements.MAIN_SECTION), config);

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      $(domElements.LOADING).hidden = false;
      $(domElements.RECIPES).classList.add(classLists.JS_HIDE);
      $(domElements.NAVBAR).classList.add(classLists.JS_HIDE);

      await timeOut(1000);

      $(domElements.LOADING).hidden = true;
      $(domElements.RECIPES).classList.remove(classLists.JS_HIDE);
      $(domElements.NAVBAR).classList.remove(classLists.JS_HIDE);
    });
  });

  $(`${domElements.RECIPE_PREPARATION} > button > svg`).addEventListener(
    "click",
    async () => {
      resetRecipePreparation();
      $(domElements.RECIPE_PREPARATION).classList.add("closeTab");
      await timeOut(250);
      $(domElements.RECIPE_PREPARATION).classList.remove("closeTab");
      $(domElements.RECIPE_PREPARATION).classList.add(classLists.JS_HIDE);
      $(domElements.RECIPES).classList.remove(classLists.JS_HIDE);
      $(domElements.NAVBAR).classList.remove(classLists.JS_HIDE);
    }
  );
}; // end

run();

const resetRecipePreparation = () => {
  $(`${domElements.RECIPE_PREPARATION} > ol`).innerHTML = "";
  $(`${domElements.RECIPE_PREPARATION} > h2`).textContent = "";
  $(`${domElements.RECIPE_PREPARATION} > textarea`).value = "";
  $(`${domElements.RECIPE_PREPARATION} > aside > span > img`).src = "";
  $(
    `${domElements.RECIPE_PREPARATION} > aside > span.category > p + p`
  ).textContent = " ";
  $(
    `${domElements.RECIPE_PREPARATION} > aside > span.area > p + p`
  ).textContent = "";
  $(
    `${domElements.RECIPE_PREPARATION} > aside > span.tags > p + p`
  ).textContent = "";
  $(`${domElements.RECIPE_PREPARATION} > aside > span.ytb > a`).href = "";
};
