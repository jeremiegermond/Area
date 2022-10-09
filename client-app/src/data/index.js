import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem(key: string, isJson = false) {
  try {
    const item = await AsyncStorage.getItem(key);
    if (isJson) {
      return item != null ? JSON.parse(item) : null;
    }
    return item;
  } catch (e) {
    console.log(`Couldn't getItem '${key}'`);
    console.log(e);
  }
}

export async function setItem(key: string, item: any, isJson = false) {
  try {
    const jsonItem = isJson ? JSON.stringify(item) : item;
    await AsyncStorage.setItem(key, jsonItem);
    console.log(`'${key}' set`);
  } catch (e) {
    console.log(`Couldn't setItem '${key}'`);
    console.log(e);
  }
}

export async function removeItem(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(`Couldn't removeItem '${key}'`);
    console.log(e);
  }
}
