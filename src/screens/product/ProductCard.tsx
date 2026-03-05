import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Product} from '../../core/model/product';
import {getPhotoUrl} from './ProductList';
import {MaterialCommunityIcons} from '../../sharedBase/globalImport';
import WatchList from './WatchList';
import {Cart} from '../../core/model/cart';
import {cartQuantityUpdate} from '../../core/service/carts.service';
import {globalStore} from '../../globalstate';

const {width} = Dimensions.get('window');
const IS_TABLET = width >= 768;

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({product}: ProductCardProps) {
  const navigation = useNavigation<any>();
  const imageUrl = getPhotoUrl(product.image);
  const {setCartListList} = globalStore();

  const addToCart = async (item: any) => {
    let cartData: Cart = item;
    cartData = {
      name: item.name,
      slug: item.slug,
      qty: 1,
      regularPrice: item.regularPrice,
      salePrice: item.salePrice,
      totalGst: 0,
      productId: item.id,
      totalAmount: item.salePrice * 1,
      // appUserId: user?.id,
      image: item.image,
      minQty: 1,
    };

    try {
      const data = await cartQuantityUpdate(cartData, 'add');
      setCartListList(data);
      // toast.current?.show({
      //   severity: 'success',
      //   summary: 'Added to Cart',
      //   detail: `${item.name} has been added to your cart.`,
      // });
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  return (
    <Pressable style={({pressed}) => [styles.card, pressed && {opacity: 0.95}]}>
      <View style={styles.imageWrapper}>
        <View style={styles.heartIcon}>
          <WatchList
            productId={product.id!}
            name={product?.name ?? ''}
            sku={product?.sku ?? ''}
            slug={product?.slug ?? ''}
            title="Add to Watchlist"
          />
        </View>

        {imageUrl ? (
          <Image
            source={{uri: imageUrl}}
            style={styles.image}
            resizeMode="contain"
          />
        ) : null}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.circleBtn}
            onPress={() =>
              navigation.navigate('ProductView', {
                slug: product.slug,
                id: product.id,
              })
            }>
            <MaterialCommunityIcons
              name="arrow-up-outline"
              size={18}
              color="#fff"
            />
          </Pressable>

          <Pressable
            style={styles.circleBtn}
            onPress={() => addToCart(product)}>
            <MaterialCommunityIcons
              name="cart-outline"
              size={18}
              color="#fff"
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D9E2EC',
    overflow: 'hidden',
    marginBottom: 18,
  },

  imageWrapper: {
    backgroundColor: '#0B4F6C',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    position: 'relative',
  },
  image: {
    width: 150,
    height: 150,
  },

  heartIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  content: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },

  title: {
    fontSize: IS_TABLET ? 18 : 16,
    fontWeight: '600',
    color: '#0B4F6C',
    marginBottom: 16,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },

  circleBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#0B6FA4',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
