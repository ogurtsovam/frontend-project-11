import * as yup from 'yup';

const schema = yup.object({
  url: yup.string().url().required(),
});

const validate = (url) => schema.validate({ url });

export default validate;
