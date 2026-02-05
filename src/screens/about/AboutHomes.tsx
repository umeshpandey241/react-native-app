import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  // ImageBackground,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {MaterialCommunityIcons} from '../../sharedBase/globalImport';
import {getAll} from '../../core/service/researchDevelopments.service';
import {getAll as getAllLeaders} from '../../core/service/leaderships.service';
import {getAll as getAllVideos} from '../../core/service/ourVideos.service';
import {BASE_URL} from '../../../config/config';
import {Animated} from 'react-native';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import {ResearchDevelopment} from '../../core/model/researchDevelopment';
import {Leadership} from '../../core/model/leadership';
import {OurVideo} from '../../core/model/ourVideo';

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

export const getYouTubeId = (url: string) => {
  const id = url.split('v=')[1]?.split('&')[0];
  return id;
};

const {width} = Dimensions.get('window');
const IS_TABLET = width >= 768;
// const CARD_WIDTH = IS_TABLET ? 300 : 260;

export default function AboutSection() {
  // const [active, setActive] = useState<'mission' | 'vision' | 'values'>(
  //   'mission',
  // );

  const [research, setResearch] = useState<ResearchDevelopment[]>([]);
  const [team, setTeam] = useState<Leadership[]>([]);
  const [video, setVideo] = useState<OurVideo[]>([]);
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeRipple = (anim: any, delay: any) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ).start();

    makeRipple(ripple1, 0);
    makeRipple(ripple2, 600);
    makeRipple(ripple3, 1200);
  }, [ripple1, ripple2, ripple3]);

  const rippleStyle = (anim: any) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2.4],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    }),
  });
  useEffect(() => {
    const fetchVideoData = async () => {
      const ourVideosData = await getAllVideos();
      console.log(ourVideosData, 'video');
      setVideo(ourVideosData);
    };
    fetchVideoData();
  }, []);

  const activeOurVideosData = video?.filter(item => item?.isActive === true);
  const showList = ['aboutus'];
  const videoData = activeOurVideosData.filter(item =>
    showList.includes(item?.name?.toLowerCase() || ''),
  );
  const videoId = getYouTubeId(videoData[0]?.videoLink || '');

  useEffect(() => {
    const fetchData = async () => {
      const researchDevelopmentData = await getAll();
      setResearch(researchDevelopmentData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTeamsData = async () => {
      const leadershipData = await getAllLeaders();
      setTeam(leadershipData);
    };
    fetchTeamsData();
  }, []);

  const images = research
    .map(item => getPhotoUrl(item.uploadPhoto))
    .filter(Boolean);

  const teamImages = team
    .map(item => getPhotoUrl(item.uploadPhoto))
    .filter(Boolean);

  const data = [
    {
      id: 'mission',
      title: 'Our Mission',
      // image: require('../../assets/images/mission.png'),
      type: 'list',
      items: [
        'Prioritize work of the employees to get the best results.',
        'Ensure that we have the best in class productivity.',
        'Make our products available in all the markets at all times.',
        'To have products / technology ahead of demand and fit for market.',
        'Use TOC principles as the only way of managing the organization.',
      ],
    },
    {
      id: 'vision',
      title: 'Our Vision',
      // image: require('../../assets/images/vision.png'),
      type: 'text',
      items: [
        'To create value for stakeholders by growing profitably year over year in all the market segments that we operate in.',
      ],
    },
    {
      id: 'values',
      title: 'Our Values',
      // image: require('../../assets/images/ourValues.png'),
      type: 'list',
      items: [
        'Do what you say / commit. Always talk the truth.',
        'Ethical Behavior',
        'Shall not give and accept bribes in any form.',
        'Respect for others',
        'Treat others in a way that he / she shall not be offended.',
      ],
    },
  ];

  // eslint-disable-next-line react/no-unstable-nested-components
  function AdvantageCard({icon, title, text}: any) {
    return (
      <View style={styles.advantageCard}>
        <View style={styles.icon}>{icon}</View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardText}>{text}</Text>
        </View>
      </View>
    );
  }

  // const renderItem = ({item}) => {
  //   if (!item) return null;

  //   return (
  //     <Pressable style={[styles.card, {width: CARD_WIDTH}]}>
  //       <Image source={{uri: item}} style={styles.image} resizeMode="cover" />
  //     </Pressable>
  //   );
  // };

  // const renderLeaderItem = ({item}) => {
  //   const imageUrl = getPhotoUrl(item.uploadPhoto);

  //   return (
  //     <View style={[styles.card, {width: CARD_WIDTH}]}>
  //       {imageUrl && (
  //         <Image
  //           source={{uri: imageUrl}}
  //           style={styles.image}
  //           resizeMode="cover"
  //         />
  //       )}

  //       <View style={styles.overlay} />

  //       <View style={styles.content}>
  //         <Text style={styles.name}>{item.name}</Text>
  //         <Text style={styles.designation}>{item.designation}</Text>
  //         <Text style={styles.description} numberOfLines={4}>
  //           {item.description}
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // };

  return (
    <>
      <Header Heading="About Us" />
      <ScrollView>
        <View style={styles.section}>
          <View style={styles.container}>
            <View style={styles.row}>
              {/* LEFT */}
              <View style={styles.left}>
                <View style={styles.leftRow}>
                  <View style={styles.leftCol}>
                    {/* <ImageBackground
                  source={require('../../assets/images/Teammeetinghoto.png')}
                  style={styles.smallImage}
                  imageStyle={styles.imageRadius}
                /> */}

                    <View style={styles.statsCard}>
                      <Text style={styles.statsValue}>100%</Text>
                      <Text style={styles.statsLabel}>Client Satisfaction</Text>
                    </View>
                  </View>

                  {/* <ImageBackground
                source={require('../../assets/images/lab.png')}
                style={styles.largeImage}
                imageStyle={styles.imageRadius}
              /> */}
                </View>
              </View>

              {/* RIGHT */}
              <View style={styles.right}>
                <Text style={styles.badge}>ABOUT OUR COMPANY</Text>

                <Text style={styles.heading}>
                  Smart Filtration, Proven Quality, & Reliable Service
                </Text>

                <View style={styles.featureRow}>
                  <View style={styles.feature}>
                    {/* <Image
                  source={require('../../assets/images/presentation.png')}
                  style={styles.icon}
                /> */}
                    <Text style={styles.featureText}>
                      NIRAN Sets Industry Standards
                    </Text>
                  </View>

                  <View style={styles.feature}>
                    {/* <Image
                  source={require('../../assets/images/target.png')}
                  style={styles.icon}
                /> */}
                    <Text style={styles.featureText}>
                      Safeguarding Your Progress
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View>
                  <Text style={styles.paragraph}>
                    Niran is a specialized brand offering advanced filtration
                    solutions for the Food & Beverage and Pharmaceutical
                    industries, designed to meet the highest standards of
                    quality, safety, and performance.
                  </Text>

                  <Text style={styles.paragraph}>
                    Backed by Fleetguard Filters Private Limited (FFPL), a
                    leader in filtration since 1987, NIRAN draws on decades of
                    expertise in developing cutting-edge filtration
                    technologies.
                  </Text>

                  <Text style={styles.paragraph}>
                    Headquartered in Pune, Maharashtra, FFPL partners with Atmus
                    Filtration Technologies to deliver world-class solutions
                    across OEM and end-user applications.
                  </Text>

                  <Text style={styles.paragraph}>
                    With NIRAN, this legacy extends into new industries—ensuring
                    trusted filtration solutions across critical applications.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.mvSection}>
            <Text style={styles.mvBadge}>OUR GUIDING PRINCIPLES</Text>

            <Text style={styles.mvTitle}>Mission Vision & Values</Text>

            <Text style={styles.mvSubtitle}>
              Guided by purpose and principles, we create filtration solutions
              that elevate quality, inspire trust, and advance a safer,
              sustainable world.
            </Text>

            <View
              style={[
                styles.cardsRow,
                {flexDirection: IS_TABLET ? 'row' : 'column'},
              ]}>
              {data.map((item, index) => (
                <View key={index} style={styles.card}>
                  {/* Overlay (optional – remove if not needed) */}
                  <View style={styles.overlay} />

                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>

                    {item.items ? (
                      item.items.map((point, idx) => (
                        <View key={idx} style={styles.listItem}>
                          <Text style={styles.bullet}>{'\u2022'}</Text>
                          <Text style={styles.cardText}>{point}</Text>
                        </View>
                      ))
                    ) : (
                      // <Text style={styles.cardText}>{item.description}</Text>
                      <Text style={styles.cardText}>NO items</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.badge}>WHAT SETS US APART</Text>

            <Text style={styles.title}>Discover the NIRAN Advantage</Text>

            <Text style={styles.subtitle}>
              Experience reliable filtration, personalized solutions, and expert
              support—trusted by industry leaders for quality, compliance, and
              long-term partnership.
            </Text>
          </View>

          {/* CARDS */}
          <View style={styles.grid}>
            <AdvantageCard
              icon={
                <MaterialCommunityIcons
                  name="trophy-outline"
                  size={36}
                  color="#0D6EFD"
                />
              }
              title="Proven Expertise"
              text="State-of-the-art manufacturing ensures every instrument is a benchmark for accuracy."
            />

            <AdvantageCard
              icon={
                <Ionicons name="settings-outline" size={36} color="#0D6EFD" />
              }
              title="Custom-Made Solutions"
              text="Tailored systems designed to meet your precise requirements."
            />

            <AdvantageCard
              icon={<Feather name="check-circle" size={36} color="#0D6EFD" />}
              title="Uncompromising Quality"
              text="Rigorously tested for purity, performance, and reliability standards."
            />

            <AdvantageCard
              icon={
                <MaterialCommunityIcons
                  name="flask-outline"
                  size={36}
                  color="#0D6EFD"
                />
              }
              title="Continuous Innovation"
              text="We invest in R&D to deliver advanced filtration solutions that evolve with your needs."
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.container}>
            <View
              style={[
                styles.row,
                {flexDirection: IS_TABLET ? 'row' : 'column'},
              ]}>
              {/* LEFT CONTENT */}
              <View style={styles.left}>
                <Text style={styles.badge}>PRECISION IN EVERY DETAIL</Text>

                <Text style={styles.heading}>Engineering</Text>

                <Text style={styles.paragraph}>
                  At Niran, the Engineering department serves as the vital
                  bridge between visionary research and the manifestation of
                  tangible solutions. We view engineering as a sacred craft—an
                  art form where technical rigor meets a profound sense of
                  purpose. Our approach goes beyond mere functionality; we focus
                  on building robust, scalable architectures designed to endure
                  the tests of time and usage. By integrating modern
                  methodologies with a disciplined work ethic, our engineers
                  ensure that every system we create is optimized for peak
                  performance, safety, and sustainability.
                </Text>
              </View>

              {/* RIGHT IMAGE */}
              <View style={styles.right}>
                {/* <Image
                source={require('../../assets/images/engineering.png')}
                style={styles.image}
                resizeMode="cover"
              /> */}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.badge}>IGNITING THE SPARK OF DISCOVERY</Text>

            <Text style={styles.title}>Research & Development</Text>

            <Text style={styles.subtitle}>
              Experience reliable filtration, personalized solutions, and expert
              support—trusted by industry leaders for quality, compliance, and
              long-term partnership.
            </Text>
          </View>

          {/* GRID */}
          {images.length > 0 && (
            <View style={styles.gallery}>
              {images.map((item, index) => (
                <Pressable key={index} style={styles.imageCard}>
                  <Image
                    source={{uri: item}}
                    style={styles.image1}
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </View>
          )}

          {/* CTA */}
          <View style={styles.ctaWrapper}>
            {/* <Pressable style={styles.ctaButton} onPress={onViewAll}> */}
            <Pressable style={styles.ctaButton}>
              <Text style={styles.ctaText}>View All</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.badge}>THE HEARTS BEHIND THE VISION</Text>

            <Text style={styles.title}>A Symphony of Purpose & Dedication</Text>

            <Text style={styles.subtitle}>
              A collaborative family of innovators dedicated to excellence, we
              combine skill and heart to bring the Niran vision to life.
            </Text>
          </View>

          {/* GRID */}
          {teamImages.length > 0 ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.teamrow}>
              {team.map((item, index) => {
                const imageUrl = getPhotoUrl(item.uploadPhoto);

                return (
                  <View key={index} style={styles.teamcard}>
                    {imageUrl && (
                      <Image
                        source={{uri: imageUrl}}
                        style={styles.teamimage}
                        resizeMode="cover"
                      />
                    )}

                    {/* Dark gradient overlay */}
                    <View style={styles.teamoverlay} />

                    {/* Text content */}
                    <View style={styles.teamcontent}>
                      <Text style={styles.teamname}>{item.name}</Text>
                      <Text style={styles.teamdesignation}>
                        {item.designation}
                      </Text>
                      <Text style={styles.teamdescription} numberOfLines={3}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>No Leaders Found.</Text>
          )}
        </View>

        <View style={styles.wrapper}>
          {/* <ImageBackground source={videoBg} style={styles.bg} resizeMode="cover"> */}
          {/* Overlay */}
          <View style={styles.overlay} />

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.kicker}>See Our Solutions In Action</Text>

            <Text style={styles.title}>Watch Our Filtration Expertise</Text>

            <Text style={styles.subtitle}>
              Discover how NIRAN products elevate quality, safety, and
              efficiency in real-world applications.
            </Text>

            {videoId && (
              // <Pressable onPress={onPlay} style={styles.playWrap}>
              <Pressable style={styles.playWrap}>
                {/* Ripples */}
                <Animated.View style={[styles.ripple, rippleStyle(ripple1)]} />
                <Animated.View style={[styles.ripple, rippleStyle(ripple2)]} />
                <Animated.View style={[styles.ripple, rippleStyle(ripple3)]} />

                {/* Button */}
                <View style={styles.playBtn}>
                  <Ionicons name="play" size={28} color="#0D6EFD" />
                </View>
              </Pressable>
            )}
          </View>
          {/* </ImageBackground> */}
        </View>
      </ScrollView>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#EAF6FF',
    paddingVertical: 40,
  },

  header: {
    alignItems: IS_TABLET ? 'center' : 'flex-start',
    marginBottom: 40,
  },

  container: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },

  row: {
    flexDirection: IS_TABLET ? 'row' : 'column',
  },

  /* LEFT */
  left: {
    flex: 1,
    marginBottom: IS_TABLET ? 0 : 24,
  },

  leftRow: {
    flexDirection: 'row',
  },

  leftCol: {
    flex: 1,
  },

  smallImage: {
    height: 250,
    width: '100%',
    marginBottom: 16,
  },

  largeImage: {
    flex: 1,
    minHeight: 560,
  },

  imageRadius: {
    borderRadius: 16,
  },

  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsValue: {
    fontSize: 64,
    fontWeight: '800',
    color: '#0D6EFD',
  },

  statsLabel: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '600',
  },

  /* RIGHT */
  right: {
    flex: 1,
    paddingTop: 8,
  },

  badge: {
    backgroundColor: '#0D6EFD',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },

  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0D6EFD',
    marginBottom: 16,
  },

  featureRow: {
    flexDirection: IS_TABLET ? 'row' : 'column',
    marginBottom: 16,
  },

  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  icon: {
    width: 48,
    height: 48,
    marginRight: 12,
  },

  featureText: {
    fontWeight: '700',
    color: '#212529',
  },

  divider: {
    height: 1,
    backgroundColor: '#CED4DA',
    marginVertical: 12,
  },

  paragraph: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 10,
    lineHeight: 18,
  },

  mvSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  mvBadge: {
    backgroundColor: '#0D6EFD',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 12,
  },

  mvTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },

  mvSubtitle: {
    color: '#D0D7E2',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
  },

  cardsRow: {
    width: '100%',
    marginTop: 20,
  },

  card: {
    height: 420,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 12,
    backgroundColor: '#0D6EFD',
  },

  cardActive: {
    flex: 4,
  },

  cardInactive: {
    flex: 1,
  },

  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  overlayLight: {
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  overlayDark: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  cardContent: {
    padding: 20,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
  },

  cardText: {
    color: '#111',
    lineHeight: 22,
  },

  verticalText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    transform: [{rotate: '-90deg'}],
    alignSelf: 'center',
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  bullet: {
    color: '#fff',
    marginRight: 8,
    fontSize: 18,
    lineHeight: 22,
  },

  title: {
    fontSize: IS_TABLET ? 40 : 28,
    fontWeight: '800',
    color: '#0B5ED7',
    textAlign: IS_TABLET ? 'center' : 'left',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 14,
    color: '#495057',
    textAlign: IS_TABLET ? 'center' : 'left',
    lineHeight: 22,
    marginBottom: 24,
  },

  /* GRID */
  grid: {
    flexDirection: IS_TABLET ? 'row' : 'column',
  },

  advantageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E3EAF2',
    marginBottom: 16,
  },

  emptyText: {
    textAlign: 'center',
    color: '#0B5ED7',
    fontSize: 14,
    marginVertical: 32,
  },

  /* CTA */
  ctaWrapper: {
    marginTop: 32,
    alignItems: 'center',
  },

  ctaButton: {
    backgroundColor: '#6F42C1',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },

  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  content: {
    marginTop: 'auto',
    padding: 16,
  },

  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  designation: {
    color: '#E9ECEF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },

  description: {
    color: '#F1F3F5',
    fontSize: 13,
    lineHeight: 18,
  },

  image: {
    width: '100%',
    height: '100%',
  },
  wrapper: {
    height: IS_TABLET ? 600 : 450,
  },
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  kicker: {
    color: '#fff',
    fontSize: IS_TABLET ? 18 : Math.max(14, width * 0.04),
    lineHeight: 22,
    marginBottom: 8,
  },

  /* Play Button */
  playWrap: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 16, // RN >= 0.71
  },

  imageCard: {
    width: '100%',
    height: '10%', // 🔥 2 columns
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    elevation: 3,
  },

  image1: {
    width: '100%',
    height: 180, // adjust if needed
  },
  teamrow: {
    paddingHorizontal: 16,
    gap: 16, // spacing between cards
  },

  teamcard: {
    width: '100%',
    // CARD_WIDTH
    height: 360,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    elevation: 4,
  },

  teamimage: {
    width: '100%',
    height: '100%',
  },

  teamoverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(0,0,0,0.45)', // dark fade
  },

  teamcontent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },

  teamname: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  teamdesignation: {
    color: '#E5E7EB',
    fontSize: 14,
    marginTop: 4,
  },

  teamdescription: {
    color: '#D1D5DB',
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },

  teamemptyText: {
    textAlign: 'center',
    marginVertical: 24,
    color: '#666',
  },
});
