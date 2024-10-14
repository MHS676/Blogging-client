import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import { toast } from 'react-hot-toast';
import { UserContext } from '../App';
import AboutUser from '../components/about.component';
import InPageNavigation from '../components/inpage-navigation.component';
import NoDataMessage from '../components/nodata.component';
import LoadMoreDataBtn from '../components/load-more.component';
import BlogPostCard from '../components/blog-post.component';
import FilterPaginationData from '../common/filter-pagination-data';
import PageNotFound from './404.page';

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: ""
};

const ProfilePage = () => {
  const { id: profileId } = useParams();
  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState("");

  const { userAuth: { username } = {} } = useContext(UserContext);

  const {
    personal_info: { fullname, username: profile_username, profile_img, bio } = {},
    account_info: { total_posts, total_reads } = {},
    social_links,
    joinedAt,
  } = profile || profileDataStructure;

  const fetchUserProfile = () => {
    axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/get-profile`, { username: profileId })
      .then(({ data: user }) => {
        if (user && user._id) {
          if(user != null){
            setProfile(user);
          }
          setProfileLoaded(profileId)
          getBLogs({ user_id: user._id });
        } else {
          toast.error("User profile not found.");
        }
        setLoading(false);
      })
      .catch(err => {
        toast.error("Failed to load user profile. Please try again.");
        console.error(err);
        setLoading(false);
      });
  };

  const getBLogs = ({ page = 1, user_id }) => {
    user_id = user_id ?? blogs?.user_id; 

    if (!user_id) {
      toast.error("User ID is missing for fetching blogs.");
      return;
    }

    axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/search-blogs`, { author: user_id, page })
      .then(async ({ data }) => {
        const formattedData = await FilterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: '/search-blogs-count',
          data_to_send: { author: user_id }
        });

        formattedData.user_id = user_id;
        setBlogs(formattedData);
      })
      .catch(err => {
        toast.error("Failed to load blogs. Please try again.");
        console.error(err);
      });
  };

  useEffect(() => {

    if(profileId != profileLoaded) {
      setBlogs(null);
    }
    if(blogs == null){
      resetStates();
      fetchUserProfile();
    }

    resetStates();
    fetchUserProfile();
  }, [profileId]);

  const resetStates = () => {
    setProfile(profileDataStructure);
    setLoading(true);
    setProfileLoaded("")
  };

  console.log(blogs)

  return (
    <AnimationWrapper>
      {loading ? 
        <Loader />
       : profile_username.length ?
        <section className='h-cover md:flex flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
          <div className='flex flex-col max-md:items-center gap-5 min-w-[250px]'>
            <img
              className='w-48 h-48 bg-grey rounded-full md:w-32 md:h-32 object-cover'
              src={profile_img || '/path/to/default/profile.png'}
              alt={fullname || 'Profile'}
            />
            <h1 className='text-2xl font-medium'>@{profile_username || 'Unknown'}</h1>
            <p className='text-xl capitalize h-6'>{fullname || 'Unknown User'}</p>
            <p>
              {total_posts?.toLocaleString() || 0} Blogs - {total_reads?.toLocaleString() || 0} Reads
            </p>
            {profileId === username && (
              <Link to="/settings/edit-profile" className='btn-light rounded-md'>
                Edit Profile
              </Link>
            )}
            <AboutUser className="max-md:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt} />
          </div>

          <div className='max-md:mt-12 w-full'>
            <InPageNavigation routes={["Blogs Published", "About"]} defaultHidden={["About"]}>
              <>
                {blogs === null ? (
                  <Loader />
                ) : blogs.results.length ? (
                  blogs.results.map((blog, i) => (
                    <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                      <BlogPostCard content={blog} author={blog.author.personal_info} />
                    </AnimationWrapper>
                  ))
                ) : (
                  <NoDataMessage message="No blogs published" />
                )}
                <LoadMoreDataBtn state={blogs} fetchDataFun={getBLogs} />
              </>
              <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
            </InPageNavigation>
          </div>
        </section>
        : <PageNotFound/>
      }
    </AnimationWrapper>
  );
};

export default ProfilePage;
