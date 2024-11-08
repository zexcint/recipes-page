export const createCard = (arr1, arr2, container, index) => {
  const article = document.createElement("article")
  const span = document.createElement("span")

  span.textContent = arr1[index]
  article.style.backgroundImage = `url(${arr2[index]})`
  article.append(span)
  article.dataset.id = arr1[index]
  container.append(article)
}
