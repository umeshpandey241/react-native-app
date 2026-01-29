import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';

export const ViewStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            fontSize: getFontSize(20),
            textAlign: 'center',
            margin: 10,
            color: theme.text,
        },
        stepcon: {
            flex: 1,
            backgroundColor: theme.background,
            borderColor: theme.border,
        },
        StepIndicator: {
            padding: 10,
        },
        buttonContainer: {
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 12,
            borderTopWidth: 1,
            borderWidth: 1,
            backgroundColor: theme.background,
            borderColor: theme.border,
        },
        Backbutton: {
            flex: 1,
            marginHorizontal: 10,
            paddingVertical: 10,
            alignItems: 'center',
            backgroundColor: theme.background,
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: 25,
        },
        vbutton: {
            // flex: 1,
            marginHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 25,
            alignItems: 'center',
            backgroundColor: theme.primary,
            borderColor: theme.border,
            flexGrow:1,

        },
        BackbuttonText: {
            fontSize: getFontSize(15),
            color: theme.primary,
        },
        vbuttonText: {
            color: 'white',
            fontSize: getFontSize(15),

        },
        cardContainer: {
            flex: 1,
            padding: 20,
            flexDirection: 'column',
            gap: 10,
        },
        vsauthForm:{
            flex: 1,
            padding: 20,
            flexDirection: 'column',
            gap: 10,
        },
        card: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 10,
            padding: 20,
            backgroundColor: theme.background,
            justifyContent: 'space-between',
            gap: 10,
        },
        label: {
            fontSize: getFontSize(14),
            fontFamily: 'Poppins-SemiBold',
            color: theme.text,
        },
        value: {
            fontSize: getFontSize(12),
            color: theme.text,
            fontFamily: 'Poppins-Regular',
        },
        image: {
            width: 100,
            height: 100,
            resizeMode: 'cover',
            marginTop: 10,
            borderRadius: 5,
        },
        section: {
            // marginBottom: 20,
            // marginTop: 20,
        },
        sectionTitle: {
            fontSize: getFontSize(18),
            fontWeight: 'bold',
            marginBottom: 10,
        },
        imageContainer: {
            flexDirection: 'row',
            marginTop: 10,
        },
        noImageText: {
            fontStyle: 'italic',
            color: 'gray',
        },
        primaryColor: {
            color: theme.primary,
        },
        themeBorder: {
            color: theme.primaryLight,
        },
        labelContainer: {
            display: 'flex',
            flexDirection: 'row',
            gap: 5,
        },
    });
};
