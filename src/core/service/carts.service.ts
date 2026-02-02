import {CartItemData} from '@/types/carts';
import {BASE_URL} from '../../../config/config';

const getAll = async (userId?: number) => {
  const payload = {
    condition: {
      AppUserId: userId,
    },
  };
  try {
    const response = await fetch(`${BASE_URL}/Cart/Get`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
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

const cartItemRemove = async (payload: CartItemData) => {
  try {
    const response = await fetch(`${BASE_URL}/Cart/Remove`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
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

const cartQuantityUpdate = async (payload: CartItemData) => {
  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Cart/CartQuantityUpdate`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
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
