import {
  View,
  Text,
  useWindowDimensions,
  ScrollView,
  Image,
  StyleSheet,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {CaseStudy} from '../../core/model/caseStudy';
import {getAll} from '../../core/service/caseStudies.service';
import {TouchableOpacity} from 'react-native';
import {getPhotoUrl} from '../product/ProductList';
import {RenderHTML} from 'react-native-render-html';
import Header from '../../components/Header';
// import {CustomFile} from '../about/AboutHomes';
import {Linking, Alert} from 'react-native';
import DownloadCaseForm from './DownloadCaseForm';
import Footer from '../../components/Footer';
// import PdfImg from '@/assets/images/pdf.webp';

// const parseAndFormatImages = (imageData: string | null) => {
//   if (!imageData) return [];
//   try {
//     const parsed = JSON.parse(imageData);

//     const flat = Array.isArray(parsed) ? parsed.flat(Infinity) : [];

//     return flat.map((img: CustomFile) => ({
//       fileName: img.fileName,
//       filePath: img.filePath.replace(/\\/g, '/'),
//       type: img.type,
//     }));
//   } catch (error) {
//     console.error('Failed to parse image data:', error);
//     return [];
//   }
// };
const CaseStudiesList = () => {
  const [caseStudiesData, setCaseStudiesData] = React.useState<CaseStudy[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const caseStudiesList = caseStudiesData ?? null;
  const filteredByActive = caseStudiesList
    ?.filter(item => item.isActive === true)
    .reverse();
  const [caseFormOpen, setCaseFormOpen] = useState(false);
  const [selectedCaseStudyData, setSelectedCaseStudyData] = useState({});
  const {width} = useWindowDimensions();

  console.log(caseFormOpen, selectedCaseStudyData);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      const fetchCaseStudiesData = await getAll();
      console.log('fetchCaseStudiesData', fetchCaseStudiesData);
      setCaseStudiesData(fetchCaseStudiesData);
    };
    fetchCaseStudies();
  }, []);

  const normalize = (val?: string) =>
    val ? val.replace(/\s+/g, ' ').trim().toLowerCase() : '';

  const filterCaseStudiesData = useMemo(() => {
    if (!caseStudiesData) return [];
    if (activeTab === 'All' || !activeTab) return filteredByActive;
    const active = normalize(activeTab);
    return filteredByActive.filter(
      item => normalize(item?.industrieIdName) === active,
    );
  }, [caseStudiesData, filteredByActive, activeTab]);

  const uniqueIndustries = useMemo(() => {
    return Array.from(
      new Map(
        filteredByActive?.map(item => [item.industrieIdName, item]),
      ).values(),
    );
  }, [filteredByActive]);

  const openPdfInNewTab = async (url?: string) => {
    if (!url) return;

    try {
      const pdfUrl = getPhotoUrl(url) ?? '';

      const supported = await Linking.canOpenURL(pdfUrl);
      if (!supported) {
        Alert.alert('Error', 'Cannot open this PDF');
        return;
      }

      await Linking.openURL(pdfUrl);
    } catch (error) {
      console.error('Failed to open PDF:', error);
    }
  };

  return (
    <>
      <Header Heading="CaseStudy" />
      <ScrollView>
        <View style={styles.section}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.heading}>Case Study</Text>
            <Text style={styles.subText}>
              NIRAN partners with top organizations across food, pharma, water,
              and more—delivering proven filtration solutions that drive success
              and lasting relationships.
            </Text>
          </View>

          <View style={styles.content}>
            {/* LEFT – INDUSTRIES */}
            <View style={styles.leftPanel}>
              <Text style={styles.industryTitle}>Industries</Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      activeTab === 'All' && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab('All')}>
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === 'All' && styles.activeTabText,
                      ]}>
                      All
                    </Text>
                  </TouchableOpacity>

                  {uniqueIndustries?.map(industry => (
                    <TouchableOpacity
                      key={industry.id}
                      style={[
                        styles.tab,
                        activeTab === industry.industrieIdName &&
                          styles.activeTab,
                      ]}
                      onPress={() =>
                        setActiveTab(industry.industrieIdName ?? '')
                      }>
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === industry.industrieIdName &&
                            styles.activeTabText,
                        ]}>
                        {industry.industrieIdName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* RIGHT – CASE STUDIES */}
            <View style={styles.rightPanel}>
              <View style={styles.cardGrid}>
                {filterCaseStudiesData?.map(item => {
                  const mainImageUrl = getPhotoUrl(item.image);

                  return (
                    <View key={item.id} style={styles.card}>
                      {/* Image */}
                      <TouchableOpacity
                        onPress={() => openPdfInNewTab(item.document)}>
                        <Image
                          source={{uri: mainImageUrl || ''}}
                          style={styles.cardImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>

                      {/* Content */}
                      <View style={styles.cardBody}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.cardTitle}>{item.name}</Text>

                          <TouchableOpacity
                            style={styles.downloadBtn}
                            onPress={() => {
                              setCaseFormOpen(true);
                              setSelectedCaseStudyData(item);
                            }}>
                            <Text style={styles.downloadIcon}>⬇</Text>
                          </TouchableOpacity>
                        </View>

                        {item.shortDescription && (
                          <RenderHTML
                            contentWidth={width}
                            source={{html: item.shortDescription}}
                            tagsStyles={htmlStyles}
                          />
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>

              {filteredByActive?.length === 0 && (
                <Text style={styles.emptyText}>No case studies found.</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <Footer />
      {caseFormOpen && (
        <Modal
          visible={caseFormOpen}
          transparent
          animationType="fade"
          statusBarTranslucent>
          {/* Backdrop (prevent dismiss) */}
          <Pressable style={styles.backdrop} />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.centered}>
            <View style={styles.dialog}>
              {/* Header */}
              <Text style={styles.title}>Case Study</Text>

              {/* Content */}
              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}>
                <DownloadCaseForm
                  setCaseFormOpen={setCaseFormOpen}
                  selectedCaseStudyData={selectedCaseStudyData}
                />
              </ScrollView>

              {/* Footer */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setCaseFormOpen(false)}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    // Trigger submit via ref or internal submit handler
                    // Recommended: expose submit method from form
                  }}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </>
  );
};

export default CaseStudiesList;

const styles = StyleSheet.create({
  section: {
    paddingVertical: 32,
    backgroundColor: '#eef6ff',
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  subText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e3a8a',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 16,
  },
  leftPanel: {
    marginBottom: 24,
  },
  industryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1e3a8a',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  activeTab: {
    backgroundColor: '#6366f1',
  },
  tabText: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#ffffff',
  },
  rightPanel: {
    marginTop: 16,
  },
  cardGrid: {
    gap: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardBody: {
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadIcon: {
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontWeight: '500',
    color: '#1e3a8a',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  dialog: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: '#f5faff', // primary-light
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003a5d', // primary
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#d0d7de',
    marginBottom: 8,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#d0d7de',
  },

  button: {
    backgroundColor: '#005c8a', // tertiary
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

const htmlStyles = {
  p: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
    color: '#475569',
  },
  h1: {fontSize: 18},
  h2: {fontSize: 16},
  h3: {fontSize: 15},
  li: {marginBottom: 6},
};
