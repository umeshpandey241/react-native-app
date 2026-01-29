import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';

export const ProductListStyles = () => {
    const { theme } = useTheme();


    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        card: {
            borderRadius: 10,
            borderWidth: 1,
            //   margin: 5,
            marginBottom: 8,
            //   width: '47.5%',
            //   gap: 10,
            backgroundColor: theme.background,
            borderColor: theme.border,
            flexDirection: 'row',
            width: '100%',
        },
        gridCard: {
            borderRadius: 10,
            margin: 5,
            marginBottom: 8,
            width: '47.5%',
            backgroundColor: theme.background,
            borderColor: theme.border,
            flexDirection: 'column',

        },
        imageContainer: {
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
        },
        saveIcon: {
            position: 'absolute',
            top: 5,
            right: 5,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 15,
            padding: 2,
            zIndex: 1,
          },
          gridSaveIcon: {
            position: 'absolute',
            top: 15,
            right: 15,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 15,
            padding: 4,
            zIndex: 1,
          },
        gridImageContainer: {
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 5,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 10,
            marginBottom: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 0,
        },
        image: {
            width: 100,
            // height: 112,
            height: '100%',
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
        },
        gridImage: {
            width: '100%',
            height: 150,
            borderRadius: 10,
        },
        details: {
            padding: 10,
            flexDirection: 'column',
            gap: 5,
            flex: 1,
        },
        gridDetails: {
            flexDirection: 'column',
            flex: 1,

        },
        price: {
            gap: 5,
            flexDirection: 'row',
        },
        gridPrice: {
            gap: 5,
            flexDirection: 'row',
            top: -3,
        },
        name: {
            color: theme.text,
           fontSize: getFontSize(12),
            fontFamily: 'Poppins-SemiBold'
            // fontWeight: '500'
        },
        priceText: {
            color: theme.text,
           fontSize: getFontSize(12),
            fontFamily: 'Poppins-Regular'
            // fontWeight: '500'
        },
        strikeThrough: {
            textDecorationLine: 'line-through',
        },
        iconContainer: {
            flexDirection: 'row',
            // gap:20,
            justifyContent: 'space-between',

        },
        iconTextContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 5,
            borderWidth: 1,
            borderRadius: 5,
            padding: 4,
            borderColor: theme.border,
            top: 3,
        },
        primaryColor: {
            color: theme.primary,
        },
        listContainer: {
            // paddingHorizontal: 16,
            // paddingTop: 8,
            padding: 20,


        },
        toggleButton: {
            alignSelf: 'flex-end',
            padding: 8,
            backgroundColor: theme.primary,
            borderRadius: 5,
            marginBottom: 0,
            // marginLeft: 10
            margin:10

        },
        toggleButtonText: {
            color: 'white',
           fontSize: getFontSize(16),
            fontWeight: 'bold',
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