import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Banner} from '../../core/model/banner';
import {OurVideo} from '../../core/model/ourVideo';
import {getPhotoUrl} from '../product/ProductList';

const {height} = Dimensions.get('window');

type Props = {
  bannerData: Banner[];
  ourVideosData: OurVideo[];
};

const getYouTubeId = (url?: string) => url?.split('v=')[1]?.split('&')[0] ?? '';

export default function HomesHeroSection({
  bannerData = [],
  ourVideosData = [],
}: Props) {
  const slides = bannerData.filter(b => b.isActive).reverse();
  const slideCount = slides.length;

  const activeVideos = ourVideosData.filter(v => v.isActive);
  const videoId = getYouTubeId(activeVideos[0]?.videoLink);

  const [current, setCurrent] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  const opacity = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (slideCount <= 1) return;

    timerRef.current = setInterval(() => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrent(prev => (prev + 1) % slideCount);
    }, 5000);

    return () => timerRef.current && clearInterval(timerRef.current);
  }, [slideCount, opacity]);

  if (slideCount === 0) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={{opacity}}>
        <ImageBackground
          source={{uri: getPhotoUrl(slides[current].image)}}
          style={styles.background}
          resizeMode="cover">
          <View style={styles.overlay} />

          <View style={styles.content}>
            <Text style={styles.label}>{slides[current].name}</Text>

            <Text style={styles.title}>{slides[current].subTitle}</Text>

            <Text style={styles.description}>
              {slides[current].shortDescription}
            </Text>

            <View style={styles.buttons}>
              {slides[current].url && (
                <TouchableOpacity style={styles.primaryBtn}>
                  <Text style={styles.primaryText}>KNOW MORE</Text>
                </TouchableOpacity>
              )}

              {videoId && (
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => setVideoOpen(true)}>
                  <Text style={styles.secondaryText}>BRAND TOUR ▶</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ImageBackground>
      </Animated.View>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, current === i && styles.activeDot]}
          />
        ))}
      </View>

      {/* Video Modal */}
      <Modal visible={videoOpen} animationType="slide">
        <TouchableOpacity
          style={styles.close}
          onPress={() => setVideoOpen(false)}>
          <Text style={{color: '#fff', fontSize: 18}}>✕</Text>
        </TouchableOpacity>

        <WebView
          source={{
            uri: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
          }}
          allowsFullscreenVideo
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: height * 0.45,
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    paddingHorizontal: 20,
    width: '70%',
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '300',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '600',
    marginVertical: 8,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  secondaryText: {
    color: '#000',
    fontWeight: '600',
  },
  dots: {
    position: 'absolute',
    bottom: 12,
    left: 20,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 16,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
    opacity: 0.5,
  },
  activeDot: {
    backgroundColor: '#6366f1',
    opacity: 1,
  },
  close: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
});
