import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import FormFieldError from './FormFieldError';
import {TextInput} from 'react-native';
import {Enquiry} from '../core/model/enquiry';
import {enquiryValidate} from '../schema/enquiry';
import {useTranslation} from 'react-i18next';
import {CustomDropdown} from './CustomDropdown';
import {Product} from '../core/model/product';
import {Industrie} from '../core/model/industrie';
import {EnumDetail} from '../core/model/enumDetail';
import CustomMultiSelect from './CustomMultiSelect';
import {getProductByIndustryId} from '../core/service/products.service';
import {add as addData} from '../core/service/enquiries.service';
import {selectDropdownEnum, selectMultiData} from '../sharedBase/dropdownUtils';
import {getAll} from '../core/service/enumDetails.service';
import _ from 'lodash';

function initialFormState(): Enquiry {
  return {
    id: undefined,
    name: '',
    email: '',
    mobile: '',
    location: '',
    company: '',
    role: '',
    industrieId: '',
    industrieIdName: '',
    otherIndusrtri: '',
    productId: '',
    productIdName: '',
    description: '',
    enquiryType: '',
    enquiryTypeLabel: '',
    createDate: undefined,
    updateDate: undefined,
    deleteDate: undefined,
    createById: undefined,
    updateById: undefined,
    deleteById: undefined,
    isDelete: false,
  };
}

function EnquiryForm({
  setEnquiryFormOpen,
  products,
  industries,
}: {
  setEnquiryFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  industries: Industrie[];
}) {
  const {t} = useTranslation();
  const stepRefs = useRef<HTMLDivElement[]>([]);
  const [formData, setFormData] = useState<Enquiry>(initialFormState);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const enquirySchema = enquiryValidate(t);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const router = useRouter();
  const [productData, setProductData] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product[]>([]);
  const [industrieData, setIndustrieData] = useState<Industrie[]>([]);
  const [selectedIndustrie, setSelectedIndustrie] = useState<string | null>(
    null,
  );
  const [enquiryTypeData, setEnquiryTypeData] = useState<EnumDetail[]>([]);
  const [selectedEnquiryType, setSelectedEnquiryType] = useState<
    EnumDetail | undefined
  >(undefined);
  const inputRefs = useRef<{name: string; required: boolean}[]>([]);

  // console.log('errors', errors);

  useEffect(() => {
    const options = industries?.map(item => ({...item, id: item.id})) || [];
    const withOther = [...options, {id: -1, name: 'Other'}];
    setIndustrieData(withOther);
  }, [industries]);

  useEffect(() => {
    if (!selectedIndustrie || !products) return;

    if (selectedIndustrie === '-1') {
      setProductData(products);
      setSelectedProduct([]);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getProductByIndustryId(
          Number.parseInt(selectedIndustrie, 10),
        );
        if (data) {
          setProductData(data);
        } else {
          setProductData([]);
        }
      } catch (error) {
        console.error('Error fetching products by industry:', error);
        setProductData([]);
      }
      setSelectedProduct([]);
    };
    fetchData();
  }, [selectedIndustrie, products]);

  const productOptions = productData.map(p => ({
    label: p.name ?? '',
    value: String(p.id),
  }));

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const bindDropDownList = async () => {
      try {
        const data = await getAll();
        if (!Array.isArray(data) || data.length === 0) return;

        const copiedData = _.cloneDeep(data);

        const sections = {
          EnquiryType: {
            setter: setEnquiryTypeData,
            selected: formData.enquiryType,
            setSelected: setSelectedEnquiryType,
          },
        };

        Object.entries(sections).forEach(
          ([section, {setter, selected, setSelected}]) => {
            const filteredData = copiedData.filter(
              (item: EnumDetail) => item.section === section,
            );

            setter(filteredData);

            if (section !== 'Gender') {
              const selectedItem = filteredData.find(
                (item: {value: string | undefined}) => item.value === selected,
              );

              if (selectedItem) {
                setSelected(_.cloneDeep(selectedItem));
              }
            }
          },
        );
      } catch (error) {
        console.error('Error binding dropdown list:', error);
      }
    };

    timeoutId = setTimeout(bindDropDownList, 3000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [formData.enquiryType]);

  const removeEmptyFields = <T extends object>(obj: T): Partial<T> => {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key as keyof T];
      if (value !== '' && value !== undefined && value !== null) {
        acc[key as keyof T] = value;
      }
      return acc;
    }, {} as Partial<T>);
  };

  const validateAllFields = () => {
    let hasError = false;
    const newErrors: Record<string, string> = {};

    inputRefs.current.forEach(({name, required}) => {
      const value = formData[name as keyof Enquiry];
      const schema = enquirySchema[name as keyof typeof enquirySchema];

      const isEmpty =
        value === '' ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0);

      if (required && isEmpty) {
        newErrors[name] = 'This field is required';
        hasError = true;
        return;
      }

      if (schema && !isEmpty) {
        const result = schema.safeParse(value);
        if (!result.success) {
          newErrors[name] = result.error.errors[0]?.message ?? 'Invalid value';
          hasError = true;
          return;
        }
      }

      newErrors[name] = '';
    });

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const isValid = validateAllFields();

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
      };
      console.log(payload, 'payload');
      const cleanedPayload = removeEmptyFields(payload);
      console.log(cleanedPayload, 'cleanedPayload');
      await addData(cleanedPayload);
      Alert.alert('Your request has been submitted successfully');
      setFormData(initialFormState);
      setEnquiryFormOpen(false);
      // setTimeout(() => {
      //     router.push("/");
      // }, 2000);
    } catch (error) {
      Alert.alert('Error submitting form');
      console.error('Error submitting form:', error);
      // toast.error('Error submitting form. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    const schema = enquirySchema[field as keyof typeof enquirySchema];

    if (schema) {
      const result = schema.safeParse(value);
      if (result.success) {
        setErrors(prev => ({...prev, [field]: ''}));
      } else {
        setErrors(prev => ({
          ...prev,
          [field]: result.error.errors[0].message,
        }));
      }
    }
  };

  const handleDropdownChange = (
    value: string | number | null,
    controlName: string,
  ) => {
    // normalize value
    const normalizedValue =
      value !== null && value !== undefined ? String(value) : '';

    const updatedFormData = selectDropdownEnum(
      {value: normalizedValue, target: {name: controlName}},
      controlName,
      false,
      formData as Record<string, unknown>,
    );

    setFormData(updatedFormData as typeof formData);

    const schema = enquirySchema[controlName as keyof typeof enquirySchema];
    if (!schema) return;

    // 🚀 instant error clear when value exists
    if (normalizedValue) {
      setErrors(prev => ({...prev, [controlName]: ''}));
      return;
    }

    // fallback validation
    const result = schema.safeParse(normalizedValue);

    if (!result.success) {
      setErrors(prev => ({
        ...prev,
        [controlName]: result.error.errors?.[0]?.message ?? 'Invalid value',
      }));
    }
  };

  const handleMultiSelectChange = <
    T extends {id?: number | string; name?: string},
  >(
    values: string[],
    fieldName: string,
    sourceList: T[],
    setFieldValue: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    const selectedIds = values.map(v => Number(v)).filter(v => !isNaN(v));

    const selectedItems = sourceList.filter(
      item => item.id !== undefined && selectedIds.includes(Number(item.id)),
    );

    setFieldValue(selectedItems);

    const schema = enquirySchema[fieldName as keyof typeof enquirySchema];

    if (schema) {
      if (selectedIds.length === 0) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: 'This field is required',
        }));
        return;
      }

      const result = schema.safeParse(selectedIds.join(','));

      if (!result.success) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: result.error.errors[0]?.message ?? '',
        }));
        return;
      } else {
        setErrors(prev => ({...prev, [fieldName]: ''}));
      }
    } else {
      setErrors(prev => ({...prev, [fieldName]: ''}));
    }

    const updatedModel = selectMultiData(selectedItems, fieldName);

    setFormData(prev => ({
      ...prev,
      [fieldName]: selectedIds.join(','),
      [`${fieldName}Label`]:
        updatedModel?.[`${fieldName}Label`]?.toString() ?? '',
    }));
  };

  const registerInput = (name: string, required = false) => {
    const exists = inputRefs.current.find(input => input.name === name);

    if (!exists) {
      inputRefs.current.push({name, required});
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <View
        ref={el => {
          if (el && !stepRefs.current.includes(el)) {
            stepRefs.current.push(el);
          }
        }}
        style={styles.stepWrapper}>
        <View style={styles.fieldGrid}>
          <View style={styles.field}>
            <Text style={styles.label}>
              Name
              <Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              ref={ref => ref && registerInput('name', true)}
              value={formData.name}
              onChangeText={text => handleInputChange('name', text)}
              placeholder="Name"
              style={styles.input}
              maxLength={100}
            />
            <FormFieldError field="name" errors={errors} />
          </View>

          {/* EMAIL */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Email
              <Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              ref={ref => ref && registerInput('email', true)}
              value={formData.email}
              onChangeText={text => handleInputChange('email', text)}
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={100}
            />
            <FormFieldError field="email" errors={errors} />
          </View>

          {/* MOBILE */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Mobile
              <Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              ref={ref => ref && registerInput('mobile', true)}
              value={formData.mobile}
              onChangeText={text => handleInputChange('mobile', text)}
              placeholder="Mobile"
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <FormFieldError field="mobile" errors={errors} />
          </View>

          {/* LOCATION */}
          <View style={styles.field}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              value={formData.location}
              onChangeText={text => handleInputChange('location', text)}
              placeholder="Location"
              style={styles.input}
              maxLength={200}
            />
            <FormFieldError field="location" errors={errors} />
          </View>

          {/* COMPANY */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Company Name
              <Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              ref={ref => ref && registerInput('company', true)}
              value={formData.company}
              onChangeText={text => handleInputChange('company', text)}
              placeholder="Company Name"
              style={styles.input}
              maxLength={200}
            />
            <FormFieldError field="company" errors={errors} />
          </View>

          <View style={styles.dropdownmain}>
            {/* Label */}
            <Text style={styles.vlabel}>
              Enquiry Type
              <Text style={styles.required}> *</Text>
            </Text>

            {/* Dropdown */}
            <CustomDropdown
              options={enquiryTypeData}
              selectedValue={selectedEnquiryType}
              setSelectedValue={setSelectedEnquiryType}
              onValueChange={val => {
                handleDropdownChange(val, 'enquiryType');

                const selected = enquiryTypeData.find(
                  u => u.id?.toString() === val,
                );

                if (selected) {
                  setSelectedIndustrie(selected.name?.toString() ?? null);
                }
              }}
              placeholder="Enquiry Type"
              controlName="enquiryType"
            />

            {/* Error */}
            <FormFieldError field="enquiryType" errors={errors} />
          </View>

          <View style={styles.field}>
            <Text style={styles.vlabel}>Role</Text>

            <TextInput
              value={formData.role}
              onChangeText={v => handleInputChange('role', v)}
              placeholder="Role"
              style={styles.input}
              maxLength={200}
            />

            <FormFieldError field="role" errors={errors} />
          </View>

          <View style={styles.dropdownmain}>
            <Text style={styles.vlabel}>Select Industry</Text>

            <CustomDropdown
              options={industrieData}
              selectedValue={selectedIndustrie}
              setSelectedValue={setSelectedIndustrie}
              onValueChange={val => {
                handleDropdownChange(val, 'industrieId');

                const selected = industrieData.find(
                  u => u.id?.toString() === val,
                );

                if (selected) {
                  setSelectedIndustrie(selected.id?.toString() ?? null);
                }
              }}
              placeholder="Select Industry"
              controlName="industrieId"
            />

            <FormFieldError field="industrieId" errors={errors} />
          </View>

          {selectedIndustrie === '-1' && (
            <View style={styles.field}>
              <Text style={styles.vlabel}>
                {t('enquiries.columns.fields.otherIndusrtri')}
                <Text style={styles.required}> *</Text>
              </Text>

              <TextInput
                value={formData.otherIndusrtri}
                onChangeText={v => handleInputChange('otherIndusrtri', v)}
                placeholder={t('enquiries.columns.fields.otherIndusrtri')}
                style={styles.input}
                maxLength={500}
              />

              <FormFieldError field="otherIndusrtri" errors={errors} />
            </View>
          )}

          <View style={styles.dropdownmain}>
            <Text style={styles.vlabel}>Select Product</Text>

            <CustomMultiSelect
              options={productOptions}
              selectedValues={selectedProduct.map(u => u.id?.toString() ?? '')}
              onValueChange={(values: string[]) => {
                return handleMultiSelectChange(
                  values,
                  'productId',
                  productData,
                  setSelectedProduct,
                );
              }}
              placeholder="Select Product"
              maxDisplay={2}
              controlName="productId"
            />

            <FormFieldError field="productId" errors={errors} />
          </View>

          <View style={styles.field}>
            <Text style={styles.vlabel}>
              Message
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              ref={ref => ref && registerInput('description', true)}
              value={formData.description}
              onChangeText={v => handleInputChange('description', v)}
              placeholder="Message"
              style={styles.textarea}
              multiline
              numberOfLines={3}
              maxLength={10000}
              textAlignVertical="top"
            />

            <FormFieldError field="description" errors={errors} />
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={[styles.actionButton, isSubmitting && {opacity: 0.6}]}>
          <Text style={styles.actionText}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>

        {/* Close */}
        {/* <TouchableOpacity
          onPress={() => setEnquiryFormOpen(false)}
          style={styles.actionButton}>
          <Text style={styles.actionText}>Close</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
}

export default EnquiryForm;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8, // px-2
    paddingBottom: 20, // pb-5
    backgroundColor: 'white',
  },

  stepWrapper: {
    width: '100%',
  },

  fieldGrid: {
    width: '100%',
    gap: 8, // space-y-2 / gap-2
  },

  submitBtn: {
    marginTop: 16,
    backgroundColor: '#005b83',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  field: {
    marginBottom: 12,
  },

  label: {
    fontWeight: '700',
    color: '#1f2937', // var(--color-dark)
    marginBottom: 6,
    fontSize: 14,
  },

  required: {
    color: '#1f2937',
  },

  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb', // var(--color-border)
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#005b83', // var(--color-primary)
    fontSize: 14,
  },

  vlabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
  },

  dropdownmain: {
    marginBottom: 14,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#fff',
    minHeight: 80,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },

  actionButton: {
    backgroundColor: '#005b83',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 6,
  },

  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
