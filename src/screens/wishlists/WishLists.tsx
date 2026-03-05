import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getPhotoUrl} from '../about/AboutHomes';
import {WishList} from '../../core/model/wishlist';
import {globalStore, LoginStore} from '../../globalstate';
import {
  deleteWatchlist,
  getWatchlist,
} from '../../core/service/wishLists.service';
import {cartQuantityUpdate} from '../../core/service/carts.service';
import {Cart} from '../../core/model/cart';
// import {use} from 'i18next';
import {useNavigation} from '../../sharedBase/globalImport';

const WishLists = () => {
  // const toast = useRef<Toast>(null);
  const [wishListsData, setWishListsData] = useState<WishList[]>([]);
  const [items, setItems] = useState<WishList[]>([]);
  const {setCartListList} = globalStore();
  const user = LoginStore(state => state.user);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWatchlist();
      setWishListsData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setItems(wishListsData);
  }, [wishListsData]);

  const addToCart = async (item: any) => {
    const cartData: Cart = {
      name: item.name,
      slug: item.slug,
      qty: 1,
      regularPrice: item.regularPrice,
      salePrice: item.salePrice,
      totalGst: 0,
      productId: item.id,
      totalAmount: item.salePrice * 1,
      appUserId: user?.id,
      image: item.image,
      minQty: 1,
    };
    try {
      const data = await cartQuantityUpdate(cartData, 'add');
      setCartListList(data);
      // toast.current?.show({
      //   severity: 'success',
      //   summary: 'Added to Cart',
      //   detail: `${item.name} has been added to your cart.`,
      // });
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (item: any) => {
    const deleteObj: WishList = {
      name: item.name,
      slug: item.slug,
      productId: item.productId,
      appUserId: user?.id,
    };
    const data = await deleteWatchlist(deleteObj);
    if (data) {
      await getWatchlist();
    }
  };

  return (
    <>
      {items && items.length != 0 ? (
        <ScrollView style={styles.wishlist}>
          <View style={styles.sectionHeader}>
            <Text style={styles.wishlistTitle}>Wishlist</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Product</Text>
                <Text style={styles.tableHeaderText}>Price</Text>
                <Text style={styles.tableHeaderText}>Action</Text>
              </View>

              {items.map(item => {
                const mainImageUrl =
                  item.image && item.image.length > 0
                    ? getPhotoUrl(item.image)
                    : undefined;

                return (
                  <View style={styles.tableRow} key={item.id}>
                    {/* PRODUCT */}
                    <View style={styles.productCell}>
                      {mainImageUrl ? (
                        <Image
                          source={{uri: mainImageUrl}}
                          style={styles.productImage}
                        />
                      ) : (
                        <View style={styles.itemAvatar}>
                          <Text style={styles.avatarText}>
                            {item.productId
                              ? String(item.productId).slice(0, 1)
                              : '-'}
                          </Text>
                        </View>
                      )}

                      <Text style={styles.productName}>
                        {item.name
                          ? item.name.charAt(0).toUpperCase() +
                            item.name.slice(1)
                          : ''}
                      </Text>
                    </View>

                    <View style={styles.priceCell}>
                      <Text style={styles.priceText}>₹ {item.salePrice}</Text>
                    </View>

                    <View style={styles.actionCell}>
                      <TouchableOpacity
                        style={styles.primaryBtnSmall}
                        onPress={() => addToCart(item)}>
                        <Text style={styles.primaryBtnTextSmall}>
                          Add to Cart
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.dangerBtnSmall}
                        onPress={() => removeItem(item)}>
                        <Text style={styles.dangerText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.orderSummary}>
                <Text style={styles.summaryTitle}>Wishlist Info</Text>

                <View style={styles.summaryCard}>
                  <Text style={styles.label}>Total Items</Text>
                  <Text style={styles.price}>{items.length}</Text>
                </View>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => navigation.navigate('Products')}>
                  <Text style={styles.primaryBtnText}>Continue Shopping</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.empty}>
          <View style={styles.emptyContent}>
            {/* <Image
              source={watchlist || ''}
              style={styles.emptyImage}
              resizeMode="contain"
            /> */}

            <Text style={styles.emptyTitle}>Your wishlist is empty</Text>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('Product')}>
              <Text style={styles.primaryBtnText}>View Products</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wishlist: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    padding: 16,
  },

  sectionHeader: {
    marginBottom: 20,
  },

  wishlistTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f2b46',
  },

  row: {
    flexDirection: 'row',
  },

  leftColumn: {
    flex: 2,
    marginRight: 15,
  },

  rightColumn: {
    flex: 1,
  },

  /* TABLE */
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  tableHeaderText: {
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
  },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },

  productCell: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  productImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
  },

  itemAvatar: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#eef2f7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0d5c84',
  },

  productName: {
    fontSize: 14,
    fontWeight: '500',
  },

  priceCell: {
    flex: 1,
    alignItems: 'center',
  },

  priceText: {
    fontWeight: '600',
    color: '#0d5c84',
  },

  actionCell: {
    flex: 1,
    alignItems: 'flex-end',
  },

  primaryBtnSmall: {
    backgroundColor: '#0d5c84',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 6,
  },

  primaryBtnTextSmall: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  dangerBtnSmall: {
    borderWidth: 1,
    borderColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  dangerText: {
    color: '#dc3545',
    fontSize: 12,
    fontWeight: '600',
  },

  /* SUMMARY */
  orderSummary: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },

  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    color: '#6c7a89',
  },

  price: {
    fontSize: 14,
    fontWeight: '600',
  },

  /* EMPTY */
  empty: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  emptyContent: {
    alignItems: 'center',
  },

  emptyImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#0f2b46',
  },
  /* ================= COMMON BUTTONS ================= */

  primaryBtn: {
    backgroundColor: '#0d5c84',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },

  blockBtn: {
    width: '100%',
  },

  /* ================= COLUMN RESPONSIVE HELPERS ================= */

  container: {
    flex: 1,
  },

  breadcrumbContainer: {
    marginBottom: 15,
  },

  breadcrumbText: {
    fontSize: 12,
    color: '#6c7a89',
  },

  /* ================= EXTRA SUMMARY STYLES ================= */

  summary: {
    marginTop: 10,
  },

  summaryCardContainer: {
    marginBottom: 10,
  },

  discountText: {
    color: '#28a745',
    fontWeight: '600',
  },

  /* ================= EMPTY SHARED ================= */

  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7fb',
    padding: 20,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#6c7a89',
    textAlign: 'center',
    marginBottom: 15,
  },

  /* ================= TABLE ALIGNMENT HELPERS ================= */

  alignCenter: {
    alignItems: 'center',
  },

  alignRight: {
    alignItems: 'flex-end',
  },

  justifyBetween: {
    justifyContent: 'space-between',
  },

  /* ================= SHADOW UTILITY (Reusable) ================= */

  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    elevation: 3,
  },

  /* ================= AVATAR FALLBACK ================= */

  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eef2f7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0d5c84',
  },
});

export default WishLists;
