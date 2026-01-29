import {BASE_URL} from '../../../config/config';

export interface SEOData {
  id: number;
  name: string;
  title: string;
  description?: string;
  keyWords: string;
  imageUrl: string;
}

async function getSEOData(slug: string): Promise<SEOData[]> {
  try {
    const response = await fetch(`${BASE_URL}/Seo/Search?name=${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export {getSEOData};
