import React, {useState, useRef, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../theme/ThemeContext';
import {CustomDropdownStyles} from '../styles/CustomDropdownStyles';
import {
  Animated,
  Dimensions,
  FlatList,
  MaterialIcons,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../sharedBase/globalImport';

interface CustomDropdownProps<T = any> {
  options: T[];
  selectedValue: any;
  onValueChange: (value: any, controlName: string) => void;
  placeholder?: string;
  controlName: string;
  setSelectedValue: (value: any) => void;
}

export function CustomDropdown<T = any>({
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
  controlName,
  setSelectedValue,
}: CustomDropdownProps<T>) {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [visible, setVisible] = useState(false);
  const [tempValue, setTempValue] = useState(selectedValue);
  const [searchText, setSearchText] = useState('');
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current;
  const styles = CustomDropdownStyles();

  useEffect(() => {
    if (tempValue !== selectedValue) {
      setTempValue(selectedValue);
    }
  }, [selectedValue, tempValue]);

  const normalize = (item: any) => {
    if (item.label !== undefined && item.value !== undefined) {
      return {label: item.label, value: item.value};
    }
    if (item.name !== undefined && item.id !== undefined) {
      return {label: item.name, value: item.id};
    }
    return {label: String(item), value: item};
  };

  const normalizedOptions = options?.map(normalize);

  const openDrawer = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const handleOk = () => {
    console.log('tempValue:', tempValue);

    setSelectedValue(tempValue);
    onValueChange(tempValue ?? null, controlName);
    closeDrawer();
  };

  const handleCancel = () => {
    setTempValue(selectedValue);
    closeDrawer();
  };

  const filteredOptions = normalizedOptions?.filter(o =>
    o.label?.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View>
      <TouchableOpacity style={styles.input} onPress={openDrawer}>
        <Text style={{flex: 1, color: theme.text}}>
          {selectedValue
            ? normalizedOptions.find(o => o.value === selectedValue)?.label
            : placeholder}
        </Text>
        <MaterialIcons
          name="keyboard-arrow-down"
          size={24}
          color={theme.text}
        />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="none">
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <Animated.View
            style={[
              {
                backgroundColor: theme.background,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 15,
                maxHeight: '80%',
                transform: [{translateY: slideAnim}],
              },
            ]}>
            <View style={{alignItems: 'center', marginBottom: 10}}>
              <View
                style={{
                  width: 40,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: '#aaa',
                }}
              />
            </View>

            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search..."
              style={styles.searchInput}
              placeholderTextColor={theme.text}
            />

            <FlatList
              data={filteredOptions}
              keyExtractor={item => item.value.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    item.value === tempValue && {
                      backgroundColor: theme.primaryLight,
                    },
                  ]}
                  onPress={() => setTempValue(item.value)}>
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  {t('globals.emptyMessage')}
                </Text>
              }
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.okButton]}
                onPress={handleOk}>
                <Text style={[styles.buttonText, {color: 'white'}]}>OK</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
