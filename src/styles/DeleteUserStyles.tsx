import {  StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';

export const DeleteUserStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding:20,
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,

        paddingBottom: 20,
    },
    title: {
        fontSize: getFontSize(18),
        fontFamily: 'Poppins-SemiBold',
        marginTop: 10,
    },
    small: {
        fontFamily: 'Poppins-Regular',
        fontSize: getFontSize(16),
    },
    smallList: {
        fontFamily: 'Poppins-Regular',
        fontSize: getFontSize(14),
        lineHeight: 30,
    },
    horizontalLine: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.border,
        marginBottom: 10,
        marginTop: 10,
        width: '100%',
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
        // flex:1,

    },
    btnCancel: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 25,
        borderColor: theme.primary,
        borderWidth: 1,
        flexGrow: 1,
    },
    btnPrimary: {
        backgroundColor: theme.primary,
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        borderColor: theme.primary,
        borderWidth: 1,
        flexGrow: 1,
    },
    btnText: {
        color: theme.primary,
        fontSize: getFontSize(14),
        textAlign: 'center',
    },
    btnTextAccept: {
        color: '#ffffff',
        fontSize: getFontSize(14),
        textAlign: 'center',
    },
});
};
