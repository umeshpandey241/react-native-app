import {Dimensions, StyleSheet} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {getFontSize} from '../../font';

const {width} = Dimensions.get('window');

export const SidebarStyles = () => {
  const {theme} = useTheme();

  return StyleSheet.create({
    sidebarContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      // justifyContent: 'flex-start',
    },
    sidebar: {
      backgroundColor: theme.background,
      borderColor: theme.border,
      width: width * 0.7,
      // width: '70%',
      height: '100%',
      padding: 10,
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
    },
    menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    searchIcon: {
      marginTop: 20,
      marginBottom: 16,
      paddingHorizontal: 16,
    },

    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderWidth: 1,
      borderColor: 'var(--color-tertiary)',
      backgroundColor: 'var(--color-primary-light)',
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: 18,
      marginBottom: 14,
      alignSelf: 'flex-start',
    },

    actionText: {
      color: 'var(--color-tertiary)',
      fontWeight: '600',
      fontSize: 14,
    },

    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    closeButton: {
      alignSelf: 'flex-end',
      marginBottom: 10,
    },
    closeText: {
      fontSize: getFontSize(20),
      fontWeight: 'bold',
    },
    menuItem: {
      fontSize: getFontSize(14),
      left: 10,
      color: theme.text,
      top: 3,
      fontFamily: 'Poppins-Regular',
    },
    menu: {
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.background,
      color: theme.text,
      borderWidth: 0,
    },
    activeButton: {
      backgroundColor: theme.primaryLight,
    },
    dropDownPicker: {
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.background,
      color: theme.text,
      borderWidth: 0,
      width: '80%',
      marginLeft: 2,
      fontFamily: 'Poppins-Regular',
      zIndex: 1,
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      marginBottom: 10,
      borderColor: theme.border,
    },
    selected: {
      backgroundColor: theme.primary,
    },
    unselected: {
      backgroundColor: theme.background,
    },
    textSelected: {
      color: 'white',
    },
    textUnselected: {
      color: theme.text,
    },
    userDetail: {
      flexDirection: 'row',
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    name: {
      fontSize: getFontSize(16),
      marginLeft: 15,
      color: theme.text,
      fontFamily: 'Poppins-SemiBold',
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 50,
    },
    primaryColor: {
      color: theme.primary,
    },
    dropdown: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 10,
      zIndex: 1,
      backgroundColor: theme.background,
      color: theme.text,
    },
    text: {
      fontSize: getFontSize(14),
      color: theme.text,
      fontFamily: 'Poppins-Regular',
    },
    dropdownContainer: {
      borderColor: '#ccc',
      borderRadius: 8,
      backgroundColor: theme.background,
      color: theme.text,
      width: '80%',
      zIndex: 1,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    modalCard: {
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 20,
      elevation: 6,
    },

    closeIcon: {
      position: 'absolute',
      top: 12,
      right: 12,
      zIndex: 1,
    },

    modalTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: 'var(--color-primary)',
      textAlign: 'center',
      marginBottom: 16,
      marginTop: 10,
    },

    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },

    searchInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#d1d5db',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: 'var(--color-primary)',
    },

    exploreButton: {
      backgroundColor: 'blue',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
    },

    exploreText: {
      // backgroundColor: 'blue',
      color: '#ffff',
      fontWeight: '600',
      fontSize: 14,
    },

    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },

    modal: {
      backgroundColor: '#ffffff',
      width: '100%',
      maxHeight: '95%',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: 'hidden',
    },

    header: {
      borderBottomWidth: 1,
      borderColor: 'var(--color-border)',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },

    title: {
      fontSize: 16,
      fontWeight: '700',
      color: 'var(--color-primary)',
    },

    body: {
      maxHeight: '70%',
      paddingHorizontal: 16,
      paddingTop: 12,
    },

    footer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
      padding: 16,
      borderTopWidth: 1,
      borderColor: 'var(--color-border)',
    },
    primaryButton: {
      backgroundColor: '#0b6fae',
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 8,
    },

    buttonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
  });
};
