/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import Sidebar from './SideBar';
import {HeaderStyles} from '../styles/HeaderStyles';
import {
  AsyncStorage,
  MaterialCommunityIcons,
  NativeStackNavigationProp,
  Text,
  TouchableOpacity,
  useNavigation,
  useRoute,
  View,
} from '../sharedBase/globalImport';
import {RootStackParamList} from '../App';

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'AppUserHome'
>;

const Header = ({Heading = ''}: {Heading?: string}) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const [loginUserInfo, setLoginUserInfo] = useState<any>();
  const styles = HeaderStyles();

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

  const toggleSidebar = () => setSidebarVisible(prev => !prev);
  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('AppUserHome');
    }
  };

  return (
    <>
      <View style={[styles.header]}>
        <View style={styles.menuParent}>
          <>
            <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
              <MaterialCommunityIcons
                name="menu"
                size={28}
                style={styles.primaryColor}
              />
            </TouchableOpacity>
            <Text style={[styles.text]}>Hi, {loginUserInfo?.firstName}</Text>
          </>
        </View>
      </View>

      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
    </>
  );
};

export default Header;
