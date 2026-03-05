import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {GoogleSignin, useNavigation} from '../../sharedBase/globalImport';
import type {NavigationProp} from '@react-navigation/native';
import {useAuthStore} from '../../store/auth.store';
import {loginUser} from '../../core/service/login.service';
import {LoginStore} from '../../globalstate';

// import NiranLogo from '@/assets/images/NiranLogo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp<any>>();

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const logout = useAuthStore(state => state.logout);
  const {setUser} = LoginStore();
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';

    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setCaptchaText(result);
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '724261643893-ecgnuuckuqtl0u5le1nqicuubo0c3ve0.apps.googleusercontent.com',
      iosClientId:
        '724261643893-giiejtduqh04kuq5phepdhvmknjpq65g.apps.googleusercontent.com',
      offlineAccess: true,
    });

    logout();
    generateCaptcha();
  }, [logout]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleLogin = async () => {
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter email and password');
      return;
    }

    if (captchaInput !== captchaText) {
      setErrorMessage('Invalid captcha');
      generateCaptcha();
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        emailId: email,
        pin: password,
      });

      console.log('FULL RESPONSE:', JSON.stringify(response, null, 2));

      if (!response) {
        throw new Error('No response received');
      }

      if (response?.userInfo?.length > 0) {
        const userInfo = response.userInfo[0];

        console.log('USER OBJECT:', userInfo);

        setUser(userInfo as any);

        console.log('Navigating...');
        navigation.navigate('HomesHome');
      } else {
        console.log('Invalid structure:', response);
        setErrorMessage('Invalid email or password');
      }
    } catch (err: any) {
      console.log('CATCH ERROR:', err);
      setErrorMessage(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.brandSection}>
        {/* <Image source={NiranLogo} style={styles.logo} /> */}
        <Text style={styles.brandTitle}>Welcome Back</Text>
        <Text style={styles.brandSubtitle}>
          Sign in to continue to your Niran and manage everything in one place.
        </Text>
        <Text style={styles.footer}>© 2025 NIRAN. All rights reserved.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Login</Text>
        <Text style={styles.cardSubtitle}>
          Enter your credentials to access the Niran
        </Text>

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email or username"
          value={email}
          onChangeText={handleEmailChange}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
        />

        <Text style={styles.label}>Captcha</Text>

        <View style={styles.captchaContainer}>
          <Text style={styles.captchaText}>{captchaText}</Text>

          <TouchableOpacity onPress={generateCaptcha}>
            <Text style={styles.refresh}>↻</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter captcha"
          value={captchaInput}
          onChangeText={setCaptchaInput}
        />

        {/* <SubmitButton onPress={handleSubmit} pending={isPending} /> */}
        <SubmitButton onPress={handleLogin} disabled={loading} />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={{marginTop: 15}}>
          <Text
            style={{color: '#2563eb', textAlign: 'center', fontWeight: '600'}}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {loading && <ActivityIndicator />}
      </View>
    </ScrollView>
  );
}

function SubmitButton({onPress, disabled}: any) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && {opacity: 0.6}]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f6fa',
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  brandSubtitle: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 10,
  },
  footer: {
    fontSize: 12,
    color: '#999',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#666',
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  captchaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e8eefc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  captchaText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 3,
  },

  refresh: {
    fontSize: 20,
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
