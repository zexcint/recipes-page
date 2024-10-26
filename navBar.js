export { resetStates, getStates };
import { getCategoryName, getCategoryThumb } from "./apiFunctions.js";
import { DOM } from "./global.js";
import { createCard } from "./setCards.js";

const states = {
  currentIndex: 4,
  reference: []
};

function getStates() {
  return {
    currentIndex: states.currentIndex,
    reference: [...states.reference]
  }
}

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

  states.reference.push(DOM.RECIPES().cloneNode(true));

  DOM.RECIPES().innerHTML = "";

  for (let i = 0; i < 4; i++) {
    if (fragment.firstElementChild === null) {
      break;
    }
    DOM.RECIPES().append(fragment.firstElementChild);
  }

  if (maxLength === getCategoryName().length) {
    DOM.BTN_NEXT.disabled = true;
    return;
  } else {
    states.currentIndex += 4;
  }
};

const prevPage = () => {
  DOM.MAIN_SECTION.replaceChild(states.reference.pop(), DOM.RECIPES());
  states.currentIndex = getCategoryName().indexOf(DOM.RECIPES().lastElementChild.textContent.trim()) + 1;
  DOM.BTN_PREV.disabled = states.reference.length === 0;
};

DOM.BTN_PREV.addEventListener("click", () => {
  prevPage();
  if (DOM.BTN_NEXT.disabled === true) {
   DOM.BTN_NEXT.disabled = false;
  }
});

DOM.BTN_NEXT.addEventListener("click", () => {
  nextPage();
  if (DOM.BTN_PREV.disabled === true) {
    DOM.BTN_PREV.disabled = false;
  }
});
