import React, { useRef, useState, useEffect } from 'react';
import { useContext } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../App';

const SideNav = () => {
  let { userAuth: { access_token, new_notification_available } } = useContext(UserContext);
  const location = useLocation();

  // Get the current page from the URL
  let page = location.pathname.split("/")[2] || 'dashboard';
  let [pageState, setPageState] = useState(page.replace('-', ' '));
  let [showsSideNav, setShowsSideNav] = useState(false);

  let activeTabLine = useRef();
  let sideBarIconTab = useRef();
  let pageStateTab = useRef();

  // Update active tab underline when the component loads or page state changes
  useEffect(() => {
    if (pageStateTab.current) {
      let { offsetWidth, offsetLeft } = pageStateTab.current;
      activeTabLine.current.style.width = offsetWidth + "px";
      activeTabLine.current.style.left = offsetLeft + "px";
    }
  }, [pageState]);

  // Handles page state and tab underline position change
  const changePageState = (e) => {
    let { offsetWidth, offsetLeft } = e.target;

    activeTabLine.current.style.width = offsetWidth + "px";
    activeTabLine.current.style.left = offsetLeft + "px";

    if (e.target === sideBarIconTab.current) {
      setShowsSideNav(!showsSideNav); // Toggle sidebar
    } else {
      setShowsSideNav(false);
      setPageState(e.target.innerText); // Update the displayed page state
    }
  };

  return (
    access_token === null ? <Navigate to="/login" /> : 
    <>
      <section className='relative flex gap-10 py-0 m-0 max-md:flex-col'>
        
        {/* Mobile top bar */}
        <div className='md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto'>
          <button ref={sideBarIconTab} className='p-5 capitalize' onClick={changePageState}>
            <i className='fi fi-rr-bars-staggered pointer-events-none'></i>
          </button>
          <button ref={pageStateTab} className='p-5 capitalize' onClick={changePageState}>
            {pageState}
          </button>
          <hr ref={activeTabLine} className='absolute bottom-0 duration-500'/>
        </div>

        {/* Sidebar */}
        <div className={`min-w-[200px] h-[calc(100vh-8px-60px)] md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 transition-all ease-in-out ${showsSideNav ? 'opacity-100 pointer-events-auto' : 'max-md:opacity-0 max-md:pointer-events-none'}`}>
          <h1 className='text-xl text-dark-grey mb-3'>Dashboard</h1>
          <hr className='border-grey -ml-6 mb-8 mr-6' />

          <NavLink to='/dashboard/blogs' onClick={changePageState} className='sidebar-link'>
            <i className='fi fi-rr-document'></i> Blogs
          </NavLink>
          <NavLink to='/dashboard/notifications' onClick={changePageState} className='sidebar-link'>
            <div className='relative'>
              <i className='fi fi-rr-bell'></i> 
            {
              new_notification_available ? 
              <span className=' bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0'></span> : ""
            }
            </div>
            Notifications
          </NavLink>
          <NavLink to='/editor' onClick={changePageState} className='sidebar-link'>
            <i className='fi fi-rr-file-edit'></i> Write
          </NavLink>

          <h1 className='text-xl text-dark-grey mt-20 mb-3'>Settings</h1>
          <hr className='border-grey -ml-6 mb-8 mr-6' />

          <NavLink to='/settings/edit-profile' onClick={changePageState} className='sidebar-link'>
            <i className='fi fi-rr-user'></i> Edit Profile
          </NavLink>
          <NavLink to='/settings/change-password' onClick={changePageState} className='sidebar-link'>
            <i className='fi fi-rr-lock'></i> Change Password
          </NavLink>
        </div>

        {/* Main content */}
        <div className='max-md:-mt-8 mt-5 w-full'>
          <Outlet />
        </div>
      </section>
    </>
  );
};

export default SideNav;
