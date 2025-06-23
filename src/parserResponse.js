export default function parser(response) {
  const domParser = new DOMParser();
  const data = domParser.parseFromString(response.data.contents, 'application/xml');
  const parseError = data.querySelector('parsererror');
  if (parseError) {
    throw new Error('notRss');
  }

  return data;
}
