import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {getPhotoUrl} from '../product/ProductList';
import {Gallery} from '../../core/model/gallery';

const {height} = Dimensions.get('window');

interface Props {
  images: Gallery[];
}

export default function ImageCarousel({images}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailRef = useRef<FlatList>(null);

  const getImageSrc = (photo?: string) =>
    getPhotoUrl(photo) ? {uri: getPhotoUrl(photo)!} : undefined;

  const prevSlide = useCallback(() => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const nextSlide = useCallback(() => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const onThumbnailPress = (index: number) => {
    setActiveIndex(index);
    thumbnailRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainImageWrapper}>
        <Image
          source={getImageSrc(images?.[activeIndex]?.photo)}
          style={styles.mainImage}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={[styles.navButton, styles.left]}
          onPress={prevSlide}>
          <View style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.right]}
          onPress={nextSlide}>
          <View style={styles.arrowRight} />
        </TouchableOpacity>

        <View style={styles.thumbnailWrapper}>
          <FlatList
            ref={thumbnailRef}
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={styles.thumbnailList}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => onThumbnailPress(index)}
                style={[
                  styles.thumbnail,
                  activeIndex === index && styles.activeThumbnail,
                ]}>
                <Image
                  source={getImageSrc(item.photo)}
                  style={styles.thumbnailImage}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  mainImageWrapper: {
    width: '100%',
    height: height * 0.45,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainImage: {
    width: '100%',
    height: '100%',
  },

  navButton: {
    position: 'absolute',
    top: '50%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  left: {
    left: 16,
  },

  right: {
    right: 16,
  },

  arrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{rotate: '45deg'}],
  },

  arrowRight: {
    width: 12,
    height: 12,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    transform: [{rotate: '-45deg'}],
  },

  thumbnailWrapper: {
    position: 'absolute',
    bottom: 12,
    width: '100%',
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  thumbnailList: {
    paddingHorizontal: 12,
    gap: 12,
  },

  thumbnail: {
    width: 64,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    opacity: 0.6,
  },

  activeThumbnail: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#ffffff',
  },

  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});
