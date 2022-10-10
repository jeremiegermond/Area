import React from 'react';
import axios from 'axios';
import {getItem, setItem} from '../data';

export async function getServer(endpoint: string, timeout = 400) {
  const token: string = await getItem('@token');
  return await axios.get(`http://${await getItem('@ip')}:8080/${endpoint}`, {
    timeout: timeout,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
}
export async function postServer(endpoint: string, data: any, timeout = 400) {
  const token: string = await getItem('@token');
  return await axios.post(
    `http://${await getItem('@ip')}:8080/${endpoint}`,
    data,
    {
      timeout: timeout,
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );
}

export async function deleteServer(endpoint: string, timeout = 400) {
  const token: string = await getItem('@token');
  return await axios.delete(`http://${await getItem('@ip')}:8080/${endpoint}`, {
    timeout: timeout,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
}

export async function pingServer(ip: string = '') {
  ip = ip.length ? ip : await getItem('@ip');
  await axios.get(`http://${ip}:8080/ping2`, {
    timeout: 400,
  });
}

export async function userExist(user: string = '') {
  if (user.length < 1) {
    return {data: false};
  }
  return await getServer(`exist/${user}`);
}

export async function userLogin(username: string, password: string) {
  const user = {
    username: username,
    password: password,
  };
  const exist = await userExist(username)
    .then(e => e.data)
    .catch(e => console.log(e));
  await postServer(exist ? 'login' : 'signup', user).then(async r => {
    if (r.data.token.length > 1) {
      await setItem('@token', r.data.token);
    } else {
      throw 'Wrong token';
    }
  });
}

export async function checkToken() {
  const token: string = await getItem('@token');
  if (token && token.length > 1) {
    return getServer('user/profile')
      .then(r => {
        console.log('Token ok');
        return true;
      })
      .catch(e => {
        console.log(e.status);
        console.log(e.message);
      });
  }
  return false;
}

export async function connectApi(api: string, navigation) {
  await getServer(`user/${api}/addAccount`).then(res => {
    console.log(res.data);
    navigation.navigate('browser', {
      url: res.data.path,
    });
  });
}

export async function hasApi(api: string) {
  return await getServer(`user/hasApi/${api}`)
    .then(res => res.data)
    .catch(() => {
      console.log("Couldn't get API status");
      return false;
    });
}

export async function deleteApi(api: string) {
  return await deleteServer(`user/deleteApi/${api}`)
    .then(res => res.data)
    .catch(() => {
      console.log("Couldn't get delete API");
      return false;
    });
}

export async function postApi(api: string, params) {
  const {oauth_token, oauth_verifier} = params;
  console.log(params);
  await postServer(`user/${api}/callback`, {oauth_token, oauth_verifier});
}
