import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getPhotoUrl} from '../product/ProductList';
// import {PiArrowUpRightDuotone} from '@/sharedBase/globalImports';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = CARD_WIDTH * (4 / 3);

export default function EventCard({event}: {event: any}) {
  console.log('Event in EventCard:', event);
  const navigation = useNavigation<any>();
  const imageUrl = getPhotoUrl(event.uploadPhoto);

  const date = new Date(event.eventDate);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', {month: 'short'}).toUpperCase();
  const year = date.getFullYear();

  return (
    <Pressable
      style={styles.wrapper}
      onPress={() =>
        navigation.navigate('EventView', {slug: event.slug, id: event.id})
      }>
      {/* Image */}
      {imageUrl && <Image source={{uri: imageUrl}} style={styles.image} />}

      {/* Gradient Overlay */}
      <View style={styles.gradient} />

      {/* Center Icon */}
      <View style={styles.centerIcon}>
        <View style={styles.iconCircle}>
          {/* <PiArrowUpRightDuotone size={18} color="#000" /> */}
        </View>
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        <Text style={styles.title} numberOfLines={2}>
          {event.name}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {event.shortDescription?.replace(/<[^>]*>?/gm, '')}
        </Text>
      </View>

      {/* Date Badge */}
      <View style={styles.dateBadge}>
        <View style={styles.month}>
          <Text style={styles.monthText}>{month}</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.dayText}>{day}</Text>
        </View>
        <View style={styles.year}>
          <Text style={styles.yearText}>{year}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    position: 'relative',
  },

  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(3,25,37,0.85)',
  },

  centerIcon: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconCircle: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 30,
    elevation: 6,
  },

  bottomContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },

  title: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#ffffff',
  },

  description: {
    marginTop: 6,
    fontSize: width * 0.035,
    color: 'rgba(255,255,255,0.8)',
  },

  dateBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 6,
    overflow: 'hidden',
    alignItems: 'center',
  },

  month: {
    backgroundColor: '#0077b6',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  monthText: {
    color: '#fff',
    fontSize: width * 0.032,
    fontWeight: '500',
  },

  day: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },

  dayText: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#002438',
  },

  year: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingBottom: 4,
  },

  yearText: {
    fontSize: width * 0.03,
    fontWeight: '600',
    color: '#002438',
  },
});
