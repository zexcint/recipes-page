export {
  displayRecipes,
  createFragment,
  timeOut
};

import { DOM, CLASS } from "./global.js";

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

import {
  displayPreparation,
  resetPreparationValues,
  startClosingAnimation
} from "./displayPreparation.js";

import { createCard } from "./setCards.js";
import { resetStates } from "./navBar.js";

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
    DOM.LOADING.hidden = false;
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
  DOM.BTN_PREV.disabled = true;
  DOM.RECIPES().innerHTML = "";
  DOM.RECIPES().classList.add(CLASS.JS_HIDE);
  DOM.NAVBAR().classList.add(CLASS.JS_HIDE);

  DOM.CARDS_SWITCH_MODE().forEach((elm) => {
    elm.lastElementChild.hidden = true;
    elm.classList.remove(CLASS.CARDS_SWITCH_MODE);
  });

  if (DOM.RECIPE_PREPARATION_H2().textContent !== "") {
    resetPreparationValues()
    console.log(DOM.RECIPE_PREPARATION().classList);
    DOM.RECIPE_PREPARATION().classList.add(CLASS.JS_HIDE);
    console.log(DOM.RECIPE_PREPARATION().classList);
  }
};

const displayCategories = () => {
  const [f1, f2, f3, f4] = createFragment(4);
  const [card1, card2, card3, card4] = DOM.CARDS

  for (const [index, value] of categories.entries()) {
    const container = DOM.TEMPLATE[2].cloneNode(true);
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
  DOM.CARDS_ANCHOR().forEach((element) => {
    element.addEventListener("click", async (event) => {
      // time of animation 1s
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
      DOM.BTN_NEXT.disabled = getCategoryName().length <= 4;
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
    createCard(arr, arr2, fragment, index);
  }

  DOM.RECIPES().append(fragment);
};

const handleCardNavigation = () => {
  const [prev, next] = DOM.TOGGLE_CARD_BTN;
  const MAX_CLICK = DOM.TOGGLE_CARD_BTN.length;
  const MIN_CLICK = 0;
  let countClick = 0;

  DOM.TOGGLE_CARD_BTN.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const currentTarget = event.currentTarget.dataset.id;

      if (currentTarget === "next") {
        DOM.CARDS[countClick].style.display = "none";
        DOM.CARDS[countClick + 1].style.display = "grid";
        countClick++;
      } else {
        countClick--;
        DOM.CARDS[countClick + 1].style.display = "none";
        DOM.CARDS[countClick].style.display = "grid";
      }

      prev.disabled = countClick <= MIN_CLICK;
      next.disabled = countClick > MAX_CLICK;
    });
  });
};

const displayInfoCategory = () => {
  DOM.RECIPE_BTN_ALL().forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const target = event.currentTarget;
      const parent = target.closest("div");
      const textarea = parent.lastElementChild;
      textarea.hidden = textarea.hidden === false;
      parent.classList.toggle(CLASS.CARDS_SWITCH_MODE);
    });
  });
};

const run = async () => {
  await getCategories();
  displayCategories();
  setCategory();
  handleCardNavigation();
  displayInfoCategory();

  const config = {
    childList: true,
    subtree: true,
    characterData: true,
  };

  const TARGET_NODE = DOM.MAIN_SECTION
  const observer = new MutationObserver(async (event) => {
    observer.disconnect();

    if (event[0].target.parentElement.className === CLASS.MAIN_SECTION) {
      await showLoading(1000);

      DOM.LOADING.hidden = true;
      DOM.RECIPES().classList.remove(CLASS.JS_HIDE);
      DOM.NAVBAR().classList.remove(CLASS.JS_HIDE);

      DOM.RECIPE_ARTICLES().forEach((article) => {
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

    observer.observe(TARGET_NODE, config);
  });

  observer.observe(TARGET_NODE, config);

  DOM.NAV_ALL_BTN.forEach((btn) => {
    btn.addEventListener("click", async () => {
      DOM.LOADING.hidden = false;
      DOM.RECIPES().classList.add(CLASS.JS_HIDE);
      DOM.NAVBAR().classList.add(CLASS.JS_HIDE);

      await timeOut(1000);

      DOM.LOADING.hidden = true;
      DOM.RECIPES().classList.remove(CLASS.JS_HIDE);
      DOM.NAVBAR().classList.remove(CLASS.JS_HIDE);
    });
  });

  DOM.RECIPE_PREPARATION_BTN().addEventListener("click", async () => {
      resetPreparationValues();
      startClosingAnimation()
    }
  );
}; // end

run();
