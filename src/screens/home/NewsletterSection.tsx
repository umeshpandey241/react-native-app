import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  // ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {Subscriber} from '../../core/model/subscriber';
import {subscriberValidate} from '../../schema/subscriber';
// import { addData } from '@/app/actions/subscriber';
import {add as addData} from '../../core/service/subscribers.service';

function initialFormState(): Subscriber {
  return {name: '', email: ''};
}

export default function NewsletterSection() {
  const [formData, setFormData] = useState<Subscriber>(initialFormState);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contactSchema = subscriberValidate((key: string) => key);
  // const [addData, setAddData] = useState([]);

  // useEffect(() => {
  //   const adding = async () => {
  //     const addDatas = await add();
  //     setAddData(addDatas);
  //   };
  //   adding();
  // });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    const schema = contactSchema[field as keyof typeof contactSchema];

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

  const removeEmptyFields = <T extends object>(obj: T): Partial<T> => {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key as keyof T];
      if (value !== '' && value !== undefined && value !== null) {
        acc[key as keyof T] = value;
      }
      return acc;
    }, {} as Partial<T>);
  };

  const handleSubmit = async () => {
    let hasError = false;
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach(field => {
      const value = formData[field as keyof typeof formData];
      const schema = contactSchema[field as keyof typeof contactSchema];

      if (schema) {
        const result = schema.safeParse(value);
        if (!result.success) {
          newErrors[field] = result.error.errors[0].message;
          hasError = true;
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        setErrors({});
      }, 2000);
    }

    if (hasError) {
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload: Subscriber = {
        email: formData.email,
      };

      const cleanedPayload = removeEmptyFields(payload);
      await addData(cleanedPayload);

      Alert.alert("Thank you for subscribing. We'll keep you updated");
      setFormData(initialFormState);
      // setTimeout(() => {
      //     router.push("/");
      // }, 2000);
    } catch (error) {
      Alert.alert('Error submitting form');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.section}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.badge}>STAY INFORMED</Text>
        <Text style={styles.title}>Join Our Newsletter</Text>
        <Text style={styles.subtitle}>
          Get expert tips, industry insights, and the latest filtration news in
          your inbox—sign up now!
        </Text>
      </View>

      {/* FEATURES */}
      <View style={styles.features}>
        <Feature
          // icon={Mailbox}
          title="Regular Updates"
          desc="Latest market trends & pricing updates"
        />
        <Feature
          // icon={BellSimple}
          title="Expert Tips"
          desc="Guidance from filtration professionals"
        />
        <Feature
          // icon={HourglassHigh}
          title="Early Access"
          desc="Discover new products first"
        />
        <Feature
          // icon={Users}
          title="Community Perks"
          desc="Subscriber-only offers & invites"
        />
      </View>

      <View style={styles.wrapper}>
        {/* <ImageBackground
          source={filterBg}
          resizeMode="cover"
          style={styles.subscribeBox}
          imageStyle={styles.bgImage}>
          Dark overlay */}
        <View style={styles.overlay} />

        <View style={styles.subscribeContent}>
          {/* Megaphone */}
          {/* <Image source={megaphone} style={styles.megaphone} /> */}

          <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>

            <View style={styles.inputRow}>
              <TextInput
                placeholder="Enter your email address"
                placeholderTextColor="#cbd5e1"
                value={formData.email}
                onChangeText={v => handleInputChange('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.submit}
                onPress={handleSubmit}
                disabled={isSubmitting}>
                <Text style={styles.submitText}>
                  {isSubmitting ? '...' : 'Subscribe'}
                </Text>
              </TouchableOpacity>
            </View>

            {errors.email ? (
              <Text style={styles.error}>{errors.email}</Text>
            ) : null}

            <Text style={styles.privacy}>
              We respect your privacy. Unsubscribe at any time.
            </Text>
          </View>
        </View>
        {/* </ImageBackground> */}
      </View>
    </ScrollView>
  );
}

const Feature = ({icon, title, desc}: any) => (
  <View style={styles.card}>
    <Image source={icon} style={styles.icon} />
    <View style={{flex: 1}}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#f5f9ff',
  },
  wrapper: {
    padding: 16,
  },

  header: {
    alignItems: 'center',
    marginBottom: 24,
  },

  badge: {
    backgroundColor: '#1e3a8a',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '500',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e3a8a',
    marginVertical: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
  },

  features: {
    gap: 12,
    marginVertical: 24,
  },

  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  icon: {
    width: 28,
    height: 28,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
  },

  cardDesc: {
    fontSize: 13,
    color: '#475569',
  },

  subscribeBox: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#002E45',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  subscribeContent: {
    flexDirection: 'row',
    gap: 20,
    padding: 20,
    alignItems: 'center',
  },

  megaphone: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    transform: [{scaleX: -1}],
  },

  form: {
    flex: 1,
  },

  label: {
    color: '#fff',
    marginBottom: 8,
  },

  inputRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ffffff88',
    borderRadius: 8,
    overflow: 'hidden',
  },

  input: {
    flex: 1,
    padding: 12,
    color: '#fff',
  },

  submit: {
    backgroundColor: '#00A5EF',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  submitText: {
    color: '#fff',
    fontWeight: '600',
  },

  error: {
    color: '#fca5a5',
    marginTop: 6,
  },

  privacy: {
    color: '#ffffffcc',
    fontSize: 12,
    marginTop: 8,
  },
});
