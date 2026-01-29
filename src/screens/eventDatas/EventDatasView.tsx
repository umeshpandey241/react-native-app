import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {EventData} from '../../core/model/eventData';
import {getById} from '../../core/service/eventDatas.service';
import {getPhotoUrl} from '../product/ProductList';

const EventDatasView = ({route}) => {
  const {id, slug} = route.params;
  const {width} = useWindowDimensions();

  const [eventDataData, setEventDataData] = useState<EventData | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      const data = await getById({id, slug});
      setEventDataData(data);
    };
    fetchEventData();
  }, [id, slug]);

  if (!eventDataData) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Event not found</Text>
      </View>
    );
  }

  const imageUrl = getPhotoUrl(eventDataData.uploadPhoto);

  return (
    <ScrollView>
      <View style={styles.section}>
        {/* Title */}
        <Text style={styles.title}>{eventDataData.name}</Text>

        {/* Image */}
        {imageUrl && (
          <Image
            source={{uri: imageUrl}}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {/* HTML Description */}
        {eventDataData.longDescription && (
          <RenderHTML
            contentWidth={width}
            source={{html: eventDataData.longDescription}}
            tagsStyles={htmlStyles}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default EventDatasView;

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: '#f5f9ff', // white-blue gradient replacement
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 24,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 24,
  },
  notFound: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 14,
  },
});

const htmlStyles = {
  p: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
    color: '#1e3a8a',
    fontWeight: '500',
  },
  h1: {
    fontSize: 24,
    marginBottom: 12,
  },
  h2: {
    fontSize: 20,
    marginBottom: 10,
  },
  h3: {
    fontSize: 18,
    marginBottom: 8,
  },
  ul: {
    marginLeft: 18,
    marginBottom: 10,
  },
  ol: {
    marginLeft: 18,
    marginBottom: 10,
  },
  li: {
    marginBottom: 6,
  },
};
