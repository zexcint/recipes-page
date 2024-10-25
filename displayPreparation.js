export { displayPreparation };
import { $, domElements, classLists, createFragment } from "./main.js";
import { URL, getDetailsById, getFlags } from "./apiFunctions.js";

const displayPreparation = async () => {
  const json = await getFlags();
  const fragment = createFragment(1)[0];

  $(domElements.RECIPES).classList.add(classLists.JS_HIDE);
  $(domElements.NAVBAR).classList.add(classLists.JS_HIDE);
  $(domElements.RECIPE_PREPARATION).classList.remove(classLists.JS_HIDE);

  $(`${domElements.RECIPE_PREPARATION} > h2`).textContent =
    getDetailsById().strMeal;

  $(`${domElements.RECIPE_PREPARATION} > textarea`).value =
    getDetailsById().strInstructions;

  $(`${domElements.RECIPE_PREPARATION} > aside > span > img`).src =
    getDetailsById().strMealThumb;

  $(
    `${domElements.RECIPE_PREPARATION} > aside > span.category > p + p`
  ).textContent = getDetailsById().strCategory ?? "empity";

  $(
    `${domElements.RECIPE_PREPARATION} > aside > span.area > p + p`
  ).textContent = getDetailsById().strArea ?? "empity";

  $(
    `${domElements.RECIPE_PREPARATION} > aside > span.tags > p + p`
  ).textContent = getDetailsById().strTags ?? "empity";

  $(`${domElements.RECIPE_PREPARATION} > aside > span.ytb > a`).href =
    getDetailsById().strYoutube;

  for (let index = 0; index < json.flags.length; index++) {
    if (json.flags[index].hasOwnProperty(getDetailsById().strArea)) {
      $(
        `${domElements.RECIPE_PREPARATION} > aside > span.area > p + p`
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
  $(`${domElements.RECIPE_PREPARATION} > ol`).append(fragment);
};
