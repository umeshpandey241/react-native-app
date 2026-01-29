import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

// import team from '@/assets/images/Teammeetinghoto.webp';
// import lab from '@/assets/images/lab.webp';
// import Presentation from '@/assets/images/PresentationChart.webp';
// import Target from '@/assets/images/Target.webp';

const {width} = Dimensions.get('window');

export default function AboutSection({navigation}: any) {
  return (
    <View style={styles.section}>
      <View style={styles.container}>
        {/* LEFT IMAGES */}
        <View style={styles.left}>
          <View style={styles.leftColumn}>
            {/* <Image source={team} style={styles.teamImage} /> */}

            <View style={styles.statsBox}>
              <Text style={styles.statsNumber}>100%</Text>
              <Text style={styles.statsLabel}>Client Satisfaction</Text>
            </View>
          </View>

          {/* <Image source={lab} style={styles.labImage} /> */}
        </View>

        {/* RIGHT CONTENT */}
        <View style={styles.right}>
          <Text style={styles.badge}>ABOUT OUR COMPANY</Text>

          <Text style={styles.heading}>
            Smart Filtration, Proven Quality, & Reliable Service
          </Text>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              {/* <Image source={Presentation} style={styles.icon} /> */}
              <Text style={styles.featureText}>
                NIRAN Sets Industry Standards in Filtration
              </Text>
            </View>

            <View style={styles.featureItem}>
              {/* <Image source={Target} style={styles.icon} /> */}
              <Text style={styles.featureText}>
                Our Mission Is To Safeguard Your Progress
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>
            Niran is a specialized brand offering advanced filtration solutions
            for the Food & Beverage and Pharmaceutical industries, designed to
            meet the highest standards of quality, safety, and performance.
          </Text>

          <TouchableOpacity
            style={styles.cta}
            onPress={() => navigation.navigate('About')}>
            <Text style={styles.ctaText}>
              Niran - Powered by Science. Perfected by Technology.
            </Text>

            <View style={styles.ctaIcon}>
              <Text style={{color: '#6366f1'}}>↗</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#eef6ff', // blue-white gradient fallback
  },

  container: {
    flexDirection: 'column',
    gap: 24,
  },

  /* LEFT */
  left: {
    flexDirection: 'row',
    gap: 16,
  },

  leftColumn: {
    flex: 1,
    gap: 16,
  },

  teamImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },

  statsBox: {
    backgroundColor: '#E6F4FF',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 24,
  },

  statsNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#6366f1',
  },

  statsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
  },

  labImage: {
    flex: 1,
    height: 300,
    borderRadius: 16,
  },

  /* RIGHT */
  right: {
    gap: 16,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e3a8a',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },

  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e3a8a',
  },

  features: {
    gap: 16,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  icon: {
    width: 48,
    height: 48,
  },

  featureText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e3a8a',
    flex: 1,
  },

  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },

  description: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 22,
  },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 24,
  },

  ctaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },

  ctaIcon: {
    backgroundColor: '#fff',
    borderRadius: 999,
    padding: 8,
  },
});
