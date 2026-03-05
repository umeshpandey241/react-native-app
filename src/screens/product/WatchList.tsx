import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
// import {addData, fetchWishListData, removeData} from '@/app/actions/wishLists';
import {MaterialCommunityIcons} from '../../sharedBase/globalImport';
import {add, getAll, remove} from '../../core/service/wishLists.service';

interface WatchListProps {
  productId: number;
  name: string;
  sku: string;
  slug: string;
  title: string;
}

export default function WatchList({
  productId,
  name,
  sku,
  slug,
}: WatchListProps) {
  const [watchObj, setWatchObj] = useState<any>(null);

  const bindWatchList = async () => {
    try {
      const data = await getAll();
      const found = data.find((item: any) => item.productId === productId);
      setWatchObj(found || null);
    } catch (error) {
      console.log('Error fetching wishlist:', error);
    }
  };

  useEffect(() => {
    bindWatchList();
  }, [productId]);

  const addRemove = async () => {
    try {
      if (!watchObj) {
        const watchList = {
          name,
          slug,
          productId,
          sku: sku || null,
          appUserId: 1,
        };

        await add(watchList);

        bindWatchList();
      } else {
        if (watchObj.id !== undefined) {
          await remove(watchObj.id);

          setWatchObj(null);
        }
      }
    } catch (error: any) {
      console.log('Error updating wishlist:', error);
    }
  };

  return (
    <Pressable style={styles.wishlistBtn} onPress={addRemove}>
      <MaterialCommunityIcons
        name={watchObj ? 'heart' : 'heart-outline'}
        size={22}
        color={watchObj ? '#E53935' : '#0D6EFD'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wishlistBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
});
