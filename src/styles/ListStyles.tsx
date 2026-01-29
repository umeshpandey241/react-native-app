import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';

export const ListStyles = () => {
    const { theme } = useTheme();

    //  const primaryColor = theme.primary

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        card: {
            borderWidth: 1,
            margin: 5,
            width: '47.5%',
            // gap: 8,
            backgroundColor: theme.background,
            borderColor: theme.border,
        },
        imageContainer: {
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            paddingTop: 10,
        },
        image: {
            width: '100%',
            height: 140,
        },
        details: {
            //   padding: 10,
            paddingTop: 0,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 5,
        },
        name: {
            color: theme.text,
            fontFamily: 'Poppins-SemiBold',
            fontSize: getFontSize(12),
            width: 150,
            textAlign: 'center',
            // paddingHorizontal: 2
        },
        role: {
            fontFamily: 'Poppins-Regular',
            color: theme.text,
            fontSize: getFontSize(10),

        },
        iconContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            paddingBottom: 10,
        },
        iconTextContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 5,
        },
        primaryColor: {
            color: theme.primary,
        },
        listContainer: {
            paddingHorizontal: 16,
            paddingTop: 8,
        },
        button: {
            borderWidth: 1,
            borderColor: theme.border,
            paddingHorizontal: 15,
            paddingVertical: 2
        },
        buttonText: {
            fontSize: getFontSize(10),
            fontFamily: 'Poppins-Regular',
            color: theme.text,
        },
        add: {
            position: 'absolute',
            bottom: 60,
            right: 20,
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: theme.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        addIcon: {
            fontSize: getFontSize(24),
            fontFamily: 'Poppins-Regular',
            color: '#fff',
        },
    });
};