import {  Dimensions, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';

export const ImageViewerStyels = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    thumbnail: {
      width: 44,
      height: 44,
      // marginRight: 16,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 10,
    },
    button: {
      position: 'absolute',
      top: 40,
      left: 20,
      zIndex: 10,
    },
    safeArea: {
      flex: 1,
      width: '100%',
    },
    gestureHandlerRoot: {
      flex: 1,
    },
    pinchableView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    panableView: {
      width: '100%',
      height: '100%',
    },
    imageContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullImage: {
      width: '90%',
      height: '100%',
    },
    loader: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: -25,
      marginTop: -25,
    },
    errorText: {
      color: 'white',
      fontSize: getFontSize(16),
      textAlign: 'center',
    },
    downloadText: {
      fontSize: getFontSize(16),
      color: theme.primary,
  
    },
    pdfWebView: {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
  
  
    },
    pdf: { flex: 1, width: '100%', height: '100%' },
  });
};
