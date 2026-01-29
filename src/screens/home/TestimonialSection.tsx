import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getPhotoUrl} from '../industries/IndustriesList';
import {Testimonial} from '../../core/model/testimonial';

const {width} = Dimensions.get('window');
const IS_TABLET = width >= 768;
const ITEM_WIDTH = width * 0.9;

export default function TestimonialSection({
  testimonialData,
}: {
  testimonialData: Testimonial[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (testimonialData.length <= 1) return;

    const interval = setInterval(() => {
      const next = (activeIndex + 1) % testimonialData.length;
      flatListRef.current?.scrollToIndex({index: next, animated: true});
      setActiveIndex(next);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, testimonialData.length]);

  const renderItem = ({item}: {item: Testimonial}) => {
    const imageUrl = getPhotoUrl(item.uploadPhoto);

    return (
      <View style={styles.card}>
        {/* TEXT */}
        <View style={styles.textArea}>
          {/* STARS */}
          <View style={styles.stars}>
            {Array.from({length: 5}).map((_, i) => (
              <Ionicons
                key={i}
                name={i < item.rating ? 'star' : 'star-outline'}
                size={20}
                color="#006699"
              />
            ))}
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.designation}>{item.designation}</Text>
        </View>

        {/* IMAGE */}
        <View style={styles.imageWrapper}>
          {imageUrl ? (
            <Image source={{uri: imageUrl}} style={styles.image} />
          ) : (
            <View style={styles.noImage}>
              <Text>No Image</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.section}>
      {/* HEADER */}
      <Text style={styles.badge}>Clients Speak</Text>
      <Text style={styles.heading}>What Our Partners Say</Text>
      <Text style={styles.subText}>
        Real-world success, trusted results — hear from those we serve.
      </Text>

      {/* SLIDER */}
      <FlatList
        ref={flatListRef}
        data={testimonialData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
          setActiveIndex(index);
        }}
      />

      {/* DOTS */}
      {testimonialData.length <= 10 && (
        <View style={styles.dots}>
          {testimonialData.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}

      {/* ARROWS */}
      {testimonialData.length > 1 && (
        <>
          <Pressable
            style={[styles.arrow, {left: 12}]}
            onPress={() => {
              const prev =
                activeIndex === 0
                  ? testimonialData.length - 1
                  : activeIndex - 1;
              flatListRef.current?.scrollToIndex({
                index: prev,
                animated: true,
              });
              setActiveIndex(prev);
            }}>
            <Ionicons name="chevron-back" size={22} color="#006699" />
          </Pressable>

          <Pressable
            style={[styles.arrow, {right: 12}]}
            onPress={() => {
              const next =
                activeIndex === testimonialData.length - 1
                  ? 0
                  : activeIndex + 1;
              flatListRef.current?.scrollToIndex({
                index: next,
                animated: true,
              });
              setActiveIndex(next);
            }}>
            <Ionicons name="chevron-forward" size={22} color="#006699" />
          </Pressable>
        </>
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  section: {
    paddingVertical: 40,
    backgroundColor: '#F5F9FF',
    alignItems: 'center',
  },

  badge: {
    backgroundColor: '#006699',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    fontWeight: '600',
    marginBottom: 12,
  },

  heading: {
    fontSize: IS_TABLET ? 26 : 20,
    fontWeight: '700',
    color: '#0D6EFD',
    marginBottom: 6,
  },

  subText: {
    fontSize: IS_TABLET ? 16 : 13,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 600,
    marginBottom: 24,
  },

  card: {
    width: ITEM_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: width * 0.05,
    padding: 20,
    flexDirection: IS_TABLET ? 'row' : 'column-reverse',
    elevation: 3,
  },

  textArea: {
    flex: 1,
    paddingRight: IS_TABLET ? 16 : 0,
  },

  stars: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  title: {
    fontSize: IS_TABLET ? 20 : 16,
    fontWeight: '700',
    color: '#0D6EFD',
    marginBottom: 8,
  },

  description: {
    fontSize: IS_TABLET ? 15 : 13,
    color: '#6B7280',
    lineHeight: 22,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },

  name: {
    fontSize: IS_TABLET ? 16 : 14,
    fontWeight: '700',
    color: '#0D6EFD',
  },

  designation: {
    fontSize: IS_TABLET ? 14 : 12,
    color: '#006699',
  },

  imageWrapper: {
    width: IS_TABLET ? 220 : 160,
    height: IS_TABLET ? 280 : 200,
    alignSelf: 'center',
    marginBottom: IS_TABLET ? 0 : 16,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },

  noImage: {
    backgroundColor: '#E5E7EB',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dots: {
    flexDirection: 'row',
    marginTop: 16,
  },

  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
    borderRadius: 4,
  },

  dotActive: {
    backgroundColor: '#006699',
    width: 18,
  },

  arrow: {
    position: 'absolute',
    top: '55%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
    elevation: 4,
  },
});
