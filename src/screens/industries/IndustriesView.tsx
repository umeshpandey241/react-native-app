import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  Linking,
  ScrollView,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface industrieData {
  // id(id: any): unknown;
  slug: any;
  blog: Blog[];
  faqs: IndustriFaq[];
  industrie: Industrie[];
  product: Product[];
  testimonial: Testimonial[];
}
const {width} = Dimensions.get('window');
const IS_TABLET = width >= 768;
const NUM_COLUMNS = IS_TABLET ? 2 : 1;

const IndustriesView = ({route}) => {
  const {slug, id} = route.params || {};
  const [openId, setOpenId] = useState<number | null>(null);

  const [industriesData, setIndustriesData] = React.useState<industrieData[]>(
    [],
  );
  const [industriesRelatedIndustrieData, setIndustriesRelatedIndustrieData] =
    useState<industrieData | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [enquiryFormOpen, setEnquiryFormOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // const industrie = industriesData[0] ?? null;
  const industry = useMemo(() => {
    if (!slug) return null;
    return industriesData.find(i => i.slug === slug) ?? null;
  }, [industriesData, slug]);

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
      const ourIndustrieData = await getAll();
      setIndustriesData(ourIndustrieData);
    };
    fetchIndustries();

    const fetchIndustriesRelated = async () => {
      const ourIndustrieRelatedData = await getIndustrieData({id, slug});
      setIndustriesRelatedIndustrieData(ourIndustrieRelatedData);
    };
    fetchIndustriesRelated();
  }, [slug, id]);

  const mainImageUrl = useMemo(
    () => getPhotoUrl(industry?.image),
    [industry?.image],
  );

  useEffect(() => {
    setSelectedImage(mainImageUrl);
  }, [mainImageUrl]);

  const products = useMemo(() => {
    return Array.isArray(industriesRelatedIndustrieData?.product)
      ? industriesRelatedIndustrieData.product
      : [];
  }, [industriesRelatedIndustrieData]);

  const industries = useMemo(() => {
    return Array.isArray(industriesRelatedIndustrieData?.industrie)
      ? industriesRelatedIndustrieData.industrie
      : [];
  }, [industriesRelatedIndustrieData]);

  const blogs = useMemo(() => {
    return Array.isArray(industriesRelatedIndustrieData?.blog)
      ? industriesRelatedIndustrieData.blog
      : [];
  }, [industriesRelatedIndustrieData]);

  const faqs = useMemo(() => {
    return Array.isArray(industriesRelatedIndustrieData?.faqs)
      ? industriesRelatedIndustrieData.faqs
      : [];
  }, [industriesRelatedIndustrieData]);

  const relatedProductsFilteredByActive = useMemo(() => {
    if (!industry?.id) return [];

    return products.filter(product => {
      if (!product.isActive) return false;

      const industryIds = product.industrieId
        ?.split(',')
        .map(id => Number(id.trim()));

      return industryIds?.includes(industry.id);
    });
  }, [products, industry?.id]);

  const otherIndustriesFilteredByActive = useMemo(() => {
    if (!industry) {
      return [];
    }

    return industries
      .filter(item => {
        return (
          item.isActive === true &&
          item.id !== industry?.id &&
          item.industrieType === industry?.industrieType
        );
      })
      .reverse(); // optional: latest first
  }, [industries, industry]);

  const blogsData = useMemo(() => {
    if (!industry?.blogId) {
      return [];
    }

    const blogIds = industry.blogId.split(',').map(id => Number(id.trim()));

    return blogs.filter(blog => {
      return blog.isActive === true && blogIds.includes(blog.id);
    });
  }, [blogs, industry?.blogId]);

  const industryFaqs = useMemo(() => {
    return faqs.filter(faq => faq.isActive !== false);
  }, [faqs]);

  const industryTestimonials = useMemo(() => {
    if (!industry?.industriTestimonialId) {
      return [];
    }

    const testimonialIds = industry.industriTestimonialId
      .split(',')
      .map(id => Number(id.trim()));

    const testimonials = Array.isArray(
      industriesRelatedIndustrieData?.testimonial,
    )
      ? industriesRelatedIndustrieData.testimonial
      : [];

    return testimonials.filter(
      t => t.isActive !== false && testimonialIds.includes(t.id),
    );
  }, [industry?.industriTestimonialId, industriesRelatedIndustrieData]);

  const toggle = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId(prev => (prev === id ? null : id));
  };

  const renderItem = ({item}: any) => {
    // const mainImageUrl = getPhotoUrl(item.image);

    return (
      <View style={styles.cardWrapper}>
        <ProductCard product={item} />
      </View>
    );
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
              {/* {uploadedFiles && uploadedFiles.length > 0 && (
              // <Pressable
              //   style={styles.downloadBtn}
              //   onPress={() => onDownload?.(uploadedFiles[0])}>
              <Pressable style={styles.downloadBtn}>
                <Ionicons name="document-text" size={20} color="#E5252A" />
                <Text style={styles.downloadText}>Download Brochure</Text>
              </Pressable>
            )} */}
            </View>
          </View>

          {/* CONTENT */}
          <Text style={styles.primaryText}>{industry?.mainContent}</Text>

          <Text style={styles.secondaryText}>{industry?.para2}</Text>

          {/* FILTRATION IMAGE */}
          <View style={styles.processSection}>
            <Text style={styles.subTitle}>
              NIRAN&apos;s Solutions for the {industry?.name} Filtration Process
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

            <Text style={styles.secondaryText}>{industry?.para3}</Text>
          </View>
        </View>

        {relatedProductsFilteredByActive.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Related Products</Text>

            <FlatList
              data={relatedProductsFilteredByActive}
              key={NUM_COLUMNS} // forces re-render on column change
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
            {/* TITLE */}
            <Text style={styles.title}>Blogs</Text>

            {/* HORIZONTAL LIST */}
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

            {faqs.map(item => {
              const isOpen = openId === item.id;

              return (
                <View key={item.id} style={styles.itemWrapper}>
                  {/* QUESTION */}
                  <Pressable
                    onPress={() => toggle(item.id)}
                    style={styles.question}>
                    <Text style={styles.questionText}>{item.name}</Text>
                    <Text style={styles.icon}>{isOpen ? '−' : '+'}</Text>
                  </Pressable>

                  {/* ANSWER */}
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

        {industryTestimonials.length > 0 && (
          <View style={styles.testimonialWrapper}>
            <TestimonialSection testimonialData={industryTestimonials} />
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
  itemWrapper: {
    marginBottom: 12,
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
