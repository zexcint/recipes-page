export { resetStates };
import { getCategoryName, getCategoryThumb } from "./apiFunctions.js";
import { btn_prev, btn_next } from "./globalVar.js";
import { createCard } from "./setCards.js";

const states = {
  currentIndex: 4,
  reference: [],
};

const resetStates = () => {
  states.currentIndex = 4;
  states.reference = [];
};

const nextPage = () => {
  const fragment = document.createDocumentFragment();
  const maxLength = Math.min(states.currentIndex + 4, getCategoryName().length);

  for (let i = states.currentIndex; i < maxLength; i++) {
    createCard(getCategoryName(), getCategoryThumb(), fragment, i);
  }

  states.reference.push(document.querySelector(".recipes").cloneNode(true));

  document.querySelector(".recipes").innerHTML = "";

  for (let i = 0; i < 4; i++) {
    if (fragment.firstElementChild === null) {
      break;
    }
    document.querySelector(".recipes").append(fragment.firstElementChild);
  }

  if (maxLength === getCategoryName().length) {
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
    getCategoryName().indexOf(
      document.querySelector(".recipes").lastElementChild.textContent.trim()
    ) + 1;
  btn_prev.disabled = states.reference.length === 0;
};

btn_prev.addEventListener("click", () => {
  prevPage();
  // if (btn_next.disabled === true) {
  //   btn_next.disabled = false;
  // }
  btn_next.disabled = false;
  // true -> false
  // false -> true
});

btn_next.addEventListener("click", () => {
  nextPage();
  btn_prev.disabled = false;
});
