export const createCard = (arr1, arr2, container, index) => {
  const article = document.createElement("article");
  const span = document.createElement("span");
  // const img = document.createElement("img");

  // span.textContent = arr1[index];
  // img.src = arr2[index];
  // article.append(span, img);

  span.textContent = arr1[index];
  article.style.backgroundImage = `url(${arr2[index]})`;
  article.append(span);
  container.append(article);
};
