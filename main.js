import {
  getCategoryName,
  getCategoryThumb,
  setCategoryId,
  setCategoryName,
  setCategoryThumb,
  resetAllCategories,
  getCategories,
  categories,
  categoriesThumb,
  categoriesDescription,
  URL,
} from "./apiFunctions.js";
import { createCard } from "./setCards.js";
import { template, btn_prev, btn_next } from "./globalVar.js";
import { resetStates } from "./navBar.js";

const $ = (element) => document.querySelector(element);
const $$ = (elements) => document.querySelectorAll(elements);

const element = {
  RECIPES: ".recipes",
  CARDS: ".cards",
  NAVBAR: ".navbar",
  LOADING: ".loading",
  TOGGLE_CARD_BTN: ".toggleCardBtn",
  RECIPE_BTN: ".recipe-btn",
  NAV_BTN: ".navBtn",
};

const listOfClass = {
  CARDS_SWITCH_MODE: "cardsSwitchMode",
  JS_SHOW: "js-show",
  JS_HIDE: "js-hide",
}

const createFragment = (count) => {
  const arr = [];
  for (let index = 0; index < count; index++) {
    const fragment = document.createDocumentFragment();
    arr.push(fragment);
  }
  return arr;
};

const resetAllStates = () => {
  resetAllCategories();
  resetStates();
  btn_prev.disabled = true;
  $(element.RECIPES).innerHTML = "";
  $(element.RECIPES).classList.add(listOfClass.JS_HIDE);
  $(element.NAVBAR).classList.add(listOfClass.JS_HIDE);
};

const displayCategories = () => {
  const [f1, f2, f3, f4] = createFragment(4);
  const [card1, card2, card3, card4] = $$(element.CARDS);

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
  // const categoriesOptions = Array.from(
  //   document.querySelectorAll(".cards")
  // ).flatMap((element) => Array.from(element.querySelectorAll("a")));

  const categoriesOptions = $$(`${element.CARDS} > div > a`);

  categoriesOptions.forEach((element) => {
    element.addEventListener("click", (event) => {
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
      displayRecipes(getCategoryName(), 0, 4);
    }
  } catch (error) {
    console.error("filterByCategory", error);
  }
};

const displayRecipes = (arr, start, end) => {
  const [fragment] = createFragment(1);

  for (let index = start; index < end; index++) {
    if (arr[index] === undefined) {
      break;
    }
    createCard(arr, getCategoryThumb(), fragment, index);
  }
  $(element.RECIPES).append(fragment);
};

const handleCardNavigation = () => {
  const buttons = $$(element.TOGGLE_CARD_BTN);
  const cards = $$(element.CARDS);
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
  const buttons = document.querySelectorAll(element.RECIPE_BTN);

  buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const target = event.currentTarget;
      const parent = target.closest("div");
      const textarea = parent.lastElementChild;
      textarea.hidden = textarea.hidden === false;
      parent.classList.toggle(listOfClass.CARDS_SWITCH_MODE);
    });
  });
};

const run = async () => {
  await getCategories();
  displayCategories();
  setCategory();
  // await getIngredients()
  handleCardNavigation();
  displayInfoCategory();
};

run();

const buttons = $$(element.NAV_BTN);
const config = {
  childList: true,
};

const observer = new MutationObserver((MutationRecords) => {
  // console.log(MutationRecords[0]);
  if (MutationRecords[0].addedNodes.length > 0) {
    $(element.LOADING).hidden = false;
    setTimeout(() => {
      $(element.LOADING).hidden = true;
      $(element.RECIPES).classList.remove(listOfClass.JS_HIDE);
      $(element.NAVBAR).classList.remove(listOfClass.JS_HIDE);
    }, 2000);
  }
});

observer.observe($(".recipes"), config);

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    $(element.RECIPES).classList.add(listOfClass.JS_HIDE);
    $(element.NAVBAR).classList.add(listOfClass.JS_HIDE);
    $(element.LOADING).hidden = false;

    setTimeout(() => {
      $(element.LOADING).hidden = true;
      $(element.RECIPES).classList.remove(listOfClass.JS_HIDE);
      $(element.NAVBAR).classList.remove(listOfClass.JS_HIDE);
    }, 2000);
  });
});
