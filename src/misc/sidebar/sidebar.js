    import React from 'react';
    import { useLocation, Navigate } from 'react-router-dom';
    import Navbar from '../../components/header/navbar'; // Assuming Navbar is located here
    // import Header from '../../components/header/header'; // Assuming Header is located here
    import UseAuthLogin from '../../store/useAuthLogin'; // Path to your hook

    const Sidebar = ({ isOpen, toggleSidebar }) => {  // Receive props here
    const { isAuthenticated } = UseAuthLogin(); 
    const location = useLocation();  

    const isLoginPage = location.pathname === '/login';

    const ProtectedRoute = ({ children }) => {
        return isAuthenticated ? children : <Navigate to="/login" />;
    };
    console.log(ProtectedRoute)

    return (
        <div className="app-container">
        {!isLoginPage && (
            <div className={`bg-white rounded sidebar ${isOpen ? 'open' : ''}`}>
            { isOpen ?
                <img src='../images/logo.png' alt="Logo" />
            :
            <div className='sm-logo-div'>
            <img src='../images/logo_sm.png' style={{ width: '69px', height: '69px', objectFit: "contain" }} alt="Logo" />
            </div>
            }
            <Navbar isOpen={isOpen} />
            </div>
        )}

        <div className={`${isLoginPage ? '' : `content-container ${isOpen ? 'shifted' : ''}`}`}>
            {/* {!isLoginPage && <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />} */}
            <h2>Hello Sidebar</h2>
        </div>
        </div>
    );
    };

    export default Sidebar;
