import React from 'react';
import {Text, StyleSheet} from 'react-native';

interface FormFieldErrorProps {
  field: string;
  errors: Record<string, string>;
}

export default function FormFieldError({field, errors}: FormFieldErrorProps) {
  if (!errors[field]) return null;

  return <Text style={styles.error}>{errors[field]}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: '#dc2626', // var(--color-danger)
    fontSize: 12,
    paddingTop: 6,
    paddingLeft: 8,
  },
});
