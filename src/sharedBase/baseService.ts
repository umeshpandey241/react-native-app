/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { BaseModel } from './modelInterface';
import { getToken, getUserInfo, setToken, setUserInfo } from './baseServiceVar';
import { FileInfo } from '../types/listpage';
import { BASE_URL } from '../../config/config';


export const useBaseService = <T extends BaseModel>(type: string) => {
    const apiBaseUrl = BASE_URL || '';
    if (!apiBaseUrl) {
        throw new Error('VITE_API_URL is not defined');
    }
    const apiUrl = `${apiBaseUrl}/${type}`;

    const [helperServiceObj, setHelperServiceObj] = useState<any>(null);

    const getHeaders = (): Record<string, string> => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        const token = getToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        return headers;
    };

    const getAll = async (condition: any): Promise<T[]> => {
        try {
            const response = await fetch(`${apiUrl}/Get`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ condition: condition }),
            });
            if (!response.ok) {
                console.error('Failed to fetch data', response.status, response.statusText);
                throw new Error('Failed to fetch data');
            }
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error('Error in getAll:', error);
            throw error;
        }
    };

    const get = async (id: number): Promise<T> => {
        try {
            const response = await fetch(`${apiUrl}/GetById`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ id: id }),
            });
            const responseText = await response.text();
            if (!response.ok) {
                console.error('Get failed:', responseText);
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = JSON.parse(responseText);
            return data;
        } catch (error) {
            console.error('Error during fetch:', error);
            throw error;
        }
    };

    const add = async (item: T): Promise<T> => {
        try {
            const response = await fetch(`${apiUrl}/Add`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(item),
            });
            if (!response.ok) {
                const errorDetails = await response.text();
                console.error('Add failed:', errorDetails);
                throw new Error('Failed to add item');
            }
            return await response.json();
        } catch (error) {
            console.error('Error during add:', error);
            throw error;
        }
    };

    const update = async (item: T): Promise<T> => {
        try {
            const response = await fetch(`${apiUrl}/Update`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(item),
            });
            if (!response.ok) {
                const errorDetails = await response.text();
                console.error('Update failed:', errorDetails);
                throw new Error('Failed to update item');
            }
            return await response.json();
        } catch (error) {
            console.error('Error during update:', error);
            throw error;
        }
    };

    const draft = async (item: T): Promise<T> => {
        const response = await fetch(`${apiUrl}/Draft`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(item),
        });

        if (!response.ok) throw new Error("Failed to save draft");
        return await response.json();
    }

    const getHomeCommon = async (type: string, pageType: string, condition: any): Promise<any[]> => {
        const payload = {
            'type': type,
            'pageType': pageType,
            'condition': condition,
        };
        const response = await fetch(`${apiUrl}/GetHomeCommonData`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) { throw new Error('Failed to fetch home common data'); }
        const jsonResponse = await response.json();
        return jsonResponse;
    };

    const getHomeUser = async (type: string, pageType: string, condition: any): Promise<any[]> => {
        const response = await fetch(`${apiUrl}/GetHomeUserData`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ type, pageType, condition }),
        });
        if (!response.ok) { throw new Error('Failed to fetch home user data'); }
        const jsonResponse = await response.json();
        return jsonResponse;
    };

    const getHtmlData = async (type: string, pageType: string, language: string, condition: any): Promise<any[]> => {
        const response = await fetch(`${apiUrl}/GetHtmlData`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ type, pageType, language, condition }),
        });

        if (!response.ok) { throw new Error('Failed to fetch HTML data'); }
        const jsonResponse = await response.json();
        return jsonResponse;
    };

    const getHomeCommonData = async (type: string, pageType: string, condition: any): Promise<any> => {
        // const reload = true;
        try {
            const [homeCommon, homeUser, htmlData] = await Promise.all([
                getHomeCommon(type, pageType, condition),
                getHomeUser(type, pageType, condition),
                getHtmlData(type, pageType, 'en', condition),
            ]);

            const jsonResponse = { homeCommon, homeUser, htmlData };
            return jsonResponse;
        } catch (err) {
            console.error('Failed to fetch one or more data sets:', err);
            throw new Error('Failed to fetch complete data');
        }
    };

    const fileUpload = async (formData: FormData): Promise<any> => {
        const token = getToken();

        const response = await fetch(`${apiUrl}/FileUpload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload file');
        }
        const uploadResponse = await response.json();
        return uploadResponse;
    };

    const fileDownload = async (fileInfo: FileInfo): Promise<Blob> => {
        const response = await fetch(`${apiUrl}/Download`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(fileInfo),
        });


        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Server Error:', errorMessage);
            throw new Error(`Failed to download file: ${response.statusText}`);
        }

        const blob = await response.blob();
        return blob;
    };

    const getRoleData = async (): Promise<any> => {
        try {
            const userInfo = getUserInfo();

            if (userInfo) {
                const form = { role: userInfo?.role, id: 0 };

                const response = await fetch(`${apiUrl}/GetRoleData`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...getHeaders(),
                    },
                    body: JSON.stringify(form),
                });

                if (!response.ok) {
                    throw new Error('Failed to export Excel file');
                }

                return await response.json();
            }
        } catch (error) {
            throw error;
        }
    };

    return {
        setToken,
        setUserInfo,
        setHelperServiceObj,
        getHomeCommon,
        getHomeCommonData,
        getAll, get, add, update,draft,
        fileUpload, fileDownload, getRoleData,
        type,
    };
};
