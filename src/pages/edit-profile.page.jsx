import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../App'
import axios from 'axios';
import { profileDataStructure } from './profile.page';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import toast, { Toaster } from 'react-hot-toast';
import InputBox from '../components/input.component';
import { BiUser } from "react-icons/bi";
import { CiMail } from "react-icons/ci";
import { CiAt } from "react-icons/ci";
import { uploadImage } from '../common/aws';
import { storeInSession } from '../common/session';

const EditProfile = () => {

    let { userAuth, userAuth: { access_token , username }, setUserAuth } = useContext(UserContext);

    let bioLimit = 150;
    
    let profileImgFile = useRef();
    let editProfileForm = useRef();

    const [ profile, setProfile ] = useState(profileDataStructure);
    const [ loading, setLoading ] = useState(true)
    const [ charactersLeft, setCharactersLeft ] = useState(bioLimit)
    const [ updatedProfileImg, setUpdatedProfileImg ] = useState(null)

    let { personal_info: { fullname,  username: profile_username, profile_img, email, bio }, social_links } = profile;

    useEffect(() => {
         
        if(access_token) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: userAuth.username })
            .then(({ data }) => {
                setProfile(data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
        }

    }, [access_token])


    const handleCharacterChange = (e) => {
        setCharactersLeft(bioLimit - e.target.value.length)
    }

    const handleImagePreview = (e) => {

       let img = e.target.files[0]

       profileImgFile.current.src = URL.createObjectURL(img);

       setUpdatedProfileImg(img)

    }

    const handleImageUpload = (e) => {

        e.preventDefault();

        if(updatedProfileImg){

            let loadingToast = toast.loading("Uploading...")
            e.target.setAttribute("disabled", true);

            uploadImage(updatedProfileImg)
            .then( url => {
                
                if(url){
                    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img", {url}, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    })
                    .then(({ data }) => {
                        let newUserAuth = { ...userAuth, profile_img: data.profile_img }

                        storeInSession("user", JSON.stringify(newUserAuth));
                        setUserAuth(newUserAuth)

                        setUpdatedProfileImg(null);

                        toast.dismiss(loadingToast)
                        e.target.removeAttribute("disabled");
                        toast.success("Uploaded")
                    })
                    .catch(({response}) => {
                       toast.dismiss(loadingToast)
                        e.target.removeAttribute("disabled");
                        toast.error(response.data.error) 
                    })
                }

            } )
            .catch(err => {
                console.log(err)
            })

        }

    }

    const handleSubmit = (e) => {
    e.preventDefault();

    let form = new FormData(editProfileForm.current);
    let formData = {};

    // Loop through form entries and assign a fallback for undefined values
    for (let [key, value] of form.entries()) {
        formData[key] = value || '';  // Ensure no undefined values
    }

    // Destructure formData with default values for undefined fields
    let { username = '', bio = '', youtube = '', facebook = '', twitter = '', github = '', instagram = '', website = '' } = formData;

    // Check if the username has at least 3 characters
    if (username.length < 3) {
        return toast.error("Username should be at least 3 letters long");
    }

    // Check if the bio length exceeds the allowed limit (with fallback to empty string if undefined)
    if (bio.length > bioLimit) {
        return toast.error(`Bio should not be more than ${bioLimit} characters`);
    }

    // Proceed with form submission if all validations pass
    let loadingToast = toast.loading("Updating.....");
    e.target.setAttribute("disabled", true);

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile", {
        username,
        bio,
        social_links: { youtube, facebook, twitter, github, instagram, website }
    }, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })
    .then(({ data }) => {
        // If the username has changed, update the session and context
        if (userAuth.username !== data.username) {
            let newUserAuth = { ...userAuth, username: data.username };
            storeInSession("user", JSON.stringify(newUserAuth));
            setUserAuth(newUserAuth);
        }

        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        toast.success("Profile Updated");
    })
    .catch(({ response }) => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        toast.error(response.data.error);
    });
}



  return (
    <AnimationWrapper>
        {
            loading ? <Loader /> :
            <form ref={editProfileForm}>
                <Toaster />
                <h1 className='max-md:hidden'>Edit Profile</h1>

                <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>
                    <div className='max-md:center mb-5'>
                        <label htmlFor="uploading" className=" relative block w-48 h-48 bg-grey rounded-full overflow-hidden" id='profileImgLabel'>
                        <div className=' w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer'>
                            Upload Image
                        </div>
                            <img ref={profileImgFile} src={profile_img} alt="" />
                        </label>

                        <input type="file" id='uploading' accept='.jpeg, .png,  .jpg' hidden  onChange={handleImagePreview}/>

                        <button className='btn-light mt-5 max-lg:center lg:w-full px-10' onClick={handleImageUpload}>Upload</button>
                    </div>

                    <div className='w-full'>
                        <div className=' grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                            <div>
                                <InputBox name="fullname" type="text" value={fullname} placeholder="Full Name" disable={true} icon={BiUser}   /> 
                            </div>
                            <div>
                                <InputBox name="email" type="email" value={email} placeholder="Email" disable={true} icon={CiMail}   /> 
                            </div>
                        </div>

                        <InputBox 
                        name="username" 
                        value={username} 
                        onChange={(e) => setProfile({ ...profile, personal_info: { ...profile.personal_info, username: e.target.value }})} 
                        placeholder="Username" 
                        icon={CiAt} 
                        />


                        <p className=' text-dark-grey -mt-3 '>Username will use to search user and will be visible to all user</p>

                        <textarea name="bio" maxLength={bioLimit} placeholder='Bio....' defaultValue={bio} className='input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5' onChange={handleCharacterChange} ></textarea>

                        <p className='mt-1 to-dark-grey' >{ charactersLeft } Characters left </p>

                        <p className='my-6 to-dark-grey'>Add your social handle</p>

                        <div className='md:grid md:grid-cols-2 gap-x-6'>
                            {
                                Object.keys(social_links).map((key, i) => {

                                    let link = social_links[key];

                                    return <InputBox key={i} name={key} value={link} placeholder="https://" icon={"fi" + (key != 'website' ? "fi-Brands-" + key : "fi-rr-globe") + "text-2xl hover:text-black"} />

                                })
                            }
                        </div>

                        <button className='btn-dark w-auto px-10' type='submit' onClick={handleSubmit}>Update</button>

                    </div>

                </div>
            </form>
        }
    </AnimationWrapper>
  )
}

export default EditProfile
