export function responseHeadersAuth(response) {
  let access_token;
  let refresh_token;
  try {
    access_token = response.body.access_token;
    const [rt] = response.headers['set-cookie'];
    refresh_token = rt.split(';')[0];
  } catch (error) {
    return {
        access_token,
        refresh_token,
    };
  }
  return {
    access_token,
    refresh_token,
  };
}
