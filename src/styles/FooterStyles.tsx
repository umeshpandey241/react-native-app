import {  StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';

export const FooterStyles = () => {
  const { theme } = useTheme();

  return  StyleSheet.create({
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 5,
      backgroundColor: theme.background,
      borderColor: theme.border,
      borderTopWidth: 1,
    },
    iconContainer: {
      // padding: 5,
      flexDirection: 'column',
      alignItems: 'center',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
      // paddingHorizontal: 15,
      borderRadius: 10,
      // padding: 10,
      width: 90,
      borderWidth:1,
      backgroundColor: theme.background,
      borderColor: theme.border,
    },
    buttonText: {
      color: theme.text,
      textAlign: 'center',
      fontSize: getFontSize(8.5),
      fontFamily: 'Poppins-Regular',
      
    },
    floatingButton: {
      borderRadius: 50,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      top:-25,
      borderWidth:1,
      backgroundColor: theme.background,
      borderColor: theme.border,
    },
    filterBadge: {
      borderRadius: 10,
      marginLeft: 5,
      paddingHorizontal: 6,
      paddingVertical: 1,
      backgroundColor: theme.background,
      borderColor: theme.border,
    },
    badgeText: {
      color: theme.text,
      fontSize: getFontSize(12),
    },
    primaryColor: {
        color: theme.primary,
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: 'flex-end',
      },
      modalContainer: {
        flex: 1, 
        backgroundColor: theme.background,
        paddingHorizontal: 15,
      },
      modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:10,
      },
      modalTitle: {
        fontSize: getFontSize(18),
        fontWeight: 'bold',
      },
      closeButton: {
        color: 'red',
        fontSize: getFontSize(16),
      },
      modalContent: {
        flexGrow: 1,
        paddingBottom: 70,
      },
      sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      },
      sortText: {
        fontSize: getFontSize(16),
      },
      radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
      },
      sectionTitle: {
        fontSize: getFontSize(16),
        fontWeight: 'bold',
        marginTop: 10,
      },
      sortRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
      },
      sortButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 5,
      },
      modalFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.background,
        padding: 15,
        borderTopWidth: 1,
        borderColor: '#ddd',
      },
      cancelButton: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor:theme.primary,
        marginRight: 5,
        borderRadius: 5,
      },
      applyButton: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        backgroundColor: theme.primary,
        marginLeft: 5,
        borderRadius: 5,
      },
      applyText: {
        color: '#fff',
      },
      cancel: {
        color:theme.primary,
      },
      filterOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.background,
      },
      filterList: {
        width: '40%',
        borderRightWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.background,
      },
      filterItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
      },
      activeFilterItem: {
        backgroundColor: theme.primary,
      },
      filterText: { color: 'black' },
      activeFilterText: { color: 'white', fontWeight: 'bold' },
      filterContent: {
        width: '60%',
        padding: 20,
        backgroundColor: theme.background,
      },
      filterContentText: { fontSize: 16 },
      modalBody: {
        flexDirection: 'row',
        // backgroundColor: 'white',
        // width: '90%',
        // height: '60%',

      },
  });
};
