const BASE_URL = 'https://api.chucknorris.io/jokes/random';

export default async function getMessage() {
  return await fetch(BASE_URL, {
    method: 'GET',
    cache: 'default',
    headers: {
      "Connection": 'keep-alive',
    },
  });
}