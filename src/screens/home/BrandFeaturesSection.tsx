import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  // Image,
  // ImageBackground,
  FlatList,
  // Dimensions,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

// import brandBg from '@/assets/images/brand-bg.webp';
// import calender from '@/assets/images/CalendarCheck.webp';
// import Flask from '@/assets/images/Flask.webp';
// import Truck from '@/assets/images/Truck.webp';
// import Package from '@/assets/images/Package.webp';
// import Headset from '@/assets/images/Headset.webp';
// import GlobeStand from '@/assets/images/GlobeStand.webp';

// const {width} = Dimensions.get('window');

const features = [
  {
    // icon: calender,
    title: '35+ Years, Leaders In Filtration',
    desc: 'Trusted expertise delivering consistent, proven filtration results.',
  },
  {
    // icon: Flask,
    title: 'Inhouse R&D Capabilities',
    desc: 'Continuous innovation to create better filtration solutions.',
  },
  {
    // icon: Truck,
    title: 'On-Time Delivery',
    desc: 'Reliable product delivery, always as promised.',
  },
  {
    // icon: Package,
    title: 'Offering Wide Range',
    desc: 'Filtration options for diverse applications and needs.',
  },
  {
    // icon: Headset,
    title: 'After Sales Service',
    desc: 'Dedicated support for every product, post-purchase.',
  },
  {
    // icon: GlobeStand,
    title: 'Global Reach',
    desc: 'Serving customers worldwide with trusted filtration solutions.',
  },
];

export default function BrandFeaturesSection() {
  return (
    // <ImageBackground
    //   source={brandBg}
    //   style={styles.background}
    //   resizeMode="cover">
    //   {/* Gradient Overlay */}
    //   <LinearGradient
    //     colors={['rgba(0,10,16,1)', 'rgba(0,10,16,0.6)', 'rgba(0,10,16,0)']}
    //     style={styles.overlay}
    //   />

    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.badge}>BUILT ON TRUST & INNOVATION</Text>
        <Text style={styles.title}>Brand Features</Text>
        <Text style={styles.subtitle}>
          Our brand stands for legacy expertise, modern technology, and a
          relentless pursuit of excellence in filtration.
        </Text>
      </View>

      {/* Features */}
      <FlatList
        data={features}
        keyExtractor={(_, i) => i.toString()}
        numColumns={2} // change to 1 or 3 based on screen
        columnWrapperStyle={{gap: 16}}
        contentContainerStyle={{gap: 16}}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.iconWrapper}>
              {/* <Image source={item.icon} style={styles.icon} /> */}
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </View>
        )}
      />
    </View>
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: '#00141F',
  },

  header: {
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
    color: '#ffffff',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 22,
  },

  card: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
  },

  iconWrapper: {
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 30,
    padding: 12,
    marginBottom: 12,
  },

  icon: {
    width: 40,
    height: 40,
    tintColor: '#ffffff',
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
  },

  cardDesc: {
    fontSize: 13,
    fontWeight: '300',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 20,
  },
});
