/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { FileUplodStyles } from '../styles/FileUploadStyles';
import { Alert, DocumentPicker, Image, ImagePicker, MaterialCommunityIcons, PERMISSIONS, Platform, request, RESULTS, ScrollView, Text, TouchableOpacity, useTranslation, View } from '../sharedBase/globalImport';
import { useTheme } from '../theme/ThemeContext';
import { useFileUploadService } from '../core/service/fileUpload.service';


interface CustomFile {
  fileName: string;
  filePath: string;
  type: string;
}

interface FileUploadProps {
  onFileUpload: (files: CustomFile[]) => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  modelName: string;
  propName: string;
  multiple?: boolean;
  showImage?: boolean;
  existingFiles?: any | null;
  maxFileSize?: number;
  minFileSize?: number;
  maxFileNumber?: number;
  minFileNumber?: number;
  error?: string;
  required?: boolean;
}

export default function FileUploadMain({
  onFileUpload,
  onValidationChange,
  modelName,
  propName,
  multiple = false,
  showImage = false,
  existingFiles,
  maxFileSize = 52428800,
  minFileSize = 1000,
  maxFileNumber = 100,
  minFileNumber = 0,
  required = false
}: FileUploadProps) {
  const { t } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState<CustomFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isIoadComplete, setIsIoadComplete] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const styles = FileUplodStyles();
  const { theme } = useTheme();
  const fileUploadService = useFileUploadService(modelName);
  const [isUploadError, setIsUploadError] = useState<boolean>(false);

  useEffect(() => {
    const isEmpty = uploadedFiles.length === 0;
    let errorMessage: string | null = null;
    let isValid = true;

    if (isUploadError) {
      isValid = false;
      onValidationChange?.(false, uploadError || undefined);
      return;
    }

    if (required && isEmpty) {
      errorMessage = t("validators.required", { field: propName });
      isValid = false;
    } else if (minFileNumber > 0 && uploadedFiles.length < minFileNumber) {
      errorMessage = t("validators.minFiles", { field: propName, count: minFileNumber });
      isValid = false;
    } else if (maxFileNumber > 0 && uploadedFiles.length > maxFileNumber) {
      errorMessage = t("validators.maxFiles", { field: propName, count: maxFileNumber });
      isValid = false;
    }

    setUploadError(errorMessage);
    onValidationChange?.(isValid, errorMessage || undefined);
  }, [uploadedFiles.length, required, propName, minFileNumber, maxFileNumber, isUploadError, uploadError]);


  useEffect(() => {
    if (!isIoadComplete) {
      if (!existingFiles || existingFiles === '[]') {
        setUploadedFiles([]);
        setIsIoadComplete(true);
        if (required) {
          setUploadError(t("validators.required", { field: propName }));
        }
        return;
      }

      try {
        const parsedFiles = Array.isArray(existingFiles)
          ? existingFiles
          : JSON.parse(existingFiles);

        if (Array.isArray(parsedFiles)) {
          const formattedFiles = parsedFiles.map((img) => ({
            fileName: img.fileName,
            filePath: img.filePath.replace(/\\/g, '/'),
            type: img.type,
          }));
          setUploadedFiles(formattedFiles);
        } else {
          setUploadedFiles([]);
        }
        setIsIoadComplete(true);
      } catch (error) {
        console.error('Failed to parse image JSON:', error);
        setUploadError('Invalid data format');
        setUploadedFiles([]);
        setIsIoadComplete(true);
      }
    }
  }, [existingFiles, isIoadComplete, propName, required, t]);


  const requestCameraPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA
      );

      if (result !== RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Camera access is required to take photos.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  };

  const handleFileUpload = async () => {
    if (uploadedFiles.length >= maxFileNumber) {
      setUploadError(t("validators.maxFiles", { field: propName, count: maxFileNumber }))
      return
    }

    Alert.alert(
      'Upload Options',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => handleImagePicker('camera'),
        },
        {
          text: 'Gallery',
          onPress: () => handleImagePicker('gallery'),
        },
        {
          text: 'Document',
          onPress: () => handleDocumentPicker(),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleImagePicker = async (source: 'camera' | 'gallery') => {
    try {
      if (source === 'camera') {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
          return;
        }
      }

      const images = await (source === 'camera'
        ? ImagePicker.openCamera({
          mediaType: 'photo',
          cropping: true,
        })
        : ImagePicker.openPicker({
          mediaType: 'photo',
          multiple: multiple,
        }));

      const imageArray = Array.isArray(images) ? images : [images];
      await uploadFiles(imageArray);
    } catch (error) {
      console.error('Error picking image:', error);
      setUploadError('Failed to pick image. Please try again.');
      setIsUploadError(true);
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: multiple,
      });

      await uploadFiles(result);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
      } else {
        console.error('Error picking file:', error);
        setUploadError('Failed to pick file. Please try again.');
        setIsUploadError(true);
      }
    }
  };

  const uploadFiles = async (files: any[]) => {
    const newUploadedFiles: CustomFile[] = [];
    setIsUploading(true);
    setIsUploadError(false);

    if (uploadedFiles.length + files.length > maxFileNumber) {
      const remainingSlots = maxFileNumber - uploadedFiles.length
      setUploadError(t("validators.maxFiles", { field: propName, count: maxFileNumber }))
      setIsUploadError(true)
      setIsUploading(false)
      return
    }

    for (const file of files) {
      if (file.size > maxFileSize) {
        const maxSize = Math.floor(maxFileSize / 1024 / 1024)
        setUploadError(
          t("validators.fileSizeExceedsMax", { filename: file.name || file.filename, maxFileSize: maxSize }),
        )
        setIsUploadError(true)
        continue
      }

      if (file.size < minFileSize) {
        const minSize = Math.ceil(minFileSize / 1024)
        setUploadError(t("validators.fileSizeBelowMin", { filename: file.name || file.filename, minFileSize: minSize }))
        setIsUploadError(true)
        continue
      }

      try {
        const formData = new FormData();
        formData.append('file', {
          uri: file.path || file.uri,
          type: file.mime || file.type || 'application/octet-stream',
          name: file.filename || file.name || `file_${Date.now()}`,
        });
        const response = await fileUploadService.fileUpload(formData);
        newUploadedFiles.push({
          fileName: response.fileName,
          filePath: response.filePath,
          type: response.type,
        });
      } catch (error) {
        console.error('Upload failed:', error);
        setIsUploadError(true);
        setUploadError('Failed to upload one or more files. Please try again.');
      }
    }
    setIsUploading(false);

    const allFiles = [...uploadedFiles, ...newUploadedFiles];
    setUploadedFiles(allFiles);
    onFileUpload(allFiles);
  };

  const deleteAttachment = (file: CustomFile) => {
    const newFiles = uploadedFiles.filter(f => f.filePath !== file.filePath);
    setUploadedFiles(newFiles);
    onFileUpload(newFiles);
  };

  const canAddMoreFiles = uploadedFiles.length < maxFileNumber

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.fileList}>
        {uploadedFiles.map((item, index) => (
          <View key={index} style={styles.fileItem}>
            {showImage && item.type.includes('image') ? (
              <Image source={{ uri: item.filePath }} style={styles.fileImage} />
            ) : (
              <Text style={styles.fileName}>{item.fileName}</Text>
            )}
            <TouchableOpacity onPress={() => deleteAttachment(item)}>
              <MaterialCommunityIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {canAddMoreFiles && (
        isUploading ? (
          <View style={styles.progressContainer}>
            <MaterialCommunityIcons name="progress-upload" size={24} color="#0000ff" />
            <Text style={styles.uploadButtonText}>{t('globals.uploading')}</Text>
          </View>
        ) : (
          <View style={styles.uploadButton}>
            <MaterialCommunityIcons name="cloud-upload" size={22} color={theme.text} />
            <View style={{ flexWrap: 'wrap', width: 0, flex: 1, flexGrow: 1 }}>
              <Text style={styles.uploadButtonText}>{t('globals.uploadFiles')}</Text>
              <Text style={styles.smallText}>{t('globals.supportedFormats')}: JPEG, PNG, GIF, MP4, PDF, Word, excel</Text>
            </View>

            <TouchableOpacity style={styles.selectButton} onPress={handleFileUpload}>
              <Text style={styles.selectButtonText}>{t('globals.selectFile')}</Text>
            </TouchableOpacity>

          </View>
        ))}
      {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}
    </View>
  );
}



