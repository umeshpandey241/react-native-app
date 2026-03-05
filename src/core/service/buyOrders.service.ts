// import {getAuthHeaders} from '@/lib/getHeaders';
// import {useLanguageStore} from '@/store/useLanguage.store';
import {BASE_URL} from '../../../config/config';
import {BuyOrder} from '../model/buyorder';

const addOrder = async (
  buyOrderData: BuyOrder,
  //   token?: string | unknown,
  //   language?: string,
) => {
  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/BuyOrder/AddOrder`, {
      method: 'POST',
      //   headers,
      body: JSON.stringify(buyOrderData),
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

export {addOrder};
