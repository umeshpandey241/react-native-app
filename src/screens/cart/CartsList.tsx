import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {getPhotoUrl} from '../product/ProductList';
import {Cart} from '../../core/model/cart';
import {globalStore, LoginStore} from '../../globalstate';
import {cartItemRemove, getAll} from '../../core/service/carts.service';
import {BuyOrder} from '../../core/model/buyorder';
import {addOrder} from '../../core/service/buyOrders.service';
import {useNavigation} from '@react-navigation/native';

const CartsList = () => {
  const [items, setItems] = useState<Cart[]>([]);
  const navigation = useNavigation<any>();
  const [couponCode, setCouponCode] = useState('');
  console.log('couponCode:', setCouponCode);
  const [discount, setDiscount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [checkoutView, setCheckoutView] = useState(false);
  const [currentStep, setcurrentStep] = useState<number>(1);
  const [addNewAddress, setAddNewAddress] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderId, setorderId] = useState<string>('');
  const [isShipping, setIsShipping] = useState(true);
  const {setCartListList} = globalStore();
  const user = LoginStore(state => state.user);

  const addresses = [
    {
      id: 1,
      name: 'Amol Sudhakar Impal',
      street: '4 Sagar Raj Row House',
      area: 'Omkar Nagar, Peth Road',
      city: 'NASHIK',
      state: 'MAHARASHTRA',
      postalCode: '422003',
    },
    {
      id: 2,
      name: 'Amol Sudhakar Impal',
      street: '123 Another Street',
      area: 'XYZ Area',
      city: 'MUMBAI',
      state: 'MAHARASHTRA',
      postalCode: '400001',
    },
  ];

  const [selectedAddress, setSelectedAddress] = useState<
    (typeof addresses)[0] | null
  >(addresses[0]);

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when your order arrives.',
    },
    {
      id: 'upi',
      name: 'UPI / Google Pay',
      description: 'Fast & secure payments.',
    },
    {
      id: 'card',
      name: 'Debit / Credit Card',
      description: 'Visa, MasterCard, Rupay supported.',
    },
  ];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethods[0],
  );

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (user?.id) {
          const cartData1 = await getAll(user.id);
          setItems(cartData1);
          setCartListList(cartData1);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, [setCartListList, user?.id]);

  useEffect(() => {
    const sub = items.reduce(
      (sum, i) => sum + (i.salePrice || 0) * (i.qty || 1),
      0,
    );
    const ship = sub > 500 ? 0 : 50;
    const discountedTotal = sub + ship - discount;

    setSubtotal(sub);
    setShipping(ship);
    setTotal(discountedTotal);
  }, [items, discount]);

  const changeQty = (cartItems: any, delta: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === cartItems?.id
          ? {...item, qty: Math.max(1, (item.qty ?? 1) + delta)}
          : item,
      ),
    );
    recalcTotals();
  };

  const recalcTotals = () => {
    const sub = items.reduce(
      (sum, item) => sum + (item.salePrice || 0) * (item.qty || 1),
      0,
    );

    const ship = sub > 500 ? 0 : 50;
    let finalTotal = sub + ship;

    if (couponCode === 'SAVE10') {
      finalTotal = +(finalTotal * 0.9).toFixed(2);
    }

    setSubtotal(sub);
    setShipping(ship);
    setTotal(finalTotal);
  };

  const applyCoupon = () => {
    if (!couponCode) return;

    if (couponCode === 'SAVE10') {
      const discountAmount = +(subtotal * 0.1).toFixed(2);
      setDiscount(discountAmount);
    } else {
      setDiscount(0);
    }
  };

  const toggleAddNewAddress = () => {
    const newState = !addNewAddress;
    setAddNewAddress(newState);
    if (newState) {
      setSelectedAddress(null);
    } else {
      setSelectedAddress(addresses[0]);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setcurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setcurrentStep(currentStep - 1);
    }
  };

  const placeOrder = async () => {
    const orderId =
      'ORD-' +
      new Date().getFullYear() +
      '-' +
      Math.floor(100000 + Math.random() * 900000);
    setorderId(orderId);

    const couponAmount =
      couponCode === 'SAVE10' ? +(subtotal * 0.1).toFixed(2) : 0;

    const orderModel: BuyOrder = {
      appUserId: user?.id,

      name: selectedAddress?.name ?? '',
      orderId: orderId,

      billingFirstName: selectedAddress?.name?.split(' ')[0] ?? '',
      billingLastName:
        selectedAddress?.name?.split(' ').slice(1).join(' ') ?? '',
      billingEmailId: user?.emailId,
      billingMobile: user?.mobile,
      billingCountry: 'India',
      billingCountryLabel: 'India',
      billingAddressLine1: selectedAddress?.street ?? '',
      billingAddressLine2: selectedAddress?.area ?? '',
      billingCity: selectedAddress?.city ?? '',
      billingState: selectedAddress?.state ?? '',
      billingPinCode: selectedAddress?.postalCode ?? '',

      shippingFirstName: selectedAddress?.name?.split(' ')[0] ?? '',
      shippingLastName:
        selectedAddress?.name?.split(' ').slice(1).join(' ') ?? '',
      shippingMobile: user?.mobile,
      shippingCountry: 'India',
      shippingCountryLabel: 'India',
      shippingAddressLine1: selectedAddress?.street ?? '',
      shippingAddressLine2: selectedAddress?.area ?? '',
      shippingCity: selectedAddress?.city ?? '',
      shippingState: selectedAddress?.state ?? '',
      shippingPinCode: selectedAddress?.postalCode ?? '',

      paymentMethod: selectedPaymentMethod?.id ?? '',
      paymentMethodLabel: selectedPaymentMethod?.name ?? '',
      transactionId: '',

      paymentId: '',
      paymentSignature: '',
      paymentStatus: 'Pending',
      paymentStatusLabel: 'Pending',

      subTotalAmount: Number(subtotal) || 0,
      shippingAmount: Number(shipping) || 0,
      couponAmount: Number(couponAmount) || 0,
      orderTotalAmt: Number(total) || 0,

      totalGstAmount: 0,
      igst: 0,
      sgst: 0,
      cgst: 0,

      couponId: 0,
      couponCode: couponCode ?? '',

      adminDiscountAmount: 0,
      shippingDiscountAmount: 0,

      refundAmount: 0,
      refundNotes: '',
      refundStatus: '',

      customerProvideNote: '',

      isShipToDiffAddr: false,
      registerUser: false,
      isDelete: false,
    };

    try {
      setIsPlacingOrder(true);
      const res = await addOrder(orderModel);

      if (res) {
        setIsPlacingOrder(false);
        setcurrentStep(4);
        // alert("Order placed successfully!");
      }
    } catch (error) {
      setIsPlacingOrder(false);
      console.error('Place Order Error:', error);
      // alert('Order not placed. Backend error!');
    }
  };

  const removeItem = async (item: any) => {
    try {
      const data = await cartItemRemove(item.id);
      if (data) {
        recalcTotals();
        if (user?.id) {
          const cartData = await getAll(user.id);
          setItems(cartData);
        }
      }
    } catch (error) {
      console.error('Remove error:', error);
    }
  };

  return (
    <>
      {items && items.length > 0 && !checkoutView && (
        <ScrollView style={styles.cart}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.pgHeader}>
              <Text style={styles.pgTitle}>Cart</Text>
            </View>

            <View style={styles.row}>
              {/* LEFT SIDE - CART ITEMS */}
              <View style={styles.leftColumn}>
                <View style={styles.cartContainer}>
                  {items.map(item => {
                    const mainImageUrl =
                      item.image && item.image.length > 0
                        ? getPhotoUrl(item.image)
                        : undefined;

                    return (
                      <View style={styles.cartItem} key={item.id}>
                        {mainImageUrl && (
                          <Image
                            source={{uri: mainImageUrl}}
                            style={styles.cartProduct}
                            resizeMode="contain"
                          />
                        )}

                        <View style={styles.initialCard}>
                          <View style={styles.initial}>
                            <Text style={styles.initialText}>
                              {item?.productId
                                ? String(item.productId).slice(0, 1)
                                : '-'}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.cartProductInfo}>
                          <View style={styles.productContent}>
                            <Text style={styles.productTitle}>
                              {item?.name}
                            </Text>
                            <Text style={styles.productDesc}>
                              Lorem ipsum doler sit amet
                            </Text>

                            <View style={styles.cartItemPricing}>
                              <View style={styles.priceBlock}>
                                <Text style={styles.currentPrice}>
                                  ₹ {item.salePrice}
                                </Text>
                                <Text style={styles.oldPrice}>₹ 3,999</Text>
                              </View>

                              <View style={styles.productQty}>
                                <TouchableOpacity
                                  style={styles.qtyBtn}
                                  onPress={() => changeQty(item, -1)}
                                  disabled={(item.qty ?? 1) <= 1}>
                                  <Text style={styles.qtyBtnText}>-</Text>
                                </TouchableOpacity>

                                <TextInput
                                  value={String(item.qty)}
                                  style={styles.qtyInput}
                                  keyboardType="numeric"
                                  onChangeText={() => recalcTotals()}
                                />

                                <TouchableOpacity
                                  style={styles.qtyBtn}
                                  onPress={() => changeQty(item, 1)}>
                                  <Text style={styles.qtyBtnText}>+</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>

                          <TouchableOpacity
                            style={styles.removeItem}
                            onPress={() => removeItem(item)}>
                            <Text style={styles.removeText}>Remove</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* RIGHT SIDE - ORDER SUMMARY */}
              <View style={styles.rightColumn}>
                <View style={styles.orderSummary}>
                  <Text style={styles.summaryTitle}>Order Summary</Text>

                  <View style={styles.inlineGroup}>
                    <TextInput
                      placeholder="Discount Voucher"
                      style={styles.voucherInput}
                    />
                    <TouchableOpacity
                      style={styles.applyBtn}
                      onPress={() => applyCoupon()}>
                      <Text style={styles.applyText}>Apply</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.summaryCard}>
                    <Text style={styles.label}>Subtotal</Text>
                    <Text style={styles.price}>₹ {subtotal}</Text>
                  </View>

                  <View style={styles.summaryCard}>
                    <Text style={styles.label}>Shipping</Text>
                    <Text style={styles.price}>₹ {shipping}</Text>
                  </View>

                  <View style={styles.summaryCard}>
                    <Text style={styles.label}>Discount</Text>
                    <Text style={styles.price}>- ₹ 10%</Text>
                  </View>

                  <View style={styles.summaryCard}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.price}>₹ {total}</Text>
                  </View>

                  <View style={styles.checkboxRow}>
                    <Switch
                      value={isShipping}
                      onValueChange={value => setIsShipping(value)}
                    />
                    <Text style={styles.checkLabel}>
                      Shipping & taxes calculated at checkout
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() => {
                      setCheckoutView(true);
                      setcurrentStep(1);
                    }}>
                    <Text style={styles.checkoutText}>Proceed To Checkout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {(!items || items.length === 0) && !checkoutView && (
        <View style={styles.emptyCart}>
          <View style={styles.emptyContainer}>
            <View style={styles.emptyContent}>
              <Text style={styles.emptyTitle}>Your cart is empty</Text>

              <TouchableOpacity
                style={styles.viewProductsBtn}
                onPress={() => navigation.navigate('Product')}>
                <Text style={styles.viewProductsText}>View Products</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {checkoutView && (
        <ScrollView style={styles.orderSteps}>
          {/* LEFT SIDE */}
          <View style={styles.checkoutLeft}>
            <Text style={styles.checkoutTitle}>Checkout</Text>

            {/* STEP PROGRESS */}
            <View style={styles.stepProgress}>
              <View
                style={[styles.step, currentStep >= 1 && styles.activeStep]}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepLabel}>Shipping</Text>
              </View>

              <View
                style={[styles.line, currentStep >= 2 && styles.activeLine]}
              />

              <View
                style={[styles.step, currentStep >= 2 && styles.activeStep]}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepLabel}>Payment</Text>
              </View>

              <View
                style={[styles.line, currentStep >= 3 && styles.activeLine]}
              />

              <View
                style={[styles.step, currentStep >= 3 && styles.activeStep]}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepLabel}>Review</Text>
              </View>

              <View
                style={[styles.line, currentStep >= 4 && styles.activeLine]}
              />

              <View
                style={[styles.step, currentStep >= 4 && styles.activeStep]}>
                <Text style={styles.stepNumber}>4</Text>
                <Text style={styles.stepLabel}>Complete</Text>
              </View>
            </View>

            {/* ================= STEP 1 ================= */}
            {currentStep === 1 && (
              <View style={styles.stepCard}>
                <Text style={styles.stepHeading}>01. Shipping Address</Text>

                {addresses.map(address => (
                  <TouchableOpacity
                    key={address.id}
                    style={[
                      styles.addressCard,
                      selectedAddress?.id === address.id && styles.selectedCard,
                    ]}
                    onPress={() => setSelectedAddress(address)}>
                    <View style={styles.radioCircle}>
                      {selectedAddress?.id === address.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>

                    <View style={{flex: 1}}>
                      <Text style={styles.addressName}>{address.name}</Text>
                      <Text style={styles.addressText}>
                        {address.street}
                        {'\n'}
                        {address.area}
                        {'\n'}
                        {address.city}, {address.state} {address.postalCode}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => toggleAddNewAddress()}>
                  <Text style={styles.primaryBtnText}>
                    {addNewAddress ? 'Cancel' : 'Add New Address'}
                  </Text>
                </TouchableOpacity>

                {addNewAddress && (
                  <View style={styles.formContainer}>
                    <TextInput style={styles.input} placeholder="First Name" />
                    <TextInput style={styles.input} placeholder="Last Name" />
                    <TextInput
                      style={styles.input}
                      placeholder="Company Name"
                    />
                    <TextInput style={styles.input} placeholder="Country" />
                    <TextInput
                      style={styles.input}
                      placeholder="Street Address"
                    />
                    <TextInput style={styles.input} placeholder="Town / City" />
                    <TextInput style={styles.input} placeholder="State" />
                    <TextInput
                      style={styles.input}
                      placeholder="Postcode / ZIP"
                    />
                    <TextInput style={styles.input} placeholder="Phone" />
                    <TextInput
                      style={styles.input}
                      placeholder="Email Address"
                    />
                  </View>
                )}

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.lightBtn}
                    onPress={() => setCheckoutView(false)}>
                    <Text>Back to Cart</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => nextStep()}>
                    <Text style={styles.primaryBtnText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ================= STEP 2 ================= */}
            {currentStep === 2 && (
              <View style={styles.stepCard}>
                <Text style={styles.stepHeading}>02. Payment Method</Text>

                {paymentMethods.map(method => (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.paymentCard,
                      selectedPaymentMethod?.id === method.id &&
                        styles.selectedCard,
                    ]}
                    onPress={() => setSelectedPaymentMethod(method)}>
                    <View style={styles.radioCircle}>
                      {selectedPaymentMethod?.id === method.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>

                    <View>
                      <Text style={styles.paymentName}>{method.name}</Text>
                      <Text style={styles.paymentDescription}>
                        {method.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.lightBtn}
                    onPress={() => prevStep()}>
                    <Text>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => nextStep()}>
                    <Text style={styles.primaryBtnText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {currentStep === 3 && (
              <View style={styles.stepCard}>
                <Text style={styles.stepHeading}>03. Review Order</Text>

                {items.map(item => (
                  <View key={item.id} style={styles.reviewItem}>
                    <View>
                      <Text style={styles.reviewTitle}>{item.name}</Text>
                      <Text>Qty: {item.qty}</Text>
                    </View>

                    <Text style={styles.reviewPrice}>
                      ₹ {(item.salePrice || 0) * (item.qty || 1)}
                    </Text>
                  </View>
                ))}

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.lightBtn}
                    onPress={() => prevStep()}>
                    <Text>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => placeOrder()}
                    disabled={isPlacingOrder}>
                    <Text style={styles.primaryBtnText}>
                      {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ================= STEP 4 ================= */}
            {currentStep === 4 && (
              <View style={[styles.stepCard, styles.successCard]}>
                <Text style={styles.successIcon}>✔</Text>

                <Text style={styles.successTitle}>
                  Order Placed Successfully 🎉
                </Text>

                <Text>
                  Your order has been confirmed and will be delivered soon.
                </Text>

                <View style={styles.orderInfo}>
                  <View style={styles.infoCard}>
                    <Text>Order ID</Text>
                    <Text style={styles.bold}>{orderId}</Text>
                  </View>

                  <View style={styles.infoCard}>
                    <Text>Estimated Delivery</Text>
                    <Text style={styles.bold}>3 - 5 Days</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => navigation.navigate('Product')}>
                  <Text style={styles.primaryBtnText}>Continue Shopping</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* RIGHT SIDE SUMMARY */}
          <View style={styles.checkoutRight}>
            <View style={styles.orderSummary}>
              <Text style={styles.summaryTitle}>Order Summary</Text>

              <View style={styles.summaryCard}>
                <Text>Subtotal</Text>
                <Text>₹ {subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryCard}>
                <Text>Shipping</Text>
                <Text>₹ {shipping.toFixed(2)}</Text>
              </View>

              {couponCode && (
                <View style={styles.summaryCard}>
                  <Text>Discount ({couponCode})</Text>
                  <Text style={{color: 'green'}}>
                    - ₹ {(subtotal * 0.1).toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={[styles.summaryCard, styles.totalCard]}>
                <Text style={styles.bold}>Total</Text>
                <Text style={styles.bold}>₹ {total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  initialCard: {},
  initialText: {},
  initial: {},
  productContent: {},
  priceBlock: {},
  cart: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    padding: 16,
  },

  container: {
    flex: 1,
  },

  pgHeader: {
    marginBottom: 20,
  },

  pgTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f2b46',
  },

  row: {
    flexDirection: 'column',
  },

  leftColumn: {
    width: '100%',
    marginBottom: 20,
  },

  rightColumn: {
    width: '100%',
  },

  cartContainer: {
    gap: 16,
  },

  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    elevation: 2,
  },

  cartProduct: {
    width: 80,
    height: 80,
  },

  cartProductInfo: {
    flex: 1,
  },

  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f2b46',
  },

  productDesc: {
    color: '#6c757d',
    marginVertical: 4,
  },

  cartItemPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  currentPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f2b46',
  },

  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
  },

  productQty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  qtyBtn: {
    backgroundColor: '#0d5c84',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },

  qtyBtnText: {
    color: '#fff',
    fontSize: 18,
  },

  qtyInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: 40,
    height: 32,
    textAlign: 'center',
    borderRadius: 6,
  },

  removeItem: {
    marginTop: 8,
  },

  removeText: {
    color: 'red',
  },

  orderSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },

  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#0f2b46',
  },

  inlineGroup: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  voucherInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },

  applyBtn: {
    backgroundColor: '#0d5c84',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },

  applyText: {
    color: '#fff',
    fontWeight: '600',
  },

  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },

  label: {
    color: '#555',
  },

  totalLabel: {
    fontWeight: '700',
    fontSize: 16,
  },

  price: {
    fontWeight: '600',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 10,
  },

  checkLabel: {
    flex: 1,
    fontSize: 13,
    color: '#555',
  },

  checkoutBtn: {
    backgroundColor: '#0d5c84',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  checkoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7fb',
    padding: 20,
  },

  emptyContainer: {
    width: '100%',
    alignItems: 'center',
  },

  emptyContent: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0f2b46',
    marginBottom: 20,
  },

  viewProductsBtn: {
    backgroundColor: '#0d5c84',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  viewProductsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orderSteps: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },

  checkoutLeft: {
    padding: 16,
  },

  checkoutRight: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  checkoutTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f2b46',
    marginBottom: 20,
  },

  /* ================= STEP PROGRESS ================= */

  stepProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  step: {
    alignItems: 'center',
  },

  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#cfd8e3',
    textAlign: 'center',
    lineHeight: 34,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },

  stepLabel: {
    fontSize: 12,
    color: '#6c7a89',
  },

  activeStep: {
    backgroundColor: '#0d5c84',
  },

  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#cfd8e3',
  },

  activeLine: {
    backgroundColor: '#0d5c84',
  },

  /* ================= STEP CARD ================= */

  stepCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    elevation: 3,
  },

  stepHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f2b46',
    marginBottom: 16,
  },

  /* ================= ADDRESS ================= */

  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderWidth: 1,
    borderColor: '#e1e8f0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fafcff',
  },

  selectedCard: {
    borderColor: '#0d5c84',
    backgroundColor: '#eef6fb',
  },

  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#0d5c84',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0d5c84',
  },

  addressName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f2b46',
    marginBottom: 4,
  },

  addressText: {
    fontSize: 13,
    color: '#6c7a89',
    lineHeight: 18,
  },

  /* ================= FORM ================= */

  formContainer: {
    marginTop: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#dce3ec',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
  },

  /* ================= PAYMENT ================= */

  paymentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderWidth: 1,
    borderColor: '#e1e8f0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fafcff',
  },

  paymentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f2b46',
    marginBottom: 4,
  },

  paymentDescription: {
    fontSize: 13,
    color: '#6c7a89',
  },

  /* ================= REVIEW ================= */

  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
  },

  reviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f2b46',
  },

  reviewPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d5c84',
  },

  /* ================= BUTTONS ================= */

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: '#0d5c84',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 6,
  },

  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },

  lightBtn: {
    flex: 1,
    backgroundColor: '#eef2f7',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 6,
  },

  /* ================= SUCCESS ================= */

  successCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },

  successIcon: {
    fontSize: 50,
    color: '#28a745',
    marginBottom: 15,
  },

  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#0f2b46',
    textAlign: 'center',
  },

  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },

  infoCard: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },

  bold: {
    fontWeight: '700',
    marginTop: 4,
  },

  totalCard: {
    borderTopWidth: 1,
    borderTopColor: '#eef2f7',
    paddingTop: 12,
    marginTop: 8,
  },
});

export default CartsList;
