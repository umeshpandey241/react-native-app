import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {OurVideo} from '../../core/model/ourVideo';
// import {WebView} from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';

interface VideoCardProps {
  video: OurVideo;
  isPlaying: boolean;
  onPlay: () => void;
}

export default function VideoCard({video, isPlaying, onPlay}: VideoCardProps) {
  // const getYouTubeEmbed = (url?: string) => {
  //   if (!url) return '';
  //   return url.replace('watch?v=', 'embed/') + '?autoplay=1';
  // };

  const videoId = video.videoLink?.split('v=')[1] ?? '';

  return (
    <View style={styles.container}>
      {!isPlaying ? (
        <>
          {/* Thumbnail */}
          <Image
            source={{
              uri: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          {/* Play Button */}
          <TouchableOpacity
            style={styles.playButton}
            onPress={onPlay}
            accessibilityLabel="Play Video">
            <Text style={styles.playIcon}>▶</Text>
          </TouchableOpacity>
        </>
      ) : (
        // <WebView
        //   source={{uri: getYouTubeEmbed(video.videoLink)}}
        //   style={styles.webview}
        //   allowsFullscreenVideo
        // />
        <YoutubePlayer height={200} play={true} videoId={videoId} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 4,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -40}, {translateY: -40}],
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  playIcon: {
    fontSize: 32,
    color: '#1e3a8a', // var(--color-primary)
    marginLeft: 4,
  },
  webview: {
    width: '100%',
    height: '100%',
  },
});
