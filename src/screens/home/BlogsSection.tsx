import React, {useEffect, useRef, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Blog} from '../../core/model/blog';
import BlogCard from '../blogs/BlogCard';
import {getPhotoUrl} from '../product/ProductList';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

type Props = {
  blogsData: Blog[];
};

export default function BlogsSection({blogsData}: Props) {
  const listRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const filteredBlogs = useMemo(
    () => blogsData.filter(b => b.isActive).slice(0, 10),
    [blogsData],
  );

  const ITEM_WIDTH = width * 0.8;
  const showDots = filteredBlogs.length <= 10;

  useEffect(() => {
    if (filteredBlogs.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % filteredBlogs.length;
        listRef.current?.scrollToIndex({index: next, animated: true});
        return next;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [filteredBlogs.length]);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.badge}>INSIGHTS & INNOVATIONS</Text>
        <Text style={styles.title}>Latest From Our Blog</Text>
        <Text style={styles.subtitle}>
          Explore trends, tips, and expert views on filtration for every
          industry.
        </Text>
      </View>

      {filteredBlogs.length > 0 && (
        <>
          <FlatList
            ref={listRef}
            data={filteredBlogs}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            keyExtractor={(item, i) => `${item.id}-${i}`}
            contentContainerStyle={{paddingHorizontal: 16}}
            onMomentumScrollEnd={e => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / ITEM_WIDTH,
              );
              setCurrentIndex(index);
            }}
            renderItem={({item}) => (
              <View style={{width: ITEM_WIDTH, padding: 8}}>
                <BlogCard
                  name={item.name ?? ''}
                  image={getPhotoUrl(item.image) ?? ''}
                  slug={item.slug ?? ''}
                  tags={item.tags ?? ''}
                  shortDescription={item.shortDescription ?? ''}
                />
              </View>
            )}
          />

          {showDots && (
            <View style={styles.dots}>
              {filteredBlogs.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    listRef.current?.scrollToIndex({
                      index: i,
                      animated: true,
                    });
                    setCurrentIndex(i);
                  }}
                  style={[styles.dot, currentIndex === i && styles.activeDot]}
                />
              ))}
            </View>
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.cta}
        onPress={() => navigation.navigate('BlogList')}>
        <Text style={styles.ctaText}>View All ↗</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 32,
    backgroundColor: '#eef6ff', // blue-white gradient fallback
  },

  header: {
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 24,
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
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e3a8a',
    marginVertical: 8,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    textAlign: 'center',
    maxWidth: '85%',
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },

  activeDot: {
    width: 24,
    backgroundColor: '#1e3a8a',
  },

  cta: {
    marginTop: 32,
    alignSelf: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  ctaText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
