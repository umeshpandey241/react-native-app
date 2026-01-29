/* eslint-disable no-trailing-spaces */

/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, Image, StyleSheet, Modal, TouchableOpacity, Animated, ActivityIndicator, Text, Dimensions, Platform, ToastAndroid, Alert, PermissionsAndroid } from 'react-native';
import { BASE_URL } from '../../config/config';
import { GestureHandlerRootView, MaterialCommunityIcons, PanGestureHandler, PinchGestureHandler, State, TapGestureHandler, useTranslation } from '../sharedBase/globalImport';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { ImageViewerStyels } from '../styles/ImageViewerStyles';
import RNFS from 'react-native-fs';

interface ImgViewerProps {
  imageJson: string;
  modelName: string;
}

export const ImgViewer = ({ imageJson }: ImgViewerProps) => {
  const { t } = useTranslation();
  const [parsedFiles, setParsedFiles] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const lastOffset = useRef({ x: 0, y: 0 });
  const doubleTapRef = useRef(null);
  const { theme } = useTheme();
  const styles = ImageViewerStyels();



  useEffect(() => {
    if (!imageJson || imageJson.trim() === "") {
      setParsedFiles([]);
      return;
    }

    try {
      const imgFiles = JSON.parse(imageJson);
      if (Array.isArray(imgFiles) && imgFiles.length > 0) {
        const imageUrls = imgFiles.map((imgFile: any) =>
          `${BASE_URL}/ImportFiles/${imgFile.filePath.replace(/\\/g, '/')}`
        );
        setParsedFiles(imageUrls);
      } else {
        setParsedFiles([]);
      }
    } catch (error) {
      console.error('Failed to parse image JSON:', error);
      setParsedFiles([]);
    }
  }, [imageJson]);


  const onPinchGestureEvent = Animated.event([{ nativeEvent: { scale: scale } }], { useNativeDriver: true });

  const onPinchHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale.current *= event.nativeEvent.scale;
      scale.setValue(lastScale.current);
    }
  };

  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onPanHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastOffset.current.x += event.nativeEvent.translationX;
      lastOffset.current.y += event.nativeEvent.translationY;
      translateX.setOffset(lastOffset.current.x);
      translateX.setValue(0);
      translateY.setOffset(lastOffset.current.y);
      translateY.setValue(0);
    }
  };

  const onDoubleTap = () => {
    Animated.spring(scale, {
      toValue: lastScale.current > 1 ? 1 : 2,
      useNativeDriver: true,
    }).start();
    lastScale.current = lastScale.current > 1 ? 1 : 2;
  };

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(null);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError('Failed to load image. Please try again.');
  }, []);

  const downloadFileDirect = async (fileUri: string) => {
    try {
      const fileName = fileUri.split('/').pop();
      const destPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const result = await RNFS.downloadFile({
        fromUrl: fileUri,
        toFile: destPath,
      }).promise;

      if (result.statusCode === 200) {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Downloaded successfully!', ToastAndroid.SHORT);
        } else {
          Alert.alert('Success', 'Downloaded successfully!');
        }
      } else {
        throw new Error('Download failed with status ' + result.statusCode);
      }
    } catch (error) {
      console.error('Download failed:', error);
      if (Platform.OS === 'android') {
        ToastAndroid.show('File download failed.', ToastAndroid.SHORT);
      } else {
        Alert.alert('Error', 'File download failed.');
      }
    }
  };


  // const openPDFInBrowser = async () => {
  //   try {
  //     // Open the PDF URL using Linking API
  //     const supported = await Linking.canOpenURL('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  //     if (supported) {
  //       await Linking.openURL('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  //     } else {
  //       Alert.alert('Unable to open the PDF in the browser.');
  //     }
  //   } catch (error) {
  //     Alert.alert('An error occurred while trying to open the PDF.');
  //     console.error(error);
  //   }
  // };


  return (
    <View>
      {parsedFiles.map((file: any, index) => (
        <View key={index} style={{ marginTop: 10 }}>
          {file.includes('.pdf') ? (
            <TouchableOpacity onPress={() => downloadFileDirect(file)}>
              <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: theme.border }}>
                {/* <MaterialCommunityIcons name="file-pdf-box" size={50} color="#e74c3c" /> */}
                {/* <MaterialCommunityIcons name="download" size={20} color="#e74c3c" onPress={() => downloadFileDirect(file)} /> */}
                <View style={{ width: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: theme.border, paddingVertical: 5 }}>
                  <Image source={require('../assets/images/pdf-icon.jpeg')} style={styles.thumbnail} />
                </View>
              </View>
            </TouchableOpacity>
          ) : file.includes('.doc') || file.includes('.docx') ? (
            <TouchableOpacity onPress={() => downloadFileDirect(file)}>
              <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: theme.border }}>
                <MaterialCommunityIcons name="file-word-box" size={50} color="#3498db" />
                <MaterialCommunityIcons name="download" size={20} color="#3498db" onPress={() => downloadFileDirect(file)} />
              </View>
            </TouchableOpacity>
          ) : file.includes('.xls') || file.includes('.xlsx') ? (
            <TouchableOpacity onPress={() => downloadFileDirect(file)} >
              <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: theme.border }}>
                <MaterialCommunityIcons name="file-excel-box" size={50} color="#27ae60" />
                <MaterialCommunityIcons name="download" size={20} color="#27ae60" onPress={() => downloadFileDirect(file)} />
              </View>
            </TouchableOpacity>
          ) : file.includes('.jpg') || file.includes('.jpeg') || file.includes('.png') ? (
            <TouchableOpacity onPress={() => setCurrentImage(file)}>
              <View style={{ width: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: theme.border, paddingVertical: 5 }}>
                <Image source={{ uri: file }} style={styles.thumbnail} />

              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => downloadFileDirect(file)} >
              <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: theme.border }}>
                <MaterialCommunityIcons name="file" size={50} color="#7f8c8d" />
                <MaterialCommunityIcons name="download" size={20} color="#7f8c8d" onPress={() => downloadFileDirect(file)} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      ))}



      <Modal visible={!!currentImage} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setCurrentImage(null)}>
            <MaterialCommunityIcons name="close-circle" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => downloadFileDirect(currentImage)}>
            <Text style={styles.downloadText}>{t('globals.download')}</Text>
          </TouchableOpacity>
          <SafeAreaView style={styles.safeArea}>
            <GestureHandlerRootView style={styles.gestureHandlerRoot}>
              <PinchGestureHandler onGestureEvent={onPinchGestureEvent} onHandlerStateChange={onPinchHandlerStateChange}>
                <Animated.View style={styles.pinchableView}>
                  <PanGestureHandler onGestureEvent={onPanGestureEvent} onHandlerStateChange={onPanHandlerStateChange}>
                    <Animated.View style={styles.panableView}>
                      <TapGestureHandler onHandlerStateChange={onDoubleTap} numberOfTaps={2} ref={doubleTapRef}>
                        <Animated.View style={styles.imageContainer}>
                          {imageLoading && <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />}
                          {imageError && <Text style={styles.errorText}>{imageError}</Text>}
                          <Animated.Image
                            source={{ uri: currentImage }}
                            style={[
                              styles.fullImage,
                              {
                                width: Dimensions.get('window').width * 0.9,
                                height: Dimensions.get('window').height * 0.7,
                                transform: [{ scale }, { translateX }, { translateY }],
                              },
                            ]}
                            resizeMode="contain"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                          />
                        </Animated.View>
                      </TapGestureHandler>
                    </Animated.View>
                  </PanGestureHandler>
                </Animated.View>
              </PinchGestureHandler>
            </GestureHandlerRootView>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};



