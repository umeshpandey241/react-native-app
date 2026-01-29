import { useBaseService } from '../../sharedBase/baseService';
import { FileInfo } from '../../types/listpage';

export const useFileUploadService = (modelName: string) => {
    const baseService = useBaseService<File>(modelName);

    const fileUpload = async (formData: FormData): Promise<any> => {
        return baseService.fileUpload(formData);
    };

    const fileDownload = async (fileInfo: FileInfo): Promise<Blob> => {
        return baseService.fileDownload(fileInfo);
    };

    return {
        fileUpload,
        fileDownload,
    };
};

