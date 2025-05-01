import './styles/index.css';
import { initialCards } from './components/cards.js';
import { openModal, closeModal } from './components/modal.js';
import { createCard } from './components/card.js';

// DOM элементы
const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const cardList = document.querySelector('.places__list');

// Попапы
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// Формы
const editForm = editProfilePopup.querySelector('.popup__form');
const addCardForm = addCardPopup.querySelector('.popup__form');

// Обработчик открытия попапа с картинкой
function handleCardImageClick(cardData) {
  const popupImage = imagePopup.querySelector('.popup__image');
  const popupCaption = imagePopup.querySelector('.popup__caption');
  
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  
  openModal(imagePopup);
}

// Обработчик лайка
function handleLikeClick(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

// Обработчик удаления карточки
function handleDeleteClick(cardElement) {
  cardElement.remove();
}

// Функция рендеринга карточки
function renderCard(cardData) {
  const cardElement = createCard(
    cardData,
    handleDeleteClick,
    handleLikeClick,
    handleCardImageClick
  );
  cardList.prepend(cardElement);
}

// Обработчики открытия попапов
editProfileButton.addEventListener('click', () => {
  const nameInput = editForm.querySelector('.popup__input_type_name');
  const jobInput = editForm.querySelector('.popup__input_type_description');
  
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  
  openModal(editProfilePopup);
});

addCardButton.addEventListener('click', () => {
  openModal(addCardPopup);
});

// Обработчик формы редактирования профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const nameInput = editForm.querySelector('.popup__input_type_name');
  const jobInput = editForm.querySelector('.popup__input_type_description');
  
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  
  closeModal(editProfilePopup);
}

// Обработчик формы добавления карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const nameInput = addCardForm.querySelector('.popup__input_type_card-name');
  const linkInput = addCardForm.querySelector('.popup__input_type_url');
  
  const newCard = {
    name: nameInput.value,
    link: linkInput.value
  };
  
  renderCard(newCard);
  addCardForm.reset();
  closeModal(addCardPopup);
}

// Инициализация карточек
initialCards.forEach(card => {
  renderCard(card);
});

// Навешиваем обработчики форм
editForm.addEventListener('submit', handleEditFormSubmit);
addCardForm.addEventListener('submit', handleAddCardFormSubmit);

// Навешиваем обработчики закрытия на все попапы
document.querySelectorAll('.popup__close').forEach(button => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => closeModal(popup));
});