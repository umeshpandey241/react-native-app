import { setToken, setUserInfo } from '../sharedBase/baseServiceVar';
import { AsyncStorage, create, devtools, persist } from '../sharedBase/globalImport';


interface AuthStore {
  token: string | null;
  userDet: any | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  userInfo: (userDet: any) => void;
  logout: () => void;
  loggedInUserID: string | null;
  loggedInUser: (loggedInUserID: string) => void;
}

const asyncStorageWrapper = {
  getItem: async (name: string) => {
    const value = await AsyncStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name: string, value: any) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist<AuthStore>(
      (set) => ({
        token: null,
        isAuthenticated: false,
        login: (token: string) => {
          set({ token, isAuthenticated: true });
          setToken(token);
        },
        userDet:null,
        userInfo: (userDet: any) => {
          set({ userDet });
          setUserInfo(userDet);
        },
        logout: () => {
          set({ token: null, isAuthenticated: false });
          setToken('');
          setUserInfo({ id: 0, name: '', firstName: '', lastName: '', emailId: '', lastLogin: '', mobile: '', isAdmin: false, role: '', address: '', photoAttachment: [], state: '', district: '', isPremiumUser: false, totalPlot: 0 });
        },
        loggedInUserID: null,
        loggedInUser: (loggedInUserID: string) => {
          set({ loggedInUserID });
        },
      }),
      {
        name: 'auth-storage',
        storage:asyncStorageWrapper,
        merge: (persistedState, currentState) => {
          const typedState = persistedState as Partial<AuthStore> | undefined;
          if (typedState?.token) {
            setToken(typedState.token);
          }
          if (typedState?.userDet) {
            setUserInfo(typedState.userDet);
          }
          return {
            ...currentState,
            ...(typedState ?? {}),
          };
        },
      }
    )
  )
);
