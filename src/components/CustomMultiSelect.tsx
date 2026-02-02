import React, {useState, useMemo} from 'react';
import {
  MaterialCommunityIcons,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  TextInput,
  FlatList,
  useTranslation,
} from '../sharedBase/globalImport';
import {useTheme} from '../theme/ThemeContext';
import {CustomMultiselectStyles} from '../styles/CustomMultiselectStyle';
import Modal from 'react-native-modal';

interface Option {
  label: string;
  value: string | number;
}

interface CustomMultiSelectProps {
  options: Option[];
  selectedValues: (string | number)[];
  onValueChange: (selected: (string | number)[]) => void;
  maxDisplay?: number;
  placeholder?: string;
}

const CustomMultiSelect = ({
  options,
  selectedValues,
  onValueChange,
  maxDisplay = 2,
  placeholder,
}: CustomMultiSelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelected, setTempSelected] = useState<(string | number)[]>([
    ...selectedValues,
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const styles = CustomMultiselectStyles();
  const {t} = useTranslation();
  const {theme} = useTheme();

  const toggleSelection = (value: string | number) => {
    if (tempSelected.includes(value)) {
      setTempSelected(tempSelected.filter(v => v !== value));
    } else {
      setTempSelected([...tempSelected, value]);
    }
  };

  const applySelection = () => {
    onValueChange(tempSelected);
    setModalVisible(false);
  };

  const getLabelFromValue = (value: string | number) =>
    options.find(o => o.value === value)?.label || '';

  const filteredOptions = useMemo(
    () =>
      options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, options],
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => {
          setTempSelected([...selectedValues]);
          setSearchTerm('');
          setModalVisible(true);
        }}>
        <View style={styles.dropdownContent}>
          <Text style={styles.selectedText} numberOfLines={2}>
            {selectedValues.length === 0
              ? t(placeholder ?? '')
              : (() => {
                  const max = maxDisplay ?? 2;
                  const labels = selectedValues.map(getLabelFromValue);
                  const displayed = labels.slice(0, max);
                  const remaining = labels.length - max;

                  return (
                    displayed.join(', ') +
                    (remaining > 0 ? `, +${remaining} more` : '')
                  );
                })()}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color="#888" />
        </View>
      </TouchableOpacity>

      <View style={styles.chipsContainer}>
        {selectedValues.map(value => (
          <View key={value.toString()} style={styles.chip}>
            <Text style={styles.chipText}>{getLabelFromValue(value)}</Text>
            <Pressable
              onPress={() =>
                onValueChange(selectedValues.filter(v => v !== value))
              }>
              <Text style={styles.remove}>×</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setModalVisible(false)}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View
          style={[
            styles.modalContent,
            {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '80%',
            },
          ]}>
          <View style={{alignItems: 'center', marginBottom: 8}}>
            <View
              style={{
                width: 40,
                height: 5,
                backgroundColor: '#ccc',
                borderRadius: 3,
              }}
            />
          </View>

          <TextInput
            placeholder={t('globals.search')}
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
            placeholderTextColor={theme.text}
          />

          <FlatList
            data={filteredOptions}
            keyExtractor={item => item.value.toString()}
            renderItem={({item}) => {
              const isSelected = tempSelected.includes(item.value);
              return (
                <TouchableOpacity
                  onPress={() => toggleSelection(item.value)}
                  style={[
                    styles.optionItem,
                    isSelected && styles.optionSelected,
                  ]}>
                  <View style={styles.optionLeft}>
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                      ]}>
                      {isSelected && <Text style={styles.tick}>✓</Text>}
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}>
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>{t('globals.emptyMessage')}</Text>
            }
          />

          {/* <View style={styles.modalFooter}>
                        <Button label="Cancel" onPress={() => setModalVisible(false)} />
                        <Button label="OK" onPress={applySelection} />
                    </View> */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.okButton]}
              onPress={applySelection}>
              <Text style={[styles.buttonText, {color: 'white'}]}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Button = ({label, onPress}: {label: string; onPress: () => void}) => {
  const styles = CustomMultiselectStyles();
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CustomMultiSelect;
