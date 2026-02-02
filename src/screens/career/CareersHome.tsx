import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  // ImageBackground,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {JobVacancy} from '../../core/model/jobVacancy';
import {JobCategory} from '../../core/model/jobCategory';
import {Gallery} from '../../core/model/gallery';
import {OurVideo} from '../../core/model/ourVideo';
import {getAll} from '../../core/service/jobVacancies.service';
import {getAll as getAllCategories} from '../../core/service/jobCategories.service';
import {getAll as getAllGalleries} from '../../core/service/galleries.service';
import {getAll as getAllVideo} from '../../core/service/ourVideos.service';
import ImageCarousel from './ImageCarousel';
import VideoCard from './VideoCard';
import Header from '../../components/Header';
import ApplyPostForm from './ApplyPostForm';
import JobRequestForm from './JobRequestForm';
import LinearGradient from 'react-native-linear-gradient';
// import {currentOpenings} from '../../assets/images/mission.jpg';

const CareersHome = () => {
  const [jobVacanciesData, setJobVacanciesData] = useState<JobVacancy[]>([]);
  const [jobCategoriesData, setJobCategoriesData] = useState<JobCategory[]>([]);
  const [galleryData, setGalleryData] = useState<Gallery[]>([]);
  const [ourVideosData, setOurVideosData] = useState<OurVideo[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [postData, setPostData] = useState<JobVacancy>({});
  const [applyPostForm, setApplyPostForm] = useState(false);
  const galleriesData = galleryData ?? null;
  const listRef = useRef<FlatList>(null);
  const ITEM_WIDTH = 280 + 16;
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  console.log(setCurrentOffset);
  const [requestFormOpen, setRequestFormOpen] = useState(false);

  useEffect(() => {
    const fetchJobVacancies = async () => {
      const fetchJobVacanciesData = await getAll();
      // console.log('fetchJobVacanciesData', fetchJobVacanciesData);
      setJobVacanciesData(fetchJobVacanciesData);
    };
    fetchJobVacancies();
  }, []);

  useEffect(() => {
    const fetchJobCategories = async () => {
      const fetchJobCategoriesData = await getAllCategories();
      // console.log('fetchJobCategoriesData', fetchJobCategoriesData);
      setJobCategoriesData(fetchJobCategoriesData);
    };
    fetchJobCategories();
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      const fetchGalleryData = await getAllGalleries();
      // console.log('fetchGallery', fetchGalleryData);
      setGalleryData(fetchGalleryData);
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    const fetchOurVideos = async () => {
      const fetchOurVideosData = await getAllVideo();
      // console.log('fetchOurVideosData', fetchOurVideosData);
      setOurVideosData(fetchOurVideosData);
    };
    fetchOurVideos();
  }, []);

  const normalize = (val?: string) =>
    val ? val.replace(/\s+/g, ' ').trim().toLowerCase() : '';

  const filterJobVacanciesData = useMemo(() => {
    if (activeTab === 'All' || !activeTab) return jobVacanciesData;
    const active = normalize(activeTab);
    return jobVacanciesData?.filter(
      item => normalize(item.jobCategoryIdName) === active,
    );
  }, [jobVacanciesData, activeTab]);

  const activeOurVideosData = ourVideosData?.filter(
    item => item.isActive === true,
  );
  const hideList = ['home', 'aboutus'];
  const videoData = activeOurVideosData?.filter(
    item => !hideList.includes(item?.name?.toLowerCase() || ''),
  );

  const scrollNext = () => {
    listRef.current?.scrollToOffset({
      offset: currentOffset + ITEM_WIDTH,
      animated: true,
    });
  };

  const scrollPrev = () => {
    listRef.current?.scrollToOffset({
      offset: Math.max(currentOffset - ITEM_WIDTH, 0),
      animated: true,
    });
  };

  // const renderItem = ({item}) => (
  //   <View style={styles.cardWrapper}>
  //     <View style={styles.card}>
  //       <View style={styles.cardContent}>
  //         <View style={styles.categoryRow}>
  //           <View style={styles.categoryIcon}>
  //             <Text style={styles.iconText}>⚗️</Text>
  //           </View>
  //           <Text style={styles.categoryText}>{item.jobCategoryIdName}</Text>
  //         </View>

  //         <Text style={styles.title}>{item.name}</Text>
  //         <View style={styles.metaRow}>
  //           <View style={styles.metaItem}>
  //             <Text>📍</Text>
  //             <Text style={styles.metaText}>{item.location}</Text>
  //           </View>

  //           <View style={styles.metaItem}>
  //             <Text>⏱</Text>
  //             <Text style={styles.metaText}>Full Time</Text>
  //           </View>
  //         </View>

  //         <View style={styles.divider} />

  //         <View style={styles.requirements}>
  //           <Text style={styles.requirement}>
  //             ✔ {item.experience} Experience Required
  //           </Text>
  //           <Text style={styles.requirement}>
  //             ✔ {item.qualification} Qualification Required
  //           </Text>
  //         </View>

  //         <TouchableOpacity
  //           style={styles.applyBtn}
  //           onPress={() => {
  //             setApplyPostForm(true);
  //             setPostData(item);
  //             console.log('Pressed');
  //           }}>
  //           <Text style={styles.applyText}>Apply Now</Text>
  //           <Text style={styles.applyArrow}>↗</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   </View>
  // );

  return (
    <>
      <Header Heading="Career" />
      <ScrollView>
        <View style={styles.section}>
          <View style={styles.innerContainer}>
            <View style={styles.container}>
              <Text style={styles.badge}>JOB OPPORTUNITIES</Text>
              <Text style={styles.title}>Current Openings</Text>
              <Text style={styles.description}>
                Join an innovative team committed to advancing filtration
                technology and making a difference in global safety and quality.
              </Text>
            </View>

            <View style={styles.wrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>
                {/* All */}
                <TouchableOpacity
                  onPress={() => setActiveTab('All')}
                  style={[
                    styles.tab,
                    activeTab === 'All' ? styles.activeTab : styles.inactiveTab,
                  ]}>
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'All' && styles.activeTabText,
                    ]}>
                    All
                  </Text>
                </TouchableOpacity>

                {/* Dynamic Categories */}
                {jobCategoriesData?.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => setActiveTab(category.name ?? '')}
                    style={[
                      styles.tab,
                      activeTab === category.name
                        ? styles.activeTab
                        : styles.inactiveTab,
                    ]}>
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === category.name && styles.activeTabText,
                      ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.grid}>
              {filterJobVacanciesData.map((item, index) => (
                <View key={index} style={styles.cardWrapper}>
                  <View style={styles.card}>
                    <View style={styles.cardContent}>
                      {/* Category */}
                      <View style={styles.categoryRow}>
                        <View style={styles.categoryIcon}>
                          <Text style={styles.iconText}>⚗️</Text>
                        </View>
                        <Text style={styles.categoryText}>
                          {item.jobCategoryIdName}
                        </Text>
                      </View>

                      {/* Title */}
                      <Text style={styles.title} numberOfLines={3}>
                        {item.name}
                      </Text>

                      {/* Meta */}
                      <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                          <Text>📍</Text>
                          <Text style={styles.metaText}>{item.location}</Text>
                        </View>

                        <View style={styles.metaItem}>
                          <Text>⏱</Text>
                          <Text style={styles.metaText}>Full Time</Text>
                        </View>
                      </View>

                      <View style={styles.divider} />

                      {/* Requirements */}
                      <View style={styles.requirements}>
                        <Text style={styles.requirement}>
                          ✔ {item.experience} Experience Required
                        </Text>
                        <Text style={styles.requirement}>
                          ✔ {item.qualification} Qualification Required
                        </Text>
                      </View>

                      {/* Button */}
                      <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={() => {
                          setApplyPostForm(true);
                          setPostData(item);
                        }}>
                        <Text style={styles.applyText}>Apply Now</Text>
                        <Text style={styles.applyArrow}>↗</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section1}>
              <LinearGradient
                colors={['#0565A8', '#0B84D2']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.card}>
                {/* Content */}
                <View style={styles.content1}>
                  <Text style={styles.title1}>
                    Didn’t find a match in our current openings?
                  </Text>

                  <Text style={styles.description1}>
                    Submit your resume and let us know your interests. We’ll
                    contact you when a suitable position becomes available — so
                    you never miss an opportunity to join our team.
                  </Text>
                </View>

                {/* CTA */}
                <TouchableOpacity
                  style={styles.ctaButton1}
                  onPress={() => setRequestFormOpen(true)}
                  activeOpacity={0.85}>
                  {/* <View style={styles.ctaIconCircle}> */}
                  <View style={styles.ctaIconCircle}>
                    <Text style={styles.ctaIcon1}>↗</Text>
                  </View>
                  <Text style={styles.ctaText1}>Apply Now</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.innerContainer}>
            <Text style={styles.badge}>CAREERS AT NIRAN</Text>
            <Text style={styles.title}>Work With Us</Text>
            <Text style={styles.description}>
              Join an innovative team committed to advancing filtration
              technology and making a difference in global safety and quality.
            </Text>
          </View>
        </View>

        {galleriesData && galleriesData?.length > 0 && (
          <ImageCarousel images={galleriesData} />
        )}

        {videoData && videoData?.length > 0 && (
          <View style={styles.wrapper}>
            <TouchableOpacity
              style={[styles.arrowBtn, styles.left]}
              onPress={scrollPrev}
              accessibilityLabel="Previous Slide">
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>

            <FlatList
              ref={listRef}
              data={videoData}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.list}
              renderItem={({item}) => (
                <View style={styles.item}>
                  <VideoCard
                    video={item}
                    isPlaying={activeVideoId === item.id}
                    onPlay={() => setActiveVideoId(item.id ?? null)}
                  />
                </View>
              )}
            />
            <TouchableOpacity
              style={[styles.arrowBtn, styles.right]}
              onPress={scrollNext}
              accessibilityLabel="Next Slide">
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <Modal
        visible={applyPostForm}
        animationType="slide"
        transparent
        onRequestClose={() => setApplyPostForm(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* HEADER (FIXED) */}
            <View style={styles.modalHeader}>
              <View style={styles.headerTop}>
                <View style={styles.headerIcon}>
                  <Text style={{color: '#fff'}}>⚗️</Text>
                </View>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setApplyPostForm(false)}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalTitle}>{postData.name}</Text>

              <View style={styles.headerMeta}>
                <Text style={styles.headerMetaText}>
                  📍 {postData.location}
                </Text>
                <Text style={styles.headerMetaText}>⏱ Full Time</Text>
              </View>
            </View>

            {/* SCROLLABLE CONTENT */}
            <ScrollView
              style={styles.scrollContent}
              contentContainerStyle={{paddingBottom: 40}}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {/* JOB DETAILS */}
              <DetailRow label="Experience" value={postData.experience} />
              <DetailRow label="Location" value={postData.location} />
              <DetailRow label="Qualification" value={postData.qualification} />
              <DetailRow
                label="Responsibilities"
                value={postData.responsibilities}
              />
              <DetailRow
                label="Knowledge Required"
                value={postData.knowledgeRequired}
              />
              <DetailRow
                label="Skills Required"
                value={postData.skillRequired}
              />

              {/* APPLY FORM */}
              <View style={styles.formSection}>
                <ApplyPostForm
                  postData={postData}
                  setApplyPostForm={setApplyPostForm}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={requestFormOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setRequestFormOpen(false)}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={() => setRequestFormOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        {/* Centered Modal */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            {/* HEADER (fixed) */}
            <View style={styles.header}>
              <Text style={styles.title}>
                Submit Your Resume For Future Opportunities
              </Text>
            </View>

            <ScrollView
              style={styles.formSection}
              contentContainerStyle={styles.bodyContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled">
              <JobRequestForm setRequestFormOpen={setRequestFormOpen} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const DetailRow = ({label, value}: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default CareersHome;

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1, // 🔥 MOST IMPORTANT
  },
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 16,
  },
  section: {
    width: '100%',
    paddingVertical: 32,
    backgroundColor: '#eef6ff',
  },
  header: {
    marginBottom: 48,
    alignItems: 'flex-start',
  },
  innerContainer: {
    paddingHorizontal: 16,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 48,
  },

  badge: {
    alignSelf: 'flex-start', // mx-0
    textTransform: 'uppercase',
    backgroundColor: '#0B5ED7',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e3a8a',
    marginVertical: 8,
  },
  iconText: {},

  description: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e3a8a',
    maxWidth: '100%',
    lineHeight: 22,
  },
  wrapper: {
    marginBottom: 40,
    paddingBottom: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  inactiveTab: {
    backgroundColor: '#eef2ff',
    borderColor: '#e5e7eb',
  },
  bodyContent: {
    padding: 16,
    paddingBottom: 24,
  },
  activeTab: {
    backgroundColor: '#0B5ED7',
    borderColor: '#6366f1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#1e3a8a',
  },
  activeTabText: {
    color: '#ffffff',
  },

  emptyText: {
    textAlign: 'center',
    paddingVertical: 40,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyBold: {
    fontWeight: '600',
    color: '#000',
  },
  image: {
    borderRadius: 24,
  },
  content: {
    zIndex: 2,
  },

  ctaButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 2,
    alignSelf: 'flex-start',
    elevation: 4,
  },
  ctaIcon: {
    fontSize: 26,
    backgroundColor: '#0B5ED7',
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },

  list: {
    paddingHorizontal: 16,
    gap: 16,
  },

  item: {
    width: 280, // card width
  },

  arrowBtn: {
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
    color: '#005b83',
    fontWeight: '600',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  iconWrap: {
    backgroundColor: '#3b82f6',
    padding: 6,
    borderRadius: 20,
  },

  category: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },

  jobTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },

  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
  },

  body: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    maxHeight: '80%',
  },

  details: {
    flex: 1,
    padding: 16,
  },

  form: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxHeight: '95%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },

  modalHeader: {
    backgroundColor: '#0b5f8a',
    padding: 16,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 6,
    borderRadius: 20,
  },

  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },

  headerMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 6,
  },

  headerMetaText: {
    color: '#e5f3ff',
    fontSize: 13,
  },

  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  scrollContent: {
    padding: 12,
  },

  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },

  label: {
    width: '40%',
    backgroundColor: '#f8fafc',
    padding: 10,
    fontWeight: '600',
    fontSize: 13,
    color: '#1e3a8a',
  },

  value: {
    width: '60%',
    padding: 10,
    fontSize: 13,
    color: '#1e3a8a',
  },

  formSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },

  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 6,
  },

  inputBox: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  inputPlaceholder: {
    color: '#94a3b8',
    fontSize: 13,
  },
  modalWrapper: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: '5%',
  },

  modalContainer: {
    backgroundColor: '#eaf4ff', // var(--color-primary-light)
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '80%',
  },

  footer: {
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    backgroundColor: '#eaf4ff',
  },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#005b83', // var(--color-tertiary)
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },

  cardContent: {
    padding: 16,
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  categoryIcon: {
    backgroundColor: '#EAF2FF',
    padding: 6,
    borderRadius: 20,
    marginRight: 8,
  },

  categoryText: {
    fontWeight: '600',
    color: '#1F3C88',
  },

  // title: {
  //   fontSize: 16,
  //   fontWeight: '700',
  //   marginVertical: 6,
  //   color: '#0A2540',
  // },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    fontSize: 12,
    color: '#555',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },

  requirements: {
    gap: 6,
  },

  requirement: {
    fontSize: 12,
    color: '#333',
  },

  applyBtn: {
    backgroundColor: '#0B5ED7',
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },

  applyText: {
    color: '#fff',
    fontWeight: '600',
  },

  applyArrow: {
    color: '#fff',
  },
  section1: {
    paddingHorizontal: 16,
    marginVertical: 24,
  },

  card1: {
    borderRadius: 24,
    padding: 24,
    minHeight: 300,
    justifyContent: 'space-between',
  },

  content1: {
    gap: 12,
  },

  title1: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 28,
  },

  description1: {
    fontSize: 14,
    color: '#EAF6FF',
    lineHeight: 20,
  },

  ctaButton1: {
    alignItems: 'center',
    gap: 8,
  },

  ctaIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

  ctaIcon1: {
    fontSize: 26,
    color: '#0B84D2',
    fontWeight: '700',
  },

  ctaText1: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
