import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Industrie} from '../../core/model/industrie';
import {Product} from '../../core/model/product';
import {useTranslation} from 'react-i18next';
import {enquiryValidate} from '../../schema/enquiry';
import {add as addData} from '../../core/service/enquiries.service';
import FormFieldError from '../../components/FormFieldError';
import CustomMultiSelect from '../../components/CustomMultiSelect';
import {selectMultiData} from '../../sharedBase/dropdownUtils';
import {Enquiry} from '../../core/model/enquiry';

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

export default function EnquiryIndustrieForm({
  setEnquiryFormOpen,
  industrieData,
  products,
}: {
  setEnquiryFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  industrieData: Industrie[];
  products: Product[];
  loadingData: boolean;
}) {
  const {t} = useTranslation();
  // const stepRefs = useRef<HTMLDivElement[]>([]);
  const [formData, setFormData] = useState<Enquiry>(initialFormState);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const enquirySchema = enquiryValidate(t);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const router = useRouter();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product[]>([]);

  const inputRefs = useRef<{name: string; required: boolean}[]>([]);

  console.log('error', errors);

  useEffect(() => {
    if (industrieData) {
      setFormData(prev => ({
        ...prev,
        industrieId: industrieData[0]?.id?.toString(),
        industrieIdName: industrieData[0]?.name || '',
      }));
    }
  }, [industrieData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = products?.map((item: Industrie) => ({
          ...item,
          id: item.id,
        }));
        setProductsList(options);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [formData, products]);

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
    // event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    console.log(formData, 'formData');

    const isValid = validateAllFields();

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        enquiryType: 'For Industry',
        enquiryTypeLabel: 'For Industry',
      };

      console.log(payload, 'payload');
      const cleanedPayload = removeEmptyFields(payload);
      console.log(cleanedPayload, 'cleanedPayload');
      await addData(cleanedPayload);
      // toast.success('Your request has been submitted successfully');
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

  const handleMultiSelectChange = <
    T extends {id?: number | string; name?: string},
  >(
    values: string[],
    fieldName: string,
    sourceList: T[],
    setFieldValue: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    // Convert selected values to numbers safely
    const selectedIds = values.map(v => Number(v)).filter(v => !isNaN(v));

    // Map selected IDs to full objects
    const selectedItems = sourceList.filter(
      item => item.id !== undefined && selectedIds.includes(Number(item.id)),
    );

    // Update selected items state
    setFieldValue(selectedItems);

    const schema = enquirySchema[fieldName as keyof typeof enquirySchema];

    // 🔹 Validation (schema-driven, RN-safe)
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
      // Optional field → clear error
      setErrors(prev => ({...prev, [fieldName]: ''}));
    }

    // Preserve existing label-mapping logic
    const updatedModel = selectMultiData(selectedItems, fieldName);

    // Update main form data
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
      <ScrollView style={styles.stepWrapper}>
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

          <View style={styles.field}>
            <Text style={styles.vlabel}>Select industry</Text>

            <TextInput
              value={formData.industrieIdName}
              placeholder="Industry"
              style={[styles.input]}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>

          {products?.length > 0 && (
            <View style={styles.dropdownmain}>
              <Text style={styles.vlabel}>Select Product</Text>

              <CustomMultiSelect
                options={
                  productsList?.map(item => ({
                    value: item.id?.toString() ?? '',
                    label: item.name ?? '',
                  })) ?? []
                }
                selectedValues={selectedProduct.map(
                  u => u.id?.toString() ?? '',
                )}
                onValueChange={(values: string[]) =>
                  handleMultiSelectChange(
                    values,
                    'productId',
                    productsList,
                    setSelectedProduct,
                  )
                }
                placeholder="Select Product"
                maxDisplay={2}
                controlName="productId"
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.vlabel}>Other industry</Text>

            <TextInput
              value={formData.otherIndusrtri}
              onChangeText={v => handleInputChange('otherIndusrtri', v)}
              placeholder="Other industry"
              style={styles.input}
              maxLength={500}
            />

            <FormFieldError field="otherIndusrtri" errors={errors} />
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
            <TouchableOpacity
              onPress={() => setEnquiryFormOpen(false)}
              style={styles.actionButton}>
              <Text style={styles.actionText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

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
