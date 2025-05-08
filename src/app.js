import validate from './validate.js';

export default () => {
  const elements = {
    form: document.getElementById('rss-form'),
    fieldUrl: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
  };

  const state = {
    feed: [],
    currentUrl: {},
  };

  const errorHandler = (error) => {
    console.error('Ошибка валидации:', error.message);
  };

  const checkForDuplicateFeed = (url) => {
    if (state.feed.includes(url)) {
      throw new Error('Этот RSS уже добавлен');
    }
    return url;
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const url = elements.fieldUrl.value;

    validate(url)
      .then(checkForDuplicateFeed)
      .then((validatedUrl) => {
        state.feed.push(validatedUrl);
      })
      .catch(errorHandler);
  });
};
