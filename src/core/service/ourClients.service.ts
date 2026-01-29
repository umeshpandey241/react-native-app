import {OurClient} from '@/core/model/ourClient';
import {CustomFile} from '@/core/model/customfile';
import {getAuthHeaders} from '@/lib/getHeaders';
import {useLanguageStore} from '@/store/useLanguage.store';
import {BASE_URL} from '../../../config/config';

const getAll = async (token?: string | unknown, language?: string) => {
  const payload = {
    form: null,
    condition: null,
  };

  try {
    // const headers = await getAuthHeaders(token, language || useLanguageStore.getState().selectedLanguage);
    const response = await fetch(`${BASE_URL}/OurClient/Get`, {
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
  ourClientID: string,
  token?: string | unknown,
  language?: string,
) => {
  const payload = {
    id: ourClientID,
  };

  try {
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/OurClient/GetById`, {
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
  payload: OurClient,
  token?: string | unknown,
  language?: string,
) => {
  // const payload = {
  //     "id": ourClientID
  // }

  try {
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/OurClient/Draft`, {
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

const add = async (
  payload: OurClient,
  token?: string | unknown,
  language?: string,
) => {
  try {
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/OurClient/Add`, {
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
    throw error;
  }
};

const update = async (
  payload: OurClient,
  token?: string | unknown,
  language?: string,
) => {
  try {
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/OurClient/Update`, {
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
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/OurClient/Delete`, {
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
    console.error('Error deleting OurClient:', error);
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

    const headers = getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );

    if (headers['Content-Type']) {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${BASE_URL}/OurClient/FileUpload`, {
      method: 'POST',
      // headers: {
      //     Authorization: `Bearer ${token}`,
      // },
      headers,
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
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/OurClient/Download`, {
      method: 'POST',
      headers,
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
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/OurClient/GetHomeCommonData`, {
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

const getHtmlData = async (token?: string | unknown, language?: string) => {
  const payload = {
    type: 'default',
    pageType: 'admin',
    language: 'en',
    condition: null,
  };

  try {
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/OurClient/GetHtmlData`, {
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

const getHomeUserData = async (token?: string | unknown, language?: string) => {
  const payload = {
    type: 'default',
    pageType: 'admin',
    condition: null,
  };

  try {
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/OurClient/GetHomeUserData`, {
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

const deleteUser = async (token?: string | unknown, language?: string) => {
  const payload = {
    id: 0,
  };

  try {
    const headers = await getAuthHeaders(
      token,
      language || useLanguageStore.getState().selectedLanguage,
    );
    const response = await fetch(`${BASE_URL}/OurClient/DeleteUser`, {
      method: 'POST',
      headers,
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
    console.error('Error deleting OurClient:', error);
    throw error;
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
  getHomeCommonData,
  getHtmlData,
  getHomeUserData,
  deleteUser,
};
