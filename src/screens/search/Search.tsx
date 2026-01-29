import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getGlobalSearchData} from '../../core/service/homes.service';
import {Product} from '../../core/model/product';
import {Blog} from '../../core/model/blog';
import {Industrie} from '../../core/model/industrie';

interface globalSearchData {
  product: Product[];
  blog: Blog[];
  industrie: Industrie[];
}
const Search = ({route}) => {
  const {searchText} = route.params ?? {};
  console.log(searchText);
  const [searchData, setSearchData] = useState<globalSearchData>({});
  const [globalSearchData, setGlobalSearchData] =
    useState<globalSearchData>(searchData);

  useEffect(() => {
    const fetchSearchData = async () => {
      const fetchSearch = await getGlobalSearchData(searchText ?? '');
      console.log('fetchSearch', fetchSearch);
      setSearchData(fetchSearch);
    };
    fetchSearchData();
  });

  useEffect(() => {
    if (searchData) setGlobalSearchData(searchData);
  }, [searchData]);

  const hasResults =
    (globalSearchData?.product?.length ?? 0) > 0 ||
    (globalSearchData?.industrie?.length ?? 0) > 0 ||
    (globalSearchData?.blog?.length ?? 0) > 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.pageTitle}>Search Result</Text>

        {!hasResults && (
          <Text style={styles.noResult}>
            No results found. Please try another search.
          </Text>
        )}

        {/* PRODUCTS */}
        {globalSearchData?.product?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Products ({globalSearchData.product.length})
            </Text>

            {globalSearchData.product.map((product: any) => (
              <View key={product.slug} style={styles.card}>
                <View style={styles.imageWrapper}>
                  {product.image && (
                    <Image
                      source={{uri: product.image}}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  )}
                </View>

                <View style={styles.content}>
                  <Text style={styles.cardTitle}>{product.name}</Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {product.mainContent}
                  </Text>

                  <TouchableOpacity
                    // onPress={() => navigation.navigate('ProductDetails', { slug: product.slug })}
                    style={styles.linkBtn}>
                    <Text style={styles.linkText}>View Details →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* INDUSTRIES */}
        {globalSearchData?.industrie?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Industry ({globalSearchData.industrie.length})
            </Text>

            {globalSearchData.industrie.map((industrie: any) => (
              <View key={industrie.slug} style={styles.card}>
                <View style={styles.imageWrapper}>
                  {industrie.image && (
                    <Image
                      source={{uri: industrie.image}}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  )}
                </View>

                <View style={styles.content}>
                  <Text style={styles.cardTitle}>{industrie.name}</Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {industrie.mainContent}
                  </Text>

                  <TouchableOpacity style={styles.linkBtn}>
                    <Text style={styles.linkText}>View Details →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* BLOGS */}
        {globalSearchData?.blog?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Blog ({globalSearchData.blog.length})
            </Text>

            {globalSearchData.blog.map((blog: any) => (
              <View key={blog.slug} style={styles.card}>
                <View style={styles.imageWrapper}>
                  {blog.image && (
                    <Image
                      source={{uri: blog.image}}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  )}
                </View>

                <View style={styles.content}>
                  <Text style={styles.cardTitle}>{blog.name}</Text>

                  {/* HTML stripped → plain text */}
                  <Text style={styles.description} numberOfLines={2}>
                    {blog.shortDescription?.replace(/<[^>]*>?/gm, '')}
                  </Text>

                  <TouchableOpacity style={styles.linkBtn}>
                    <Text style={styles.linkText}>View Details →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEF9FF',
  },

  inner: {
    paddingHorizontal: 16,
    paddingVertical: 40,
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003B5C',
    marginBottom: 20,
  },

  noResult: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginVertical: 40,
  },

  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003B5C',
    marginBottom: 20,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    overflow: 'hidden',
  },

  imageWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003B5C',
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },

  linkBtn: {
    marginTop: 10,
  },

  linkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0084C7',
  },
});
