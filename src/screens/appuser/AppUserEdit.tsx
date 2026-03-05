import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
import {getFontSize} from '../../../font';
import {useTheme} from '../../theme/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {
  CheckBox,
  MaterialCommunityIcons,
  RadioButton,
  useTranslation,
} from '../../sharedBase/globalImport';
import FormFieldError from '../../components/FormFieldError';
import {CustomDropdown} from '../../components/CustomDropdown';
import {EnumDetail} from '../../core/model/enumDetail';
import {getAll} from '../../core/service/enumDetails.service';
import {
  RadioButtonChangeEvent,
  selectRadioEnum,
} from '../../sharedBase/dropdownUtils';
import {Calendar} from 'react-native-paper-dates';
import {formatDate} from '../career/JobRequestForm';
import {appUser} from '../../schema/appUser';

export default function AppUserEdit() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const appUserSchema = appUser(t);
  // const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepsData = [t('appUsers.form_detail.fields.accessDetails')];
  const [stepNo, setStepNo] = useState(1);
  console.log(setStepNo);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [model, setModel] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(setIsSubmitting);
  const [item, setItem] = useState<any>(model);

  const [listRole, setListRole] = useState<EnumDetail[]>([]);
  const [listPublish, setListPublish] = useState<EnumDetail[]>([]);
  const [genderlist, setGenderList] = useState<EnumDetail[]>([]);

  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    undefined,
  );
  const [selectedPublish, setSelectedPublish] = useState<string | undefined>(
    undefined,
  );
  const [selectedGender, setSelectedGender] = useState<string>('');

  useEffect(() => {
    const bindDropDownList = async () => {
      const data = await getAll();
      const sections = {
        RoleType: {
          setter: setListRole,
          selected: model.role,
          setSelected: setSelectedRole,
        },
        PublishType: {
          setter: setListPublish,
          selected: model.publish,
          setSelected: setSelectedPublish,
        },
        Gender: {
          setter: setGenderList,
          selected: model.gender,
          setSelected: setSelectedGender,
        },
      };
      Object.entries(sections).forEach(
        ([section, {setter, selected, setSelected}]) => {
          const filteredData = data.filter(
            (item: EnumDetail) => item.section === section,
          );
          setter(filteredData);
          if (section !== 'Gender') {
            const selectedItem = filteredData.find(
              (item: any) => item.value === selected,
            );
            if (selectedItem) setSelected({...selectedItem});
          } else if (selected && section === 'Gender') {
            setSelected(selected);
          }
        },
      );
    };
    bindDropDownList().catch(error => {
      console.error('Error binding dropdown lists:', error);
    });
  }, [model.gender, model.publish, model.role]);

  function handleInputChange(field: string, value: string) {
    setModel((prev: any) => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  // const handleCheckboxChange = (e: {checked?: boolean}, key: string) => {
  //   const value = e.checked ?? false;

  //   setModel(prev => ({
  //     ...prev,
  //     [key]: value,
  //   }));

  //   const schema = appUserSchema[key as keyof typeof appUserSchema];
  //   if (schema) {
  //     const result = schema.safeParse(value);
  //     if (result.success) {
  //       setErrors(prev => ({...prev, [key]: ''}));
  //     } else {
  //       setErrors(prev => ({
  //         ...prev,
  //         [key]: result.error.issues[0].message,
  //       }));
  //     }
  //   }
  // };

  const handleRadioChange = (
    e: RadioButtonChangeEvent,
    controlName: string,
    isBoolean = false,
  ) => {
    const updatedValue = selectRadioEnum(
      e,
      controlName,
      model,
      setModel,
      isBoolean,
    );

    setModel((prev: any) => ({
      ...prev,
      [controlName]: updatedValue,
    }));

    const schema = appUserSchema[controlName as keyof typeof appUserSchema];

    if (schema) {
      const result = schema.safeParse(updatedValue);

      if (result.success) {
        setErrors(prev => ({...prev, [controlName]: ''}));
      } else {
        setErrors(prev => ({
          ...prev,
          [controlName]: result.error.issues[0]?.message || 'Invalid value',
        }));
      }
    }
  };

  function handleDropdownChange(value: any, field: string) {
    setModel((prev: any) => ({...prev, [field]: value.value}));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  // const validateStepFields = (step: number) => {
  //   const container = stepRefs.current[step];
  //   let hasError = false;
  //   const newErrors: Record<string, string> = {...errors};

  //   if (container) {
  //     const nativeInputs = container.querySelectorAll<
  //       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //     >('input, select, textarea');

  //     nativeInputs.forEach(input => {
  //       const fieldName = input.name;
  //       const value = model[fieldName as keyof typeof model];
  //       const schema = appUserSchema[fieldName as keyof typeof appUserSchema];
  //       const isRequired = input.hasAttribute('required');
  //       const isEmpty = value === '' || value === null || value === undefined;

  //       if (isRequired) {
  //         if (schema) {
  //           const result = schema.safeParse(value);
  //           if (!result.success) {
  //             newErrors[fieldName] =
  //               result.error.issues[0]?.message || 'Invalid value';
  //             hasError = true;
  //           } else {
  //             newErrors[fieldName] = '';
  //           }
  //         } else if (isEmpty) {
  //           newErrors[fieldName] = 'This field is required';
  //           hasError = true;
  //         } else {
  //           newErrors[fieldName] = '';
  //         }
  //       } else if (schema && !isEmpty) {
  //         const result = schema.safeParse(value);
  //         if (!result.success) {
  //           newErrors[fieldName] =
  //             result.error.issues[0]?.message || 'Invalid value';
  //           hasError = true;
  //         } else {
  //           newErrors[fieldName] = '';
  //         }
  //       } else {
  //         newErrors[fieldName] = '';
  //       }
  //     });

  //     const multiSelectInputs = container.querySelectorAll('.p-multiselect');
  //     multiSelectInputs.forEach(input => {
  //       const fieldName = input.getAttribute('data-name');
  //       const schema = appUserSchema[fieldName as keyof typeof appUserSchema];

  //       const isRequired = input.getAttribute('data-required') === 'true';
  //       if (fieldName) {
  //         const value = model[fieldName as keyof typeof model];
  //         const isEmpty =
  //           value === '' ||
  //           value === null ||
  //           value === undefined ||
  //           (Array.isArray(value) && value.length === 0);

  //         if (isRequired) {
  //           if (schema) {
  //             const result = schema.safeParse(value);
  //             if (!result.success) {
  //               newErrors[fieldName] =
  //                 result.error.issues[0]?.message || 'Invalid value';
  //               hasError = true;
  //             } else {
  //               newErrors[fieldName] = '';
  //             }
  //           } else if (isEmpty) {
  //             newErrors[fieldName] = 'This field is required';
  //             hasError = true;
  //           }
  //         } else {
  //           newErrors[fieldName] = '';
  //         }
  //       }
  //     });
  //   }

  //   setErrors(newErrors);
  //   return !hasError;
  // };

  const handleSubmitClick = () => {
    // if (isSubmitting) return;
    // setIsSubmitting(true);
    // const isValid = validateStepFields(stepNo);
    // if (!isValid) {
    //   setIsSubmitting(false);
    //   return;
    // }
    // const form = document.getElementById('myForm') as HTMLFormElement | null;
    // if (form) {
    //   form.requestSubmit();
    // }
  };

  const next = async () => {
    // const isValid = validateStepFields(stepNo);
    // if (!isValid) {
    //   return;
    // }
    // try {
    //     if (model.id) {
    //         await itemQuery.draftItem(model);
    //     }
    //     if (stepNo < headers?.length) {
    //         setStepNo((prev) => prev + 1);
    //         stepperRef?.current?.nextCallback();
    //     }
    // } catch (error) {
    //     console.error("Draft save failed:", error);
    // }
  };

  const previous = () => {
    // setStepNo(prev => (prev > 0 ? prev - 1 : 0));
    // stepperRef?.current?.prevCallback();
  };

  return (
    <>
      <View style={styles.formHeader}>
        <View style={styles.container}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color="#000"
              />

              <Text style={styles.backText}>
                {t('appUsers.form_detail.fields.modelname')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* {stepsData.length > 1 && (
        // <Stepper activeStep={stepNo - 1}>
        //   {stepsData.map((step, i) => (
        //     <StepperPanel key={i} header={step} />
        //   ))}
        // </Stepper>
      )} */}

      {model && (
        <View style={styles.container}>
          {stepNo === 1 && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 40}}>
              <View style={styles.vsauthForm}>
                {stepNo === 1 && (
                  <ScrollView>
                    <View style={styles.vsauthForm}>
                      {/* Name */}
                      <View style={styles.dropdownmain}>
                        <View style={styles.labelContainer}>
                          <Text style={styles.vlabel}>
                            {t('appUsers.columns.fields.name')}
                          </Text>
                          <MaterialCommunityIcons
                            name="asterisk"
                            size={10}
                            color="red"
                          />
                        </View>

                        <TextInput
                          style={styles.vsinput}
                          value={item.name}
                          onChangeText={text => handleInputChange('name', text)}
                          placeholder={t('appUsers.columns.fields.name')}
                          placeholderTextColor={styles.placeholderText.color}
                        />
                        <FormFieldError field="name" errors={errors} />
                      </View>

                      {/* First Name */}
                      <View style={styles.dropdownmain}>
                        <Text style={styles.vlabel}>
                          {t('appUsers.columns.fields.firstName')}
                        </Text>

                        <TextInput
                          style={styles.vsinput}
                          value={item.firstName}
                          onChangeText={text =>
                            handleInputChange('firstName', text)
                          }
                          placeholder={t('appUsers.columns.fields.firstName')}
                          placeholderTextColor={styles.placeholderText.color}
                        />
                        <FormFieldError field="firstName" errors={errors} />
                      </View>

                      {/* Last Name */}
                      <View style={styles.dropdownmain}>
                        <Text style={styles.vlabel}>
                          {t('appUsers.columns.fields.lastName')}
                        </Text>

                        <TextInput
                          style={styles.vsinput}
                          value={item.lastName}
                          onChangeText={text =>
                            handleInputChange('lastName', text)
                          }
                          placeholder={t('appUsers.columns.fields.lastName')}
                          placeholderTextColor={styles.placeholderText.color}
                        />
                        <FormFieldError field="lastName" errors={errors} />
                      </View>

                      {/* Mobile */}
                      <View style={styles.dropdownmain}>
                        <View style={styles.labelContainer}>
                          <Text style={styles.vlabel}>
                            {t('appUsers.columns.fields.mobile')}
                          </Text>
                          <MaterialCommunityIcons
                            name="asterisk"
                            size={10}
                            color="red"
                          />
                        </View>

                        <TextInput
                          style={styles.vsinput}
                          value={item.mobile}
                          keyboardType="number-pad"
                          maxLength={10}
                          onChangeText={text =>
                            handleInputChange('mobile', text)
                          }
                          placeholder={t('appUsers.columns.fields.mobile')}
                          placeholderTextColor={styles.placeholderText.color}
                        />
                        <FormFieldError field="mobile" errors={errors} />
                      </View>

                      {/* Mobile Verified */}
                      <View style={styles.dropdownmain}>
                        <View style={styles.labelContainer}>
                          <Text style={styles.vlabel}>
                            {t('appUsers.columns.fields.mobileVerified')}
                          </Text>
                          <MaterialCommunityIcons
                            name="asterisk"
                            size={10}
                            color="red"
                          />
                        </View>

                        <CheckBox
                          isChecked={item.mobileVerified || false}
                          onClick={() =>
                            setItem((prev: {mobileVerified: any}) => ({
                              ...prev,
                              mobileVerified: !prev.mobileVerified,
                            }))
                          }
                          checkBoxColor={theme.primary}
                          style={{marginTop: 10}}
                        />
                        <FormFieldError
                          field="mobileVerified"
                          errors={errors}
                        />
                      </View>

                      {/* Email */}
                      <View style={styles.dropdownmain}>
                        <Text style={styles.vlabel}>
                          {t('appUsers.columns.fields.emailId')}
                        </Text>

                        <TextInput
                          style={styles.vsinput}
                          value={item.emailId}
                          keyboardType="email-address"
                          onChangeText={text =>
                            handleInputChange('emailId', text)
                          }
                          placeholder={t('appUsers.columns.fields.emailId')}
                          placeholderTextColor={styles.placeholderText.color}
                        />
                        <FormFieldError field="emailId" errors={errors} />
                      </View>

                      {/* Email Verified */}
                      <View style={styles.dropdownmain}>
                        <Text style={styles.vlabel}>
                          {t('appUsers.columns.fields.emailVerified')}
                        </Text>

                        <CheckBox
                          isChecked={item.emailVerified || false}
                          onClick={() =>
                            setItem((prev: {emailVerified: any}) => ({
                              ...prev,
                              emailVerified: !prev.emailVerified,
                            }))
                          }
                          checkBoxColor={theme.primary}
                          style={{marginTop: 10}}
                        />
                        <FormFieldError field="emailVerified" errors={errors} />
                      </View>

                      {/* Password */}
                      <View style={styles.dropdownmain}>
                        <Text style={styles.vlabel}>
                          {t('appUsers.columns.fields.password')}
                        </Text>

                        <TextInput
                          style={styles.vsinput}
                          secureTextEntry
                          value={item.password}
                          onChangeText={text =>
                            handleInputChange('password', text)
                          }
                          placeholder={t('appUsers.columns.fields.password')}
                          placeholderTextColor={styles.placeholderText.color}
                        />
                        <FormFieldError field="password" errors={errors} />
                      </View>

                      {/* Active */}
                      <View style={styles.dropdownmain}>
                        <View style={styles.labelContainer}>
                          <Text style={styles.vlabel}>
                            {t('appUsers.columns.fields.isActive')}
                          </Text>
                          <MaterialCommunityIcons
                            name="asterisk"
                            size={10}
                            color="red"
                          />
                        </View>

                        <CheckBox
                          isChecked={item.isActive || false}
                          onClick={() =>
                            setItem(prev => ({
                              ...prev,
                              isActive: !prev.isActive,
                            }))
                          }
                          checkBoxColor={theme.primary}
                          style={{marginTop: 10}}
                        />
                        <FormFieldError field="isActive" errors={errors} />
                      </View>

                      {/* Role Dropdown */}
                      <View style={styles.dropdownmain}>
                        <View style={styles.labelContainer}>
                          <Text style={styles.vlabel}>
                            {t('appUsers.columns.fields.role')}
                          </Text>
                          <MaterialCommunityIcons
                            name="asterisk"
                            size={10}
                            color="red"
                          />
                        </View>

                        <CustomDropdown
                          options={listRole}
                          selectedValue={selectedRole}
                          setSelectedValue={setSelectedRole}
                          onValueChange={val =>
                            handleDropdownChange(val, 'role')
                          }
                          placeholder={t('appUsers.columns.fields.role')}
                          controlName="role"
                        />
                        <FormFieldError field="role" errors={errors} />
                      </View>

                      {/* Publish Dropdown */}
                      <View style={styles.dropdownmain}>
                        <View style={styles.labelContainer}>
                          <Text style={styles.vlabel}>
                            {t('appUsers.columns.fields.publish')}
                          </Text>
                          <MaterialCommunityIcons
                            name="asterisk"
                            size={10}
                            color="red"
                          />
                        </View>

                        <CustomDropdown
                          options={listPublish}
                          selectedValue={selectedPublish}
                          setSelectedValue={setSelectedPublish}
                          onValueChange={val =>
                            handleDropdownChange(val, 'publish')
                          }
                          placeholder={t('appUsers.columns.fields.publish')}
                          controlName="publish"
                        />
                        <FormFieldError field="publish" errors={errors} />
                      </View>

                      {/* lastlogin */}
                      <View style={{marginBottom: 16}}>
                        {/* Label */}
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 6,
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: '600',
                              color: '#000',
                            }}>
                            {t('appUsers.columns.fields.lastLogin')}
                          </Text>
                        </View>

                        <Calendar
                          id="lastLogin"
                          name="lastLogin"
                          yearNavigator
                          monthNavigator
                          yearRange="1920:2040"
                          placeholder={t('appUsers.columns.fields.lastLogin')}
                          onChange={(e: {value: string | Date | undefined}) =>
                            handleInputChange(
                              'lastLogin',
                              e.value ? formatDate(e.value) : '',
                            )
                          }
                          dateFormat="dd/mm/yy"
                          showIcon
                          readOnlyInput={true}
                          appendTo="self"
                        />

                        <FormFieldError field="lastLogin" errors={errors} />
                      </View>

                      {/* default language */}
                      <View style={{marginBottom: 16}}>
                        {/* Label */}
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 6,
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: '600',
                              color: '#000',
                            }}>
                            {t('appUsers.columns.fields.defaultLanguage')}
                          </Text>
                        </View>

                        {/* Input */}
                        <TextInput
                          value={model.defaultLanguage}
                          onChangeText={text =>
                            setModel({...model, defaultLanguage: text})
                          }
                          placeholder={t(
                            'appUsers.columns.fields.defaultLanguage',
                          )}
                          maxLength={100}
                          style={{
                            borderWidth: 1,
                            borderColor: '#d1d5db',
                            borderRadius: 6,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            fontSize: 14,
                            backgroundColor: '#fff',
                          }}
                        />

                        <FormFieldError
                          field="defaultLanguage"
                          errors={errors}
                        />
                      </View>

                      {/* address */}
                      <View style={{marginBottom: 16}}>
                        {/* Label */}
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 6,
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: '600',
                              color: '#000',
                            }}>
                            {t('appUsers.columns.fields.address')}
                            <Text style={{color: 'red'}}> *</Text>
                          </Text>
                        </View>

                        {/* <Editor
                          value={model.address}
                          onTextChange={e =>
                            handleInputChange('address', e.htmlValue ?? '')
                          }
                          style={{height: 250, fontSize: 14}}
                          readOnly={false}
                          data-name={t('appUsers.columns.fields.address')}
                          maxLength={120}
                        /> */}

                        <FormFieldError field="address" errors={errors} />
                      </View>

                      {/* gender */}
                      <View style={{marginBottom: 16}}>
                        {/* Label */}
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 6,
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: '600',
                              color: '#000',
                            }}>
                            {t('appUsers.columns.fields.gender')}
                            <Text style={{color: 'red'}}> *</Text>
                          </Text>
                        </View>

                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                          {genderlist.map(item => (
                            <View
                              key={item.id}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginRight: 16,
                                marginBottom: 8,
                              }}>
                              <RadioButton
                                value={item.value ?? ''}
                                status={
                                  selectedGender?.toUpperCase() ===
                                  (item.value ?? '').toUpperCase()
                                    ? 'checked'
                                    : 'unchecked'
                                }
                                onPress={() => {
                                  handleRadioChange(
                                    {target: {value: item.value}},
                                    'gender',
                                  );
                                  setSelectedGender(item.value ?? '');
                                }}
                              />
                              <Text>{item.name}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      )}

      <View style={styles.formFooter}>
        {stepNo !== 1 && (
          <TouchableOpacity
            style={[styles.btn, styles.btnLight]}
            onPress={previous}
            activeOpacity={0.7}>
            {/* <Icon name="arrow-left" size={18} color="#000" /> */}
            <Text style={styles.btnLightText}>{t('globals.previous')}</Text>
          </TouchableOpacity>
        )}

        {stepNo < stepsData.length && (
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={next}
            activeOpacity={0.7}>
            <Text style={styles.btnPrimaryText}>{t('globals.next')}</Text>
            {/* <Icon name="arrow-right" size={18} color="#fff" /> */}
          </TouchableOpacity>
        )}

        {stepNo >= stepsData.length && (
          <TouchableOpacity
            style={[
              styles.btn,
              styles.btnSuccess,
              isSubmitting && styles.btnDisabled,
            ]}
            onPress={handleSubmitClick}
            disabled={isSubmitting}
            activeOpacity={0.7}>
            {/* <Icon name="floppy-disk" size={18} color="#fff" /> */}
            <Text style={styles.btnSuccessText}>{t('globals.save')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  formHeader: {
    backgroundColor: '#fff',
    paddingTop: 50, // adjust if using SafeAreaView
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#E9F0F4',
  },

  /* STEPPER WRAPPER */
  StepIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    // borderColor: theme.border,
  },

  /* FORM BODY */
  vsauthForm: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },

  /* EACH FIELD CONTAINER */
  dropdownmain: {
    marginBottom: 20,
  },

  /* LABEL ROW (label + asterisk) */
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  /* LABEL TEXT */
  vlabel: {
    fontSize: getFontSize(14),
    fontFamily: 'Poppins-Medium',
    // color: theme.text,
    marginRight: 4,
  },

  /* INPUT FIELD */
  vsinput: {
    height: 48,
    borderWidth: 1,
    // borderColor: theme.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    // backgroundColor: theme.background,
    fontSize: getFontSize(14),
    fontFamily: 'Poppins-Regular',
    // color: theme.text,
  },

  /* MULTILINE INPUT */
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },

  /* PLACEHOLDER STYLE */
  placeholderText: {
    color: '#8E9AA0',
  },

  /* PRIMARY COLOR TEXT (Stepper Active) */
  primaryColor: {
    // color: theme.primary,
    fontFamily: 'Poppins-Medium',
  },

  /* INACTIVE STEPPER LABEL */
  themeBorder: {
    // color: theme.border,
  },

  /* BUTTON CONTAINER */
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    // borderColor: theme.border,
  },

  /* NEXT / SAVE BUTTON */
  vbutton: {
    // backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vbuttonText: {
    color: '#ffffff',
    fontSize: getFontSize(14),
    fontFamily: 'Poppins-Medium',
  },

  /* BACK BUTTON */
  Backbutton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  BackbuttonText: {
    color: '#333',
    fontSize: getFontSize(14),
    fontFamily: 'Poppins-Medium',
  },

  /* CHECKBOX SPACING */
  checkboxSpacing: {
    marginTop: 10,
  },

  formFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },

  btnLight: {
    backgroundColor: '#f1f1f1',
  },

  btnPrimary: {
    backgroundColor: '#007bff',
  },

  btnSuccess: {
    backgroundColor: '#28a745',
  },

  btnDisabled: {
    opacity: 0.6,
  },

  btnLightText: {
    color: '#000',
    fontWeight: '600',
  },

  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
  },

  btnSuccessText: {
    color: '#fff',
    fontWeight: '600',
  },
});
