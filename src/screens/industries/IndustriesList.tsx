import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getAll} from '../../core/service/industries.service';
import {getAll as getAllType} from '../../core/service/enumDetails.service';
import {BASE_URL} from '../../../config/config';
import Header from '../../components/Header';

const {width} = Dimensions.get('window');
const IS_TABLET = width >= 768;
const NUM_COLUMNS = IS_TABLET ? 3 : 1;

/* ------------------ helpers ------------------ */

const normalize = (val?: string) =>
  val ? val.replace(/\s+/g, ' ').trim().toLowerCase() : '';

export interface CustomFile {
  fileName: string;
  filePath: string;
  type: string;
  progress?: number;
}

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

/* ------------------ component ------------------ */

export default function IndustrieList() {
  const [industriesData, setIndustriesData] = useState<Array<any>>([]);
  const [industriesTypeData, setIndustriesTypeData] = useState<Array<any>>([]);

  useEffect(() => {
    // Fetch industries data
    const fetchIndustries = async () => {
      const ourIndustrieData = await getAll();
      console.log(ourIndustrieData, 'video');
      setIndustriesData(ourIndustrieData);
    };
    fetchIndustries();

    const fetchIndustriesType = async () => {
      const ourIndustrieTypeData = await getAllType();
      console.log(ourIndustrieTypeData, 'video');
      setIndustriesTypeData(ourIndustrieTypeData);
    };
    fetchIndustriesType();
  }, []);

  const navigation = useNavigation();

  const industrieTypeTabs = useMemo(
    () =>
      industriesTypeData.filter(
        e => e.section === 'IndustryType' && e.isActive,
      ),
    [industriesTypeData],
  );

  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    if (!activeTab && industrieTypeTabs.length > 0) {
      setActiveTab(normalize(industrieTypeTabs[0].value));
    }
  }, [industrieTypeTabs, activeTab]);

  const filteredIndustries = useMemo(() => {
    if (!activeTab) return [];
    return industriesData
      .filter(i => i.isActive)
      .filter(i => normalize(i.industrieType) === normalize(activeTab))
      .reverse();
  }, [industriesData, activeTab]);

  /* ------------------ renderers ------------------ */

  const renderTab = ({item}) => {
    const isActive = normalize(item.value) === activeTab;

    return (
      <Pressable
        onPress={() => setActiveTab(normalize(item.value))}
        style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}>
        <Text
          style={[
            styles.tabText,
            isActive ? styles.tabTextActive : styles.tabTextInactive,
          ]}>
          {item.name}
        </Text>
      </Pressable>
    );
  };

  const renderCard = ({item}) => {
    const imageUrl = getPhotoUrl(item.image);

    return (
      <Pressable
        onPress={() => navigation.navigate('IndustriesView', {slug: item.slug})}
        style={styles.card}>
        {imageUrl ? (
          <Image source={{uri: imageUrl}} style={styles.cardImage} />
        ) : (
          <View style={styles.noImage}>
            <Text>No Image</Text>
          </View>
        )}

        <View style={styles.cardOverlay}>
          <Text style={styles.cardTitle}>{item.name}</Text>
        </View>
      </Pressable>
    );
  };

  /* ------------------ UI ------------------ */

  return (
    <>
      <Header Heading="Industries" />
      <View style={styles.section}>
        {/* HEADER */}
        <Text style={styles.heading}>Industries</Text>

        {/* TABS */}
        <FlatList
          data={industrieTypeTabs}
          keyExtractor={item => item.id.toString()}
          renderItem={renderTab}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        />

        {/* GRID */}
        {filteredIndustries.length > 0 ? (
          <FlatList
            data={filteredIndustries}
            key={NUM_COLUMNS}
            numColumns={NUM_COLUMNS}
            renderItem={renderCard}
            keyExtractor={item => item.id.toString()}
            columnWrapperStyle={NUM_COLUMNS > 1 ? styles.row : undefined}
            contentContainerStyle={styles.grid}
          />
        ) : (
          <Text style={styles.emptyText}>
            No industries found for{' '}
            <Text style={styles.emptyHighlight}>{activeTab}</Text>
          </Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    paddingVertical: 40,
    backgroundColor: '#EEF5FF',
  },

  heading: {
    fontSize: IS_TABLET ? 36 : 28,
    fontWeight: '700',
    color: '#0D6EFD',
    textAlign: 'center',
    marginBottom: 16,
  },

  /* Tabs */
  tabsRow: {
    paddingHorizontal: 16,
    gap: 12,
    marginVertical: 20,
  },
  tab: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#6F42C1',
  },
  tabInactive: {
    backgroundColor: '#E9ECEF',
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  tabText: {
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  tabTextInactive: {
    color: '#212529',
  },

  /* Grid */
  grid: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  /* Card */
  card: {
    flex: 1,
    height: IS_TABLET ? 420 : 300,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginHorizontal: 6,
    elevation: 3,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  noImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DEE2E6',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  /* Empty */
  emptyText: {
    textAlign: 'center',
    color: '#0D6EFD',
    marginTop: 40,
  },
  emptyHighlight: {
    fontWeight: '700',
  },
});
