/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { RootStackParamList } from '../App';
import { FooterStyles } from '../styles/FooterStyles';
import { useTheme } from '../theme/ThemeContext';
import { MaterialCommunityIcons, NativeStackNavigationProp, useNavigation, useRoute, View, TouchableOpacity, Text, useTranslation } from '../sharedBase/globalImport';
import { useFetchRoleDetailsData } from '../sharedBase/lookupService';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'AppUserHome'>;


const Footer = () => {
  const navigation = useNavigation<NavigationProps>();
  const [roleData, setRoleData] = useState<any>([]);
  const styles = FooterStyles();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(1);
  const route = useRoute();
  const { theme } = useTheme();
  const { data: roleDetailsData } = useFetchRoleDetailsData();
  const { t } = useTranslation();

  const [filters, setFilters] = useState([
    { id: 1, name: 'Filter Item 1', content: 'Filter Item 1 Content' },
    { id: 2, name: 'Filter Item 2', content: 'Filter Item 2 Content' },
    { id: 3, name: 'Filter Item 3', content: 'Filter Item 3 Content' },
  ]);

  const openModal = (type: React.SetStateAction<string>) => {
    setModalType(type);
    setModalVisible(true);
  };

  useEffect(() => {
    const getRoleData = async () => {
      try {
        if (roleDetailsData && roleDetailsData.length > 0) {
          setRoleData(roleDetailsData);
        }
      } catch (error) {
        console.error('Error fetching role data:', error);
      }
    };

    getRoleData();
  }, [roleDetailsData]);

  const hasAccessToPage = (pageName: string) => {
    return roleData.some((action: any) => action.name.toLowerCase() === pageName.toLowerCase());
  };

  const handleNavigation = (path: string, pageName: string) => {
    if (hasAccessToPage(pageName)) {
      navigation.navigate({ name: path as keyof RootStackParamList } as any);
    } else {
      navigation.navigate('NotAuthorized');
    }
  };

  const openAddForm = () => {
    if (route.name === 'AppUserList') {
      navigation.navigate('AppUserEdit', { id: undefined });
    } else if (route.name === 'ProductList') {
      navigation.navigate('ProductEdit', { id: undefined });
    }
  };

  const hasAccess = (role: any, requiredAction: string) => {
    if (!role) { return false; }

    const actions = typeof role.action === 'string' ? JSON.parse(role.action) : [];

    return actions.some((action: any) => action.name.toLowerCase() === requiredAction.toLowerCase());
  };


  return (
    <View style={[styles.footer]}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('AppUserHome')}>
        <MaterialCommunityIcons name="home-outline" size={24} color={theme.primary} />
        <Text style={styles.buttonText}>
          {t('appUsers.form_detail.fields.modelname')}{"\n"}{t('globals.homes')}
        </Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('AppUserHome')}>
        <MaterialCommunityIcons name="heart-outline" size={24} color={theme.primary} />
        <Text style={styles.buttonText}>WishList</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('AppUserHome')}>
        <MaterialCommunityIcons name="cart-outline" size={24} color={theme.primary} />
        <Text style={styles.buttonText}>Cart</Text>
      </TouchableOpacity> */}

      {/* {hasAccess(roleData.find((r: any) => r.name.toLowerCase() === 'appuser'), 'List') && ( */}
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('AppUserList')}>
        <MaterialCommunityIcons name="account-outline" size={24} color={theme.primary} />
        <Text style={styles.buttonText}>
          {t('appUsers.form_detail.fields.modelname')}{"\n"} {t('globals.list')}
        </Text>
      </TouchableOpacity>
      {/* )} */}

      {/* {hasAccess(roleData.find((r: any) => r.name.toLowerCase() === 'product'), 'List') && ( */}
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('ProductList')}>
        <MaterialCommunityIcons name="package-variant-closed" size={24} color={theme.primary} />
        <Text style={styles.buttonText}>
          {t('products.form_detail.fields.modelname')}{"\n"} {t('globals.list')}
        </Text>
      </TouchableOpacity>
      {/* )} */}

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('AppUserTestsHome')}>
        <MaterialCommunityIcons name="home-outline" size={24} color={theme.primary} />
        <Text style={styles.buttonText}>
          {t('appUserTests.form_detail.fields.modelname')}{"\n"}{t('globals.homes')}
        </Text>
      </TouchableOpacity>

      {/* {hasAccess(roleData.find((r: any) => r.name.toLowerCase() === 'AppUserTest'), 'List') && ( */}
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('AppUserTestsList')}>
        <MaterialCommunityIcons name="account-outline" size={24} color={theme.primary} />
        <Text style={styles.buttonText}>
          {t('appUserTests.form_detail.fields.modelname')} {"\n"}{t('globals.list')}
        </Text>
      </TouchableOpacity>
      {/* )} */}

      {/* <TouchableOpacity style={[styles.button]} onPress={() => openModal('sort')}>
        <MaterialCommunityIcons name="sort" size={20} style={styles.primaryColor} />
        <Text style={styles.buttonText}>Sort</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.floatingButton]} onPress={() => openAddForm()}>
        <MaterialCommunityIcons name="plus" size={30} style={styles.primaryColor} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openModal('filter')} style={[styles.button]}>
        <MaterialCommunityIcons name="filter" size={20} style={styles.primaryColor} />
        <Text style={[styles.buttonText]}>Filter</Text>
        <View style={[styles.filterBadge]}><Text style={[styles.badgeText]}>2</Text></View>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {modalType === 'sort' ? 'Sort By' : 'Filters'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            {modalType === 'sort' ? (
              <>
                <TouchableOpacity style={styles.sortOption}>
                  <Text style={styles.sortText}>Popularity</Text>
                  <View style={styles.radioButton} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sortOption}>
                  <Text style={styles.sortText}>What's New</Text>
                  <View style={styles.radioButton} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sortOption}>
                  <Text style={styles.sortText}>Recently Rebalanced</Text>
                  <View style={styles.radioButton} />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Min. SIP Amount</Text>
                <View style={styles.sortRow}>
                  <TouchableOpacity style={styles.sortButton}>
                    <Text>High - Low</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sortButton}>
                    <Text>Low - High</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Min. One Time Amount</Text>
                <View style={styles.sortRow}>
                  <TouchableOpacity style={styles.sortButton}>
                    <Text>High - Low</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sortButton}>
                    <Text>Low - High</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Returns</Text>
                <View style={styles.sortRow}>
                  <TouchableOpacity style={styles.sortButton}>
                    <Text>High - Low</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sortButton}>
                    <Text>Low - High</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.modalBody}>
                  <View style={styles.filterList}>
                    {filters.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.filterItem,
                          selectedFilter === item.id && styles.activeFilterItem,
                        ]}
                        onPress={() => setSelectedFilter(item.id)}
                      >
                        <Text style={selectedFilter === item.id ? styles.activeFilterText : styles.filterText}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.filterContent}>
                    {selectedFilter && (
                      <Text style={styles.filterContentText}>
                        {filters.find((f) => f.id === selectedFilter)?.content}
                      </Text>
                    )}
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

    </View>
  );
};



export default Footer;
