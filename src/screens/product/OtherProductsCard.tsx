import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import {PiArrowUpRightDuotone} from '@/sharedBase/globalImports';

const {width} = Dimensions.get('window');

interface OtherProductsCardProps {
  name: string;
  slug: string;
  selectedImage: string;
  content: string;
}

export function OtherProductsCard({
  name,
  selectedImage,
  slug,
  content,
}: OtherProductsCardProps) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.card}>
      {/* Image Section */}
      <View style={styles.imageWrapper}>
        {selectedImage?.length > 0 && (
          <Image
            source={{uri: selectedImage}}
            resizeMode="contain"
            style={styles.image}
          />
        )}
      </View>

      {/* Content Section */}
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>{name}</Text>

        <Text style={styles.description} numberOfLines={2}>
          {content}
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('ProductDetails', {slug})}>
          {/* <PiArrowUpRightDuotone size={20} color="#fff" /> */}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    flexDirection: width > 768 ? 'row' : 'column',
  },

  imageWrapper: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#002438',
  },

  image: {
    width: 160,
    height: 160,
  },

  contentWrapper: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#002438',
    marginBottom: 8,
    textAlign: 'center',
  },

  description: {
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
  },

  button: {
    marginTop: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0077b6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default OtherProductsCard;
