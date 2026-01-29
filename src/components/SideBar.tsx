/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {RootStackParamList} from '../App';
import {useAuthStore} from '../store/auth.store';
import {SidebarStyles} from '../styles/SidebarStyles';
import {useTheme} from '../theme/ThemeContext';
import {
  Alert,
  Animated,
  AsyncStorage,
  Dimensions,
  // Image,
  InAppReview,
  Linking,
  MaterialCommunityIcons,
  Modal,
  NativeStackNavigationProp,
  Platform,
  // SafeAreaView,
  // ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useNavigation,
  useTranslation,
  View,
} from '../sharedBase/globalImport';
import {useLanguageStore} from '../store/useLanguage.store';
import Collapsible from 'react-native-collapsible';
// import {useFetchRoleDetailsData} from '../sharedBase/lookupService';
import {StatusBar, TextInput} from 'react-native';
import FormFieldError from './FormFieldError';
import {getAll as getAllProducts} from '../core/service/products.service';
import {getAll as getAllIndustries} from '../core/service/industries.service';
import {searchValidate} from '../schema/search';
import {ScrollView} from 'react-native';
import EnquiryForm from './EnquiryForm';

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'AppUserHome'
>;

type SidebarProps = {
  isVisible: boolean;
  onClose: () => void;
};

const {width} = Dimensions.get('window');

const Sidebar = ({isVisible, onClose}: SidebarProps) => {
  const {t, i18n} = useTranslation();
  const searchSchema = searchValidate(t);
  const navigation = useNavigation<NavigationProps>();
  const login = useAuthStore(state => state.login);
  // const [roleData, setRoleData] = useState<any>([]);
  const {mode, toggleTheme, theme} = useTheme();
  const {selectedLanguage, setLanguage} = useLanguageStore();
  const [loginUserInfo, setLoginUserInfo] = useState<any>();
  const slideAnim = useRef(new Animated.Value(-300)).current;
  // const androidPackageName = 'com.banquetwazl';
  const styles = SidebarStyles();
  const [isLangCollapsed, setIsLangCollapsed] = useState(true);
  // const [isThemeCollapsed, setIsThemeCollapsed] = useState(true);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  //   const {data: roleDetailsData} = useFetchRoleDetailsData();
  const [openSearchBox, setOpenSearchBox] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [products, setProducts] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryFormOpen, setEnquiryFormOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [open, setOpen] = useState(false);

  const androidPackageName = 'com.standalonern';
  const iosAppId = '310633997';

  // const rateApp = () => {
  //   if (Platform.OS === 'android') {
  //     if (InAppReview.isAvailable()) {
  //       InAppReview.RequestInAppReview()
  //         .then(hasFlowFinishedSuccessfully => {
  //           if (!hasFlowFinishedSuccessfully) {
  //             Linking.openURL(`market://details?id=${androidPackageName}`);
  //           }
  //         })
  //         .catch(error => console.log(error));
  //     } else {
  //       Linking.openURL(`market://details?id=${androidPackageName}`);
  //     }
  //   } else if (Platform.OS === 'ios') {
  //     Linking.openURL(
  //       `itms-apps://itunes.apple.com/app/id${iosAppId}?action=write-review`,
  //     );
  //   } else {
  //     Alert.alert(
  //       'Unsupported Platform',
  //       'Rating is only available on Android and iOS.',
  //     );
  //   }
  //   navigation.navigate('AppUserHome');
  // };

  useEffect(() => {
    const fetchProduct = async () => {
      const fetchProducts = await getAllProducts();
      setProducts(fetchProducts);
    };
    fetchProduct();

    const fetchIndustrie = async () => {
      const fetchIndustries = await getAllIndustries();
      setIndustries(fetchIndustries);
    };
    fetchIndustrie();
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          setLoginUserInfo(JSON.parse(userInfo));
        }
      } catch (error) {
        console.error('Error getting user info:', error);
      }
    };
    getUserInfo();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -width, // full screen width off-screen
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  //   useEffect(() => {
  //     const getRoleData = async () => {
  //       try {
  //         if (roleDetailsData && roleDetailsData.length > 0) {
  //           setRoleData(roleDetailsData);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching role data:', error);
  //       }
  //     };

  //     getRoleData();
  //   }, []);

  const handleSearchData = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    setErrors({});

    const result = searchSchema.name.safeParse(searchText);

    if (!result.success) {
      setErrors({
        name: result.error.errors[0]?.message ?? '',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      navigation.navigate('Search', {
        searchText: searchText,
      });

      setOpenSearchBox(false);
      setSearchText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    login('');
    navigation.reset({
      index: 0,
      routes: [{name: 'LoginPage'}],
    });
    onClose();
  };

  // const hasAccessToPage = (pageName: string) => {
  //   return roleData.some(
  //     (action: any) => action.name.toLowerCase() === pageName.toLowerCase(),
  //   );
  // };

  const handleNavigation = (path: string, pageName: string) => {
    // if (hasAccessToPage(pageName)) {
    navigation.navigate({name: path as keyof RootStackParamList} as any);
    // } else {
    //     navigation.navigate('NotAuthorized');
    // }
    onClose();
  };
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);

  const handleLanguageChange = (language: any) => {
    setLanguage(language);
    i18n.changeLanguage(language);
    AsyncStorage.setItem('app_language', language);
  };

  // const hasAccess = (roleData: any, requiredAction: string) => {
  //     if (!roleData) { return false; }

  //     const actions = typeof roleData.action === 'string' ? JSON.parse(roleData.action) : [];

  //     return actions.some((action: any) => action.name.toLowerCase() === requiredAction.toLowerCase());
  // };

  // const themeOptions = [
  //   {label: 'Light Theme', value: 'light'},
  //   {label: 'Dark Theme', value: 'dark'},
  //   {label: 'Blue Theme', value: 'blue'},
  //   {label: 'Green Theme', value: 'green'},
  //   {label: 'Purple Theme', value: 'purple'},
  //   {label: 'Red Theme', value: 'red'},
  //   {label: 'Orange Theme', value: 'orange'},
  // ];
  // const languageOptions = [
  //   {label: t('globals.english'), value: 'en'},
  //   {label: t('globals.hindi'), value: 'hi'},
  //   {label: t('globals.marathi'), value: 'mr'},
  // ];
  const resourcesOptions = [
    {label: 'Blogs', value: 'BlogList'},
    {label: 'Events', value: 'EventList'},
    {label: 'Case Study', value: 'CaseStudiesList'},
  ];

  const handleButtonPress = (buttonName: string, action: () => void) => {
    setActiveButton(buttonName);
    action();
  };

  const handleNavigationWithActive = (screen: string, type: string) => {
    setActiveButton(screen);
    handleNavigation(screen, type);
  };

  const handleOpenForm = () => {
    if (!loadingData) {
      setOpen(false);
      setEnquiryFormOpen(true);
    }
  };

  return (
    <>
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="none"
        onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.sidebar,
                  {transform: [{translateX: slideAnim}]},
                ]}>
                <View
                  style={{
                    paddingTop:
                      Platform.OS === 'android' ? StatusBar.currentHeight : 40,
                    paddingBottom: 80,
                  }}>
                  <View style={styles.userDetail}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      {/* <Image
                      source={require('../assets/images/user3.jpeg')}
                      style={styles.image}
                    /> */}
                      <Text style={styles.name}>
                        {loginUserInfo?.firstName}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={onClose}
                      style={styles.closeButton}>
                      <MaterialCommunityIcons
                        name="close"
                        size={24}
                        style={styles.primaryColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      handleNavigationWithActive('AppUserHome', 'AppUser')
                    }
                    style={[
                      styles.menu,
                      activeButton === 'Home' ? styles.activeButton : null,
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialCommunityIcons
                        name="home-outline"
                        size={24}
                        style={styles.primaryColor}
                      />
                      <Text style={styles.menuItem}>Home</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      handleNavigationWithActive('AboutHomes', 'About')
                    }
                    style={[
                      styles.menu,
                      activeButton === 'About' ? styles.activeButton : null,
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialCommunityIcons
                        name="account-outline"
                        size={24}
                        style={styles.primaryColor}
                      />
                      <Text style={styles.menuItem}>About us</Text>
                    </View>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                  onPress={() =>
                    handleNavigationWithActive(
                      'AppUserTestsList',
                      'AppUserTests',
                    )
                  }
                  style={[
                    styles.menu,
                    activeButton === 'AppUserTestsList'
                      ? styles.activeButton
                      : null,
                  ]}>
                  <View style={{flexDirection: 'row'}}>
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={24}
                      style={styles.primaryColor}
                    />
                    <Text style={styles.menuItem}>
                      {t('appUserTests.form_detail.fields.modelname')}{' '}
                      {t('globals.list')}
                    </Text>
                  </View>
                </TouchableOpacity> */}

                  <TouchableOpacity
                    onPress={() =>
                      handleNavigationWithActive('ProductList', 'Product')
                    }
                    style={[
                      styles.menu,
                      activeButton === 'Product' ? styles.activeButton : null,
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialCommunityIcons
                        name="package-variant-closed"
                        size={24}
                        style={styles.primaryColor}
                      />
                      <Text style={styles.menuItem}>Product</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      handleNavigationWithActive('IndustriesList', 'Industries')
                    }
                    style={[
                      styles.menu,
                      activeButton === 'Industries' && styles.activeButton,
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialCommunityIcons
                        name="star-outline"
                        size={24}
                        style={styles.primaryColor}
                      />
                      <Text style={styles.menuItem}>Industries</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      handleButtonPress('resources', () =>
                        setIsLangCollapsed(!isLangCollapsed),
                      )
                    }
                    style={[
                      styles.menu,
                      activeButton === 'Resources' && styles.activeButton,
                    ]}>
                    <View style={styles.menuRow}>
                      {/* LEFT ICON + TEXT */}
                      <View style={styles.leftContent}>
                        <MaterialCommunityIcons
                          name="trash-can"
                          size={24}
                          style={styles.primaryColor}
                        />
                        <Text style={styles.menuItem}>Resources</Text>
                      </View>

                      {/* RIGHT DROPDOWN ICON */}
                      <MaterialCommunityIcons
                        name={isLangCollapsed ? 'chevron-down' : 'chevron-up'}
                        size={22}
                        color="#6B7280"
                      />
                    </View>
                  </TouchableOpacity>

                  <Collapsible
                    collapsed={isLangCollapsed}
                    style={[
                      activeButton === 'resources' && styles.activeButton,
                    ]}>
                    {resourcesOptions.map((lang, index) => {
                      const isSelected = selectedLanguage === lang.value;

                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            handleLanguageChange(lang.value);
                            setIsLangCollapsed(true);
                            navigation.navigate(lang.value);
                          }}
                          style={[
                            {paddingVertical: 5, paddingLeft: 34},
                            isSelected && {
                              backgroundColor: '#ffff',
                              borderRadius: 5,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.menuItem,
                              {
                                paddingVertical: 5,
                                paddingLeft: 34,
                                color: isSelected ? 'black' : theme.text,
                                fontWeight: isSelected ? 'bold' : 'normal',
                              },
                            ]}>
                            {lang.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </Collapsible>

                  <TouchableOpacity
                    onPress={() =>
                      handleNavigationWithActive('CareersHome', 'Career')
                    }
                    style={[
                      styles.menu,
                      activeButton === 'Career' && styles.activeButton,
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialCommunityIcons
                        name="translate"
                        size={24}
                        style={styles.primaryColor}
                      />
                      <Text style={styles.menuItem}>Career</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Search Icon */}
                  <TouchableOpacity
                    onPress={() => setOpenSearchBox(true)}
                    style={styles.searchIcon}>
                    <MaterialCommunityIcons
                      name="magnify"
                      size={22}
                      style={styles.primaryColor}
                    />
                  </TouchableOpacity>

                  {/* Enquiry Button */}
                  <TouchableOpacity
                    onPress={handleOpenForm}
                    style={styles.actionButton}>
                    <MaterialCommunityIcons
                      name="message-text-outline"
                      size={18}
                      style={styles.primaryColor}
                    />
                    <Text style={styles.actionText}>Enquiry</Text>
                  </TouchableOpacity>

                  {/* Contact Us Button */}
                  <TouchableOpacity
                    onPress={() =>
                      handleNavigationWithActive('Contacts', 'Contact')
                    }
                    style={styles.actionButton}>
                    <MaterialCommunityIcons
                      name="headset"
                      size={18}
                      style={styles.primaryColor}
                    />
                    <Text style={styles.actionText}>Contact Us</Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                  onPress={() =>
                    handleButtonPress('theme', () =>
                      setIsThemeCollapsed(!isThemeCollapsed),
                    )
                  }
                  style={[
                    styles.menu,
                    activeButton === 'theme' && styles.activeButton,
                  ]}>
                  <View style={{flexDirection: 'row'}}>
                    <MaterialCommunityIcons
                      name="theme-light-dark"
                      size={24}
                      style={styles.primaryColor}
                    />
                    <Text style={styles.menuItem}>
                      {t('globals.changeTheme')}
                    </Text>
                  </View>
                </TouchableOpacity>

                <Collapsible
                  collapsed={isThemeCollapsed}
                  style={[activeButton === 'theme' && styles.activeButton]}>
                  <View style={{maxHeight: 200}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {themeOptions.map((themeOption, index) => {
                        const isSelected = mode === themeOption.value;

                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              toggleTheme(themeOption.value);
                              setIsThemeCollapsed(true);
                              onClose();
                            }}
                            style={[
                              {paddingVertical: 5, paddingLeft: 34},
                              isSelected && {
                                backgroundColor: '#ffff',
                                borderRadius: 5,
                              },
                            ]}>
                            <Text
                              style={[
                                styles.menuItem,
                                {
                                  color: isSelected ? 'black' : theme.text,
                                  fontWeight: isSelected ? 'bold' : 'normal',
                                },
                              ]}>
                              {themeOption.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                </Collapsible> */}
                </View>
                <TouchableOpacity
                  onPress={() => handleButtonPress('logout', handleLogout)}
                  style={[
                    styles.menu,
                    activeButton === 'logout' && styles.activeButton,
                    {position: 'absolute', bottom: 0, left: 0, right: 0},
                  ]}>
                  <View style={{flexDirection: 'row'}}>
                    <MaterialCommunityIcons
                      name="logout"
                      size={24}
                      style={styles.primaryColor}
                    />
                    <Text style={styles.menuItem}>{t('globals.logout')}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={openSearchBox}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenSearchBox(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setOpenSearchBox(false)}>
              <MaterialCommunityIcons name="close" size={20} color="#333" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              What would you like to know about?
            </Text>

            <View style={styles.searchRow}>
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Explore more products here"
                placeholderTextColor="#9ca3af"
                style={styles.searchInput}
              />

              <TouchableOpacity
                style={styles.exploreButton}
                onPress={handleSearchData}>
                <Text style={styles.exploreText}>Explore More</Text>
              </TouchableOpacity>
            </View>

            <FormFieldError field="name" errors={errors} />
          </View>
        </View>
      </Modal>

      <Modal
        visible={enquiryFormOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {}} // prevent Android back close
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Enquiry Details</Text>
            </View>

            {/* Body (scrollable) */}
            <ScrollView
              style={styles.body}
              contentContainerStyle={{paddingBottom: 20}}
              showsVerticalScrollIndicator={false}>
              <EnquiryForm
                setEnquiryFormOpen={setEnquiryFormOpen}
                products={products}
                industries={industries}
                loadingData={loadingData}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Sidebar;
