/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useRef} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
// import AuthGuard from './components/AuthGuard';
import './i18n';
import {ThemeProvider} from './theme/ThemeContext';
// import 'react-native-devsettings/withAsyncStorage';
// import NativeDevSettings from 'react-native/Libraries/NativeModules/specs/NativeDevSettings';
import {
  createNativeStackNavigator,
  enableScreens,
  NavigationContainer,
  SafeAreaProvider,
  SafeAreaView,
  useColorScheme,
  AsyncStorage,
  isSensorAvailable,
  authenticateWithOptions,
  BackHandler,
} from './sharedBase/globalImport';
import {AppState} from 'react-native';
import {useLanguageStore} from './store/useLanguage.store';
import {useAuthStore} from './store/auth.store';
// import { RemoteNotification } from './screens/RemoteNotification';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import AboutHomes from './screens/about/AboutHomes';
import IndustriesList from './screens/industries/IndustriesList';
import IndustriesView from './screens/industries/IndustriesView';
import ProductsList from './screens/product/ProductList';
import ProductsView from './screens/product/ProductsView';
import {Product} from './core/model/product';
import BlogView from './screens/blogs/BlogView';
import BlogList from './screens/blogs/BlogList';
import EventDatasList from './screens/eventDatas/EventDatasList';
import EventDatasView from './screens/eventDatas/EventDatasView';
import CaseStudiesList from './screens/caseStudies/CaseStudiesList';
import CareersHome from './screens/career/CareersHome';
import HomesHome from './screens/home/HomesHome';
import Search from './screens/search/Search';
import ContactsHome from './screens/contacts/ContactsHome';

/* <!--router-link-admin-Import--> */

const queryClient = new QueryClient();
enableScreens();

export type RootStackParamList = {
  LoginPage: undefined;
  Register: undefined;
  AppUserList: undefined;
  AppUserHome: undefined;
  AppUserView: {id: any};
  AppUserEdit: {id?: any};
  // ProductList: undefined;
  Splash: undefined;
  Wellcome: undefined;
  RemoteNotification: undefined;
  // ProductView: {id: any};
  ProductEdit: {id?: any};
  NotAuthorized: undefined;
  DeleteUserScreen: undefined;
  AppUserTestsList: undefined;
  AppUserTestsHome: undefined;
  AppUserTestsView: {id: any};
  AppUserTestsEdit: {id?: any};

  HomesHome: undefined;
  AboutHomes: undefined;
  IndustriesList: undefined;
  IndustriesView: {slug: string};
  ProductList: undefined;
  ProductView: {slug: string};
  BlogList: undefined;
  BlogView: {slug: string};
  EventList: undefined;
  EventView: {slug: string};
  CaseStudiesList: undefined;
  CareersHome: undefined;
  ContactsHome: undefined;
  Search: {slug: string};

  //<!--router-link-admin-Export-->
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = (): React.JSX.Element => {
  // const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  //   flex: 1,
  // };

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
    flex: 1,
  };

  const {selectedLanguage, initializeLanguage} = useLanguageStore();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    initializeLanguage();

    const handleAppStateChange = async (nextAppState: string) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const {available} = await isSensorAvailable();
          if (available) {
            try {
              const result = await authenticateWithOptions({
                title: '🔐 Authenticate',
                subtitle: 'Verify your identity to continue',
                description: 'Use your biometric to access the app',
                cancelLabel: 'Cancel',
                allowDeviceCredentials: false,
                disableDeviceFallback: true,
              });

              if (!result.success) {
                BackHandler.exitApp();
              }
            } catch (error) {
              BackHandler.exitApp();
            }
          }
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, []);

  // const connectToRemoteDebugger = () => {
  //   NativeDevSettings.setIsDebuggingRemotely(true);
  // };
  // useEffect(() => {

  //   connectToRemoteDebugger();
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SafeAreaProvider>
          <SafeAreaView
            style={[backgroundStyle, {flex: 1}]}
            edges={['top', 'bottom']}>
            {/* <RemoteNotification /> */}
            {/* <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
          // barStyle="dark-content"
          // backgroundColor={Colors.lighter}
        /> */}
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{headerShown: false}}
                initialRouteName="HomesHome">
                {/* <!--router-link-admin--> */}
                {/* <Stack.Screen name="RemoteNotification" component={RemoteNotification} /> */}
                <Stack.Screen name="AboutHomes" component={AboutHomes} />
                <Stack.Screen
                  name="IndustriesList"
                  component={IndustriesList}
                />
                <Stack.Screen
                  name="IndustriesView"
                  component={IndustriesView}
                />
                <Stack.Screen name="HomesHome" component={HomesHome} />
                <Stack.Screen name="ProductList" component={ProductsList} />
                <Stack.Screen name="ProductView" component={ProductsView} />
                <Stack.Screen name="BlogList" component={BlogList} />
                <Stack.Screen name="BlogView" component={BlogView} />
                <Stack.Screen name="EventList" component={EventDatasList} />
                <Stack.Screen name="EventView" component={EventDatasView} />
                <Stack.Screen
                  name="CaseStudiesList"
                  component={CaseStudiesList}
                />
                <Stack.Screen name="CareersHome" component={CareersHome} />
                <Stack.Screen name="ContactsHome" component={ContactsHome} />
                <Stack.Screen name="Search" component={Search} />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
