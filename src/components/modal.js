// Функции для работы с модальными окнами
export function openModal(modalElement) {
  modalElement.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscapeKey);
  modalElement.addEventListener('mousedown', handleOverlayClick);
}

export function closeModal(modalElement) {
  modalElement.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscapeKey);
  modalElement.removeEventListener('mousedown', handleOverlayClick);
}

function handleEscapeKey(evt) {
  if (evt.key === 'Escape') {
    const openedModal = document.querySelector('.popup_is-opened');
    if (openedModal) closeModal(openedModal);
  }
}

function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}