import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  Dimensions,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {getPhotoUrl} from './ProductList';
import {CustomFile} from '../about/AboutHomes';
import {BASE_URL} from '../../../config/config';
import {OtherProductsCard} from './OtherProductsCard';
import {ProductFaq} from '../../core/model/productFaq';
import {getAll, getProductData} from '../../core/service/products.service';
import {Industrie} from '../../core/model/industrie';
import {Product} from '../../core/model/product';
import ProductCard from './ProductCard';
import EnquiryProductForm from './EnquiryProductForm';
import RNFS from 'react-native-fs';
// import {MaterialCommunityIcons} from '../../sharedBase/globalImport';
import {
  fileDownload,
  getIndustryByProductId,
} from '../../core/service/industries.service';
import {MaterialCommunityIcons} from '../../sharedBase/globalImport';

interface variantProduct {
  featureBenifit: string;
  id: string;
  image: string;
  name: string;
  slug: string;
  specifiaction: string;
}

interface productData {
  faqs: ProductFaq[];
  industri: Industrie[];
  mainProduct: Product[];
  product: Product[];
  variantProduct: variantProduct[];
}

const parseAndFormatImages = (imageData: string | null) => {
  if (!imageData) return [];
  try {
    const parsed = JSON.parse(imageData);

    const flat = Array.isArray(parsed) ? parsed.flat(Infinity) : [];

    return flat.map((img: CustomFile) => ({
      fileName: img.fileName,
      filePath: img.filePath.replace(/\\/g, '/'),
      type: img.type,
    }));
  } catch (error) {
    console.error('Failed to parse image data:', error);
    return [];
  }
};

const {width} = Dimensions.get('window');
const IS_TABLET = width >= 768;
const NUM_COLUMNS = IS_TABLET ? 2 : 1;
const FEATURE_COLUMNS = IS_TABLET ? 3 : 2;

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const safeParse = (value: any) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.warn('Invalid JSON:', value);
    return null;
  }
};

const ProductView = ({route}) => {
  const {slug, id} = route.params || {};
  const [productData, setProductData] = useState<productData>({});
  const [otherProductData, setOtherProductData] = useState<Product[]>([]);
  console.log(productData, 'product');
  const mainProduct = productData?.mainProduct?.[0] ?? null;
  // const productInfo = productData?.product?.[0] ?? null;
  const productIndustry = productData?.industri ?? null;
  const productVarient = productData?.variantProduct ?? null;
  const productFaqs = productData?.faqs ?? null;
  const [activeVariant, setActiveVariant] = useState(
    productData?.variantProduct?.[0] || null,
  );
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [enquiryFormOpen, setEnquiryFormOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState<CustomFile[]>(
    parseAndFormatImages(mainProduct?.brochure ?? null),
  );

  console.log(industries, 'industries');

  useEffect(() => {
    const fetchOtherProducts = async () => {
      const fetchOtherProductsData = await getAll();
      setOtherProductData(fetchOtherProductsData);
    };
    fetchOtherProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchProductsData = await getProductData({id, slug});
      setProductData(fetchProductsData);
    };
    fetchProducts();
  }, [id, slug]);

  useEffect(() => {
    setLoadingData(true);
    const preLoad = async () => {
      const productId = mainProduct?.id;
      const industriesData = await getIndustryByProductId(productId);
      console.log(productId, 'productId');
      setIndustries(industriesData);
      console.log(industriesData, 'industy data');
    };
    preLoad();
  }, [mainProduct]);

  useEffect(() => {
    setUploadedFiles(parseAndFormatImages(mainProduct?.brochure ?? null));
  }, [mainProduct]);

  const navigation = useNavigation<any>();

  const mainImageUrl = useMemo(
    () => getPhotoUrl(mainProduct?.image ?? ''),
    [mainProduct],
  );

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    mainImageUrl,
  );

  const thumbImages = useMemo(() => {
    const parsed: CustomFile[] = mainProduct?.image
      ? JSON.parse(mainProduct?.image)
      : [];
    return parsed.map(
      file => `${BASE_URL}/ImportFiles/${file.filePath.replace(/\\/g, '/')}`,
    );
  }, [mainProduct]);

  const parsedSpecs = safeParse(mainProduct?.specifiaction ?? '[]');
  const parsedFeatureBenifits = safeParse(mainProduct?.featureBenifit ?? '[]');

  useEffect(() => {
    setSelectedImage(mainImageUrl);
  }, [mainImageUrl]);

  const features = activeVariant?.featureBenifit
    ? JSON.parse(activeVariant.featureBenifit)
    : parsedFeatureBenifits ?? [];

  const specs = activeVariant?.specifiaction
    ? JSON.parse(activeVariant.specifiaction)
    : parsedSpecs ?? [];

  const otherProductsFilteredByActive = otherProductData?.filter(
    item => item.isActive === true,
  );
  const otherProductsData = otherProductsFilteredByActive.filter(
    product => product.id != mainProduct.id && product.isParent === true,
  );

  const similarProductsFilteredByActive = productData?.product?.filter(
    item => item.isActive === true,
  );

  const toggleAccordion = (id: string | number) => {
    LayoutAnimation.easeInEaseOut();
    setActiveId(prev => (prev === id ? null : id));
  };

  const downloadFile = async (file: CustomFile) => {
    try {
      const response = await fileDownload(file);
      if (!response) {
        throw new Error('Download function returned no data');
      }
      const base64Data = Buffer.from(response).toString('base64');
      const filePath = `${RNFS.DownloadDirectoryPath}/${file.fileName}`;
      await RNFS.writeFile(filePath, base64Data, 'base64');
      console.log('File downloaded at:', filePath);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
  const renderItem = ({item}: any) => {
    // const imageUrl = getPhotoUrl(item.image);

    return (
      <View style={styles.cardWrapper}>
        <ProductCard product={item} />
      </View>
    );
  };

  return (
    <>
      <ScrollView>
        <View style={styles.section}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} />
          </TouchableOpacity>
          <View style={styles.row}>
            <View style={styles.imageCol}>
              <View style={styles.imageCard}>
                <View style={styles.imageCenter}>
                  {mainImageUrl && (
                    <Image
                      source={{uri: selectedImage || mainImageUrl}}
                      style={styles.mainImage}
                      resizeMode="contain"
                    />
                  )}
                </View>

                {/* THUMBNAILS */}
                {thumbImages?.length > 1 && (
                  <FlatList
                    data={thumbImages}
                    horizontal
                    keyExtractor={(item, i) => `${item}-${i}`}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.thumbList}
                    renderItem={({item}) => (
                      <Pressable
                        onPress={() => setSelectedImage(item)}
                        style={[
                          styles.thumb,
                          selectedImage === item && styles.thumbActive,
                        ]}>
                        <Image
                          source={{uri: item}}
                          style={styles.thumbImg}
                          resizeMode="contain"
                        />
                      </Pressable>
                    )}
                  />
                )}
              </View>
            </View>

            {/* RIGHT – CONTENT */}
            <View style={styles.contentCol}>
              <Text style={styles.title}>{mainProduct?.name}</Text>

              <Text style={styles.description}>{mainProduct?.mainContent}</Text>

              {/* ACTIONS */}
              <View style={styles.actions}>
                <Pressable
                  style={styles.enquiryBtn}
                  onPress={() => setEnquiryFormOpen(true)}>
                  <Text style={styles.enquiryText}>Enquiry</Text>
                </Pressable>

                {/* {uploadedFiles?.length > 0 && ( */}
                <Pressable
                  style={styles.downloadBtn}
                  onPress={() => downloadFile(uploadedFiles[0])}>
                  <Ionicons name="document-text" size={18} color="#E5252A" />
                  <Text style={styles.downloadText}>Download Brochure</Text>
                </Pressable>
                {/* )} */}
              </View>

              {/* CONTACT */}
              <View style={styles.contact}>
                <Text style={styles.contactText}>
                  Any questions? Please feel free to reach us at{' '}
                  <Text style={styles.phone}>+91 22655 68555</Text>
                </Text>
                <View style={styles.divider} />
              </View>

              {/* RELATED INDUSTRIES */}
              {productIndustry?.length > 0 && (
                <View>
                  <Text style={styles.subTitle}>Related Industries</Text>

                  <FlatList
                    data={productIndustry}
                    numColumns={IS_TABLET ? 3 : 2}
                    key={IS_TABLET ? 't' : 'm'}
                    keyExtractor={item => String(item.id)}
                    columnWrapperStyle={{gap: 12}}
                    contentContainerStyle={{gap: 12}}
                    renderItem={({item}) => {
                      const img = getPhotoUrl(item.image);

                      return (
                        <Pressable
                          onPress={() =>
                            navigation.navigate('IndustriesView', {
                              slug: item.slug,
                              id: item.id,
                            })
                          }
                          style={styles.industryCard}>
                          {img ? (
                            <Image
                              source={{uri: img}}
                              style={styles.industryImg}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={styles.noImg}>
                              <Text>No Image</Text>
                            </View>
                          )}

                          <View style={styles.overlay} />
                          <Text style={styles.industryName}>{item.name}</Text>
                        </Pressable>
                      );
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          {productVarient?.length > 0 && (
            <FlatList
              data={productVarient}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={styles.variantList}
              renderItem={({item}) => {
                const isActive = activeVariant?.id === item.id;
                return (
                  <Pressable
                    onPress={() => setActiveVariant(item)}
                    style={[
                      styles.variantBtn,
                      isActive && styles.variantBtnActive,
                    ]}>
                    <Text
                      style={[
                        styles.variantText,
                        isActive && styles.variantTextActive,
                      ]}>
                      {item.name}
                    </Text>
                  </Pressable>
                );
              }}
            />
          )}

          {features.length > 0 && (
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Features & Benefits</Text>

              <FlatList
                data={features}
                key={FEATURE_COLUMNS}
                numColumns={FEATURE_COLUMNS}
                columnWrapperStyle={{gap: 16}}
                contentContainerStyle={{gap: 16}}
                keyExtractor={(_, i) => `feature-${i}`}
                renderItem={({item}) => {
                  const img = getPhotoUrl(item.photo);
                  return (
                    <View style={styles.featureCard}>
                      <View style={styles.featureIcon}>
                        {img && (
                          <Image
                            source={{uri: img}}
                            style={styles.featureImg}
                            resizeMode="contain"
                          />
                        )}
                      </View>

                      <Text style={styles.featureText}>{item.name}</Text>
                    </View>
                  );
                }}
              />
            </View>
          )}

          {specs.length > 0 && (
            <View style={styles.specSection}>
              <Text style={styles.sectionTitle}>Specification</Text>

              {specs.map((spec: any, i: number) => {
                const label = Object.keys(spec)[0];
                const value = spec[label];

                return (
                  <View key={i} style={styles.specRow}>
                    <View style={styles.specLabel}>
                      <Text style={styles.specLabelText}>{label}</Text>
                    </View>

                    <View style={styles.specValue}>
                      <Text style={styles.specValueText}>{value}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Similar Products</Text>

          <FlatList
            data={similarProductsFilteredByActive}
            key={NUM_COLUMNS} // important for layout recalculation
            numColumns={NUM_COLUMNS}
            renderItem={renderItem}
            keyExtractor={item => String(item.id)}
            columnWrapperStyle={NUM_COLUMNS > 1 ? styles.row : undefined}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {otherProductsData && otherProductsData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Other Products</Text>

            <FlatList
              data={otherProductsData}
              key={NUM_COLUMNS} // important for layout recalculation
              numColumns={NUM_COLUMNS}
              keyExtractor={item => String(item.id)}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={NUM_COLUMNS > 1 ? styles.row : undefined}
              contentContainerStyle={styles.grid}
              renderItem={({item}) => {
                const mainImageUrl = getPhotoUrl(item.image);

                return (
                  <View style={styles.cardWrapper}>
                    <OtherProductsCard
                      name={item.name ?? ''}
                      selectedImage={mainImageUrl ?? ''}
                      slug={item.slug ?? ''}
                      content={item.mainContent ?? ''}
                    />
                  </View>
                );
              }}
            />
          </View>
        )}

        {productFaqs && productFaqs?.length > 0 && (
          <View style={styles.container}>
            <Text style={styles.heading}>FAQ&apos;s</Text>

            {productFaqs?.map(item => {
              const isOpen = activeId === item.id;

              return (
                <View key={item.id} style={styles.accordionItem}>
                  <Pressable
                    onPress={() => toggleAccordion(item.id)}
                    style={styles.trigger}>
                    <Text style={styles.question}>{item.name}</Text>
                  </Pressable>

                  {isOpen && (
                    <View style={styles.content}>
                      <Text style={styles.answer}>
                        {item.answer ?? 'No answer available.'}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={enquiryFormOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {}}>
        {/* Overlay */}
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Enquiry Details</Text>

              <TouchableOpacity
                onPress={() => setEnquiryFormOpen(false)}
                style={styles.closeIcon}>
                {/* <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#475569"
                /> */}
              </TouchableOpacity>
            </View>

            {/* Scrollable Body */}
            <ScrollView
              style={styles.body}
              showsVerticalScrollIndicator
              indicatorStyle="default"
              contentContainerStyle={{paddingBottom: 20}}>
              <EnquiryProductForm
                setEnquiryFormOpen={setEnquiryFormOpen}
                products={productData?.mainProduct ?? []}
                industries={industries}
                loadingData={loadingData}
              />
            </ScrollView>

            {/* Footer */}
            {/* <View style={styles.footer}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.primaryButton}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setEnquiryFormOpen(false)}
                style={styles.primaryButton}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProductView;

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#F3F8FF',
    padding: IS_TABLET ? 40 : 16,
  },

  row: {
    flexDirection: IS_TABLET ? 'row' : 'column',
    gap: 24,
    marginTop: 20,
  },

  imageCol: {flex: 1},
  contentCol: {flex: 1},

  imageCard: {
    backgroundColor: '#002438',
    borderRadius: 12,
    padding: 16,
  },

  imageCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 320,
  },

  mainImage: {
    width: '80%',
    height: '80%',
  },

  thumbList: {
    paddingTop: 12,
    gap: 8,
  },

  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  thumbActive: {
    borderColor: '#0D6EFD',
  },

  thumbImg: {
    width: 40,
    height: 40,
  },

  title: {
    fontSize: IS_TABLET ? 28 : 22,
    fontWeight: '700',
    color: '#0D6EFD',
    marginBottom: 10,
  },

  description: {
    fontSize: IS_TABLET ? 15 : 13,
    color: '#374151',
    lineHeight: 22,
    textAlign: 'justify',
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
  },

  enquiryBtn: {
    backgroundColor: '#006699',
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 6,
    justifyContent: 'center',
  },

  enquiryText: {
    color: '#fff',
    fontWeight: '600',
  },

  downloadBtn: {
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
  },

  downloadText: {
    color: '#0D6EFD',
    fontWeight: '600',
  },

  contact: {marginBottom: 20},
  contactText: {color: '#374151', fontWeight: '600'},
  phone: {color: '#006699'},
  divider: {
    marginTop: 10,
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  subTitle: {
    fontSize: IS_TABLET ? 20 : 16,
    fontWeight: '700',
    color: '#0D6EFD',
    marginBottom: 12,
  },

  industryCard: {
    flex: 1,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },

  industryImg: {
    width: '100%',
    height: '100%',
  },

  noImg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  industryName: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  variantList: {
    paddingHorizontal: IS_TABLET ? 40 : 16,
    paddingVertical: 16,
    gap: 12,
  },

  variantBtn: {
    minWidth: IS_TABLET ? 180 : width * 0.38,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#EAF2FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },

  variantBtnActive: {
    backgroundColor: '#006699',
    borderColor: '#006699',
  },

  variantText: {
    fontSize: IS_TABLET ? 14 : 12,
    fontWeight: '600',
    color: '#0D6EFD',
  },

  variantTextActive: {
    color: '#fff',
  },

  /* FEATURES */
  featuresSection: {
    paddingHorizontal: IS_TABLET ? 40 : 16,
    paddingVertical: 24,
  },

  sectionTitle: {
    fontSize: IS_TABLET ? 24 : 18,
    fontWeight: '700',
    color: '#0D6EFD',
    marginBottom: 20,
  },

  featureCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    alignItems: 'center',
  },

  featureIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E9F4FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  featureImg: {
    width: 50,
    height: 50,
  },

  featureText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#0D6EFD',
    fontSize: IS_TABLET ? 14 : 13,
  },

  /* SPECS */
  specSection: {
    paddingHorizontal: IS_TABLET ? 40 : 16,
    paddingVertical: 24,
    backgroundColor: '#F3F8FF',
  },

  specRow: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: IS_TABLET ? 999 : 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: IS_TABLET ? 'row' : 'column',
    gap: 12,
  },

  specLabel: {
    backgroundColor: '#006699',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    minWidth: IS_TABLET ? '30%' : '100%',
  },

  specLabelText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: IS_TABLET ? 14 : 13,
  },

  specValue: {
    flex: 1,
    justifyContent: 'center',
  },

  specValueText: {
    fontSize: IS_TABLET ? 14 : 13,
    color: '#111827',
    fontWeight: '600',
    textAlign: IS_TABLET ? 'left' : 'center',
  },
  grid: {
    paddingBottom: 8,
  },

  cardWrapper: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 16,
  },
  accordionItem: {
    marginBottom: 12,
  },

  trigger: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  question: {
    fontSize: width * 0.038,
    fontWeight: '600',
    color: '#002438',
  },

  content: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderTopWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },

  answer: {
    fontSize: width * 0.034,
    color: '#666',
  },
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: '#eef5fb', // white-blue gradient replacement
  },

  heading: {
    fontSize: width * 0.055,
    fontWeight: '700',
    color: '#002438',
    marginBottom: 24,
  },

  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
    backgroundColor: '#eef8ff',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 10,
  },

  header: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeIcon: {
    position: 'absolute',
    right: 14,
    top: 14,
  },

  body: {
    paddingHorizontal: 18,
    paddingTop: 12,
    maxHeight: '70%',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#dbeafe',
  },

  primaryButton: {
    backgroundColor: '#0b6fae',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
