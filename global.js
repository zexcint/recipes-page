export { DOM, CLASS };
const $ = elm => document.querySelector(`${elm}`)
const $$ = elm => document.querySelectorAll(`${elm}`)

const DOM = {
  // Static
  TEMPLATE: $("#template").content.children,
  MAIN_SECTION: $(".main-section"),
  CARDS: $$(".cards"),
  LOADING: $(".loading"),
  RECIPE_BTN: $(".recipe-btn"),
  NAV_ALL_BTN: $$(".navBtn"),
  BTN_PREV: $$(".navBtn")[0],
  BTN_NEXT: $$(".navBtn")[1],
  TOGGLE_CARD_BTN: $$(".toggleCardBtn"),
  FORM: $("header > nav > form"),
  IMPUT_SEARCH: $("form > fieldset > input[type='search']"),
  FILTER_BY: $("form > fieldset.containerFilterBy"),
  SEARCH_BTN: $("button.search-btn"),
  FILTER_BTN: $("button.filter-btn"),
  SELECT: $("header > nav > form > fieldset > select"),
  INPUT_OPTIONS: $$("input[name='options']"),

  // Dynamic
  RECIPES: () => $(".recipes"),
  RECIPE_ARTICLES: () => $$(".recipes > article"),
  RECIPE_BTN_ALL: () => $$(".recipe-btn"),
  CARDS_ANCHOR: () => $$(".cards > div > a"),
  CARDS_SWITCH_MODE: () => $$(".cards div.cardsSwitchMode"),
  NAVBAR: () => $(".navbar"),
  RECIPE_PREPARATION: () => $(".recipePreparation"),
  RECIPE_PREPARATION_BTN: () => $(".recipePreparation > button"),
  RECIPE_PREPARATION_H2: () => $(".recipePreparation > h2"),
  RECIPE_PREPARATION_TEXTAREA: () => $(".recipePreparation > textarea"),
  RECIPE_PREPARATION_THUMB: () => $(".recipePreparation > aside > div.thumb > img"),
  RECIPE_PREPARATION_CATEGORY: () => $(".recipePreparation > aside > div.category > p + p"),
  RECIPE_PREPARATION_AREA: () => $(".recipePreparation > aside > div.area > p + p"),
  RECIPE_PREPARATION_TAGS: () => $(".recipePreparation > aside > div.tags > p + p"),
  RECIPE_PREPARATION_LINK: () => $(".recipePreparation > aside > div.ytb > a"),
  RECIPE_PREPARATION_OL: () => $(".recipePreparation > ol"),
};

const CLASS = {
  MAIN_SECTION: "main-section",
  CARDS_SWITCH_MODE: "cardsSwitchMode",
  JS_SHOW: "js-show",
  JS_HIDE: "js-hide",
  CLOSE_TAB: "closeTab",
  HIDE_ELM: "hideElm"
};