import React from 'react';
import axios from 'axios';
import {getItem, setItem} from '../data';

export async function getServer(
  endpoint: string,
  token: string = '',
  timeout = 400,
) {
  return await axios.get(`http://${await getItem('@ip')}:8080/${endpoint}`, {
    timeout: timeout,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
}
export async function postServer(
  endpoint: string,
  data: any,
  token: string = '',
  timeout = 400,
) {
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

export async function pingServer(ip: string = '') {
  ip = ip.length ? ip : await getItem('@ip');
  return await axios.get(`http://${ip}:8080/ping2`, {
    timeout: 400,
  });
}

export async function userExist(user: string = '') {
  if (user.length < 1) {
    return false;
  }
  return await getServer(`exist/${user}`);
}

export async function userLogin(username: string, password: string) {
  const user = {
    username: username,
    password: password,
  };
  await postServer('login', user).then(r => {
    console.log(r.data.token);
    if (r.data.token.length > 1) {
      setItem('@token', r.data.token).then();
      console.log('returning true');
      return true;
    }
    throw 'Wrong token';
  });
}

export async function checkToken() {
  const token: string = await getItem('@token');
  if (token && token.length > 1) {
    console.log(typeof token);
    console.log(token);
    getServer('user/profile', token)
      .then(r => {
        console.log(r.data);
        return true;
      })
      .catch(e => {
        console.log(e.status);
        console.log(e.message);
      });
  }
  return false;
}
