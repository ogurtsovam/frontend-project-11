import onChange from 'on-change';

const renderErrors = (state, elements, i18nextInstance, error) => {
  const { feedback, input } = elements;
  if (error === '') {
    return;
  }

  feedback.classList.add('text-danger');
  input.classList.add('is-invalid');
  feedback.textContent = i18nextInstance.t(`${state.submitForm.error}`);
};

function renderSucces(elements, i18nextInstance) {
  const { input, feedback, form } = elements;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-warning');
  feedback.classList.add('text-success');
  feedback.textContent = i18nextInstance.t('form.succesMessage');
  form.reset();
  input.focus();
}

function renderState(elements, i18nextInstance, value) {
  if (value === 'finished') {
    renderSucces(elements, i18nextInstance);
  }
}

const watch = (state, elements, i18nextInstance) => {
  const renderForm = (path, value) => {
    switch (path) {
      case 'formState':
        renderState(elements, i18nextInstance, value);
        break;
      case 'submitForm.error':
        renderErrors(state, elements, i18nextInstance, value);
        break;
      default:
        break;
    }
  };

  const watchedState = onChange(state, (path, value) => {
    renderForm(path, value);
  });

  return watchedState;
};

export default watch;
