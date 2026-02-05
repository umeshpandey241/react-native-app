import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  // Linking,
  Alert,
  ScrollView,
  FlatList,
  // LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useEffect, useMemo, useState} from 'react';
import {getAll, getIndustrieData} from '../../core/service/industries.service';
import {Blog} from '../../core/model/blog';
import {IndustriFaq} from '../../core/model/industriFaq';
import {Industrie} from '../../core/model/industrie';
import {Product} from '../../core/model/product';
import {Testimonial} from '../../core/model/testimonial';
import {CustomFile, getPhotoUrl} from './IndustriesList';
import ProductCard from '../product/ProductCard';
import IndustriesCard from './IndustriesCard';
import BlogCard from '../blogs/BlogCard';
import TestimonialSection from '../home/TestimonialSection';
import EnquiryIndustrieForm from './EnquiryIndustrieForm';

import {
  MaterialCommunityIcons,
  useNavigation,
  useRoute,
} from '../../sharedBase/globalImport';

import {getProductByIndustryId} from '../../core/service/products.service';
import IndustryDownloadCaseForm from './IndustryDownloadCaseForm';

export function buildInfiniteSlides<T>(items: T[], visible = 3): T[] {
  if (items.length === 0) return [];
  if (items.length >= visible) return items;
  const result: T[] = [];
  while (result.length < visible * 4) {
    result.push(...items);
  }
  return result;
}

export const parseAndFormatImages = (imageData: string | null) => {
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

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface industrieData {
  blog: Blog[];
  faqs: IndustriFaq[];
  industrie: Industrie[];
  product: Product[];
  testimonial: Testimonial[];
}
const {width} = Dimensions.get('window');
const IS_TABLET = width >= 768;
const NUM_COLUMNS = IS_TABLET ? 2 : 1;

const IndustriesView = () => {
  const route = useRoute();
  const {slug, id}: any = route.params || {};
  const [openId] = useState<number | null>(null);
  const [industriesData, setIndustriesData] = React.useState<industrieData>();
  console.log('industry data', industriesData);
  const [industriesRelatedIndustrieData, setIndustriesRelatedIndustrieData] =
    useState<Industrie[]>([]);
  console.log(industriesRelatedIndustrieData, 'industriesRelated');
  const industrie = industriesData?.industrie?.[0] ?? null;
  const industry = industriesData?.industrie?.[0];
  const productsOfIndustry = industriesData?.product ?? null;
  const industryFaqs = industriesData?.faqs ?? null;
  const industryTestimonial = industriesData?.testimonial ?? null;
  const blogsData = industriesData?.blog ?? null;
  // const blogsDataCount = blogsData?.length ?? null;
  const [uploadedFiles, setUploadedFiles] = useState<CustomFile[]>(
    parseAndFormatImages(industrie?.brochure ?? null),
  );
  const [enquiryFormOpen, setEnquiryFormOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const [loadingData, setLoadingData] = useState(false);
  // console.log(setLoadingData);
  const navigation = useNavigation();

  const [caseFormOpen, setCaseFormOpen] = useState(false);
  // Ensure selectedCaseStudyData is always of type Industrie (or CaseStudy)
  const [selectedCaseStudyData, setSelectedCaseStudyData] =
    useState<Industrie | null>(null);

  //   ?.filter(item => item.isActive === true)
  //   .reverse();
  // const otherIndustries = otherIndustriesFilteredByActive?.filter(
  //   ind =>
  //     ind.id != industry?.id && ind.industrieType === industry?.industrieType,
  // );

  // const productIds = useMemo(
  //   () =>
  //     industry?.productId ? industry.productId.split(',').map(Number) : [],
  //   [industry?.productId],
  // );

  // const [uploadedFiles, setUploadedFiles] = useState<CustomFile[]>([]);

  // useEffect(() => {
  //   if (industry?.brochure) {
  //     setUploadedFiles(parseAndFormatImages(industry.brochure));
  //   }
  // }, [industry]);

  useEffect(() => {
    // Fetch industries data
    const fetchIndustries = async () => {
      const ourIndustrieData = await getIndustrieData({id, slug});
      setIndustriesData(ourIndustrieData);
    };
    fetchIndustries();

    const fetchIndustriesRelated = async () => {
      const ourIndustrieRelatedData = await getAll();
      setIndustriesRelatedIndustrieData(ourIndustrieRelatedData);
    };
    fetchIndustriesRelated();
  }, [slug, id]);

  useEffect(() => {
    setUploadedFiles(parseAndFormatImages(industrie?.brochure ?? null));
  }, [industrie]);

  useEffect(() => {
    if (!industrie?.id) return;

    setLoadingData(true);
    const preLoad = async () => {
      try {
        const [productData] = await Promise.all([
          getProductByIndustryId(industrie.id ?? 0),
        ]);
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching dropdown data', error);
      } finally {
        setLoadingData(false);
      }
    };

    preLoad();
  }, [industrie]);

  const mainImageUrl = useMemo(
    () => getPhotoUrl(industrie?.filtrationProcess),
    [industrie],
  );
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    mainImageUrl,
  );

  useEffect(() => {
    setSelectedImage(mainImageUrl);
  }, [mainImageUrl]);

  const otherIndustriesFilteredByActive = industriesRelatedIndustrieData
    ?.filter(item => item.isActive === true)
    .reverse();

  const relatedProductsFilteredByActive = productsOfIndustry?.filter(
    item => item.isActive === true,
  );

  const renderItem = ({item}: any) => {
    return <ProductCard product={item} />;
  };

  const renderOtherItem = ({item}: any) => {
    const imageUrl = getPhotoUrl(item.image);

    return (
      <View style={styles.cardWrapper}>
        <IndustriesCard
          name={item.name ?? ''}
          image={imageUrl || ''}
          slug={item.slug ?? ''}
        />
      </View>
    );
  };

  const renderBlogItem = ({item}: any) => {
    const imageUrl = getPhotoUrl(item.image);

    return (
      <View style={styles.cardWrapper}>
        <BlogCard
          name={item.name ?? ''}
          image={imageUrl || ''}
          slug={item.slug ?? ''}
          tags={item.tags ?? ''}
          shortDescription={item.shortDescription ?? ''}
        />
      </View>
    );
  };
  return (
    <>
      <ScrollView>
        <View style={styles.wrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} />
          </TouchableOpacity>
          {/* HEADER ROW */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{industry?.name}</Text>

            <View style={styles.actions}>
              {/* Enquiry */}
              <Pressable
                style={styles.enquiryBtn}
                onPress={() => setEnquiryFormOpen(true)}>
                <Text style={styles.enquiryText}>Enquiry</Text>
              </Pressable>

              {/* Download Brochure */}

              <Pressable
                style={styles.downloadBtn}
                onPress={() => {
                  setCaseFormOpen(true);
                  setSelectedCaseStudyData(industry ?? null);
                }}>
                {/* <Pressable style={styles.downloadBtn}> */}
                {/* <Ionicons name="document-text" size={20} color="#E5252A" /> */}
                <Text style={styles.downloadText}>Download Brochure</Text>
              </Pressable>
            </View>
          </View>

          {/* CONTENT */}
          <Text style={styles.primaryText}>{industry?.mainContent}</Text>

          <Text style={styles.secondaryText}>{industry?.para2}</Text>

          {/* FILTRATION IMAGE */}
          <View style={styles.processSection}>
            <Text style={styles.subTitle}>
              NIRAN&apos;s Solutions for the {industrie?.name || ''} Filtration
              Process
            </Text>

            {selectedImage ? (
              <View style={styles.imageWrapper}>
                <Image
                  source={{uri: selectedImage}}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            ) : null}

            <Text style={styles.secondaryText}>{industrie?.para3}</Text>
          </View>
        </View>

        {relatedProductsFilteredByActive &&
          relatedProductsFilteredByActive.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.title}>Related Products</Text>

              <FlatList
                data={relatedProductsFilteredByActive}
                key={NUM_COLUMNS}
                keyExtractor={item => String(item.id)}
                renderItem={renderItem}
                numColumns={NUM_COLUMNS}
                columnWrapperStyle={NUM_COLUMNS > 1 ? styles.row : undefined}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

        {otherIndustriesFilteredByActive &&
          otherIndustriesFilteredByActive.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.title}>Other Industries</Text>

              <FlatList
                data={otherIndustriesFilteredByActive}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={renderOtherItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.list}
              />
            </View>
          )}

        {blogsData && blogsData?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Blogs</Text>

            <FlatList
              data={blogsData}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={renderBlogItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          </View>
        )}

        {industryFaqs && industryFaqs?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>FAQ&apos;s</Text>

            {industryFaqs?.map(item => {
              const isOpen = openId === item.id;

              return (
                <View key={item.id} style={styles.itemWrapper}>
                  <Pressable
                    onPress={() => toggle(item.id)}
                    style={styles.question}>
                    <Text style={styles.questionText}>{item.name}</Text>
                    <Text style={styles.icon}>{isOpen ? '−' : '+'}</Text>
                  </Pressable>

                  {isOpen && (
                    <View style={styles.answerWrapper}>
                      <Text style={styles.answerText}>
                        {item.answer || 'No answer available.'}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {industryTestimonial && industryTestimonial.length > 0 && (
          <View style={styles.testimonialWrapper}>
            <TestimonialSection testimonialData={industryTestimonial} />
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
              <EnquiryIndustrieForm
                setEnquiryFormOpen={setEnquiryFormOpen}
                products={products}
                industrieData={industriesData?.industrie ?? []}
                loadingData={loadingData}
              />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              {/* <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.primaryButton}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
     */}
              <TouchableOpacity
                onPress={() => setEnquiryFormOpen(false)}
                style={styles.primaryButton}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={caseFormOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {}} // disables back button close (Android)
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.overlay}>
          {/* Backdrop */}
          <View style={styles.backdrop} />

          {/* Dialog */}
          <View style={styles.dialog}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Product Brochure</Text>
            </View>

            {/* Body */}
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}>
              <IndustryDownloadCaseForm
                setCaseFormOpen={setCaseFormOpen}
                selectedCaseStudyData={
                  selectedCaseStudyData || (industry as any)
                }
              />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <Pressable
                onPress={() => setCaseFormOpen(false)}
                style={styles.button}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>

              {/* <Pressable
                      onPress={() => {
                        // trigger submit inside form
                        // usually passed via prop or ref
                      }}
                      style={styles.button}>
                      <Text style={styles.buttonText}>Submit</Text>
                    </Pressable> */}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F3F8FF', // blue-white gradient substitute
    paddingVertical: IS_TABLET ? 48 : 32,
  },
  testimonialWrapper: {
    backgroundColor: '#F5F9FF', // white-blue gradient substitute
  },

  /* HEADER */
  headerRow: {
    paddingHorizontal: IS_TABLET ? 48 : 16,
    flexDirection: IS_TABLET ? 'row' : 'column',
    alignItems: IS_TABLET ? 'center' : 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: IS_TABLET ? 32 : 22,
    fontWeight: '700',
    color: '#0D6EFD',
  },
  button: {
    backgroundColor: '#006da8', // var(--color-tertiary)
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  itemWrapper: {
    marginBottom: 12,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  dialog: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#f0f6fb', // var(--color-primary-light)
    borderRadius: 16,
    overflow: 'hidden',
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  enquiryBtn: {
    backgroundColor: '#006699',
    height: 40,
    paddingHorizontal: 24,
    borderRadius: 6,
    justifyContent: 'center',
  },
  enquiryText: {
    color: '#fff',
    fontWeight: '600',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  downloadText: {
    color: '#0D6EFD',
    fontWeight: '600',
    fontSize: 14,
  },

  /* TEXT */
  primaryText: {
    paddingHorizontal: IS_TABLET ? 48 : 16,
    fontSize: IS_TABLET ? 16 : 14,
    fontWeight: '700',
    color: '#0D6EFD',
    marginBottom: 12,
    textAlign: 'justify',
  },
  secondaryText: {
    paddingHorizontal: IS_TABLET ? 48 : 16,
    fontSize: IS_TABLET ? 15 : 13,
    fontWeight: '500',
    color: '#111',
    lineHeight: 22,
    textAlign: 'justify',
  },

  /* PROCESS */
  processSection: {
    paddingTop: IS_TABLET ? 32 : 24,
  },
  subTitle: {
    paddingHorizontal: IS_TABLET ? 48 : 16,
    fontSize: IS_TABLET ? 24 : 18,
    fontWeight: '700',
    color: '#0D6EFD',
    marginBottom: 16,
  },
  imageWrapper: {
    marginHorizontal: IS_TABLET ? 48 : 16,
    marginBottom: 20,
    minHeight: IS_TABLET ? 450 : 300,
    maxHeight: 500,
    borderRadius: 8,
    backgroundColor: '#EEF2F7',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  section: {
    backgroundColor: '#F5F9FF', // white-blue gradient substitute
    paddingVertical: IS_TABLET ? 56 : 40,
    paddingHorizontal: IS_TABLET ? 48 : 16,
  },

  grid: {
    paddingBottom: 8,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  cardWrapper: {
    flex: 1,
    marginHorizontal: 6,
  },
  list: {
    paddingHorizontal: IS_TABLET ? 48 : 16,
  },
  question: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  questionText: {
    flex: 1,
    fontSize: IS_TABLET ? 16 : 14,
    fontWeight: '600',
    color: '#0D6EFD',
    paddingRight: 10,
  },

  icon: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0D6EFD',
  },

  answerWrapper: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderTopWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },

  answerText: {
    fontSize: IS_TABLET ? 15 : 13,
    color: '#6B7280',
    lineHeight: 22,
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

  description: {
    fontSize: IS_TABLET ? 15 : 13,
    color: '#374151',
    lineHeight: 22,
    textAlign: 'justify',
  },

  contact: {marginBottom: 20},
  contactText: {color: '#374151', fontWeight: '600'},
  phone: {color: '#006699'},
  divider: {
    marginTop: 10,
    height: 1,
    backgroundColor: '#E5E7EB',
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

export default IndustriesView;
