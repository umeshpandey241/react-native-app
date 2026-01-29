import React from 'react';
import { SearchBoxStyles } from '../styles/SearchBoxStyles';
import { MaterialCommunityIcons, TextInput, useTranslation, View } from '../sharedBase/globalImport';



interface SearchBoxProps {
    onSearch: (text: string) => void;
}

const SearchBoxComponent = ({ onSearch }: SearchBoxProps) => {
    const styles = SearchBoxStyles();
    const { t } = useTranslation();

    return (
        <View style={[styles.searchContainer]}>
            <MaterialCommunityIcons name="magnify" size={22} color="#B0B0B0" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={t('globals.search')}
                placeholderTextColor="#B0B0B0"
                onChangeText={onSearch}
            />
        </View>
    );
};



export default SearchBoxComponent;
