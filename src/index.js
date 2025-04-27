import './styles/index.css';
import './components/cards.js';
import './components/modal.js';
// @todo: Темплейт карточки
// Ищем в HTML элемент id="card-template"
// и сохраняем содержимое (шаблон карточки) в переменной cardTemplate
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
// Ищем HTML элемент с классом places__list 
// и сохраняем в переменную cardList
const cardList = document.querySelector(".places__list");

// @todo: Функция создания карточки
// Объявляем и сохраняем в переменную createCard функцию, 
// используя стрелочную функцию
// и извлекаем нужные поля (название, ссылка) в аргументах.
// Вторым параметром функции будет функция-обработчик, 
// которую мы передаём для удаления карточки.
// Она будет вызвана при клике по иконке корзины
const createCard = ({ name, link }, startDelete) => {

  // Сохраним в переменную cardItem копию карточки, созданную из шаблона.
  // Покопаемся в переменной cardTemplate и найдём нужный нам элемент <li>.
  // Скопируем этот DOM элемент со всем содержимым
  const cardItem = cardTemplate.querySelector(".places__item").cloneNode(true);

  // Найдём в содержимом элемент с классом .card__image
  // и сохраним его в переменной cardPic 
  const cardPic = cardItem.querySelector(".card__image");

  // Найдём в содержимом элемент с классом .card__title
  // и сохраним его в переменной cardTitle 
  const cardTitle = cardItem.querySelector(".card__title");

  // Найдём в содержимом элемент с классом .card__delete-button
  // и сохраним его в переменной deleteButton 
  const deleteButton = cardItem.querySelector(".card__delete-button");

  // Установим текстовое содержимое элемента (в нашем случае название карточки)
  cardTitle.textContent = name;

  // Установим путь к изображению в HTML
  cardPic.src = link;

  // Установим альтернативный текст для картинки в HTML
  cardPic.alt = name;

  // "Послушаем" найденную выше кнопку deleteButton и если на нее нажмут,
  // вызовем функцию startDelete, передав ей в аргументах текущую карточку
  deleteButton.addEventListener("click", () => startDelete(cardItem));

  // Возвращаем полностью настроенный DOM-элемент карточки наружу из функции.
  return cardItem;
};

// @todo: Функция удаления карточки
// Создадим стрелочную функцию deleteCard, которая будет принимать один элемент (card) 
// и будет удалять его из HTML, используя метод .remove()
const deleteCard = (card) => {
  card.remove();
};

// @todo: Вывести карточки на страницу
// Создадим переменную и одновременно функцию renderInitialCards, которая
// будет отображать начальные карточки на странице, принимая на вход
// массив initialCards, объявленный в файле cards.js
const renderInitialCards = (cards) => {

  // Переберём все элементы массива по очереди и для каждого вызовем
  // функцию createCard, передав ей текущий объект как переменную card
  cards.forEach((card) => {

    // Создадим переменную, в которой будет находиться полностью готовая карточка,
    // используя выше написанную функцию createCard 
    const cardElement = createCard(card, deleteCard);

    // Добавим карточку в HTML используя метод .append
    cardList.append(cardElement);
  });
};

// Запустим отображение наших карточек, вызвав функуию renderInitialCards
renderInitialCards(initialCards);