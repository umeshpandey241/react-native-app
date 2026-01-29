import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Industrie} from '../../core/model/industrie';
import {EnumDetail} from '../../core/model/enumDetail';
import IndustriesCard from '../industries/IndustriesCard';
import {getPhotoUrl} from '../product/ProductList';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

type Props = {
  industrieData: Industrie[];
  industriesTypeData: EnumDetail[];
};

export default function IndustrieSection({
  industrieData,
  industriesTypeData,
}: Props) {
  const [activeTab, setActiveTab] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation();

  const industrieTypeTabs = useMemo(
    () =>
      industriesTypeData.filter(
        e => e.section === 'IndustryType' && e.isActive,
      ),
    [industriesTypeData],
  );

  useEffect(() => {
    if (!activeTab && industrieTypeTabs.length > 0) {
      setActiveTab(industrieTypeTabs[0].value ?? '');
    }
  }, [industrieTypeTabs, activeTab]);

  const normalize = (val?: string) =>
    val ? val.replace(/\s+/g, ' ').trim().toLowerCase() : '';

  const filteredIndustries = useMemo(() => {
    if (!activeTab) return [];
    const active = normalize(activeTab);

    return industrieData
      .filter(i => i.isActive)
      .filter(i => normalize(i.industrieType) === active);
  }, [industrieData, activeTab]);

  /* -------- AUTOPLAY -------- */
  useEffect(() => {
    if (filteredIndustries.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % filteredIndustries.length;
        listRef.current?.scrollToIndex({
          index: next,
          animated: true,
        });
        return next;
      });
    }, 2500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [filteredIndustries]);

  return (
    <View style={styles.section}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Industries</Text>

        <View style={styles.tabs}>
          {industrieTypeTabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.value ?? '')}
              style={[styles.tab, activeTab === tab.value && styles.activeTab]}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.value && styles.activeTabText,
                ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* CAROUSEL */}
      <FlatList
        ref={listRef}
        data={filteredIndustries}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        contentContainerStyle={styles.carousel}
        onMomentumScrollEnd={e => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / (width * 0.75),
          );
          setCurrentIndex(index);
        }}
        renderItem={({item}) => (
          <View style={styles.cardWrapper}>
            <IndustriesCard
              name={item.name ?? ''}
              image={getPhotoUrl(item.image) ?? ''}
              slug={item.slug ?? ''}
            />
          </View>
        )}
      />

      {/* DOTS */}
      {filteredIndustries.length <= 10 && (
        <View style={styles.dots}>
          {filteredIndustries.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, currentIndex === i && styles.activeDot]}
            />
          ))}
        </View>
      )}

      {/* CTA */}
      <TouchableOpacity
        style={styles.cta}
        onPress={() => navigation.navigate('IndustriesList')}>
        <Text style={styles.ctaText}>View All ↗</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 32,
    backgroundColor: '#f5f9ff',
  },

  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 16,
  },

  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },

  tab: {
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
  },

  activeTab: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
  },

  activeTabText: {
    color: '#ffffff',
  },

  carousel: {
    paddingHorizontal: 16,
    gap: 16,
  },

  cardWrapper: {
    width: width * 0.75,
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },

  activeDot: {
    width: 24,
    backgroundColor: '#1e3a8a',
  },

  cta: {
    marginTop: 32,
    alignSelf: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  ctaText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
