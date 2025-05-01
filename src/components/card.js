export function createCard(cardData, handleDeleteClick, handleLikeClick, handleImageClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', () => handleDeleteClick(cardElement));
  likeButton.addEventListener('click', handleLikeClick);
  cardImage.addEventListener('click', () => handleImageClick(cardData));

  return cardElement;
}