import avatar from '../src-assets/img/avatar.png';
import iconProfile from '../src-assets/img/icon-profile.svg';
import iconRaiseFund from '../src-assets/img/icon-raise-fund.svg';
import iconLogout from '../src-assets/img/icon-logout.svg';

import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/authContext';
import { useHistory } from "react-router-dom";

function CompAfterLogin() {
  // Dropdown handler
  const [stateDropdown, setStateDropdown] = useState('none');
  const toggleDropdown = () => stateDropdown === 'none' ? setStateDropdown('block') : setStateDropdown('none');
  const closeDropdown = () => setStateDropdown('none');

  const history = useHistory();
  const [,dispatchUser] = useContext(UserContext)
  // Logout handler
  const logoutHandler = () => {
    dispatchUser({
      type: 'LOGOUT',
    });

    history.push('/');
  }

  return (
    <>
      <div
        style={{display: stateDropdown}}
        onClick={closeDropdown}
        className='fixed inset-x-0 top-0 visible h-screen'
      />
      <div className='relative'>
        <div
          onClick={toggleDropdown} 
          className='w-11 h-11 cursor-pointer'
        >
          <img src={avatar} alt="Avatar User" />
        </div>

        {/* Dropdown Menu */}
        <div 
          style={{display: stateDropdown}}
          className='absolute right-2 top-14 w-0 h-0 border-x-12 border-b-24 border-b-white border-x-transparent '
        />
        <div
          style={{display: stateDropdown}}
          className='absolute right-0 top-20 w-48'>
          <div className='z-10 flex flex-col bg-white py-6 rounded-md shadow-md'>
            <Link to='/profile'>
              <div className='flex flex-row items-center mb-6 px-4'>
                <div className='w-6 mr-3'>
                  <img src={iconProfile} alt="Icon Profile User" />
                </div>
                <div className='font-semibold'>
                  Profile
                </div >
              </div>
            </Link>
            <Link to='/my-raise-fund'>
              <div className='flex flex-row items-center mb-6 px-4'>
                <div className='w-6 mr-3'>
                  <img src={iconRaiseFund} alt="Icon Raise Fund" />
                </div>
                <div className='font-semibold'>
                  Raise Fund
                </div >
              </div>
            </Link>
            <div className='h-0.5 bg-gray-hw-200 mb-5' />
            <div
              onClick={logoutHandler}
              className='cursor-pointer flex flex-row items-center px-4'
            >
              <div className='w-6 mr-3'>
                <img src={iconLogout} alt="Icon Raise Fund" />
              </div>
              <div className='font-semibold'>
                Logout
              </div >
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompAfterLogin;