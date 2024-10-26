export { DOM, CLASS };

// const template = document.querySelector("#template").content.children;
// const [btn_prev, btn_next] = document.querySelectorAll(".navBtn");

const DOM = {
  RECIPES: () => document.querySelector(".recipes"),
  NAVBAR: () => document.querySelector(".navbar"),
  RECIPE_ARTICLES: () => document.querySelectorAll(".recipes > article"),
  TEMPLATE: document.querySelector("#template").content.children,
  MAIN_SECTION: document.querySelector(".main-section"),
  CARDS: document.querySelectorAll(".cards"),
  LOADING: document.querySelector(".loading"),
  RECIPE_BTN: document.querySelector(".recipe-btn"),
  RECIPE_BTN_ALL: () => document.querySelectorAll(".recipe-btn"),
  NAV_ALL_BTN: document.querySelectorAll(".navBtn"),
  BTN_PREV: document.querySelectorAll(".navBtn")[0],
  BTN_NEXT: document.querySelectorAll(".navBtn")[1],
  TOGGLE_CARD_BTN: document.querySelectorAll(".toggleCardBtn"),
  FORM: document.querySelector("header > nav > form"),
  IMPUT_SEARCH: document.querySelector("form > fieldset > input[type='search']"),
  FILTER_BY: document.querySelector("form > fieldset.containerFilterBy"),
  SEARCH_BTN: document.querySelector("button.search-btn"),
  FILTER_BTN: document.querySelector("button.filter-btn"),
  SELECT: document.querySelector("header > nav > form > fieldset > select"),
  INPUT_OPTIONS: document.querySelectorAll("input[name='options']"),
  CARDS_SWITCH_MODE: () => document.querySelectorAll(".cards div.cardsSwitchMode"),
  CARDS_ANCHOR: document.querySelectorAll(".cards > div > a"),
  RECIPE_PREPARATION: () => document.querySelector(".recipePreparation"),
  RECIPE_PREPARATION_BTN: () => document.querySelector(".recipePreparation > button"),
  RECIPE_PREPARATION_H2: () => document.querySelector(".recipePreparation > h2"),
  RECIPE_PREPARATION_TEXTAREA: () => document.querySelector(".recipePreparation > textarea"),
  RECIPE_PREPARATION_THUMB: () => document.querySelector(".recipePreparation > aside > span.thumb > img"),
  RECIPE_PREPARATION_CATEGORY: () => document.querySelector(".recipePreparation > aside > span.category > p + p"),
  RECIPE_PREPARATION_AREA: () => document.querySelector(".recipePreparation > aside > span.area > p + p"),
  RECIPE_PREPARATION_TAGS: () => document.querySelector(".recipePreparation > aside > span.tags > p + p"),
  RECIPE_PREPARATION_LINK: () => document.querySelector(".recipePreparation > aside > span.ytb > a"),
  RECIPE_PREPARATION_OL: () => document.querySelector(".recipePreparation > ol"),
};

const CLASS = {
  MAIN_SECTION: "main-section",
  CARDS_SWITCH_MODE: "cardsSwitchMode",
  JS_SHOW: "js-show",
  JS_HIDE: "js-hide",
  CLOSE_TAB: "closeTab",
  HIDE_ELM: "hideElm"
};