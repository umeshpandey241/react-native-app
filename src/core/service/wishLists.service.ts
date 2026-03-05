import {getAuthHeaders} from '@/lib/getHeaders';
import {useLanguageStore} from '@/store/useLanguage.store';
import {WishList} from '../model/wishlist';
import {BASE_URL} from '../../../config/config';

const getAll = async (token?: string | unknown, language?: string) => {
  const payload = {
    condition: {},
  };

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/WishList/Get`, {
      method: 'POST',
      // headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error ! status",${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const add = async (
  payload: WishList,
  // token?: string | unknown,
  // language?: string,
) => {
  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/WishList/Add`, {
      method: 'POST',
      // headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ! status",${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const remove = async (
  id: number,
  token?: string | unknown,
  language?: string,
) => {
  const payload = {Id: id};

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/WishList/Remove`, {
      method: 'POST',
      // headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error ! status",${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const deleteWatchlist = async (
  deleteData: WishList,
  // token?: string | unknown,
  // language?: string,
) => {
  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/WishList/Delete`, {
      method: 'POST',
      // headers,
      body: JSON.stringify(deleteData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error ! status",${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const getWatchlist = async (token?: string | unknown, language?: string) => {
  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/WishList/GetWatchlist`, {
      method: 'POST',
      // headers,
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error(`HTTP error ! status",${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

export {getAll, add, remove, deleteWatchlist, getWatchlist};
