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

const {width} = Dimensions.get('window');
const IS_TABLET = width >= 768;

interface IndustryCardProps {
  name: string;
  image: string;
  slug: string;
}

export default function IndustriesCard({name, image, slug}: IndustryCardProps) {
  const navigation = useNavigation<any>();

  return (
    <Pressable
      onPress={() => navigation.navigate('IndustryDetail', {slug})}
      style={({pressed}) => [styles.card, pressed && {opacity: 0.95}]}>
      <View style={styles.imageWrapper}>
        {image ? (
          <Image
            source={{uri: image}}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}

        {/* Overlay */}
        <View style={styles.overlay} />

        {/* Title */}
        <View style={styles.titleWrapper}>
          <Text style={styles.title} numberOfLines={2}>
            {name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: IS_TABLET ? 320 : 280,
    borderRadius: 14,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 4},
  },

  imageWrapper: {
    height: IS_TABLET ? 360 : 300,
    width: '100%',
  },

  image: {
    ...StyleSheet.absoluteFillObject,
  },

  noImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#6B7280',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  titleWrapper: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  title: {
    color: '#fff',
    fontSize: IS_TABLET ? 18 : 16,
    fontWeight: '500',
  },
});
