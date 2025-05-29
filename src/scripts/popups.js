/**
 * Управление модальными окнами
 */

/**
 * Скрывает активное модальное окно
 * @param {Event} event - Событие, вызвавшее закрытие
 */
export const hideModal = (event) => {
  const activeModal = event.target.closest(".popup") || 
                     document.querySelector(".popup_is-opened");
  
  if (activeModal) {
    activeModal.classList.remove("popup_is-opened");
    document.removeEventListener("keydown", handleKeyPress);
  }
};

/**
 * Отображает модальное окно
 * @param {HTMLElement} modalElement - Элемент модального окна
 */
export const showModal = (modalElement) => {
  modalElement.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleKeyPress);
};

/**
 * Обработчик нажатия клавиш
 * @param {KeyboardEvent} event - Событие клавиатуры
 */
export const handleKeyPress = (event) => {
  if (event.key === "Escape") {
    hideModal(event);
  }
};

/**
 * Обработчик клика по оверлею
 * @param {MouseEvent} event - Событие мыши
 */
export const handleOverlayClick = (event) => {
  if (!event.target.closest(".popup__content")) {
    hideModal(event);
  }
};