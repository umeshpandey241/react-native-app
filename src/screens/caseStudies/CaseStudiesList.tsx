import {
  View,
  Text,
  useWindowDimensions,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {CaseStudy} from '../../core/model/caseStudy';
import {getAll} from '../../core/service/caseStudies.service';
import {TouchableOpacity} from 'react-native';
import {getPhotoUrl} from '../product/ProductList';
import {RenderHTML} from 'react-native-render-html';
import Header from '../../components/Header';
// import PdfImg from '@/assets/images/pdf.webp';

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
                      // onPress={() => openPdfInNewTab(item.document)}
                      >
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
