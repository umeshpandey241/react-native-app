import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import {Product} from '../../core/model/product';
import ProductCard from '../product/ProductCard';
import {CustomFile} from '../../core/model/customfile';
import {getAll} from '../../core/service/products.service';
import {BASE_URL} from '../../../config/config';
import Header from '../../components/Header';

const {width} = Dimensions.get('window');
const IS_TABLET = width >= 768;
const NUM_COLUMNS = IS_TABLET ? 2 : 1;

/* ---------- IMAGE UTILITY ---------- */
export const getPhotoUrl = (uploadPhoto: string | undefined) => {
  if (!uploadPhoto) return undefined;
  try {
    const parsed: CustomFile[] = JSON.parse(uploadPhoto);
    if (parsed.length > 0 && parsed[0].filePath) {
      return `${BASE_URL}/ImportFiles/${parsed[0].filePath.replace(
        /\\/g,
        '/',
      )}`;
    }
    return undefined;
  } catch {
    return undefined;
  }
};

const ProductsList = () => {
  const [productsData, setProductsData] = useState<Array<Product>>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const fetchProductsData = await getAll();
      // console.log(fetchProductsData, 'productsData');
      setProductsData(fetchProductsData);
    };
    fetchProducts();
  }, []);

  const productData = useMemo(() => {
    return productsData?.filter(p => p.isActive && p.isParent)?.reverse();
  }, [productsData]);

  const renderItem = ({item}: {item: Product}) => {
    return (
      <View style={styles.cardWrapper}>
        <ProductCard product={item} />
      </View>
    );
  };

  return (
    <>
      <Header Heading="Products" />
      <ScrollView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.badge}>ENGINEERED FOR EVERY NEED</Text>

          <Text style={styles.title}>Products</Text>

          <Text style={styles.description}>
            Innovative filters for food, pharma, and water—precision-built for
            performance, safety, and reliability in every application.
          </Text>
        </View>

        {/* GRID */}
        <FlatList
          data={productData}
          key={NUM_COLUMNS}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={NUM_COLUMNS > 1 ? styles.row : undefined}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </>
  );
};

export default ProductsList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F8FF', // blue-white gradient substitute
  },

  header: {
    paddingHorizontal: IS_TABLET ? 48 : 16,
    paddingVertical: IS_TABLET ? 48 : 32,
    alignItems: IS_TABLET ? 'center' : 'flex-start',
  },

  badge: {
    backgroundColor: '#006699',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: IS_TABLET ? 12 : 11,
    fontWeight: '600',
    marginBottom: 12,
  },

  title: {
    fontSize: IS_TABLET ? 32 : 26,
    fontWeight: '700',
    color: '#0D6EFD',
    marginBottom: 12,
  },

  description: {
    fontSize: IS_TABLET ? 15 : 13,
    color: '#374151',
    lineHeight: 22,
    textAlign: IS_TABLET ? 'center' : 'left',
    maxWidth: 700,
  },

  grid: {
    paddingHorizontal: IS_TABLET ? 40 : 12,
    paddingBottom: 40,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  cardWrapper: {
    flex: 1,
    marginHorizontal: 6,
  },
});
