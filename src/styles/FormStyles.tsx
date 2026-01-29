import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';

export const FormStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
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
            alignItems: 'center',
            backgroundColor: theme.primary,
            borderColor: theme.border,
            borderRadius: 25,
            flexGrow: 1
        },
        BackbuttonText: {
            fontSize: getFontSize(15),
            color: theme.primary,
        },
        vbuttonText: {
            color: 'white',
            fontSize: getFontSize(15),
        },
        vsauthForm: {
            width: '100%',
            padding: 20,
            height: '83%',
            paddingBottom: 10,
        },
        vlabel: {
            fontSize: getFontSize(14),
            fontFamily: 'Poppins-SemiBold',
            color: theme.text,
        },
        vsinput: {
            borderRadius: 8,
            borderWidth: 1,
            backgroundColor: theme.background,
            borderColor: theme.border,
            padding: 15,
            // marginVertical: 10,
            fontFamily: 'Poppins-Regular',
            color: theme.text,
            marginBottom: 10,
            fontSize: getFontSize(12),
            marginTop: 10,
        },
        dropdown: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 4,
            // paddingHorizontal: 8,
            // height: 40,
            padding: 10,
            zIndex: 1000,
            backgroundColor: theme.background,
            color: theme.text,
            marginTop: 10,
        },
        multiselect: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 4,
            padding: 10,
            marginTop: 10,
            backgroundColor: theme.background,
            color: theme.text,
            zIndex: 999,
        },
        text: {
            fontSize: getFontSize(12),
            color: theme.text,
        },
        dropdownContainer: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 8,
            backgroundColor: theme.background,
            color: theme.text,
            maxHeight: 220,
            elevation: 5,
        },
        dropdownmain: {
            // flex: 1,
            marginBottom: 4,
        },
        label: {
            fontSize: getFontSize(14),
            fontWeight: 'bold',
            marginBottom: 8,
        },
        radioContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        error: {
            color: 'red',
            fontSize: getFontSize(12),
            marginBottom: 10,
            fontFamily: 'Poppins-Regular',
        },
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
        primaryColor: {
            color: theme.primary,
        },
        themeBorder: {
            color: theme.primaryLight,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        calendarContainer: {
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 10,
            width: '90%',
            alignItems: 'center',
        },
        closeButton: {
            marginTop: 10,
            padding: 10,
            backgroundColor: '#007bff',
            borderRadius: 5,
            width: '50%',
            alignItems: 'center',
        },
        closeButtonText: {
            color: '#fff',
            fontSize: getFontSize(16),
            fontWeight: 'bold',
        },
        placeholderText: {
            color: '#999999',
            fontSize: getFontSize(12),
        },
        calendar: {
            // paddingHorizontal: 10,
            // paddingVertical: 8,
            // alignSelf: 'center',
            // zIndex: 1,
            // marginLeft: 8,
            marginRight: 10,
        },
        searchContainerStyle: {
            backgroundColor: theme.background,
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 10,
            paddingVertical: 5,
        },
        searchTextInputStyle: {
            // backgroundColor: theme.background,
            height: 40,
            color: theme.text,
            fontSize: getFontSize(14)
        },
        placeholderStyle: {
            fontSize: getFontSize(14),
            color: theme.text,
        },
        selectedTextStyle: {
            fontSize: getFontSize(12),
            color: theme.primary
        },
        inputSearchStyle: {
            // height: 40,
            // borderWidth: 1,
            // borderColor: theme.border,
            // borderRadius: 6,
            // paddingHorizontal: 10,
            // fontSize: getFontSize(14),
            // color: theme.text,
            // backgroundColor: theme.background,
            backgroundColor: theme.background,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 6,
            paddingHorizontal: 10,
            height: 40,
            color: theme.text,
        },
        selectedStyle: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.primary,
            marginTop: 8,
            marginRight: 8,
            paddingHorizontal: 10,
            paddingVertical: 4,
        },
        textSelectedStyle: {
            color: theme.primary,
            fontSize: getFontSize(12),
            marginRight: 4,
        },
        removeStyle: {
            color: theme.primary,
            fontSize: getFontSize(14),
            fontWeight: "bold",
        },
        multiselectContainer: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 6,
            backgroundColor: theme.background,
            maxHeight: 180,
            zIndex: 9999,
        },
        itemTextStyle: {
            fontSize: getFontSize(12),
            color: theme.primary,
        },
        multiselectSelectedStyle: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 16,
            backgroundColor: theme.primaryLight,
            borderWidth: 1,
            borderColor: theme.primary,
            marginTop: 8,
            marginRight: 8,
            paddingHorizontal: 12,
            paddingVertical: 6,
        },
        selectedItemStyle: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 14,
            backgroundColor: theme.primaryLight,
            borderWidth: 1,
            borderColor: theme.primary,
            marginTop: 8,
            marginRight: 8,
            paddingHorizontal: 10,
            paddingVertical: 4,
        },
        arrowIconStyle: {
            width: 20,
            height: 20,
            tintColor: theme.text,
        },
        emptyTextStyle: {
            padding: 10,
            textAlign: 'center',
            color: theme.text
        },
        labelContainer: {
            display: 'flex',
            flexDirection: 'row',
            gap: 5,
        },
        radioBtnContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 20,
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 20,
        }
    });

};

