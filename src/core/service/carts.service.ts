// import {getAuthHeaders} from '@/lib/getHeaders';
// import {useLanguageStore} from '@/store/useLanguage.store';
import {BASE_URL} from '../../../config/config';

const getAll = async (
  userId?: number,
  //   token?: string | unknown,
  //   language?: string,
) => {
  const payload = {
    AppUserId: userId,
  };

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Cart/Get`, {
      method: 'POST',
      //   headers,
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

const cartItemRemove = async (
  id: number,
  //   token?: string | unknown,
  //   language?: string,
) => {
  const obj = {Id: id};
  try {
    const response = await fetch(`${BASE_URL}/Cart/Remove`, {
      method: 'POST',
      // headers,
      body: JSON.stringify(obj),
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

const cartQuantityUpdate = async (
  cartModel: any,
  type: any,
  //   token?: string | unknown,
  //   language?: string,
) => {
  const form = {form: cartModel, type: type};

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Cart/CartQuantityUpdate`, {
      method: 'POST',
      //   headers,
      body: JSON.stringify(form),
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

export {getAll, cartItemRemove, cartQuantityUpdate};
