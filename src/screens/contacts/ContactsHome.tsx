// import {View, Text} from 'react-native';
// import React from 'react';

// const ContactsHome = () => {
//   return (
//     <View>
//       <Text>ContactsHome</Text>
//     </View>
//   );
// };

// export default ContactsHome;

import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  // Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/Feather';

import {Contact} from '../../core/model/contact';
import {contactValidate} from '../../schema/contact';
import FormFieldError from '../../components/FormFieldError';
import {useTranslation} from '../../sharedBase/globalUtils';
import {add} from '../../core/service/contacts.service';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// import contactHero from '@/assets/images/contactus.webp';
// import officeMeet from '@/assets/images/officemeet.webp';

function initialFormState(): Contact {
  return {
    name: '',
    email: '',
    mobile: '',
    city: '',
    state: '',
    message: '',
  };
}

export default function ContactsHome() {
  const {t} = useTranslation();

  const [formData, setFormData] = useState<Contact>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactSchema = useMemo(() => contactValidate(t), [t]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));

    const schema = contactSchema[field as keyof typeof contactSchema];
    if (schema) {
      const result = schema.safeParse(value);
      setErrors(prev => ({
        ...prev,
        [field]: result.success ? '' : result.error.errors[0].message,
      }));
    }
  };

  const validateForm = () => {
    let hasError = false;
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach(field => {
      const schema = contactSchema[field as keyof typeof contactSchema];
      const value = formData[field as keyof typeof formData];

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

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await add(formData);
      Alert.alert('Success', 'Thank you! We will contact you shortly.');
      setFormData(initialFormState());
    } catch (err) {
      Alert.alert('Error', 'Failed to submit contact form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header Heading="Contact" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <ScrollView style={styles.container}>
          {/* Hero */}
          {/* <Image source={contactHero} style={styles.heroImage} /> */}
          <Text style={styles.heroTitle}>Contact Us</Text>

          {/* Intro */}
          <View style={styles.header}>
            <Text style={styles.badge}>GET IN TOUCH</Text>
            <Text style={styles.heading}>Contact Us</Text>
            <Text style={styles.subheading}>
              We're here to answer your questions and help you find the perfect
              filtration solutions.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            {[
              {key: 'name', placeholder: 'Name'},
              {key: 'email', placeholder: 'Email', keyboard: 'email-address'},
              {key: 'mobile', placeholder: 'Mobile', keyboard: 'number-pad'},
              {key: 'city', placeholder: 'City'},
              {key: 'state', placeholder: 'State'},
            ].map(field => (
              <View key={field.key}>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  value={String(formData[field.key as keyof Contact])}
                  onChangeText={v => handleInputChange(field.key, v)}
                  keyboardType={field.keyboard as any}
                />
                <FormFieldError field={field.key} errors={errors} />
              </View>
            ))}

            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Message"
              multiline
              value={formData.message}
              onChangeText={v => handleInputChange('message', v)}
            />
            <FormFieldError field="message" errors={errors} />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.submitText}>Send Message</Text>
              <Icon name="send" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Contact Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Address</Text>
            <Text style={styles.infoText}>
              2972 Westheimer Rd. Santa Ana, Illinois 85486
            </Text>

            <View style={styles.divider} />

            <Text style={styles.infoTitle}>Get In Touch</Text>
            <Text style={styles.infoText}>📞 (217) 555-0113</Text>
            <Text style={styles.infoText}>💬 +91 9876543210</Text>
            <Text style={styles.infoText}>✉ niranenterprises@gmail.com</Text>
          </View>

          {/* <Image source={officeMeet} style={styles.officeImage} /> */}

          {/* Map */}
          <View style={styles.mapContainer}>
            <WebView
              source={{
                uri: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.045!2d-99.1635!3d19.409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f92f30b0a3e3%3A0x502dc17e8c89c9a7!2sSanta%20Ana!5e0!3m2!1sen!2sin!4v1696600000000!5m2!1sen!2sin',
              }}
              style={{flex: 1}}
              originWhitelist={['*']}
              javaScriptEnabled
              domStorageEnabled
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#eef9ff'},

  heroImage: {width: '100%', height: 200},
  heroTitle: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },

  header: {
    padding: 16,
    alignItems: 'center',
  },

  badge: {
    backgroundColor: '#005c8a',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 12,
    marginBottom: 8,
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003a5d',
  },

  subheading: {
    fontSize: 14,
    textAlign: 'center',
    color: '#003a5d',
    marginTop: 8,
  },

  card: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },

  textarea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },

  submitButton: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#005c8a',
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 12,
  },

  submitText: {
    color: '#fff',
    fontWeight: '600',
  },

  infoCard: {
    backgroundColor: '#003a5d',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  infoTitle: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },

  infoText: {
    color: '#cbd5e1',
    marginBottom: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#1e4e6b',
    marginVertical: 10,
  },

  officeImage: {
    width: '100%',
    height: 200,
  },

  mapContainer: {
    height: 300,
    width: '100%',
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
