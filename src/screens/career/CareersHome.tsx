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
// import LinearGradient from 'react-native-linear-gradient';
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
  const [requestFormOpen, setRequestFormOpen] = useState(false);

  useEffect(() => {
    const fetchJobVacancies = async () => {
      const fetchJobVacanciesData = await getAll();
      console.log('fetchJobVacanciesData', fetchJobVacanciesData);
      setJobVacanciesData(fetchJobVacanciesData);
    };
    fetchJobVacancies();
  }, []);

  useEffect(() => {
    const fetchJobCategories = async () => {
      const fetchJobCategoriesData = await getAllCategories();
      console.log('fetchJobCategoriesData', fetchJobCategoriesData);
      setJobCategoriesData(fetchJobCategoriesData);
    };
    fetchJobCategories();
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      const fetchGalleryData = await getAllGalleries();
      console.log('fetchGallery', fetchGalleryData);
      setGalleryData(fetchGalleryData);
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    const fetchOurVideos = async () => {
      const fetchOurVideosData = await getAllVideo();
      console.log('fetchOurVideosData', fetchOurVideosData);
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

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.categoryRow}>
          <View style={styles.categoryIcon}>
            <Text style={styles.iconText}>⚗️</Text>
          </View>
          <Text style={styles.categoryText}>{item.jobCategoryIdName}</Text>
        </View>

        <Text style={styles.title}>{item.name}</Text>
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

        <View style={styles.requirements}>
          <Text style={styles.requirement}>
            ✔ {item.experience} Experience Required
          </Text>
          <Text style={styles.requirement}>
            ✔ {item.qualification} Qualification Required
          </Text>
        </View>

        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => {
            setApplyPostForm(true);
            setPostData(item);
            console.log('Pressed');
          }}>
          <Text style={styles.applyText}>Apply Now</Text>
          <Text style={styles.applyArrow}>↗</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

            <View>
              <FlatList
                data={filterJobVacanciesData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2} // 📱 change to 1 for small screens if needed
                columnWrapperStyle={{gap: 16}}
                contentContainerStyle={{gap: 16, marginBottom: 64}}
              />
            </View>

            <View style={styles.section}>
              {/* <ImageBackground
              source={{uri: currentOpenings.src}}
              style={styles.card}
              imageStyle={styles.image}> */}
              {/* <LinearGradient
              colors={['rgba(0,102,158,0.9)', 'rgba(11,132,210,0.9)']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.overlay}
            /> */}

              <View style={styles.content}>
                <Text style={styles.title}>
                  Didn’t find a match in our current openings?
                </Text>

                <Text style={styles.description}>
                  Submit your resume and let us know your interests. We’ll
                  contact you when a suitable position becomes available — so
                  you never miss an opportunity to join our team.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => setRequestFormOpen(true)}
                accessibilityLabel="Open application request form">
                <Text style={styles.ctaIcon}>↗</Text>
                <Text style={styles.ctaText}>Apply Now</Text>
              </TouchableOpacity>
              {/* </ImageBackground> */}
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
    backgroundColor: '#6366f1',
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
    backgroundColor: '#6366f1',
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
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    backgroundColor: 'rgba(99,102,241,0.1)',
    padding: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e3a8a',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  requirements: {
    gap: 6,
  },
  requirement: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  applyBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  applyText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  applyArrow: {
    color: '#ffffff',
    fontSize: 16,
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
    color: '#6366f1',
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
});
