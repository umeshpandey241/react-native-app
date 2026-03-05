import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import FormFieldError from '../../components/FormFieldError';
import {CaseStudy} from '../../core/model/caseStudy';
import {useTranslation} from 'react-i18next';
import {DownloadedCase} from '../../core/model/downloadedCase';
import {downloadedCaseValidate} from '../../schema/downloadedCase';
import {add} from '../../core/service/downloadedCases.service';

function initialFormState(): DownloadedCase {
  return {
    id: undefined,
    name: '',
    email: '',
    mobile: '',
    caseStudyId: undefined,
    caseName: '',
    type: '',
    createDate: undefined,
    updateDate: undefined,
    deleteDate: undefined,
    createById: undefined,
    updateById: undefined,
    deleteById: undefined,
    isDelete: false,
  };
}

const IndustryDownloadCaseForm = ({
  setCaseFormOpen,
  selectedCaseStudyData,
}: {
  setCaseFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCaseStudyData: CaseStudy;
}) => {
  const {t} = useTranslation();
  const inputRefs = useRef<{name: string; required: boolean}[]>([]);
  const [formData, setFormData] = useState<DownloadedCase>(initialFormState);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const downloadCaseSchema = downloadedCaseValidate(t);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(loading);

  useEffect(() => {
    if (selectedCaseStudyData) {
      setFormData(prev => ({
        ...prev,
        caseStudyId: selectedCaseStudyData?.id,
        caseName: selectedCaseStudyData?.name || '',
      }));
    }
  }, [selectedCaseStudyData]);

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
      const value = formData[name as keyof typeof formData];
      const schema =
        downloadCaseSchema[name as keyof typeof downloadCaseSchema];

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

    const isValid = validateAllFields();

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {...formData, type: 'Product'};
      const cleanedPayload = removeEmptyFields(payload);
      setLoading(true);

      try {
        await add(cleanedPayload);
        Alert.alert(
          'Success',
          'Thank you. Kindly check your email; the Product Brochure has been shared.',
        );
      } catch (error) {
        Alert.alert('Error', 'Error submitting form. Please try again later.');
      }

      setFormData(initialFormState);
      setCaseFormOpen(false);
    } catch (error) {
      // if (process.env.NODE_ENV !== 'production') {
      //   console.error(error);
      // }
      Alert.alert('Error submitting form. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    const schema = downloadCaseSchema[field as keyof typeof downloadCaseSchema];

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
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.form}>
        <View>
          {/* Name */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Name
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              value={formData.name}
              onChangeText={val => handleInputChange('name', val)}
              placeholder={'Name'}
              style={styles.input}
              maxLength={100}
            />

            <FormFieldError field="name" errors={errors} />
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Email
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              value={formData.email}
              onChangeText={val => handleInputChange('email', val)}
              placeholder={'Email'}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={100}
            />

            <FormFieldError field="email" errors={errors} />
          </View>

          {/* Mobile */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Mobile
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              value={formData.mobile}
              onChangeText={val => handleInputChange('mobile', val)}
              placeholder={'Mobile'}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={10}
            />

            <FormFieldError field="mobile" errors={errors} />
          </View>

          {/* Submit */}
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default IndustryDownloadCaseForm;

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },

  field: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },

  required: {
    color: '#dc2626',
  },

  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
    color: '#0f172a',
  },

  error: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },

  button: {
    marginTop: 10,
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});
