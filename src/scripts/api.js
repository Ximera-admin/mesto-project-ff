/**
 * Сервис для работы с API
 */

const apiSettings = {
  baseEndpoint: "https://mesto.nomoreparties.co/v1/wff-cohort-39",
  headers: {
    authorization: "3193d9f6-f26f-4e13-8fe0-26211ac7b423",
    "Content-Type": "application/json"
  }
};

/**
 * Обрабатывает ответ сервера
 * @param {Response} response - Ответ сервера
 * @returns {Promise} Промис с данными или ошибкой
 */
const parseResponse = (response) => {
  return response.ok
    ? response.json()
    : Promise.reject(`Ошибка: ${response.status}`);
};

/**
 * Получает данные пользователя
 * @returns {Promise} Промис с данными пользователя
 */
export const fetchUserData = () => {
  return fetch(`${apiSettings.baseEndpoint}/users/me`, {
    headers: apiSettings.headers
  }).then(parseResponse);
};

/**
 * Получает начальные карточки
 * @returns {Promise} Промис с массивом карточек
 */
export const fetchCards = () => {
  return fetch(`${apiSettings.baseEndpoint}/cards`, {
    headers: apiSettings.headers
  }).then(parseResponse);
};

/**
 * Обновляет информацию о пользователе
 * @param {string} name - Имя пользователя
 * @param {string} about - Описание пользователя
 * @returns {Promise} Промис с обновлёнными данными
 */
export const updateProfile = (name, about) => {
  return fetch(`${apiSettings.baseEndpoint}/users/me`, {
    method: "PATCH",
    headers: apiSettings.headers,
    body: JSON.stringify({ name, about })
  }).then(parseResponse);
};

/**
 * Создаёт новую карточку
 * @param {string} name - Название места
 * @param {string} link - Ссылка на изображение
 * @returns {Promise} Промис с данными новой карточки
 */
export const serverCreateCard = (name, link) => {
  return fetch(`${apiSettings.baseEndpoint}/cards`, {
    method: "POST",
    headers: apiSettings.headers,
    body: JSON.stringify({ name, link })
  }).then(parseResponse);
};

/**
 * Удаляет карточку
 * @param {string} cardId - ID карточки
 * @returns {Promise} Промис с результатом удаления
 */
export const serverRemoveCard = (cardId) => {
  return fetch(`${apiSettings.baseEndpoint}/cards/${cardId}`, {
    method: "DELETE",
    headers: apiSettings.headers
  }).then(parseResponse);
};

/**
 * Ставит лайк карточке
 * @param {string} cardId - ID карточки
 * @returns {Promise} Промис с обновлённой карточкой
 */
export const serverAddLike = (cardId) => {
  return fetch(`${apiSettings.baseEndpoint}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: apiSettings.headers
  }).then(parseResponse);
};

/**
 * Удаляет лайк с карточки
 * @param {string} cardId - ID карточки
 * @returns {Promise} Промис с обновлённой карточкой
 */
export const serverRemoveLike = (cardId) => {
  return fetch(`${apiSettings.baseEndpoint}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: apiSettings.headers
  }).then(parseResponse);
};

/**
 * Обновляет аватар пользователя
 * @param {string} avatarUrl - URL нового аватара
 * @returns {Promise} Промис с обновлёнными данными
 */
export const updateAvatar = (avatarUrl) => {
  return fetch(`${apiSettings.baseEndpoint}/users/me/avatar`, {
    method: "PATCH",
    headers: apiSettings.headers,
    body: JSON.stringify({ avatar: avatarUrl })
  }).then(parseResponse);
};