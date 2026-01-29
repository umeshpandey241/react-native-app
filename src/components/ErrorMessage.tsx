import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface ErrorMessageProps {
    field: string;
    errors: Record<string, string>;
}

const ErrorMessage = ({ field,errors }: ErrorMessageProps) => {
    if (!errors) return null;

    return  <Text style={styles.error}>{errors[field]}</Text>;
};

const styles = StyleSheet.create({
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        marginBottom:2
    },
});

export default ErrorMessage;
