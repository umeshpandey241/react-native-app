import {Product} from '@/core/model/product';
import {CustomFile} from '@/core/model/customfile';
// import {getAuthHeaders} from '@/lib/getHeaders';
import {useLanguageStore} from '@/store/useLanguage.store';
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
    const response = await fetch(`${BASE_URL}/Product/Get`, {
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

const getById = async (
  {id, slug}: {id: string; slug?: string | null},
  token?: string | unknown,
  language?: string,
) => {
  const payload = {
    id: Number(id),
    slug: slug ?? null,
  };
  //   let headers = getAuthHeaders(token);
  //   if (token) {
  //     const {...rest} = headers;
  //     headers = rest;
  //   }

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Product/GetById`, {
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

const draft = async (
  payload: Product,
  token?: string | unknown,
  language?: string,
) => {
  // const payload = {
  //     "id": productID
  // }

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Product/Draft`, {
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
  payload: Product,
  token?: string | unknown,
  language?: string,
) => {
  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Product/Add`, {
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

const update = async (
  payload: Product,
  token?: string | unknown,
  language?: string,
) => {
  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Product/Update`, {
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

const deleteData = async (
  userId: string,
  token?: string | unknown,
  language?: string,
) => {
  const payload = {
    Id: userId,
  };

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Product/Delete`, {
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
    console.error('Error deleting Product:', error);
    throw error;
  }
};

const fileUpload = async (
  file: File,
  token?: string | unknown,
  language?: string,
): Promise<CustomFile> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // const headers = getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );

    // if (headers['Content-Type']) {
    //   delete headers['Content-Type'];
    // }

    const response = await fetch(`${BASE_URL}/Product/FileUpload`, {
      method: 'POST',
      // headers: {
      //     Authorization: `Bearer ${token}`,
      // },
      // headers,
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to upload file: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    if (!data.fileName || !data.filePath || !data.type) {
      throw new Error('Invalid response format from server');
    }
    return data;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

export interface FileInfo {
  fileName: string;
  filePath: string;
}

const fileDownload = async (
  fileInfo: FileInfo,
  token?: string | unknown,
  language?: string,
): Promise<Blob> => {
  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Product/Download`, {
      method: 'POST',
      // headers,
      body: JSON.stringify(fileInfo),
    });

    if (!response.ok) throw new Error('Failed to download file');

    const data = await response.blob();
    return data;
  } catch (error) {
    console.error('Download file error:', error);
    throw error;
  }
};

const getHomeCommonData = async (
  token?: string | unknown,
  language?: string,
) => {
  const payload = {
    type: 'default',
    pageType: 'admin',
    condition: null,
  };

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Product/GetHomeCommonData`, {
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

const getHtmlData = async (token?: string | unknown, language?: string) => {
  const payload = {
    type: 'default',
    pageType: 'admin',
    language: 'en',
    condition: null,
  };

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Product/GetHtmlData`, {
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

const getHomeUserData = async (token?: string | unknown, language?: string) => {
  const payload = {
    type: 'default',
    pageType: 'admin',
    condition: null,
  };

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Product/GetHomeUserData`, {
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

const deleteUser = async (token?: string | unknown, language?: string) => {
  const payload = {
    id: 0,
  };

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Product/DeleteUser`, {
      method: 'POST',
      // headers,
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${text}`);
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    } else {
      const text = await response.text();
      return {message: text};
    }
  } catch (error) {
    console.error('Error deleting Product:', error);
    throw error;
  }
};

const getProductParentData = async (
  {id, slug}: {id: string; slug?: string | null},
  token?: string | unknown,
  language?: string,
) => {
  const payload = {
    slug: slug ?? null,
    id: 0,
  };

  //   let headers = getAuthHeaders(token);
  //   if (token) {
  //     const {...rest} = headers;
  //     headers = rest;
  //   }

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Product/GetProductParentData`, {
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

const getProductData = async (
  {id, slug}: {id: string; slug?: string | null},
  token?: string | unknown,
  language?: string,
) => {
  const payload = {
    slug: slug ?? null,
    id: 0,
  };

  //   let headers = getAuthHeaders(token);
  //   if (token) {
  //     const {...rest} = headers;
  //     headers = rest;
  //   }

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Product/GetProductData`, {
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

const getProductByIndustryId = async (
  token?: string | unknown,
  language?: string,
  industrieId?: number,
) => {
  const payload = {
    IndustrieId: industrieId,
    id: 0,
  };

  try {
    // const headers = await getAuthHeaders(token, language || useLanguageStore.getState().selectedLanguage);
    const response = await fetch(`${BASE_URL}/Product/GetProductByIndustryId`, {
      method: 'POST',
      // headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ! status",${response.status}`);
    }

    const data = await response.json();

    return Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : [];
  } catch (error) {
    console.error('Fetch error:', error);
    return []; // ✅ NEVER undefined
  }
};

export {
  getAll,
  update,
  getById,
  fileUpload,
  deleteData,
  draft,
  add,
  fileDownload,
  getProductParentData,
  getProductByIndustryId,
  getHomeCommonData,
  getHtmlData,
  getHomeUserData,
  deleteUser,
  getProductData,
};
