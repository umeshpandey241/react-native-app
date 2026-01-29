import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  // ImageBackground,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import {OurClient} from '../../core/model/ourClient';
import {getPhotoUrl} from '../product/ProductList';
// import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

type Props = {
  ourClientsData: OurClient[];
};

export default function OurClientSection({ourClientsData}: Props) {
  const filteredByActive = ourClientsData?.filter(
    item => item.isActive === true,
  );
  // const navigation = useNavigation();

  const repeatedClients = Array(4).fill(filteredByActive).flat();

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -width,
        duration: 3000,
        useNativeDriver: true,
      }),
    ).start();
  }, [translateX]);

  return (
    // <ImageBackground
    //   // source={patternbg}
    //   resizeMode="cover"
    //   style={styles.section}>
    //   {/* Gradient overlay */}
    //   <LinearGradient
    //     colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
    //     style={styles.overlay}
    //   />

    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.badge}>TRUSTED BY LEADING BRANDS</Text>
        <Text style={styles.title}>Our Client</Text>
        <Text style={styles.subtitle}>
          NIRAN partners with top organizations across food, pharma, water, and
          more— delivering proven filtration solutions that drive success and
          lasting relationships.
        </Text>
      </View>

      <View style={styles.marqueeContainer}>
        <Animated.View style={[styles.marquee, {transform: [{translateX}]}]}>
          {repeatedClients.map((logo, index) => {
            const imageUrl = getPhotoUrl(logo.image);
            return (
              <View key={index} style={styles.logoCard}>
                {imageUrl ? (
                  <Image
                    source={{uri: imageUrl}}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={{color: '#999'}}>No Image</Text>
                )}
              </View>
            );
          })}
        </Animated.View>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.cta}
        // onPress={() => navigation.navigate('OurClients')}
      >
        <Text style={styles.ctaText}>View All ↗</Text>
      </TouchableOpacity>
    </View>
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    paddingVertical: 40,
    backgroundColor: '#6366f1', // tertiary fallback
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  content: {
    zIndex: 2,
    backgroundColor: '#6366f1',
  },

  header: {
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 32,
  },

  badge: {
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    marginVertical: 6,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    maxWidth: '85%',
  },

  marqueeContainer: {
    overflow: 'hidden',
    marginVertical: 32,
  },

  marquee: {
    flexDirection: 'row',
    gap: 24,
    // backgroundColor: 'blue',
  },

  logoCard: {
    width: 112,
    height: 112,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 72,
    height: 72,
  },

  cta: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  ctaText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
});
