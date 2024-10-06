import { categoryName, categoryThumb } from "./main.js"
import { parent, btn_prev, btn_next } from "./globalVar.js"
import { createCard } from "./generateCard.js"

let currentIndexNext = 4

const nextPage = () => {
  const fragment = document.createDocumentFragment()

  for (let index = currentIndexNext; index < categoryName.length; index++) {
    createCard(categoryName, categoryThumb, fragment, index)
  }

  parent.innerHTML = ""

  for (let index = 0; index < 4; index++) {
    if (fragment.firstElementChild === null) {
      break
    }
    parent.append(fragment.firstElementChild)
  }

  btn_next.disabled = fragment.childElementCount === 0

  currentIndexNext += 4
}

const prevPage = () => {
  const fragment = document.createDocumentFragment()

  for (let index = 0; index < categoryName.length; index++) {
    createCard(categoryName, categoryThumb, fragment, index)
  }

  const position = categoryName.indexOf(parent.firstElementChild.textContent.trim())

  parent.innerHTML = ""

  btn_prev.disabled = fragment.children[position - 8] === undefined

  for (let index = 0; index < 4; index++) {
    parent.prepend(fragment.children[position - index].previousElementSibling)
  }

  currentIndexNext = categoryName.indexOf(parent.lastElementChild.textContent.trim()) + 1
}

btn_prev.addEventListener("click", () => {
  prevPage()
  if (btn_next.disabled === true) {
    btn_next.disabled = false
  }
})

btn_next.addEventListener("click", () => {
  nextPage()
  btn_prev.disabled = false
})