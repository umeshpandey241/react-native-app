/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {RootStackParamList} from '../App';
import {SidebarStyles} from '../styles/SidebarStyles';
import {useTheme} from '../theme/ThemeContext';
import {
  // Alert,
  Animated,
  AsyncStorage,
  Dimensions,
  MaterialCommunityIcons,
  Modal,
  NativeStackNavigationProp,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useNavigation,
  useTranslation,
  View,
} from '../sharedBase/globalImport';
import {useLanguageStore} from '../store/useLanguage.store';
import Collapsible from 'react-native-collapsible';
import {StatusBar, TextInput} from 'react-native';
import FormFieldError from './FormFieldError';
import {getAll as getAllProducts} from '../core/service/products.service';
import {getAll as getAllIndustries} from '../core/service/industries.service';
import {searchValidate} from '../schema/search';
import {ScrollView} from 'react-native';
import EnquiryForm from './EnquiryForm';
import {getNavbarData} from '../core/service/homes.service';

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
  const {mode, toggleTheme, theme} = useTheme();
  const {selectedLanguage, setLanguage} = useLanguageStore();
  const slideAnim = useRef(new Animated.Value(-300)).current;
  // const androidPackageName = 'com.banquetwazl';
  const styles = SidebarStyles();
  const [isProductCollapsed, setIsProductCollapsed] = useState(true);
  const [isIndustryCollapsed, setIsIndustryCollapsed] = useState(true);
  const [isResourseCollapsed, setIsResourseCollapsed] = useState(true);
  const [isIndustriesCollapsed, setIsIndustriesCollapsed] = useState(true);
  const [isMedsCollapsed, setIsMedsCollapsed] = useState(true);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [openSearchBox, setOpenSearchBox] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [products, setProducts] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryFormOpen, setEnquiryFormOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [navData, setNavData] = useState<any>(null);
  const [loadingData] = useState(false);
  const [isSelected, setIsSelected] = useState<Boolean>(false);
  // const androidPackageName = 'com.standalonern';
  // const iosAppId = '310633997';

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
    const loadNav = async () => {
      const data = await getNavbarData();
      setNavData(data);
    };
    loadNav();
  }, []);

  const productList = navData?.product || [];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

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

  const handleNavigation = (path: string) => {
    navigation.navigate({name: path as keyof RootStackParamList} as any);
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

  const resourcesOptions = [
    {label: 'Blogs', value: 'BlogList'},
    {label: 'Events', value: 'EventList'},
    {label: 'Cart', value: 'CartsList'},
    {label: 'WishList', value: 'WishLists'},
    // {label: 'Case Study', value: 'CaseStudiesList'},
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
                  <TouchableOpacity
                    onPress={() =>
                      handleNavigationWithActive('HomesHome', 'Home')
                    }
                    style={[
                      styles.menu,
                      activeButton === 'Home' ? styles.activeButton : null,
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialCommunityIcons
                        name="home"
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
                        name="account"
                        size={24}
                        style={styles.primaryColor}
                      />
                      <Text style={styles.menuItem}>About us</Text>
                    </View>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
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
                        name="factory"
                        size={24}
                        style={styles.primaryColor}
                      />
                      <Text style={styles.menuItem}>Industries</Text>
                    </View>
                  </TouchableOpacity> */}

                  <TouchableOpacity
                    onPress={() =>
                      handleButtonPress('product', () =>
                        setIsProductCollapsed(!isProductCollapsed),
                      )
                    }
                    style={[
                      styles.menu,
                      activeButton === 'Product' && styles.activeButton,
                    ]}>
                    <View style={styles.menuRow}>
                      {/* LEFT ICON + TEXT */}
                      <View style={styles.leftContent}>
                        <MaterialCommunityIcons
                          name="package-variant-closed"
                          size={24}
                          style={styles.primaryColor}
                        />
                        <Text style={styles.menuItem}>Product</Text>
                      </View>

                      {/* RIGHT DROPDOWN ICON */}
                      <MaterialCommunityIcons
                        name={
                          isProductCollapsed ? 'chevron-down' : 'chevron-up'
                        }
                        size={22}
                        color="#6B7280"
                      />
                    </View>
                  </TouchableOpacity>

                  <Collapsible
                    collapsed={isProductCollapsed}
                    style={[activeButton === 'Product' && styles.activeButton]}>
                    {productList.map((item: any) => {
                      return (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => {
                            navigation.navigate('ProductView', {
                              slug: item.slug,
                              id: item.id,
                            });
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
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </Collapsible>

                  <TouchableOpacity
                    onPress={() =>
                      handleButtonPress('Industries', () =>
                        setIsIndustryCollapsed(!isIndustryCollapsed),
                      )
                    }
                    style={[
                      styles.menu,

                      activeButton === 'Industries' && styles.activeButton,
                    ]}>
                    <View style={styles.menuRow}>
                      {/* LEFT ICON + TEXT */}
                      <View style={styles.leftContent}>
                        <MaterialCommunityIcons
                          name="trash-can"
                          size={24}
                          style={styles.primaryColor}
                        />
                        <Text style={styles.menuItem}>Industries</Text>
                      </View>

                      {/* RIGHT DROPDOWN ICON */}
                      <MaterialCommunityIcons
                        name={
                          isIndustryCollapsed ? 'chevron-down' : 'chevron-up'
                        }
                        size={22}
                        color="#6B7280"
                      />
                    </View>
                  </TouchableOpacity>

                  <Collapsible
                    collapsed={isIndustryCollapsed}
                    style={[
                      activeButton === 'Industries' && styles.activeButton,
                    ]}>
                    <TouchableOpacity
                      onPress={() => {
                        handleButtonPress('Food', () =>
                          setIsIndustriesCollapsed(!isIndustriesCollapsed),
                        );
                      }}
                      style={[
                        {paddingVertical: 5, paddingLeft: 34},
                        isSelected && {
                          backgroundColor: '#ffff',
                          borderRadius: 5,
                        },
                      ]}>
                      <View style={styles.menuRow}>
                        <View style={styles.leftContent}>
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
                            Food & Bevrages
                          </Text>
                        </View>

                        {/* RIGHT DROPDOWN ICON */}
                        <MaterialCommunityIcons
                          name={
                            isIndustriesCollapsed
                              ? 'chevron-down'
                              : 'chevron-up'
                          }
                          size={22}
                          color="#6B7280"
                        />
                      </View>
                    </TouchableOpacity>
                    <Collapsible
                      collapsed={isIndustriesCollapsed}
                      style={[activeButton === 'Food' && styles.activeButton]}>
                      {navData?.foodBeverages
                        ?.slice()
                        ?.sort((a: any, b: any) => a.name.localeCompare(b.name))
                        ?.map((item: any) => {
                          return (
                            <TouchableOpacity
                              key={item.id}
                              onPress={() => {
                                navigation.navigate('IndustriesView', {
                                  slug: item.slug,
                                });
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
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                    </Collapsible>

                    <TouchableOpacity
                      onPress={() => {
                        handleButtonPress('Meds', () =>
                          setIsMedsCollapsed(!isMedsCollapsed),
                        );
                      }}
                      style={[
                        {paddingVertical: 5, paddingLeft: 34},
                        isSelected && {
                          backgroundColor: '#ffff',
                          borderRadius: 5,
                        },
                      ]}>
                      <View style={styles.menuRow}>
                        <View style={styles.leftContent}>
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
                            pharmaceuticals
                          </Text>
                        </View>

                        {/* RIGHT DROPDOWN ICON */}
                        <MaterialCommunityIcons
                          name={
                            isIndustriesCollapsed
                              ? 'chevron-down'
                              : 'chevron-up'
                          }
                          size={22}
                          color="#6B7280"
                        />
                      </View>
                    </TouchableOpacity>
                    <Collapsible
                      collapsed={isMedsCollapsed}
                      style={[activeButton === 'Meds' && styles.activeButton]}>
                      {navData?.pharmaceuticals
                        ?.slice()
                        ?.sort((a: any, b: any) => a.name.localeCompare(b.name))
                        ?.map((item: any) => {
                          return (
                            <TouchableOpacity
                              key={item.id}
                              onPress={() => {
                                navigation.navigate('IndustriesView', {
                                  slug: item.slug,
                                });
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
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                    </Collapsible>
                  </Collapsible>

                  <TouchableOpacity
                    onPress={() =>
                      handleButtonPress('resources', () =>
                        setIsResourseCollapsed(!isResourseCollapsed),
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
                        name={
                          isResourseCollapsed ? 'chevron-down' : 'chevron-up'
                        }
                        size={22}
                        color="#6B7280"
                      />
                    </View>
                  </TouchableOpacity>

                  <Collapsible
                    collapsed={isResourseCollapsed}
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
                            setIsResourseCollapsed(true);
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
                      handleNavigationWithActive('AppUserEdit', 'AppUserEdit')
                    }
                    style={[
                      styles.menu,
                      activeButton === 'AppUserEdit' && styles.activeButton,
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialCommunityIcons
                        name="translate"
                        size={24}
                        style={styles.primaryColor}
                      />
                      <Text style={styles.menuItem}>Edit</Text>
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
                    onPress={() => {
                      handleOpenForm();
                      onClose();
                    }}
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
                      handleNavigationWithActive('ContactsHome', 'Contact')
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
                {/* <TouchableOpacity
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
                </TouchableOpacity> */}
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
        statusBarTranslucent
        onRequestClose={() => {}}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Enquiry Details</Text>
            </View>

            {/* Body */}
            <ScrollView
              style={styles.body}
              contentContainerStyle={styles.bodyContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <EnquiryForm
                setEnquiryFormOpen={setEnquiryFormOpen}
                products={products}
                industries={industries}
              />
            </ScrollView>

            {/* Footer (optional) */}
            <View style={styles.footer} />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Sidebar;
