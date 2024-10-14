import React, { useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import lightLogo from "../imgs/logo-light.png";
import darkLogo from "../imgs/logo-dark.png";
import AnimationWrapper from '../common/page-animation';
import lightBanner from '../imgs/blog banner light.png';
import darkBanner from '../imgs/blog banner dark.png';
import { uploadImage } from '../common/aws';
import { Toaster, toast } from 'react-hot-toast';
import { EditorContext } from '../pages/editor.pages';
import EditorJS from '@editorjs/editorjs';
import { tools } from './tools.component';
import axios from 'axios';
import { ThemeContext, UserContext } from '../App';

const BlogEditor = () => {
const { blog, blog: { title, banner, content }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);

  const { userAuth: { access_token } } = useContext(UserContext);
  let { blog_id } = useParams()
  const navigate = useNavigate();
  let { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor (new EditorJS({
        holder: "textEditor",
        data: Array.isArray(content) ? content[0] : content,
        tools: tools,
        placeholder: "Let's write an awesome story",
      }));

    }
  }, [content, textEditor, setTextEditor]);

  const handleBannerUpload = async (e) => {
    const img = e.target.files[0];
    if (!img) return;

    const loadingToast = toast.loading('Uploading...');
    try {
      const url = await uploadImage(img);
      toast.dismiss(loadingToast);
      toast.success("Image uploaded successfully!");
      setBlog((prevBlog) => ({ ...prevBlog, banner: url }));
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Error uploading image: " + err.message);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    const input = e.target;
    input.style.height = 'auto';
    input.style.height = `${input.scrollHeight}px`;
    setBlog((prevBlog) => ({ ...prevBlog, title: input.value }));
  };

  const handleError = (e) => {
    let img = e.target;

    img.src = theme === 'light' ? lightBanner : darkBanner;
  };

  const handlePublishEvent = () => {
    if (!blog.banner) return toast.error("Upload a blog banner to publish it");
    if (!blog.title) return toast.error("Write a blog title to publish it");

    if (textEditor && textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog((prevBlog) => ({ ...prevBlog, content: data }));
            setEditorState("Publish");
          } else {
            toast.error("Write something in your blog to publish");
          }
        })
        .catch((err) => console.error("Error saving content:", err));
    }
  };

  const handleSaveDraft = async (e) => {
    if (e.target.className.includes('disable')) {
      return;
    }
    if (!title.length) {
      return toast.error("Write blog title before saving it as a draft");
    }

    const loadingToast = toast.loading("Saving Draft...");
    e.target.classList.add('disable');

    if (textEditor && textEditor.isReady) {
      try {
        const content = await textEditor.save();
        const blogObj = { title, banner, des: blog.des, content, tags: blog.tags, draft: true };

        await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/create-blog`, { ...blogObj, id: blog_id }, {
          headers: { 'Authorization': `Bearer ${access_token}` },
        });

        e.target.classList.remove('disable');
        toast.dismiss(loadingToast);
        toast.success("Saved");

        setTimeout(() => {
          navigate("/dashboard/blogs?tab=draft");
        }, 500);
      } catch (error) {
        e.target.classList.remove('disable');
        toast.dismiss(loadingToast);
        toast.error(error.response?.data?.error || "Failed to save draft");
      }
    }
  };

  return (
    <>
      <nav className='navbar'>
        <Link to="/" className='flex-none w-10'>
          <img src={theme == 'light' ? darkLogo : lightLogo} alt="Logo" />
        </Link>
        <p className='max-md:hidden text-black line-clamp-1 w-full'>
          {blog.title || "New Blog"}
        </p>
        <div className='flex gap-4 ml-auto'>
          <button className='btn-dark py-2' onClick={handlePublishEvent}>Publish</button>
          <button onClick={handleSaveDraft} className='btn-light py-2'>Save Draft</button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className='mx-auto max-w-[900px] w-full'>
            <div className='relative aspect-video bg-white hover:opacity-80 border-4 border-grey'>
              <label htmlFor="uploadBanner">
                <img 
                  onError={handleError}
                  src={blog.banner} 
                  className='z-20' 
                  alt="Blog Banner" 
                />
                <input
                  id='uploadBanner'
                  type='file'
                  accept='.png, .jpg, .jpeg'
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              placeholder='Blog Title'
              className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white'
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
              value={title || ''}
            ></textarea>

            <hr className='w-full opacity-40 my-5' />

            <div id='textEditor' className='font-gelasio'></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
