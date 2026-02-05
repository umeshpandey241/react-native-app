import React, {useEffect, useState} from 'react';
import {
  // View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {DownloadedCase} from '../../core/model/downloadedCase';
import {CaseStudy} from '../../core/model/caseStudy';
import {downloadedCaseValidate} from '../../schema/downloadedCase';
import {add as addData} from '../../core/service/downloadedCases.service';
import FormFieldError from '../../components/FormFieldError';
// import Loader from '@/components/custom/Loader';
import {useTranslation} from '../../sharedBase/globalUtils';

function initialFormState(): DownloadedCase {
  return {
    id: undefined,
    name: '',
    email: '',
    mobile: '',
    caseStudyId: undefined,
    caseName: '',
    createDate: undefined,
    updateDate: undefined,
    deleteDate: undefined,
    createById: undefined,
    updateById: undefined,
    deleteById: undefined,
    isDelete: false,
  };
}

interface Props {
  setCaseFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCaseStudyData: CaseStudy;
}

export default function DownloadCaseForm({
  setCaseFormOpen,
  selectedCaseStudyData,
}: Props) {
  const {t} = useTranslation();

  const [formData, setFormData] = useState<DownloadedCase>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(loading);
  const downloadCaseSchema = downloadedCaseValidate(t);

  useEffect(() => {
    if (selectedCaseStudyData) {
      setFormData(prev => ({
        ...prev,
        caseStudyId: selectedCaseStudyData.id,
        caseName: selectedCaseStudyData.name ?? '',
      }));
    }
  }, [selectedCaseStudyData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));

    const schema = downloadCaseSchema[field as keyof typeof downloadCaseSchema];
    if (schema) {
      const result = schema.safeParse(value);
      setErrors(prev => ({
        ...prev,
        [field]: result.success ? '' : result.error.errors[0].message,
      }));
    }
  };

  const validateAllFields = () => {
    let hasError = false;
    const newErrors: Record<string, string> = {};

    (['name', 'email', 'mobile'] as const).forEach(field => {
      const schema = downloadCaseSchema[field];
      const value = formData[field];

      if (schema) {
        const result = schema.safeParse(value);
        if (!result.success) {
          newErrors[field] = result.error.errors[0].message;
          hasError = true;
        }
      }
    });

    setErrors(newErrors);
    return !hasError;
  };

  const removeEmptyFields = <T extends object>(obj: T): Partial<T> =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([, value]) => value !== '' && value !== undefined && value !== null,
      ),
    ) as Partial<T>;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const isValid = validateAllFields();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      setLoading(true);

      const cleanedPayload = removeEmptyFields(formData);
      await addData(cleanedPayload);

      Alert.alert(
        'Success',
        'Thank you. Kindly check your email; the Case Study has been shared.',
      );

      setFormData(initialFormState());
      setCaseFormOpen(false);
    } catch (err) {
      Alert.alert('Error', 'Error submitting form. Please try again later.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // if (loading) return <Loader />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      {/* Name */}
      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={v => handleInputChange('name', v)}
        placeholder={'Name'}
      />
      <FormFieldError field="name" errors={errors} />

      {/* Email */}
      <Text style={styles.label}>Email *</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={v => handleInputChange('email', v)}
        placeholder={'Email'}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormFieldError field="email" errors={errors} />

      {/* Mobile */}
      <Text style={styles.label}>Mobile *</Text>
      <TextInput
        style={styles.input}
        value={formData.mobile}
        onChangeText={v => handleInputChange('mobile', v)}
        placeholder={'Mobile'}
        keyboardType="number-pad"
        maxLength={10}
      />
      <FormFieldError field="mobile" errors={errors} />

      {/* Submit */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isSubmitting}>
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#0f172a',
  },

  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    marginBottom: 4,
  },

  button: {
    marginTop: 20,
    backgroundColor: '#1e40af',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
