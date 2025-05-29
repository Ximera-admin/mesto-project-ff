/**
 * Валидация форм
 */

/**
 * Показывает сообщение об ошибке
 * @param {HTMLFormElement} form - Форма
 * @param {HTMLInputElement} input - Поле ввода
 * @param {string} errorMessage - Текст ошибки
 * @param {Object} config - Конфигурация валидации
 */
const showError = (form, input, errorMessage, config) => {
  const errorElement = form.querySelector(`#${input.id}-error`) || 
                      form.querySelector(`#${input.name}-error`);
  
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.visibleErrorClass);
    input.classList.add(config.errorInputClass);
  }
};

/**
 * Скрывает сообщение об ошибке
 * @param {HTMLFormElement} form - Форма
 * @param {HTMLInputElement} input - Поле ввода
 * @param {Object} config - Конфигурация валидации
 */
const hideError = (form, input, config) => {
  const errorElement = form.querySelector(`#${input.id}-error`) || 
                      form.querySelector(`#${input.name}-error`);
  
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove(config.visibleErrorClass);
    input.classList.remove(config.errorInputClass);
  }
};

/**
 * Проверяет валидность поля
 * @param {HTMLFormElement} form - Форма
 * @param {HTMLInputElement} input - Поле ввода
 * @param {Object} config - Конфигурация валидации
 * @returns {boolean} Валидно ли поле
 */
const validateInput = (form, input, config) => {
  if (!input.validity.valid) {
    let errorText = "";
    
    if (input.validity.valueMissing && input.dataset.errorRequired) {
      errorText = input.dataset.errorRequired;
    } else if (input.validity.patternMismatch && input.dataset.errorPattern) {
      errorText = input.dataset.errorPattern;
    } else {
      errorText = input.validationMessage;
    }
    
    showError(form, input, errorText, config);
    return false;
  }
  
  hideError(form, input, config);
  return true;
};

/**
 * Деактивирует кнопку отправки
 * @param {HTMLButtonElement} button - Кнопка
 * @param {Object} config - Конфигурация валидации
 */
const disableButton = (button, config) => {
  button.disabled = true;
  button.classList.add(config.disabledBtnClass);
};

/**
 * Активирует кнопку отправки
 * @param {HTMLButtonElement} button - Кнопка
 * @param {Object} config - Конфигурация валидации
 */
const enableButton = (button, config) => {
  button.disabled = false;
  button.classList.remove(config.disabledBtnClass);
};

/**
 * Обновляет состояние кнопки отправки
 * @param {HTMLInputElement[]} inputs - Массив полей ввода
 * @param {HTMLButtonElement} button - Кнопка отправки
 * @param {Object} config - Конфигурация валидации
 */
export const updateButtonState = (inputs, button, config) => {
  const isValid = inputs.every(input => 
    validateInput(button.closest("form"), input, config)
  );
  
  isValid ? enableButton(button, config) : disableButton(button, config);
};

/**
 * Устанавливает обработчики событий для формы
 * @param {HTMLFormElement} form - Форма
 * @param {Object} config - Конфигурация валидации
 */
const setupFormListeners = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputClass));
  const submitButton = form.querySelector(config.submitBtnClass);
  
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      validateInput(form, input, config);
      updateButtonState(inputs, submitButton, config);
    });
  });
  
  updateButtonState(inputs, submitButton, config);
};

/**
 * Включает валидацию всех форм
 * @param {Object} config - Конфигурация валидации
 */
export const setupFormValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formClass));
  forms.forEach(form => setupFormListeners(form, config));
};

/**
 * Сбрасывает валидацию формы
 * @param {HTMLFormElement} form - Форма
 * @param {Object} config - Конфигурация валидации
 */
export const resetFormValidation = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputClass));
  const submitButton = form.querySelector(config.submitBtnClass);
  
  inputs.forEach(input => hideError(form, input, config));
  disableButton(submitButton, config);
};