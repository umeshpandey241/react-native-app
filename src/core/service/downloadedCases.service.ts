import {DownloadedCase} from '../../core/model/downloadedCase';
import {CustomFile} from '../../core/model/customfile';
import {BASE_URL} from '../../../config/config';

const getAll = async () => {
  const payload = {
    form: null,
    condition: null,
  };

  try {
    const response = await fetch(`${BASE_URL}/DownloadedCase/Get`, {
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

const getById = async (downloadedCaseID: string) => {
  const payload = {
    id: downloadedCaseID,
  };

  try {
    const response = await fetch(`${BASE_URL}/DownloadedCase/GetById`, {
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

const draft = async (payload: DownloadedCase) => {
  // const payload = {
  //     "id": downloadedCaseID
  // }

  try {
    const response = await fetch(`${BASE_URL}/DownloadedCase/Draft`, {
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

const add = async (payload: DownloadedCase) => {
  try {
    const response = await fetch(`${BASE_URL}/DownloadedCase/Add`, {
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
    throw error;
  }
};

const update = async (payload: DownloadedCase) => {
  try {
    const response = await fetch(`${BASE_URL}/DownloadedCase/Update`, {
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
    throw error;
  }
};

const deleteData = async (userId: string) => {
  const payload = {
    Id: userId,
  };

  try {
    const response = await fetch(`${BASE_URL}/DownloadedCase/Delete`, {
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
    console.error('Error deleting DownloadedCase:', error);
    throw error;
  }
};

const fileUpload = async (file: File): Promise<CustomFile> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/DownloadedCase/FileUpload`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
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

const fileDownload = async (fileInfo: FileInfo): Promise<Blob> => {
  try {
    const response = await fetch(`${BASE_URL}/DownloadedCase/Download`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
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

const getHomeCommonData = async () => {
  const payload = {
    type: 'default',
    pageType: 'admin',
    condition: null,
  };

  try {
    const response = await fetch(
      `${BASE_URL}/DownloadedCase/GetHomeCommonData`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
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

const getHtmlData = async () => {
  const payload = {
    type: 'default',
    pageType: 'admin',
    language: 'en',
    condition: null,
  };

  try {
    const response = await fetch(`${BASE_URL}/DownloadedCase/GetHtmlData`, {
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

const getHomeUserData = async () => {
  const payload = {
    type: 'default',
    pageType: 'admin',
    condition: null,
  };

  try {
    const response = await fetch(`${BASE_URL}/DownloadedCase/GetHomeUserData`, {
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

const deleteUser = async () => {
  const payload = {
    id: 0,
  };

  try {
    const response = await fetch(`${BASE_URL}/DownloadedCase/DeleteUser`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
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
    console.error('Error deleting DownloadedCase:', error);
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
