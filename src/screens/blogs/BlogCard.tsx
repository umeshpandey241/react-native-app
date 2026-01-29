import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const IS_TABLET = width >= 768;

interface BlogCardProps {
  name: string;
  image: string;
  slug: string;
  tags: string;
  shortDescription: string;
}

export default function BlogCard({
  name,
  image,
  slug,
  tags,
  shortDescription,
}: BlogCardProps) {
  const navigation = useNavigation<any>();

  const tagList = tags
    ? tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    : [];

  return (
    <Pressable
      onPress={() => navigation.navigate('BlogDetail', {slug})}
      style={({pressed}) => [styles.card, pressed && {opacity: 0.95}]}>
      {/* IMAGE */}
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

        {/* Overlay icon */}
        <View style={styles.iconOverlay}>
          <View style={styles.iconCircle}>
            <Ionicons name="arrow-up-outline" size={18} color="#006699" />
          </View>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* TAGS */}
        {tagList.length > 0 && (
          <View style={styles.tagsRow}>
            {tagList.map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* TITLE */}
        <Text style={styles.title} numberOfLines={2}>
          {name}
        </Text>

        {/* DESCRIPTION */}
        <Text style={styles.description} numberOfLines={2}>
          {shortDescription}
        </Text>
      </View>
    </Pressable>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 4},
  },

  /* IMAGE */
  imageWrapper: {
    height: IS_TABLET ? 260 : 220,
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

  /* ICON */
  iconOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 30,
    elevation: 4,
  },

  /* CONTENT */
  content: {
    padding: 14,
  },

  /* TAGS */
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#E9F2FB',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: IS_TABLET ? 12 : 10,
    fontWeight: '600',
    color: '#006699',
  },

  /* TEXT */
  title: {
    fontSize: IS_TABLET ? 16 : 14,
    fontWeight: '600',
    color: '#0D6EFD',
    marginBottom: 6,
  },
  description: {
    fontSize: IS_TABLET ? 14 : 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});
