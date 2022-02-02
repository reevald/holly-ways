// Assets
import logo from '../src-assets/img/logo.svg';

// Sub component
import CompLogin from './login';
import CompRegister from './register';
import CompAfterLogin from './afterLogin';

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/authContext';

function WrapperNavbar({ children }) {
  return (
    <div className='fixed inset-x-0 top-0 bg-red-hw h-16 flex flex-row justify-center'>
      <div className='flex flex-row justify-between items-center h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-16'>
        <div>
          <Link to='/'>
            <img src={logo} alt='Logo' />
          </Link>
        </div>
        <div className='flex flex-row items-center'>
          {children}
        </div>
      </div>
    </div>
  );
}

function CompNavbar() {
  const [state,] = useContext(UserContext);
  const isLogin = state.isLogin;
  
  return (
    <WrapperNavbar>
      { isLogin ?
        <CompAfterLogin />
        :
        <>
          <CompLogin />
          <CompRegister />
        </>
      }
    </WrapperNavbar>
  );
}

export default CompNavbar;