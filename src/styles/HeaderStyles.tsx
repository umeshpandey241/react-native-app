import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';

export const HeaderStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    header: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 1,
      padding: 5,
      paddingVertical: 10,
      borderBottomWidth: 1,
      backgroundColor: theme.background,
      borderColor: theme.border,
    },
    menuParent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuButton: {
      position: 'absolute',
      left: 10,
    },
    menuText: {
      fontSize: getFontSize(14),
      color: theme.primary,
      fontFamily: 'Poppins-SemiBold'
    },
    text: {
      left: 50,
      fontSize: getFontSize(16),
      color: theme.text,
      fontFamily: 'Poppins-SemiBold'
    },
    dropdown: {
      width: 150,
      left: 100,
    },
    primaryColor: {
      color: theme.primary,
    },

  });
};