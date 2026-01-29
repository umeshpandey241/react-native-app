import React from 'react';
import { LottieView, StyleSheet, View } from '../sharedBase/globalImport';

export const Loading = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/lottiefiles/Animation - loding.json')}
        style={styles.lottie}
        autoPlay
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    resizeMode:'contain',

  },
  lottie: {
    width: 150,
    height: 150,
  },
});


