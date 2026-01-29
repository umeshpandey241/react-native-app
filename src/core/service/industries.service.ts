import {Industrie} from '@/core/model/industrie';
import {CustomFile} from '@/core/model/customfile';
// import {getAuthHeaders} from '@/lib/getHeaders'
import {useLanguageStore} from '@/store/useLanguage.store';
import {BASE_URL} from '../../../config/config';

const getAll = async (token?: string | unknown, language?: string) => {
  const payload = {
    form: null,
    condition: null,
  };

  try {
    // const headers = await getAuthHeaders(token, language || useLanguageStore.getState().selectedLanguage);
    const response = await fetch(`${BASE_URL}/Industrie/Get`, {
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
  let headers = getAuthHeaders(token);
  if (token) {
    const {...rest} = headers;
    headers = rest;
  }

  try {
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/Industrie/GetById`, {
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

const draft = async (
  payload: Industrie,
  token?: string | unknown,
  language?: string,
) => {
  // const payload = {
  //     "id": industrieID
  // }

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Industrie/Draft`, {
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

const add = async (
  payload: Industrie,
  token?: string | unknown,
  language?: string,
) => {
  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Industrie/Add`, {
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
    throw error;
  }
};

const update = async (
  payload: Industrie,
  token?: string | unknown,
  language?: string,
) => {
  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Industrie/Update`, {
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
    const response = await fetch(`${BASE_URL}/Industrie/Delete`, {
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
    console.error('Error deleting Industrie:', error);
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

    const response = await fetch(`${BASE_URL}/Industrie/FileUpload`, {
      method: 'POST',
      // headers: {
      //     Authorization: `Bearer ${token}`,
      // },
      //   headers,
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
    const response = await fetch(`${BASE_URL}/Industrie/Download`, {
      method: 'POST',
      //   headers,
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
    const response = await fetch(`${BASE_URL}/Industrie/GetHomeCommonData`, {
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
    const response = await fetch(`${BASE_URL}/Industrie/GetHtmlData`, {
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
    const response = await fetch(`${BASE_URL}/Industrie/GetHomeUserData`, {
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

const deleteUser = async (token?: string | unknown, language?: string) => {
  const payload = {
    id: 0,
  };

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(`${BASE_URL}/Industrie/DeleteUser`, {
      method: 'POST',
      //   headers,
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
    console.error('Error deleting Industrie:', error);
    throw error;
  }
};

const getIndustrieData = async (
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
    const response = await fetch(`${BASE_URL}/Industrie/GetIndustrieData`, {
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

const getIndustryByProductId = async (
  // token?: string | unknown,
  // language?: string,
  productId?: number,
) => {
  const payload = {
    ProductId: productId,
    id: 0,
  };

  console.log(payload, 'payload');

  try {
    // const headers = await getAuthHeaders(
    //   token,
    //   language || useLanguageStore.getState().selectedLanguage,
    // );
    const response = await fetch(
      `${BASE_URL}/Industrie/GetIndustryByProductId`,
      {
        method: 'POST',
        // headers,
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error ! status",${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
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
  getIndustryByProductId,
  getHomeCommonData,
  getHtmlData,
  getHomeUserData,
  deleteUser,
  getIndustrieData,
};
