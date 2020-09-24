import join from 'url-join';

const { REACT_APP_API_URL } = process.env;

const callApi = async (url) => {
  const res = await fetch(url, {
    credentials: 'same-origin',
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res;
};

export const fetchLogout = async () => {
  await callApi(join(REACT_APP_API_URL, 'logout'));
};

export const fetchUser = async () => {
  const res = await callApi(join(REACT_APP_API_URL, 'user'));
  return res.json();
};
