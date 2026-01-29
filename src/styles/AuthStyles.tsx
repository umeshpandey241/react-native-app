import { StyleSheet } from 'react-native';
// import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';
import { Color } from '../GlobelStyles';

export const AuthStyles = () => {
    //   const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: '#F5F5F5',
        },
        logo: {
            width: 100,
            height: 100,
            marginBottom: 20,
        },
        subHeading: {
            fontSize: getFontSize(14),
            color: '#888',
            marginTop: 10,
            fontFamily: 'Poppins-SemiBold',
        },
        mainHeading: {
            fontSize: getFontSize(24),
            fontFamily: 'Poppins-SemiBold',
        },
        description: {
            textAlign: 'center',
            color: '#888',
            marginVertical: 10,
            fontFamily: 'Poppins-SemiBold',
        },
        authForm: {
            width: '100%',
        },
        textInput: {
            borderRadius: 8,
            borderWidth: 1,
            borderColor: Color.border,
            backgroundColor: '#ECEEEF',
            padding: 15,
            marginVertical: 10,
            color:'#000',
            fontFamily: 'Poppins-Regular',
        },
        continueButton: {
            backgroundColor: '#007bff',
            padding: 10,
            borderRadius: 6,
            alignItems: 'center',
            marginTop: 10,
            paddingVertical: 14,
        },
        loginButtonText: {
            color: 'white',
            fontSize: getFontSize(16),
            fontFamily: 'Poppins-SemiBold',
        },
        orText: {
            textAlign: 'center',
            marginVertical: 10,
            marginHorizontal: 10,
            fontFamily: 'Poppins-SemiBold',
        },
        googleButton: {
            borderWidth: 1,
            borderColor: '#D1D5DB',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 10,
        },
        googleButtonContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        googleButtonText: {
            marginLeft: 8,
            color: '#555',
            fontFamily: 'Poppins-SemiBold',
        },
        biometricButton: {
            borderWidth: 1,
            borderColor: '#4285F4',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 10,
            backgroundColor: '#F8F9FF',
        },
        registerText: {
            textAlign: 'center',
            color: '#555',
            marginTop: 20,
            fontFamily: 'Poppins-Regular',
        },
        registerNow: {
            color: '#007bff',
            fontFamily: 'Poppins-SemiBold',
        },
        error: {
            color: 'red',
            fontSize: getFontSize(12),
            marginBottom: 10,
            fontFamily: 'Poppins-Regular',
        },
        orContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            // width: '90%',
            paddingVertical: 15,
        },
        line: {
            flex: 1,
            height: 1,
            backgroundColor: Color.border,
        },
        disableButton: {
            backgroundColor: Color.border,
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
            fontFamily: 'Poppins-SemiBold',

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
        button: {
            backgroundColor: Color.primary,
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderRadius: 5,
            alignItems: 'center',
            width: '100%',
        },
        buttonText: {
            color: '#fff',
            fontSize: getFontSize(16),
            fontFamily: 'Poppins-Regular',
        },
        oauthSection: {
            height: '100%',
            minHeight: '100%',
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 16,
            maxWidth: 500,
          },
          oauthHeader: {
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 16,
          },
          oheading: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 6,
          },
          oheadingText: {
            fontSize: 20,
            textTransform: 'uppercase',
            marginTop: -50,
            fontFamily: 'Poppins-SemiBold',
        
          },
          osmallText: {
            fontFamily:'Poppins-Regular',
            fontSize: 18,
          },
          mobileNo: {
            fontSize: 16,
            fontFamily:'Poppins-Regular',
        
          },
          otextPrimary: {
            fontSize: 18,
            color:  Color.primary,
            fontFamily:'Poppins-Regular',
            marginTop: 8,
          },
          oauthForm: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 16,
            width: '100%',
          },
          oformGroup: {
            width: '100%',
          },
          olabel: {
            fontSize: 18,
            fontWeight: '500',
            marginBottom: 10,
          },
          otpScreen: {
            width: '100%',
          },
          otpInput: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
            width: '100%',
          },
          activeInput: {
            borderColor: 'black',
          },
          oformControl: {
            flex: 1,
            fontSize: 24,
            textAlign: 'center',
            padding: 0,
            margin: 0,
            minWidth: 60,
            maxWidth: 90,
            minHeight: 60,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
        
          },
          oauthFooter: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 16,
            width: '100%',
          },
          rtextPrimary: {
            fontFamily:'Poppins-SemiBold',
            marginRight: 10
          },
          redText: {
            color: 'red'
          },
          Link: {
            color: Color.primary,
            marginRight: 10,
          },
          verifyButton: {
            backgroundColor: Color.primary,
            width: '100%',
            padding: 10,
            borderRadius: 5,
          },
          verifyButtonText: {
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
          },
          errorText: {
            color: '#ff0000',
            marginTop: 8,
          },
          label:
          {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 16,
            fontWeight: '500',
            marginBottom: 10,
          },
          authFooter: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 16,
            width: '100%',
          },
          footerText: {
            fontFamily: 'Poppins-Regular',
            fontSize: 16,
            lineHeight: 24,
          },
    });
};
