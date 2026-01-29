import {getAuthHeaders} from '@/lib/getHeaders';
import {useLanguageStore} from '@/store/useLanguage.store';
import {CartItemData} from '@/types/carts';
import {BASE_URL} from '../../../config/config';

const getAll = async (
  userId?: number,
  token?: string | unknown,
  language?: string,
) => {
  const payload = {
    condition: {
      AppUserId: userId,
    },
  };
  try {
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/Cart/Get`, {
      method: 'POST',
      headers,
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
  payload: CartItemData,
  token?: string | unknown,
  language?: string,
) => {
  try {
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/Cart/Remove`, {
      method: 'POST',
      headers,
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

const cartQuantityUpdate = async (
  payload: CartItemData,
  token?: string | unknown,
  language?: string,
) => {
  try {
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/Cart/CartQuantityUpdate`, {
      method: 'POST',
      headers,
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

export {getAll, cartItemRemove, cartQuantityUpdate};
