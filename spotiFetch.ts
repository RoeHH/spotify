import * as Auth from "./auth.ts";

export async function spotiFetch(
  url: string,
  method: string,
  body: string | undefined
) {
  let res;
  if (body != undefined) {
    res = await fetch(url, {
      body: body,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${await Auth.getToken(false)}`,
        "Content-Type": "application/json",
      },
      method: method,
    });
  } else {
    res = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${await Auth.getToken(false)}`,
        "Content-Type": "application/json",
      },
      method: method,
    });
  }
  const resJson = res.json();
  return resJson;
}
