import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  // Dimensions,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {getAll as getClient} from '../../core/service/ourClients.service';
import {getAll} from '../../core/service/clientCategory.service';
import {OurClient} from '../../core/model/ourClient';
import {ClientCategory} from '../../core/model/clientCategory';
import {getPhotoUrl} from '../about/AboutHomes';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const OurClientsHome = () => {
  const [ourClientsData, setOurClientsData] = useState<OurClient[]>([]);
  const [clientCategoriesData, setClientCategoriesData] = useState<
    ClientCategory[]
  >([]);
  const clientsData = ourClientsData ?? null;
  const [activeTab, setActiveTab] = useState<string>('All');
  const activeClientCategoriesData = clientCategoriesData?.filter(
    item => item.isActive === true,
  );
  // const {width} = Dimensions.get('window');

  useEffect(() => {
    const fetchClient = async () => {
      const client = await getClient();
      setOurClientsData(client);
    };
    fetchClient();
  }, []);

  useEffect(() => {
    const fetchClientCategory = async () => {
      const client = await getAll();
      setClientCategoriesData(client);
    };
    fetchClientCategory();
  }, []);

  useEffect(() => {
    if (clientCategoriesData?.length > 0 && !activeTab) {
      setActiveTab('All');
    }
  }, [clientCategoriesData, activeTab]);

  const normalize = (val?: string) =>
    val ? val.replace(/\s+/g, ' ').trim().toLowerCase() : '';

  const filteredOurClientsData = useMemo(() => {
    if (activeTab === 'All' || !activeTab) return clientsData;
    const filteredByActive = clientsData?.filter(
      item => item.isActive === true,
    );

    const active = normalize(activeTab);
    return filteredByActive?.filter(
      item => normalize(item.clientCategoryIdName) === active,
    );
  }, [clientsData, activeTab]);

  return (
    <>
      <Header Heading="Client" />
      <View style={styles.container}>
        {/* Heading */}
        <Text style={styles.heading}>Our Clients</Text>

        <Text style={styles.description}>
          NIRAN partners with top organizations across food, pharma, water, and
          more—delivering proven filtration solutions that drive success and
          lasting relationships.
        </Text>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}>
          <Pressable
            onPress={() => setActiveTab('All')}
            style={[styles.tab, activeTab === 'All' && styles.activeTab]}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'All' && styles.activeTabText,
              ]}>
              All
            </Text>
          </Pressable>

          {activeClientCategoriesData?.map(category => (
            <Pressable
              key={category.id}
              onPress={() => setActiveTab(category.name ?? '')}
              style={[
                styles.tab,
                activeTab === category.name && styles.activeTab,
              ]}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === category.name && styles.activeTabText,
                ]}>
                {category.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Clients Grid */}
        {filteredOurClientsData?.length ? (
          <FlatList
            data={filteredOurClientsData}
            keyExtractor={item => item.id.toString()}
            numColumns={4}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.grid}
            renderItem={({item}) => {
              const imageUrl = getPhotoUrl(item.image);
              return (
                <View style={styles.clientCard}>
                  {imageUrl ? (
                    <Image
                      source={{uri: imageUrl}}
                      style={styles.clientImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.noImage}>
                      <Text style={styles.noImageText}>No Image</Text>
                    </View>
                  )}
                </View>
              );
            }}
          />
        ) : (
          <Text style={styles.emptyText}>
            No Clients available for category:{' '}
            <Text style={styles.emptyHighlight}>{activeTab}</Text>
          </Text>
        )}
      </View>
      <Footer />
    </>
  );
};

export default OurClientsHome;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#f4f8fc',
  },

  heading: {
    // fontSize: width * 0.08,
    fontWeight: '700',
    color: '#0a2540',
    textAlign: 'center',
    marginBottom: 8,
  },

  description: {
    textAlign: 'center',
    // fontSize: width * 0.04,
    color: '#425466',
    marginBottom: 24,
  },

  tabsContainer: {
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: '#eaf1f8',
    borderWidth: 1,
    borderColor: '#d0d7de',
  },

  activeTab: {
    backgroundColor: '#00a8cc',
    borderColor: '#00a8cc',
  },

  tabText: {
    // fontSize: width * 0.04,
    fontWeight: '600',
    color: '#0a2540',
  },

  activeTabText: {
    color: '#fff',
  },

  grid: {
    paddingTop: 20,
  },

  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  clientCard: {
    width: '23%',
    aspectRatio: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  clientImage: {
    width: '100%',
    height: '100%',
  },

  noImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  noImageText: {
    fontSize: 10,
    color: '#6b7280',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#6b7280',
  },

  emptyHighlight: {
    fontWeight: '600',
    color: '#000',
  },
});
