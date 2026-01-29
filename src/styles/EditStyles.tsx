import { StyleSheet } from 'react-native';
import { getFontSize } from '../../font';
// import { useTheme } from '../../theme/ThemeContext';

export const EditStyles = () => {
//   const { theme } = useTheme();

  return StyleSheet.create({
    successContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        maxHeight: 350,
        maxWidth: 360,
        width: 360,
    },
    closeIcon: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dc3545',
        borderRadius: 20,

    },
    close: {
        backgroundColor: '#dc3545',
        borderRadius: 20,

    },
    successIcon: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    successMessage: {
        fontSize: getFontSize(22),
        textAlign: 'center',
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    lottie: {
        width: 200,
        height: 200,
        // resizeMode:'contain',
    },
});
};