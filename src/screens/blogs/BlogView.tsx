import React, {useEffect, useState} from 'react';
import {getBlogData} from '../../core/service/blogCategories.service';
import {getAll, getById} from '../../core/service/blogs.service';
import {getPhotoUrl} from '../about/AboutHomes';
import {Blog} from '../../core/model/blog';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

interface BlogCategoryDetails {
  id: number;
  name: string;
  slug: string;
  totalBlogs: string;
}

const BlogView = ({route}) => {
  const {slug, id} = route.params;

  const [blogsData, setBlogsData] = useState<Blog[]>([]);
  const [blogCategoriesData, setBlogCategoriesData] = useState<
    BlogCategoryDetails[]
  >([]);
  const [item, setItem] = useState<Blog | null>(null);
  const blogCategories = blogCategoriesData ?? null;
  const blogsDataFilteredByActive = blogsData?.filter(
    item => item.isActive === true,
  );
  const mainImageUrl = getPhotoUrl(item?.image);
  // console.log('mainImageUrl', mainImageUrl);
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
      // console.log(fetchBlogCategoriesData, 'blogCategoriesData');
      setBlogCategoriesData(fetchBlogCategoriesData);
    };
    fetchBlogCategories();
  }, []);

  useEffect(() => {
    const fetchById = async () => {
      const fetchByIdData = await getById({id, slug});
      // console.log(fetchByIdData, 'fetchByIdData');
      setItem(fetchByIdData);
    };
    fetchById();
  }, [id, slug]);

  const recentPosts = blogsDataFilteredByActive
    ?.filter(blog => blog.id !== item?.id)
    .sort(
      (a, b) =>
        new Date(b.blogDate ?? '').getTime() -
        new Date(a.blogDate ?? '').getTime(),
    )
    .slice(0, 3);

  const sortedCategories = [...blogCategories]
    .sort((a, b) => Number(b.totalBlogs) - Number(a.totalBlogs))
    .slice(0, 5);

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.layout}>
          {/* MAIN CONTENT */}
          <View style={styles.content}>
            <Text style={styles.blogTitle}>{item?.name}</Text>
            {mainImageUrl ? (
              <Image source={{uri: mainImageUrl}} style={styles.mainImage} />
            ) : (
              <View style={styles.noImage}>
                <Text>No Image</Text>
              </View>
            )}

            {/* Blog Content */}
            <Text style={styles.blogContent}>
              {item?.longDescription?.replace(/<[^>]*>?/gm, '')}
            </Text>
          </View>

          <View style={styles.sidebar}>
            <View style={styles.section}>
              <Text style={styles.sidebarTitle}>Recent Posts</Text>
              <View style={styles.divider} />

              {recentPosts.map((post, i) => (
                <Pressable
                  key={i}
                  onPress={() =>
                    navigation.navigate('BlogDetails', {slug: post.slug})
                  }
                  style={styles.recentPost}>
                  {post.image ? (
                    <Image
                      source={{uri: getPhotoUrl(post.image)}}
                      style={styles.recentImage}
                    />
                  ) : (
                    <View style={styles.noImageSmall}>
                      <Text>No Image</Text>
                    </View>
                  )}

                  <View style={styles.recentContent}>
                    <Text style={styles.recentTitle} numberOfLines={1}>
                      {post.name}
                    </Text>
                    <Text style={styles.recentDesc} numberOfLines={1}>
                      {post.shortDescription?.replace(/<[^>]*>?/gm, '')}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sidebarTitle}>Categories</Text>
              <View style={styles.divider} />

              {sortedCategories.map((cat, i) => (
                <Pressable
                  key={i}
                  onPress={() =>
                    navigation.navigate('Blogs', {category: cat.name})
                  }
                  style={styles.categoryRow}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryCount}>({cat.totalBlogs})</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default BlogView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eef5fb',
    paddingVertical: 24,
  },

  layout: {
    flexDirection: isTablet ? 'row' : 'column',
    gap: 24,
    paddingHorizontal: 16,
  },

  sidebar: {
    width: isTablet ? 300 : '100%',
  },

  section: {
    marginBottom: 32,
  },

  sidebarTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#002438',
  },

  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },

  recentPost: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  recentImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },

  noImageSmall: {
    width: 60,
    height: 60,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  recentContent: {
    flex: 1,
  },

  recentTitle: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#002438',
  },

  recentDesc: {
    fontSize: width * 0.032,
    color: '#555',
  },

  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  categoryName: {
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#002438',
  },

  categoryCount: {
    fontSize: width * 0.03,
    color: '#666',
  },

  content: {
    flex: 1,
  },

  blogTitle: {
    fontSize: width * 0.055,
    fontWeight: '700',
    color: '#002438',
    marginBottom: 16,
    textAlign: isTablet ? 'center' : 'left',
  },

  mainImage: {
    width: '100%',
    height: width * 0.6,
    borderRadius: 8,
    marginBottom: 16,
  },

  noImage: {
    height: width * 0.6,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  blogContent: {
    fontSize: width * 0.036,
    lineHeight: 24,
    color: '#002438',
    fontWeight: '500',
  },
});
