import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';

export const SearchBoxStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            // backgroundColor: '#F0F0F0',
            borderRadius: 30,
            paddingHorizontal: 15,
            marginTop: 15,
            borderWidth: 1,
            backgroundColor: theme.background,
            borderColor: theme.border,
            flex: 1,
            // marginBottom:15,
        },
        icon: {
            marginRight: 8,
            color: theme.primary,

        },
        input: {
            flex: 1,
            fontSize: getFontSize(16),
            color: theme.text,
            
        },
    });
};