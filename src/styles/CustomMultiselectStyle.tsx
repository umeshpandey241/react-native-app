import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getFontSize } from '../../font';

export const CustomMultiselectStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: { marginVertical: 5 },
        label: { marginBottom: 6, fontSize: 16, fontWeight: '600', color: '#333' },
        dropdown: {
            borderWidth: 1,
            borderColor: '#bbb',
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRadius: 6,
            backgroundColor: theme.background,
            color: theme.text,
        },
        dropdownContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        selectedText: { color: theme.text, flex: 1 },
        chipsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 8,
        },
        chip: {
            flexDirection: 'row',
            backgroundColor: '#d0eaff',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 20,
            alignItems: 'center',
            marginRight: 8,
            marginBottom: 8,
        },
        chipText: { marginRight: 6, fontSize: 13 },
        remove: { color: '#ff4d4f', fontWeight: 'bold', fontSize: 16 },
        modalBackground: {
            flex: 1,
            backgroundColor: theme.background,
            justifyContent: 'center',
            padding: 20,
        },
        modalContent: {
            backgroundColor: theme.background,
            borderRadius: 8,
            maxHeight: '50%',
            padding: 16,
        },
        searchInput: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 8,
            marginBottom: 10,
            color: theme.text,
            fontSize: getFontSize(14)
        },
        optionItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderBottomColor: '#eee',
            borderBottomWidth: 1,
        },
        optionSelected: {
            backgroundColor: theme.background,
        },
        optionText: { fontSize: 16, color: theme.text },
        optionTextSelected: { color: '#007ad9', fontWeight: 'bold' },
        checkmark: { color: '#007ad9', fontSize: 16 },
        modalFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
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
        buttonText: {
            fontSize: 16,
            color: theme.text,
        },
        optionLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },

        checkbox: {
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: '#999',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
        },

        checkboxSelected: {
            backgroundColor: '#007ad9',
            borderColor: '#007ad9',
        },
        tick: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
            lineHeight: 18,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 12,
        },
        okButton: {
            backgroundColor: '#007AFF',
            borderColor: '#007AFF',
        },
        emptyText: {
            textAlign: 'center',
            padding: 20,
            color: '#888',
        },
    });

};
