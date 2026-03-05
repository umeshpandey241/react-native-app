/* eslint-disable @typescript-eslint/no-explicit-any */

import {LoginPayload, LoginResponse} from '../../types/auth';
import {BASE_URL} from '../../../config/config';

const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse | null> => {
  try {
    const response = await fetch(`${BASE_URL}/Login/LoginPin`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }

    try {
      const data = await response.json();
      return data;
    } catch {
      return null;
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

const getUserInfo = async (email?: string, password?: string): Promise<any> => {
  const payload = {
    emailId: email,
    pin: password,
  };

  try {
    const response = await fetch(`${BASE_URL}/Login/LoginPin`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }

    try {
      const data = await response.json();
      return data.userInfo;
    } catch {
      return null;
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const ValidateEmail = async (
  emailID?: string,
  token?: string,
): Promise<any> => {
  const payload = {
    emailId: emailID,
  };

  try {
    const response = await fetch(`${BASE_URL}/Login/ValidateEmail`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      return data;
    } catch (e) {
      console.warn('Response is not JSON, returning raw text', e);
      return responseText;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const loginByEmail = async (emailId?: any): Promise<any> => {
  const payload = {emailId: emailId};

  try {
    const response = await fetch(`${BASE_URL}/Login/LoginEmail`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    try {
      const data = JSON.parse(responseText);
      return data;
    } catch (e) {
      console.warn('Response is not JSON, returning raw text', e);
      return responseText;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export {loginUser, getUserInfo, ValidateEmail, loginByEmail};
