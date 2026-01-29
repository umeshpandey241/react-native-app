import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';

export const FileUplodStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      // padding: 16,
      // backgroundColor: '#fff',
    },
    fileList: {
      // marginBottom: 16,
    },
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 8,
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: 10,
      borderColor: theme.border,
      backgroundColor: theme.primaryLight,
    },
    fileImage: {
      width: 50,
      height: 50,
      marginRight: 8,
    },
    fileName: {
      flex: 1,
      marginRight: 8,
      color: theme.text,
    },
    uploadButton: {
      flexDirection: 'row',
      padding: 12,
      backgroundColor: theme.primaryLight,
      borderColor:theme.border,
      alignItems: 'center',
      justifyContent: 'space-between',
      // height: 100,
      marginTop: 10,
    },
    selectButton: {
      padding: 5,
      backgroundColor:'transparent',
      borderColor:theme.primary,
      alignItems: 'center',
      borderRadius: 5,
      borderWidth: 1,
    },
    selectButtonText:{
      fontFamily: 'Poppins-Regular',
       fontSize: getFontSize(8),
      color: theme.text,
    },
    uploadButtonText: {
      // marginLeft: 6,
      fontFamily: 'Poppins-SemiBold',
      fontSize: getFontSize(11.5),
      color: theme.text,
    },
    smallText: {
      // marginLeft: 6,
      fontFamily: 'Poppins-Regular',
      fontSize: getFontSize(8),
      color: theme.text,
    },
    errorText: {
      color: 'red',
      marginTop: 8,
    },
    progressContainer: {
      marginVertical: 10,
      alignItems:'center',
    },
    progressText: {
      textAlign: 'center',
      marginBottom: 5,
    },
    progressBar: {
      height: 10,
      borderRadius: 5,
    },
    fileCountText: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: 8,
    },
  });
};