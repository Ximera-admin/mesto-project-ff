/**
 * Генератор карточек
 */

/**
 * Создаёт DOM-элемент карточки
 * @param {Object} cardInfo - Данные карточки
 * @param {DocumentFragment} cardBlueprint - Шаблон карточки
 * @param {Object} eventHandlers - Обработчики событий
 * @param {string} currentUser - ID текущего пользователя
 * @returns {HTMLElement} Готовый элемент карточки
 */
export const generateCardElement = (
  cardInfo,
  cardBlueprint,
  eventHandlers,
  currentUser
) => {
  const cardElement = cardBlueprint.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteBtn = cardElement.querySelector(".card__delete-button");
  const likeBtn = cardElement.querySelector(".card__like-button");
  const likesCounter = cardElement.querySelector(".card__like-count");

  // Заполнение данными
  cardTitle.textContent = cardInfo.name;
  cardImage.src = cardInfo.link;
  cardImage.alt = `Фотография места: ${cardInfo.name}`;
  
  // Обновление счетчика лайков
  if (likesCounter) {
    likesCounter.textContent = cardInfo.likes?.length || 0;
  }

  // Проверка лайка пользователя
  if (cardInfo.likes?.some(user => user._id === currentUser)) {
    likeBtn.classList.add("card__like-button_is-active");
  }

  // Управление кнопкой удаления
  if (cardInfo.owner && cardInfo.owner._id !== currentUser) {
    deleteBtn.style.display = "none";
  }

  // Навешивание обработчиков
  deleteBtn.addEventListener("click", eventHandlers.onDelete);
  likeBtn.addEventListener("click", eventHandlers.onLike);
  cardImage.addEventListener("click", eventHandlers.onImageClick);

  return cardElement;
};

/**
 * Удаляет карточку из DOM
 * @param {Event} event - Событие клика
 */
export const removeCardElement = (event) => {
  event.target.closest(".card").remove();
};

/**
 * Переключает состояние лайка
 * @param {Event} event - Событие клика
 */
export const toggleLikeState = (event) => {
  event.target.classList.toggle("card__like-button_is-active");
};