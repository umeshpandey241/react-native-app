import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';
import { t } from 'i18next';

export const CustomDropdownStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        input: {
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 12,
            borderRadius: 8,
            marginVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
        },
        overlay: {
            flex: 1,
            backgroundColor: theme.background,
        },
        drawer: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            maxHeight: '60%',
            backgroundColor: theme.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
        },
        searchInput: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
            color: theme.text
        },
        item: {
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderBottomWidth: 0.5,
            borderBottomColor: '#ddd',
        },
        itemText: {
            fontSize: 16,
            color: theme.text,
        },
        emptyText: {
            textAlign: 'center',
            padding: 20,
            color: '#888',
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 12,
        },
        button: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginLeft: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#ccc',
        },
        okButton: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
        },
        buttonText: {
            fontSize: 16,
            color: theme.text,
        },
    });
};
