import {View, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {Banner} from '../../core/model/banner';
import {Industrie} from '../../core/model/industrie';
import {EnumDetail} from '../../core/model/enumDetail';
import {Product} from '../../core/model/product';
import {Blog} from '../../core/model/blog';
import {OurClient} from '../../core/model/ourClient';
import {Testimonial} from '../../core/model/testimonial';
import {OurVideo} from '../../core/model/ourVideo';
import {getAll as getAllBanners} from '../../core/service/banners.service';
import {getAll as getAllIndustriesType} from '../../core/service/enumDetails.service';
import {getAll as getAllProducts} from '../../core/service/products.service';
import {getAll as getAllIndustries} from '../../core/service/industries.service';
import {getAll as getAllBlogs} from '../../core/service/blogs.service';
import {getAll as getAllClients} from '../../core/service/ourClients.service';
import {getAll as getAllTestimonial} from '../../core/service/testimonials.service';
import {getAll as getAllVideos} from '../../core/service/ourVideos.service';
import HomesHeroSection from './HomesHeroSection';
import AboutSection from './AboutSection';
import StrengthsSection from './StrengthsSection';
import {ScrollView} from 'react-native';
import BrandFeaturesSection from './BrandFeaturesSection';
import IndustrieSection from './IndustrieSection';
import ProductsSection from './ProductsSection';
import OurClientSection from './OurClientSection';
import TestimonialSection from './TestimonialSection';
import BlogsSection from './BlogsSection';
import Header from '../../components/Header';
import NewsletterSection from './NewsletterSection';
import Footer from '../../components/Footer';

const styles = StyleSheet.create({
  gradientBackground: {
    backgroundColor: '#f0f8ff',
  },
});

const HomesHome = () => {
  const [bannerData, setBannerData] = React.useState<Banner[]>([]);
  const [industrieData, setIndustrieData] = React.useState<Industrie[]>([]);
  const [industriesTypeData, setIndustriesTypeData] = React.useState<
    EnumDetail[]
  >([]);
  const [productsData, setProductsData] = React.useState<Product[]>([]);
  const [blogsData, setBlogsData] = React.useState<Blog[]>([]);
  const [ourClientsData, setOurClientsData] = React.useState<OurClient[]>([]);
  const [testimonialData, setTestimonialData] = React.useState<Testimonial[]>(
    [],
  );
  const [ourVideosData, setOurVideosData] = React.useState<OurVideo[]>([]);

  useEffect(() => {
    const fetchBanner = async () => {
      const bannerDatas = await getAllBanners();
      setBannerData(bannerDatas);
    };
    fetchBanner();
  });

  useEffect(() => {
    // Fetch industries data
    const fetchIndustries = async () => {
      const ourIndustrieData = await getAllIndustries();
      // console.log(ourIndustrieData, 'video');
      setIndustrieData(ourIndustrieData);
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    // Fetch industries data
    const fetchIndustriesType = async () => {
      const ourIndustrieData = await getAllIndustriesType();
      // console.log(ourIndustrieData, 'video');
      setIndustriesTypeData(ourIndustrieData);
    };
    fetchIndustriesType();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchProductsData = await getAllProducts();
      // console.log(fetchProductsData, 'productsData');
      setProductsData(fetchProductsData);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      const fetchBlogsData = await getAllBlogs();
      // console.log(fetchBlogsData, 'blogsData');
      setBlogsData(fetchBlogsData);
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      const fetchClientsData = await getAllClients();
      // console.log(fetchClientsData, 'fetchClientsData');
      setOurClientsData(fetchClientsData);
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchTestimonial = async () => {
      const fetchTestimonialData = await getAllTestimonial();
      // console.log(fetchClientData, 'blogsData');
      setTestimonialData(fetchTestimonialData);
    };
    fetchTestimonial();
  }, []);

  useEffect(() => {
    const fetchVideo = async () => {
      const fetchVideoData = await getAllVideos();
      // console.log(fetchClientData, 'blogsData');
      setOurVideosData(fetchVideoData);
    };
    fetchVideo();
  }, []);

  return (
    <>
      <Header Heading="Home" />
      <ScrollView>
        <HomesHeroSection
          bannerData={bannerData}
          ourVideosData={ourVideosData}
        />
        <AboutSection />
        <StrengthsSection />
        <BrandFeaturesSection />
        <IndustrieSection
          industrieData={industrieData}
          industriesTypeData={industriesTypeData}
        />
        <ProductsSection productsData={productsData} />
        <OurClientSection ourClientsData={ourClientsData} />
        <View style={styles.gradientBackground}>
          <TestimonialSection testimonialData={testimonialData} />
        </View>
        <BlogsSection blogsData={blogsData} />
        <NewsletterSection />
      </ScrollView>
      <Footer />
    </>
  );
};

export default HomesHome;
