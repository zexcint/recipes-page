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
import { createCard } from "./setCards.js";
import { template, btn_prev, btn_next } from "./globalVar.js";
import { resetStates } from "./navBar.js";

const $ = (element) => document.querySelector(element);
const $$ = (elements) => document.querySelectorAll(elements);

const element = {
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
    $(element.LOADING).hidden = false;
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
  $(element.RECIPES).innerHTML = "";
  $(element.RECIPES).classList.add(classLists.JS_HIDE);
  $(element.NAVBAR).classList.add(classLists.JS_HIDE);

  $$(`${element.CARDS} div.cardsSwitchMode`).forEach((elm) => {
    elm.lastElementChild.hidden = true;
    elm.classList.remove("cardsSwitchMode");
  });

  if ($(`${element.RECIPE_PREPARATION} > h2`).textContent !== "") {
    $(`${element.RECIPE_PREPARATION} > h2`).textContent = "";
    $(`${element.RECIPE_PREPARATION} > textarea`).value = "";
    $(`${element.RECIPE_PREPARATION} > aside > span.thumb > img`).src = "";
    $(
      `${element.RECIPE_PREPARATION} > aside > span.category > p + p`
    ).textContent = "";
    $(`${element.RECIPE_PREPARATION} > aside > span.area > p + p`).textContent =
      "";
    // $(`${element.RECIPE_PREPARATION} > aside > span.area`).innerHTML = "";
    $(`${element.RECIPE_PREPARATION} > aside > span.tags > p + p`).textContent =
      "";
    $(`${element.RECIPE_PREPARATION} > aside > span.ytb > a`).href = "";
    $(`${element.RECIPE_PREPARATION} > ol`).innerHTML = "";
    $(element.RECIPE_PREPARATION).classList.add(classLists.JS_HIDE);
  }
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
  const categoriesOptions = $$(`${element.CARDS} > div > a`);

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
      parent.classList.toggle(classLists.CARDS_SWITCH_MODE);
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
  // getIngredients()

  const buttons = $$(element.NAV_BTN);
  const config = {
    childList: true,
    subtree: true,
    characterData: true,
  };

  const observer = new MutationObserver(async (event) => {
    if (event[0].target.parentElement.className === classLists.MAIN_SECTION) {
      await showLoading(1000);

      $(element.LOADING).hidden = true;
      $(element.RECIPES).classList.remove(classLists.JS_HIDE);
      $(element.NAVBAR).classList.remove(classLists.JS_HIDE);

      $$(`${element.RECIPES} > article`).forEach((article) => {
        article.addEventListener("click", async (event) => {
          const target = event.currentTarget.textContent.trim();
          const id = getCategoryName().indexOf(target);
          await getFullDetailsById(getCategoryId()[id]);
          displayPreparation();
        });
      });
    }
  });

  observer.observe($(element.MAIN_SECTION), config);

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      $(element.LOADING).hidden = false;
      $(element.RECIPES).classList.add(classLists.JS_HIDE);
      $(element.NAVBAR).classList.add(classLists.JS_HIDE);

      await timeOut(1000);

      $(element.LOADING).hidden = true;
      $(element.RECIPES).classList.remove(classLists.JS_HIDE);
      $(element.NAVBAR).classList.remove(classLists.JS_HIDE);
    });
  });

  $(`${element.RECIPE_PREPARATION} > button > svg`).addEventListener(
    "click",
    async () => {
      $(element.RECIPE_PREPARATION).classList.add("closeTab");
      await timeOut(250);
      $(element.RECIPE_PREPARATION).classList.remove("closeTab");
      $(element.RECIPE_PREPARATION).classList.add(classLists.JS_HIDE);
      $(element.RECIPES).classList.remove(classLists.JS_HIDE);
      $(element.NAVBAR).classList.remove(classLists.JS_HIDE);
    }
  );

  const displayPreparation = async () => {
    const json = await getFlags();
    const fragment = createFragment(1)[0];

    $(element.RECIPES).classList.add(classLists.JS_HIDE);
    $(element.NAVBAR).classList.add(classLists.JS_HIDE);
    $(element.RECIPE_PREPARATION).classList.remove(classLists.JS_HIDE);

    // // reset
    // $(`${element.RECIPE_PREPARATION} > h2`).textContent = ""
    // $(`${element.RECIPE_PREPARATION} > textarea`).value = ""
    // $(`${element.RECIPE_PREPARATION} > aside > span > img`).src = ""
    // $(`${element.RECIPE_PREPARATION} > aside > span.category > p + p`).textContent =" "
    // $(`${element.RECIPE_PREPARATION} > aside > span.area > p + p`).textContent = ""
    // $(`${element.RECIPE_PREPARATION} > aside > span.tags > p + p`).textContent = ""
    // $(`${element.RECIPE_PREPARATION} > aside > span.ytb > a`).href = ""
    // // end

    $(`${element.RECIPE_PREPARATION} > h2`).textContent =
      getDetailsById().strMeal;

    $(`${element.RECIPE_PREPARATION} > textarea`).value =
      getDetailsById().strInstructions;

    $(`${element.RECIPE_PREPARATION} > aside > span > img`).src =
      getDetailsById().strMealThumb;

    $(
      `${element.RECIPE_PREPARATION} > aside > span.category > p + p`
    ).textContent = getDetailsById().strCategory ?? "empity";

    $(`${element.RECIPE_PREPARATION} > aside > span.area > p + p`).textContent =
      getDetailsById().strArea ?? "empity";

    $(`${element.RECIPE_PREPARATION} > aside > span.tags > p + p`).textContent =
      getDetailsById().strTags ?? "empity";

    $(`${element.RECIPE_PREPARATION} > aside > span.ytb > a`).href =
      getDetailsById().strYoutube;

    for (let index = 0; index < json.flags.length; index++) {
      if (json.flags[index].hasOwnProperty(getDetailsById().strArea)) {
        $(
          `${element.RECIPE_PREPARATION} > aside > span.area > p + p`
        ).textContent += ` ${json.flags[index][getDetailsById().strArea]}`;
        break;
      }
    }

    const arr = Object.entries(getDetailsById());

    const arr2 = arr.filter(
      (elm) =>
        elm[0].startsWith("strIngredient") &&
        elm[1] !== "" &&
        elm[1] !== " " &&
        elm[1] !== null
    );

    const measure = arr.filter(
      (elm) =>
        elm[0].startsWith("strMeasure") &&
        elm[1] !== "" &&
        elm[1] !== " " &&
        elm[1] !== null
    );

    const ingredient = Array.from(new Set(arr2.map((elm) => elm[1])));

    for (let index = 0; index < ingredient.length; index++) {
      const li = document.createElement("li");
      const img = document.createElement("img");

      li.textContent = `${ingredient?.[index]} - ${measure?.[index]?.[1]}`;
      img.src = `${URL.THUMB_INGREDIENT}${ingredient?.[index]}-Small.png`;

      if (li.textContent.includes("undefined")) {
        li.textContent = li.textContent.replace("undefined", "");
      }

      fragment.append(li, img);
    }

    $(`${element.RECIPE_PREPARATION} > ol`).innerHTML = ""
    $(`${element.RECIPE_PREPARATION} > ol`).append(fragment);
  };
}; // end

run();
