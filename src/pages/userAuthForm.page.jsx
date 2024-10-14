import React, { useRef, useContext } from 'react';
import InputBox from '../components/input.component';
import { LuUser2, LuMail } from 'react-icons/lu';
import { IoKeyOutline } from 'react-icons/io5';
import googleIcon from '../imgs/google.png';
import { Link, Navigate } from 'react-router-dom';
import AnimationWrapper from '../common/page-animation';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { storeInSession } from '../common/session';
import { UserContext } from '../App';
import { authWithGoogle } from '../common/firebase';

const UserAuthForm = ({ type }) => {
  const authForm = useRef();
  const { userAuth, setUserAuth } = useContext(UserContext);

  const authenticateUserThroughServer = async (serverRoute, formData) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`, formData);
      storeInSession("user", JSON.stringify(data));
      setUserAuth(data);
      toast.success(type === "sign-in" ? "User signed in successfully!" : "User signed up successfully!");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serverRoute = type === "sign-in" ? "/signin" : "/signup";

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    const form = new FormData(authForm.current);
    const formData = Object.fromEntries(form.entries());

    const { fullname, email, password } = formData;

    if (type !== 'sign-in' && fullname && fullname.length < 3) {
      return toast.error("Full name must be at least 3 letters long");
    }

    if (!email) {
      return toast.error("Enter Email");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }

    if (!passwordRegex.test(password)) {
      return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter");
    }

    authenticateUserThroughServer(serverRoute, formData);
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await authWithGoogle();
      const { user } = result;
      const formData = {
        email: user.email,
        fullname: user.displayName,
        googleId: user.uid,
      };
      await authenticateUserThroughServer("/google-signin", formData);
    } catch (error) {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  if (userAuth?.access_token) {
    return <Navigate to="/" />;
  }

  return (
    <AnimationWrapper keyValue={type}>
      <section className='h-cover flex items-center justify-center'>
        <Toaster />
        <form ref={authForm} onSubmit={handleSubmit} className='w-[80%] max-w-[400px]'>
          <h1 className='text-4xl font-gelasio capitalize text-center mb-24'>
            {type === 'sign-in' ? 'Welcome back' : 'Join us today'}
          </h1>

          {type !== 'sign-in' && (
            <InputBox
              name='fullname'
              type='text'
              placeholder='Full Name'
              icon={LuUser2}
            />
          )}
          <InputBox
            name='email'
            type='email'
            placeholder='Email'
            icon={LuMail}
          />
          <InputBox
            name='password'
            type='password'
            placeholder='Password'
            icon={IoKeyOutline}
          />
          <button className='btn-dark center mt-14' type='submit'>
            {type.replace('-', ' ')}
          </button>

          <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
            <hr className='w-1/2 border-black' />
            or
            <hr className='w-1/2 border-black' />
          </div>
          <button
            className='btn-dark flex items-center justify-center gap-4 w-[90%] center'
            onClick={handleGoogleSignIn}
          >
            <img src={googleIcon} className='w-5' alt="Google icon" />
            Continue with Google
          </button>
          {type === 'sign-in' ? (
            <p className='mt-6 text-dark-grey text-xl text-center'>
              Don't have an account? <Link to='/signup' className='underline text-black text-xl ml-1'>Join us</Link>
            </p>
          ) : (
            <p className='mt-6 text-dark-grey text-xl text-center'>
              Already a member? <Link to='/signin' className='underline text-black text-xl ml-1'>Sign in here.</Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
