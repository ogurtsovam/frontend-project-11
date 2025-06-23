import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import resources from './locales/locales.js';
import watch from './view.js';
import parser from './parserResponse.js';

const validation = (url, i18nextInstance) => {
  const schema = yup.string()
    .trim()
    .required(i18nextInstance.t('form.errors.notEmpty'))
    .url(i18nextInstance.t('form.errors.invalidLink'))
    .validate(url, { abortEarly: false });
  return schema;
};

const getResponse = (url) => {
  const urlProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlProxy.searchParams.set('disableCache', 'true');
  urlProxy.searchParams.set('url', url);
  const addProxy = urlProxy.toString();
  return axios.get(addProxy);
};

export default async () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    input: document.querySelector('#url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    container: document.querySelector('container-xxl'),
  };

  const state = {
    formState: 'filling',
    feeds: [],
    posts: [],
    submitForm: {
      error: '',
      success: '',
    },
    readPosts: [],
    activePost: '',
    clickedPost: [],
  };

  const i18nextInstance = i18next.createInstance();

  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then(() => {
      yup.setLocale({
        string: {
          url: () => ({ key: 'invalidLink' }),
          required: () => ({ key: 'notEmpty' }),
        },
        mixed: {
          notOneOf: () => ({ key: 'addedLink' }),
        },
      });
    });

  const watchedState = watch(state, elements, i18nextInstance);

  const handleFormSubmit = (inputValue) => {
    const formSchema = validation(inputValue, i18nextInstance);
    formSchema
      .then(() => {
        watchedState.formState = 'sending';
        elements.submitButton.setAttribute('disabled', true);
      })
      .then(() => getResponse(inputValue))
      .then((response) => {
        elements.submitButton.setAttribute('disabled', true);
        const parserResult = parser(response);
        if (parserResult) {
          elements.feedback.textContent = 'loaded';
        }
      })
      .then(() => {
        watchedState.submitForm.error = '';
        watchedState.formState = 'finished';
        elements.submitButton.removeAttribute('disabled');
      })
      .catch((error) => {
        watchedState.formState = 'invalid';
        elements.submitButton.removeAttribute('disabled');
        if (error.message === 'Network Error') {
          watchedState.submitForm.error = i18nextInstance.t('form.errors.networkError');
        } else if (error.message === 'notRss') {
          watchedState.submitForm.error = i18nextInstance.t('form.errors.notRss');
        } else {
          watchedState.submitForm.error = error.message;
        }
      });
  };

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = formData.get('url');
    handleFormSubmit(data);
  });
};
