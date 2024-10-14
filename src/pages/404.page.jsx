import React, { useContext } from 'react';
import lightPageNotFound from '../imgs/404-light.png';
import darkPageNotFound from '../imgs/404-dark.png';
import { Link } from 'react-router-dom';
import lightFullLogo from '../imgs/full-logo-light.png';
import darkFullLogo from '../imgs/full-logo-dark.png';
import { ThemeContext } from '../App';

const PageNotFound = () => {

  let { theme } = useContext(ThemeContext);

  return (
    <main className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
      <img
        src={theme == "light" ? darkPageNotFound : lightPageNotFound}
        alt="404 - Page not found"
        className='select-none border-2 border-grey w-72 aspect-square object-cover rounded'
      />

      <h1 className='text-4xl font-gelasio leading-7'>Page not found</h1>
      <p className='text-dark-grey text-xl leading-7 -mt-8'>
        The page you are looking for does not exist. Head back to the <Link to="/" className='text-black underline'>Home Page</Link>
      </p>

      <div className='mt-auto'>
        <img
          src={theme == "light" ? darkFullLogo : lightFullLogo}
          alt="Full Logo"
          className='h-8 object-contain block mx-auto underline'
        />
        <p className='mt-5 text-dark-grey'>Read millions of stories around the world</p>
      </div>
    </main>
  );
}

export default PageNotFound;
