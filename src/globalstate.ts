import {
  create,
  createJSONStorage,
  persist,
} from '../src/sharedBase/globalUtils';
import {AppUser} from './core/model/appUser';
import {CartItem} from './types/cart';

interface GlobalStore {
  cartListList: CartItem[];
  userId: number;
  setCartListList: (list: CartItem[]) => void;
  setUserId: (userid: number) => void;
}

export const globalStore = create<GlobalStore>()(
  persist(
    set => ({
      cartListList: [],
      userId: 0,
      setCartListList: list => set({cartListList: list}),
      setUserId: (userid: number) => {
        const parsedUserId = Number(userid);
        if (!isNaN(parsedUserId)) {
          set({userId: parsedUserId});
        } else {
          console.error('Invalid userId: Must be a number');
        }
      },
    }),
    {
      name: 'login-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

interface LoginStore {
  email: string;
  password: string;
  token: string | null;
  user: AppUser | null;
  hasHydrated: boolean;

  setEmail: (no: string) => void;
  setPassword: (no: string) => void;
  setToken: (token: string) => void;
  setUser: (user: AppUser) => void;
  setHasHydrated: (value: boolean) => void;
  clearAuth: () => void;
}

export const LoginStore = create<LoginStore>()(
  persist(
    set => ({
      email: '',
      password: '',
      token: null,
      user: null,
      hasHydrated: false,

      setEmail: value => set({email: value}),
      setPassword: value => set({password: value}),
      setToken: token => set({token}),
      setHasHydrated: value => set({hasHydrated: value}),
      setUser: user => set({user}),

      clearAuth: () =>
        set({
          email: '',
          password: '',
          token: null,
          user: null,
        }),
    }),
    {
      name: 'login-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
