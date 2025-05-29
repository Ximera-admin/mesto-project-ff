// Импорты
import "../styles/index.css";
import { 
  hideModal, 
  showModal, 
  handleKeyPress, 
  handleOverlayClick 
} from "./popups.js";
import { generateCardElement } from "./card.js";
import { 
  setupFormValidation, 
  resetFormValidation 
} from "./validation.js";
import {
  fetchUserData,
  fetchCards,
  updateProfile,
  serverCreateCard,
  serverRemoveCard,
  serverAddLike,
  serverRemoveLike,
  updateAvatar
} from "./api.js";

// Текущий пользователь
let currentUserId = null;

// DOM элементы
const elements = {
  cardsContainer: document.querySelector(".places__list"),
  cardTemplate: document.querySelector("#card-template").content,
  modalCloseButtons: document.querySelectorAll(".popup__close"),
  allModals: document.querySelectorAll(".popup"),
  editProfileBtn: document.querySelector(".profile__edit-button"),
  addCardBtn: document.querySelector(".profile__add-button"),
  profileImage: document.querySelector(".profile__image"),
  profileTitle: document.querySelector(".profile__title"),
  profileDescription: document.querySelector(".profile__description"),
  
  // Формы
  profileForm: document.forms["edit-profile"],
  newCardForm: document.forms["new-place"],
  avatarForm: document.forms["avatar-form"],
  
  // Модальные окна
  imageModal: document.querySelector(".popup_type_image"),
  editModal: document.querySelector(".popup_type_edit"),
  newCardModal: document.querySelector(".popup_type_new-card"),
  avatarModal: document.querySelector(".popup_type_avatar")
};

// Конфиг валидации
const validationConfig = {
  formClass: ".popup__form",
  inputClass: ".popup__input",
  submitBtnClass: ".popup__button",
  disabledBtnClass: "popup__button_inactive",
  errorInputClass: "popup__input_type_error",
  visibleErrorClass: "popup__error_visible"
};

/**
 * Открывает модальное окно с изображением
 * @param {Event} event - Событие клика
 */
const openImageModal = (event) => {
  const card = event.target.closest(".card");
  const imageElement = card.querySelector(".card__image");
  
  elements.imageModal.querySelector(".popup__image").src = imageElement.src;
  elements.imageModal.querySelector(".popup__image").alt = imageElement.alt;
  elements.imageModal.querySelector(".popup__caption").textContent = 
    card.querySelector(".card__title").textContent;
  
  showModal(elements.imageModal);
};

/**
 * Отображает карточки на странице
 * @param {Array} cards - Массив карточек
 */
const renderCards = (cards) => {
  elements.cardsContainer.innerHTML = "";
  
  cards.forEach(card => {
    const cardElement = generateCardElement(
      card,
      elements.cardTemplate,
      {
        onDelete: (evt) => handleCardDeletion(evt, card),
        onLike: (evt) => handleCardLike(evt, card),
        onImageClick: openImageModal
      },
      currentUserId
    );
    
    elements.cardsContainer.append(cardElement);
  });
};

/**
 * Обработчик удаления карточки
 * @param {Event} event - Событие клика
 * @param {Object} cardData - Данные карточки
 */
const handleCardDeletion = (event, cardData) => {
  if (confirm("Удалить карточку?")) {
    serverRemoveCard(cardData._id)
      .then(() => {
        event.target.closest(".card").remove();
      })
      .catch(console.error);
  }
};

/**
 * Обработчик лайка карточки
 * @param {Event} event - Событие клика
 * @param {Object} cardData - Данные карточки
 */
const handleCardLike = (event, cardData) => {
  const likeButton = event.target;
  const cardElement = likeButton.closest(".card");
  const likesCounter = cardElement.querySelector(".card__like-count");
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  
  const apiCall = isLiked ? serverRemoveLike : serverAddLike;
  
  apiCall(cardData._id)
    .then(updatedCard => {
      likeButton.classList.toggle("card__like-button_is-active");
      if (likesCounter) {
        likesCounter.textContent = updatedCard.likes.length;
      }
    })
    .catch(console.error);
};

/**
 * Обработчик открытия модалки редактирования профиля
 */
const openProfileEditor = () => {
  elements.profileForm.elements["name"].value = elements.profileTitle.textContent;
  elements.profileForm.elements["description"].value = 
    elements.profileDescription.textContent;
  
  showModal(elements.editModal);
  resetFormValidation(elements.profileForm, validationConfig);
};

/**
 * Обработчик отправки формы профиля
 * @param {Event} event - Событие отправки формы
 */
const handleProfileSubmit = (event) => {
  event.preventDefault();
  const submitButton = elements.profileForm.querySelector(
    validationConfig.submitBtnClass
  );
  const originalText = submitButton.textContent;
  
  submitButton.textContent = "Сохранение...";
  
  updateProfile(
    elements.profileForm.elements["name"].value,
    elements.profileForm.elements["description"].value
  )
    .then(userData => {
      elements.profileTitle.textContent = userData.name;
      elements.profileDescription.textContent = userData.about;
      hideModal(event);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = originalText;
    });
};

/**
 * Обработчик открытия модалки добавления карточки
 */
const openCardAdder = () => {
  showModal(elements.newCardModal);
  elements.newCardForm.reset();
  resetFormValidation(elements.newCardForm, validationConfig);
};

/**
 * Обработчик отправки формы новой карточки
 * @param {Event} event - Событие отправки формы
 */
const handleCardSubmit = (event) => {
  event.preventDefault();
  const submitButton = elements.newCardForm.querySelector(
    validationConfig.submitBtnClass
  );
  const originalText = submitButton.textContent;
  
  submitButton.textContent = "Сохранение...";
  
  serverCreateCard(
    elements.newCardForm.elements["place-name"].value,
    elements.newCardForm.elements["link"].value
  )
    .then(newCard => {
      const cardElement = generateCardElement(
        newCard,
        elements.cardTemplate,
        {
          onDelete: (evt) => handleCardDeletion(evt, newCard),
          onLike: (evt) => handleCardLike(evt, newCard),
          onImageClick: openImageModal
        },
        currentUserId
      );
      
      elements.cardsContainer.prepend(cardElement);
      hideModal(event);
      elements.newCardForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = originalText;
    });
};

/**
 * Обработчик открытия модалки смены аватара
 */
const openAvatarEditor = () => {
  showModal(elements.avatarModal);
  elements.avatarForm.reset();
  resetFormValidation(elements.avatarForm, validationConfig);
};

/**
 * Обработчик отправки формы аватара
 * @param {Event} event - Событие отправки формы
 */
const handleAvatarSubmit = (event) => {
  event.preventDefault();
  const submitButton = elements.avatarForm.querySelector(
    validationConfig.submitBtnClass
  );
  const originalText = submitButton.textContent;
  
  submitButton.textContent = "Сохранение...";
  
  updateAvatar(elements.avatarForm.elements["avatar"].value)
    .then(userData => {
      elements.profileImage.style.backgroundImage = `url(${userData.avatar})`;
      hideModal(event);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = originalText;
    });
};

// Инициализация валидации форм
setupFormValidation(validationConfig);

// Навешивание обработчиков закрытия модалок
elements.modalCloseButtons.forEach(button => {
  button.addEventListener("click", hideModal);
});

elements.allModals.forEach(modal => {
  modal.addEventListener("click", handleOverlayClick);
});

// Навешивание обработчиков кнопок
elements.editProfileBtn.addEventListener("click", openProfileEditor);
elements.addCardBtn.addEventListener("click", openCardAdder);
elements.profileImage.addEventListener("click", openAvatarEditor);

// Навешивание обработчиков форм
elements.profileForm.addEventListener("submit", handleProfileSubmit);
elements.newCardForm.addEventListener("submit", handleCardSubmit);
elements.avatarForm.addEventListener("submit", handleAvatarSubmit);

// Загрузка начальных данных
Promise.all([fetchUserData(), fetchCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    elements.profileTitle.textContent = userData.name;
    elements.profileDescription.textContent = userData.about;
    elements.profileImage.style.backgroundImage = `url(${userData.avatar})`;
    renderCards(cards);
  })
  .catch(console.error);