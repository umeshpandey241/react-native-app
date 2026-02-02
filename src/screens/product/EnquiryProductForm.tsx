import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import {Enquiry} from '../../core/model/enquiry';
import {enquiryValidate} from '../../schema/enquiry';
import {useTranslation} from 'react-i18next';
import {CustomDropdown} from '../../components/CustomDropdown';
import {Product} from '../../core/model/product';
import {Industrie} from '../../core/model/industrie';
import {add as addData} from '../../core/service/enquiries.service';
import {selectDropdownEnum} from '../../sharedBase/dropdownUtils';
import FormFieldError from '../../components/FormFieldError';
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

function EnquiryProductForm({
  setEnquiryFormOpen,
  products,
  industries,
}: // loadingData,
{
  setEnquiryFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  industries: Industrie[];
  loadingData: boolean;
}) {
  const {t} = useTranslation();
  // const stepRefs = useRef<HTMLDivElement[]>([]);
  const [formData, setFormData] = useState<Enquiry>(initialFormState);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const enquirySchema = enquiryValidate(t);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const router = useRouter();
  // const navigation = useNavigation<any>();
  const [industriesList, setIndustriesList] = useState<Industrie[]>([]);
  const [selectedIndustrie, setSelectedIndustrie] = useState<string | null>(
    null,
  );
  const inputRefs = useRef<{name: string; required: boolean}[]>([]);

  console.log('error', errors);

  useEffect(() => {
    if (products) {
      setFormData(prev => ({
        ...prev,
        productId: products[0]?.id?.toString(),
        productIdName: products[0]?.name || '',
      }));
    }
  }, [products]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = industries?.map((item: Industrie) => ({
          ...item,
          id: item.id,
        }));
        setIndustriesList(options);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [formData, industries]);

  const removeEmptyFields = <T extends object>(obj: T): Partial<T> => {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key as keyof T];
      if (value !== '' && value !== undefined && value !== null) {
        acc[key as keyof T] = value;
      }
      return acc;
    }, {} as Partial<T>);
  };

  // const validateAllFields = () => {
  //   let hasError = false;
  //   const newErrors: Record<string, string> = {};

  //   Object.keys(enquirySchema).forEach(key => {
  //     const schema = enquirySchema[key as keyof typeof enquirySchema];
  //     const value = formData[key as keyof typeof formData];

  //     if (!schema) return;

  //     const result = schema.safeParse(value);

  //     if (!result.success) {
  //       newErrors[key] = result.error.errors[0]?.message ?? 'Invalid value';
  //       hasError = true;
  //     }
  //   });

  //   setErrors(newErrors);
  //   return !hasError;
  // };

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
    console.log('handle submit');

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
        enquiryType: 'For Product',
        enquiryTypeLabel: 'For Product',
      };

      console.log(payload, 'payload');

      const cleanedPayload = removeEmptyFields(payload);
      console.log(cleanedPayload, 'cleanedPayload');

      await addData(cleanedPayload);

      Alert.alert('Your request has been submitted successfully');

      setFormData(initialFormState());
      setEnquiryFormOpen(false);
    } catch (error) {
      Alert.alert('Error submitting form');
      console.error('Error submitting form:', error);
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
      <View style={styles.stepWrapper}>
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
            <Text style={styles.vlabel}>Product</Text>

            <TextInput
              value={formData.productIdName}
              placeholder="Product"
              style={[styles.input]}
              editable={false} // RN equivalent of readOnly
              selectTextOnFocus={false}
            />
          </View>

          <View style={styles.dropdownmain}>
            <Text style={styles.vlabel}>Select Industry</Text>

            <CustomDropdown
              options={industriesList}
              selectedValue={selectedIndustrie}
              setSelectedValue={setSelectedIndustrie}
              onValueChange={val => {
                handleDropdownChange(val, 'industrieId');

                const selected = industriesList.find(
                  u => u.id?.toString() === val,
                );

                if (selected) {
                  setSelectedIndustrie(selected.id?.toString() ?? null);
                }
              }}
              placeholder="Select Industry"
              controlName="industrieId"
              // loading={loadingData}
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
          // disabled={isSubmitting}
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
    </ScrollView>
  );
}

export default EnquiryProductForm;

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
