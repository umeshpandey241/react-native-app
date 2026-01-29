import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';

export const HomeStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: theme.background,
        },
        htmlContent: {
            // marginVertical: 10,
            // textAlign: 'center',
            alignItems: 'center',
        },
        htmlText: {
            color: theme.text,
        },
        summaryContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
        },
        summaryCard: {
            backgroundColor: theme.background,
            borderRadius: 15,
            padding: 10,
            marginBottom: 10,
            width: '47%',
            borderWidth: 1,
            borderColor: theme.border,
        },
        cardContent: {
            flexDirection: 'row',
            // margin: 10,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
        },
        summaryTitle: {
            fontSize: getFontSize(12),
            color: theme.text,
            marginBottom: 8,
            fontFamily: 'Poppins-SemiBold',
            textAlign: 'right',
        },
        summaryValue: {
            fontSize: getFontSize(12),
            color: theme.text,
            fontFamily: 'Poppins-SemiBold',
            textAlign: 'right',
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        userSlider: {
            // height: 200,
            // marginVertical: 10,
            padding: 10,
        },
        userSlide: {
            // width: 150,
            marginRight: 10,
            alignItems: 'center',
            borderWidth: 1,
            backgroundColor: theme.background,
            borderColor: theme.border,
            borderRadius: 10,
        },
        imageContainer: {
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            paddingTop: 10,
        },
        userImage: {
            width: 130,
            height: 125,
            borderRadius: 10,
        },
        userName: {
            // marginTop: 5,
            fontFamily: 'Poppins-SemiBold',
            fontSize: getFontSize(12),
            color: theme.text,
            width:120,
            paddingHorizontal: 2,
            paddingVertical: 3
        },
        userRole: {
            // marginTop: 5,
            fontFamily: 'Poppins-Regular',
            fontSize: getFontSize(12),
            color: theme.text,
        },
        userEmail: {
            fontSize: getFontSize(12),
            color: 'gray',
        },
        userListContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            // padding: 10,
        },
        userList: {
            // width: '48%',
            // padding: 10,
            // borderWidth: 1,
            marginBottom: 2,
        },
        userListHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        },
        userListTitle: {
            fontSize: getFontSize(16),
            fontFamily: 'Poppins-Bold',
            color: theme.text,
        },
        showAll: {
            fontSize: getFontSize(12),
            fontFamily: 'Poppins-Regular',
            color: theme.text,
        },
        userListItem: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 10,
            borderColor: '#e5e7eb',
            // margin: 5,
            marginLeft: 10,
            // borderWidth: 1,
            width: 80,
            height: 150,
        },
        userListItemImage: {
            width: 75,
            height: 75,
            borderRadius: 50,
            alignItems: 'center',
            top: 10,
        },
        userListItemName: {
            fontFamily: 'Poppins-Regular',
            textAlign: 'center',
            fontSize: getFontSize(12),
            color: theme.text,
            width: 80,
            flexWrap: 'wrap'
        },

        userListItemEmail: {
            fontSize: getFontSize(12),
            color: theme.text,
        },
        userCardContainer: {
            // flexDirection: 'row',
            // justifyContent: 'space-around',
            // padding: 10,
        },
        userCard: {
            padding: 20,
            borderRadius: 15,
            // alignItems: 'center',
            borderWidth: 1,
            margin: 5,
            backgroundColor: theme.background,
            borderColor: theme.border,
            flex: 1,

        },
        userDetails: {
            flexDirection: 'row',
        },
        userCardImage: {
            width: 50,
            height: 50,
            borderRadius: 40,
            // marginBottom: 10,
        },
        userCardName: {
            top: 3,
            color: theme.text,
            fontSize: getFontSize(14),
            fontFamily: 'Poppins-SemiBold',
        },
        userCardRole: {
            top: 5,
            color: theme.text,
            fontSize: getFontSize(12),
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        userCardDescription: {
            fontSize: getFontSize(12),
            color: 'gray',
            textAlign: 'center',
            marginBottom: 10,
        },
        userCardButton: {
            backgroundColor: theme.primaryLight,
            alignItems: 'center',
            padding: 5,
            paddingHorizontal: 20,
            borderRadius: 15,
            fontFamily: 'Poppins-SemiBold',
        },
        userCardButtonText: {
            color: theme.text,
            fontFamily: 'Poppins-SemiBold',
        },
        userCardDet: {
            color: theme.text,
            fontSize: getFontSize(12),
            fontFamily: 'Poppins-Regular',
        },
        line: {
            flex: 1,
            height: 1,
            backgroundColor: theme.border,
            margin: 5,
            marginTop: 10,
        },
        btmDetails: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 10,
        },
        userCardDetails: {
            flexDirection: 'column',
            // justifyContent: 'space-between',
            // alignItems: 'flex-start',
            // marginVertical: 5,
            marginLeft: 10,
        },
        btmDetailsNumber: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            // alignItems: 'center',
            marginVertical: 5,
            // gap: 10,
            paddingHorizontal: 10
        },
    });

};
