'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Blog} from '@/core/model/blog';
import {getAll} from '../../core/service/blogs.service';
import {getBlogData} from '../../core/service/blogCategories.service';
import Header from '../../components/Header';
import {getPhotoUrl} from '../about/AboutHomes';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

interface BlogCategoryDetails {
  id: number;
  name: string;
  slug: string;
  totalBlogs: string;
}

export default function BlogList() {
  const [blogsData, setBlogsData] = useState<Blog[]>([]);
  const [blogCategoriesData, setBlogCategoriesData] = useState<
    BlogCategoryDetails[]
  >([]);
  const blogCategories = blogCategoriesData ?? null;
  const blogsList = blogsData ?? null;
  const [activeTab, setActiveTab] = useState<string>('All');
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchBlogs = async () => {
      const fetchBlogsData = await getAll();
      // console.log(fetchBlogsData, 'blogsData');
      setBlogsData(fetchBlogsData);
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchBlogCategories = async () => {
      const fetchBlogCategoriesData = await getBlogData();
      console.log(fetchBlogCategoriesData, 'blogCategoriesData');
      setBlogCategoriesData(fetchBlogCategoriesData);
    };
    fetchBlogCategories();
  }, []);

  useEffect(() => {
    if (blogCategories?.length > 0 && !activeTab) {
      setActiveTab('All');
    }
  }, [blogCategories, activeTab]);

  const normalize = (val?: string) =>
    val ? val.replace(/\s+/g, ' ').trim().toLowerCase() : '';

  const filterOurBlogsData = useMemo(() => {
    if (!blogsList) return [];

    const filteredByActive = blogsList?.filter(item => item.isActive === true);

    if (activeTab === 'All' || !activeTab) return filteredByActive;

    const active = normalize(activeTab);

    return filteredByActive.filter(
      item => normalize(item?.blogCategoryIdName) === active,
    );
  }, [blogsList, activeTab]);

  const numColumns = isTablet ? 3 : 2;

  const renderBlog = ({item}: any) => {
    const imageUrl = getPhotoUrl(item.image);

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate('BlogView', {slug: item.slug, id: item.id})
        }>
        {imageUrl ? (
          <Image source={{uri: imageUrl}} style={styles.image} />
        ) : (
          <View style={styles.noImage}>
            <Text>No Image</Text>
          </View>
        )}

        <View style={styles.iconOverlay}>
          {/* <PiArrowUpRightDuotone size={18} color="#000" /> */}
        </View>

        <View style={styles.content}>
          <View style={styles.tagsRow}>
            {item.tags?.split(',').map((tag: string, i: number) => (
              <View key={i} style={styles.badge}>
                <Text style={styles.badgeText}>{tag.trim()}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.blogTitle} numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {item.shortDescription?.replace(/<[^>]*>?/gm, '')}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      {/* <HeroSection title="Blogs" /> */}
      <Header Heading="Blogs" />

      <View style={styles.section}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>INSIGHTS & INNOVATIONS</Text>
          </View>

          <Text style={styles.heading}>Latest From Our Blog</Text>
          <Text style={styles.subHeading}>
            Explore trends, tips, and expert views on filtration for every
            industry.
          </Text>
        </View>
        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === 'All' && styles.activeTab]}
            onPress={() => setActiveTab('All')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'All' && styles.activeTabText,
              ]}>
              All
            </Text>
          </Pressable>

          {blogCategories.map((cat: any) => (
            <Pressable
              key={cat.id}
              style={[styles.tab, activeTab === cat.name && styles.activeTab]}
              onPress={() => setActiveTab(cat.name)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === cat.name && styles.activeTabText,
                ]}>
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {filterOurBlogsData?.length > 0 ? (
          <FlatList
            data={filterOurBlogsData}
            key={numColumns}
            numColumns={numColumns}
            renderItem={renderBlog}
            keyExtractor={item => item.id.toString()}
            columnWrapperStyle={{gap: 12}}
            contentContainerStyle={{gap: 12}}
          />
        ) : (
          <Text style={styles.empty}>
            No blogs available for category: {activeTab}
          </Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#eef5fb',
  },

  header: {
    marginBottom: 24,
  },

  chip: {
    alignSelf: 'flex-start',
    backgroundColor: '#0077b6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },

  chipText: {
    color: '#fff',
    fontSize: width * 0.03,
    fontWeight: '600',
  },

  heading: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#002438',
    marginBottom: 8,
  },

  subHeading: {
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#002438',
  },

  tabs: {
    marginBottom: 24,
  },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e9f2fb',
    marginRight: 8,
  },

  activeTab: {
    backgroundColor: '#0077b6',
  },

  tabText: {
    fontWeight: '600',
    color: '#002438',
  },

  activeTabText: {
    color: '#fff',
  },

  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 200,
  },

  noImage: {
    height: 200,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    elevation: 4,
  },

  content: {
    padding: 12,
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },

  badge: {
    backgroundColor: '#E9F2FB',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  badgeText: {
    fontSize: width * 0.028,
    color: '#0077b6',
    fontWeight: '600',
  },

  blogTitle: {
    fontSize: width * 0.04,
    fontWeight: '700',
    color: '#002438',
    marginBottom: 4,
  },

  description: {
    fontSize: width * 0.033,
    color: '#666',
  },

  empty: {
    textAlign: 'center',
    paddingVertical: 32,
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#002438',
  },
});
