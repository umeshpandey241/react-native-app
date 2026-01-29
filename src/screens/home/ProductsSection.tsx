import React, {useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Product} from '../../core/model/product';
import {useNavigation} from '@react-navigation/native';
import ProductCard from '../product/ProductCard';
import {getPhotoUrl} from '../product/ProductList';

const {width} = Dimensions.get('window');

type Props = {
  productsData: Product[];
};

export default function ProductsSection({productsData}: Props) {
  const listRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const filteredProducts = useMemo(() => {
    return productsData
      .filter(p => p.isActive)
      .filter(p => p.isParent)
      .reverse();
  }, [productsData]);

  const ITEM_WIDTH = width * 0.75;

  const scrollPrev = () => {
    const prev = Math.max(currentIndex - 1, 0);
    listRef.current?.scrollToIndex({index: prev, animated: true});
    setCurrentIndex(prev);
  };

  const scrollNext = () => {
    const next = Math.min(currentIndex + 1, filteredProducts.length - 1);
    listRef.current?.scrollToIndex({index: next, animated: true});
    setCurrentIndex(next);
  };

  return (
    <View style={styles.section}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.badge}>ENGINEERED FOR EVERY NEED</Text>
        <Text style={styles.title}>Products</Text>
        <Text style={styles.subtitle}>
          Innovative filters for food, pharma, and water—precision-built for
          performance, safety, and reliability in every application.
        </Text>
      </View>

      {/* CAROUSEL */}
      {filteredProducts.length > 0 && (
        <View style={styles.carouselWrapper}>
          {/* Prev */}
          <TouchableOpacity
            style={[styles.arrow, styles.left]}
            onPress={scrollPrev}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>

          <FlatList
            ref={listRef}
            data={filteredProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, i) => `${item.id}-${i}`}
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            contentContainerStyle={{paddingHorizontal: 16}}
            onMomentumScrollEnd={e => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / ITEM_WIDTH,
              );
              setCurrentIndex(index);
            }}
            renderItem={({item}) => (
              <View style={{width: ITEM_WIDTH, padding: 8}}>
                <ProductCard product={item} />
              </View>
            )}
          />

          {/* Next */}
          <TouchableOpacity
            style={[styles.arrow, styles.right]}
            onPress={scrollNext}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CTA */}
      <TouchableOpacity
        style={styles.cta}
        onPress={() => navigation.navigate('ProductList')}>
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

  carouselWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },

  arrow: {
    position: 'absolute',
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  left: {
    left: 8,
  },

  right: {
    right: 8,
  },

  arrowText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#005b83',
  },

  cta: {
    marginTop: 24,
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
