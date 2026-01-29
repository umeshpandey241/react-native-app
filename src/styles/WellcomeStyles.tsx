import {  StyleSheet } from 'react-native';
import { getFontSize } from '../../font';

export const WellcomeStyles = () => {
  return StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    skipButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: getFontSize(18),
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'Poppins-Bold',
    },
    description: {
        fontSize: getFontSize(16),
        textAlign: 'center',
        color: 'gray',
        fontFamily: 'Poppins-Regular',
        lineHeight: 26,
    },
    pagination: {
        flexDirection: 'row',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        top: 50,
        alignItems: 'center',
    },
    skipText: {
        fontSize: getFontSize(16),
        color: 'black',
        fontFamily: 'Poppins-SemiBold'
    },
    prevText: {
        fontSize: getFontSize(16),
        color: 'black',
        fontFamily: 'Poppins-SemiBold',
    },
    nextText: {
        fontSize: getFontSize(16),
        color: 'black',
        fontFamily: 'Poppins-SemiBold',
    },
    disabledText: {
        color: 'lightgray',
    },
});
};
