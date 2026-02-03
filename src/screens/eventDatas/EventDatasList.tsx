import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {DatePicker} from '../../sharedBase/globalImport';

import {EventData} from '../../core/model/eventData';
import {getAll} from '../../core/service/eventDatas.service';
import EventCard from './EventCard';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
// import SearchIcon from '@/assets/icons/SearchIcon';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

type CategoryType = 'Happening' | 'Upcoming' | 'Expired';

const EventDatasList = () => {
  const [eventDatasData, setEventDatasData] = useState<EventData[]>([]);
  const categories: CategoryType[] = ['Happening', 'Upcoming', 'Expired'];

  const [activeCategory, setActiveCategory] =
    useState<CategoryType>('Happening');

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [search, setSearch] = useState('');

  const [showCalendar, setShowCalendar] = useState(false);
  const [pickerType, setPickerType] = useState<'from' | 'to' | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      const data = await getAll();
      setEventDatasData(data);
    };
    fetchEventData();
  }, []);

  const clearFilters = () => {
    setFromDate(null);
    setToDate(null);
    setSearch('');
  };

  const toDateKey = (date: Date) => {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
  };

  // const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
  //   if (event.type !== 'set' || !selectedDate) {
  //     setShowPicker(false);
  //     return;
  //   }

  //   setShowPicker(false);

  //   if (pickerType === 'from') {
  //     setFromDate(selectedDate);
  //   }

  //   if (pickerType === 'to') {
  //     setToDate(selectedDate);
  //   }
  // };

  const todayKey = toDateKey(new Date());

  const filteredEvents = useMemo(() => {
    return eventDatasData.filter(event => {
      if (!event.isActive || !event.eventDate) return false;

      const eventDate = new Date(event.eventDate);
      const eventKey = toDateKey(eventDate);

      if (activeCategory === 'Happening' && eventKey !== todayKey) {
        return false;
      }

      if (activeCategory === 'Upcoming' && eventKey <= todayKey) {
        return false;
      }

      if (activeCategory === 'Expired' && eventKey >= todayKey) {
        return false;
      }

      if (fromDate && eventKey < toDateKey(fromDate)) return false;
      if (toDate && eventKey > toDateKey(toDate)) return false;

      if (search && !event.name?.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [activeCategory, eventDatasData, fromDate, toDate, search, todayKey]);

  return (
    <>
      <Header Heading="Event" />
      <View style={styles.container}>
        <Text style={styles.heading}>Events</Text>

        {/* CATEGORY TABS */}
        <View style={styles.tabsRow}>
          {categories.map(category => {
            const isActive = activeCategory === category;
            return (
              <Pressable
                key={category}
                onPress={() => setActiveCategory(category)}
                style={[styles.tab, isActive && styles.activeTab]}>
                <Text
                  style={[styles.tabText, isActive && styles.activeTabText]}>
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* FILTERS */}
        <View style={styles.filters}>
          {(activeCategory === 'Upcoming' || activeCategory === 'Expired') && (
            <View style={styles.dateRow}>
              <Text style={styles.label}>Select Date</Text>

              <Pressable
                style={styles.dateInput}
                onPress={() => {
                  setPickerType('from');
                  setShowCalendar(true);
                }}>
                <Text>{fromDate ? fromDate.toDateString() : 'From'}</Text>
              </Pressable>

              <Pressable
                style={styles.dateInput}
                onPress={() => {
                  setPickerType('to');
                  setShowCalendar(true);
                }}>
                <Text>{toDate ? toDate.toDateString() : 'To'}</Text>
              </Pressable>
            </View>
          )}

          {/* SEARCH */}
          <View style={styles.searchRow}>
            <TextInput
              value={search}
              onChangeText={e => setSearch(e)}
              placeholder="Search Event..."
              style={styles.searchInput}
            />

            <View style={styles.searchBtn}>
              {/* <SearchIcon width={16} /> */}
            </View>

            {activeCategory !== 'Happening' && (
              <Pressable style={styles.clearBtn} onPress={clearFilters}>
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* DATE PICKERS */}
        <DatePicker
          modal
          mode="date"
          open={showCalendar}
          date={
            pickerType === 'from'
              ? fromDate ?? new Date()
              : toDate ?? new Date()
          }
          onConfirm={date => {
            setShowCalendar(false);

            if (pickerType === 'from') {
              setFromDate(date);
            }

            if (pickerType === 'to') {
              setToDate(date);
            }
          }}
          onCancel={() => setShowCalendar(false)}
          theme={Platform.OS === 'ios' ? 'light' : 'light'}
        />

        {/* EVENTS GRID */}
        {filteredEvents.length === 0 ? (
          <Text style={styles.empty}>No events found: {activeCategory}</Text>
        ) : (
          <FlatList
            data={filteredEvents}
            numColumns={isTablet ? 3 : 1}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => <EventCard event={item} />}
            columnWrapperStyle={isTablet ? {gap: 12} : undefined}
            contentContainerStyle={{gap: 12}}
          />
        )}
      </View>
      <Footer />
    </>
  );
};

export default EventDatasList;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#eef5fb',
  },

  heading: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#002438',
    marginBottom: 24,
    textAlign: 'center',
  },

  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },

  tab: {
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  activeTab: {
    backgroundColor: '#0077b6',
    borderColor: '#0077b6',
  },

  tabText: {
    fontWeight: '600',
    color: '#002438',
  },

  activeTabText: {
    color: '#fff',
  },

  filters: {
    marginBottom: 20,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    justifyContent: 'center',
  },

  label: {
    fontWeight: '700',
    color: '#002438',
  },

  dateInput: {
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },

  searchBtn: {
    height: 40,
    width: 40,
    backgroundColor: '#0077b6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearBtn: {
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0077b6',
    justifyContent: 'center',
  },

  clearText: {
    color: '#fff',
    fontWeight: '600',
  },

  empty: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#002438',
    marginTop: 32,
  },
});
