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
import {Product} from '../../core/model/product';
import {getPhotoUrl} from './ProductList';

const {width} = Dimensions.get('window');
const IS_TABLET = width >= 768;

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({product}: ProductCardProps) {
  const navigation = useNavigation<any>();

  const imageUrl = getPhotoUrl(product.image);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('ProductView', {slug: product.slug, id: product.id})
      }
      style={({pressed}) => [styles.card, pressed && {opacity: 0.9}]}>
      <View style={styles.imageWrapper}>
        {imageUrl ? (
          <Image
            source={{uri: imageUrl}}
            style={styles.image}
            resizeMode="contain"
          />
        ) : null}
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.iconWrapper}>
          <Ionicons name="arrow-up-outline" size={18} color="#fff" />
        </View>
      </View>
    </Pressable>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 16,
  },

  /* IMAGE */
  imageWrapper: {
    backgroundColor: '#002438', // gradient substitute
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    width: 140,
    height: 140,
  },

  /* CONTENT */
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  title: {
    flex: 1,
    fontSize: IS_TABLET ? 16 : 14,
    fontWeight: '600',
    color: '#0D6EFD',
    marginRight: 8,
  },

  /* ICON */
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#006699',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
