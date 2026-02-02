import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

// import strengths from '@/assets/images/strengths.webp';
// import LuFilter from '@/assets/images/Funnel.webp';
// import ShieldCheck from '@/assets/images/ShieldCheck.webp';
// import LuSettings from '@/assets/images/GearFine.webp';
// import LuShieldCheck from '@/assets/images/Circuitry.webp';

// const {width} = Dimensions.get('window');

export default function StrengthsSection() {
  return (
    <View style={styles.section}>
      <View style={styles.container}>
        {/* LEFT IMAGE */}
        {/* <Image source={strengths} style={styles.mainImage} /> */}

        {/* RIGHT CONTENT */}
        <View style={styles.content}>
          <Text style={styles.badge}>WHY CHOOSE US</Text>

          <Text style={styles.heading}>Our Strengths</Text>

          <Text style={styles.description}>
            Legacy expertise, advanced R&D, certifications, and customer-focused
            solutions drive our filtration leadership.
          </Text>

          <View style={styles.list}>
            <StrengthItem
              // icon={LuFilter}
              title="Exceptional Filtration Performance"
              desc="Clean, pure results for various applications"
            />

            <Divider />

            <StrengthItem
              // icon={ShieldCheck}
              title="Regulatory Compliance"
              desc="Solutions that meet the highest industry standards"
            />

            <Divider />

            <StrengthItem
              // icon={LuSettings}
              title="Customized Solutions"
              desc="Tailored to your specific needs"
            />

            <Divider />

            <StrengthItem
              // icon={LuShieldCheck}
              title="Reliable Technology"
              desc="Ensuring product integrity and preventing contamination"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const StrengthItem = ({icon, title, desc}: any) => (
  <View style={styles.item}>
    <Image source={icon} style={styles.icon} />
    <View style={{flex: 1}}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemDesc}>{desc}</Text>
    </View>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  section: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#f5f9ff', // white-blue gradient fallback
  },

  container: {
    gap: 24,
  },

  /* LEFT IMAGE */
  mainImage: {
    width: '100%',
    height: 260,
    borderRadius: 16,
  },

  /* RIGHT CONTENT */
  content: {
    gap: 12,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
  },

  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e3a8a',
  },

  description: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 22,
    textAlign: 'justify',
  },

  list: {
    marginTop: 8,
    gap: 8,
  },

  item: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },

  icon: {
    width: 32,
    height: 32,
    marginTop: 4,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
  },

  itemDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    marginTop: 4,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 6,
  },
});
