import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash, FaGlobe, FaYoutube, FaTwitter } from 'react-icons/fa' // Import your required icons

const iconMap = {
  website: FaGlobe,
  youtube: FaYoutube,
  twitter: FaTwitter
  // Add other icons here based on your needs
};

const InputBox = ({ name, type, id, value, placeholder, iconKey, disable = false }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const Icon = iconMap[iconKey]; // Map the string to a valid React icon component

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className='relative w-[100%] mb-4'>
      <input
        name={name}
        type={type === 'password' ? (passwordVisible ? 'text' : 'password') : type}
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        disabled={disable}
        className='input-box'
      />
      {Icon && <Icon className='input-icon' />}  {/* Properly render the passed icon */}
      {
        type === 'password' && (
          passwordVisible ? 
          <FaRegEye className='input-icon left-[auto] right-4 cursor-pointer' onClick={togglePasswordVisibility}/> :
          <FaRegEyeSlash className='input-icon left-[auto] right-4 cursor-pointer' onClick={togglePasswordVisibility}/>
        )
      }
    </div>
  )
}

export default InputBox;
