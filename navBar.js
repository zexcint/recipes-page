import { categoryName, categoryThumb } from "./main.js";
import { btn_prev, btn_next } from "./globalVar.js";
import { createCard } from "./generateCard.js";

const states = {
  currentIndex: 4,
  reference: [],
};

export const resetCurrentIndex = () => (states.currentIndex = 4);
export const resetReference = () => (states.reference = []);

const nextPage = () => {
  const fragment = document.createDocumentFragment();
  let maxLength = Math.min(states.currentIndex + 4, categoryName.length);

  for (let i = states.currentIndex; i < maxLength; i++) {
    createCard(categoryName, categoryThumb, fragment, i);
  }

  states.reference.push(document.querySelector(".recipes").cloneNode(true));

  document.querySelector(".recipes").innerHTML = "";

  for (let i = 0; i < 4; i++) {
    if (fragment.firstElementChild === null) {
      break;
    }
    document.querySelector(".recipes").append(fragment.firstElementChild);
  }

  if (maxLength === categoryName.length) {
    btn_next.disabled = true;
    return;
  } else {
    states.currentIndex += 4;
  }
};

const prevPage = () => {
  document
    .querySelector(".main-section")
    .replaceChild(states.reference.pop(), document.querySelector(".recipes"));
  states.currentIndex =
    categoryName.indexOf(
      document.querySelector(".recipes").lastElementChild.textContent.trim()
    ) + 1;
  btn_prev.disabled = states.reference.length === 0;
};

btn_prev.addEventListener("click", () => {
  prevPage();
  if (btn_next.disabled === true) {
    btn_next.disabled = false;
  }
});

btn_next.addEventListener("click", () => {
  nextPage();
  btn_prev.disabled = false;
});
