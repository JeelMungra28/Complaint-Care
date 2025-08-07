import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Footer from '../common/FooterC'
import Complaint from '../user/Complaint';
import Status from '../user/Status';
import ThemeToggle from '../common/ThemeToggle';

const HomePage = () => {
   const navigate = useNavigate();
   const [activeComponent, setActiveComponent] = useState('Complaint');
   const [userName, setUserName] = useState('');

   useEffect(() => {
      const getData = async () => {
         try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
               const { name } = user;
               setUserName(name);
            } else {
               navigate('/');
            }
         } catch (error) {
            console.log(error);
         }
      };

      getData();
   }, [navigate]);

   const handleNavLinkClick = (componentName) => {
      setActiveComponent(componentName);
   };

   const Logout = () => {
      localStorage.removeItem('user');
      navigate('/');
   };

   return (
      <>
         <nav className="modern-navbar">
            <div className="container-fluid">
               <div className="d-flex align-items-center">
                  <h1 className="navbar-brand mb-0" style={{color: 'var(--text-primary)', fontSize: '1.5rem'}}>
                     Hi, {userName}
                  </h1>
               </div>
               <div className="d-flex align-items-center">
                  <ul className="navbar-nav d-flex flex-row align-items-center me-4">
                     <li className="nav-item">
                        <button
                           className={`nav-link btn ${activeComponent === 'Complaint' ? 'active' : ''}`}
                           onClick={() => handleNavLinkClick('Complaint')}
                           style={{
                              background: activeComponent === 'Complaint' ? 'var(--primary-light)' : 'transparent',
                              border: 'none',
                              color: activeComponent === 'Complaint' ? 'var(--primary-color)' : 'var(--text-secondary)',
                              fontWeight: activeComponent === 'Complaint' ? '600' : '500',
                              borderRadius: 'var(--radius-md)',
                              padding: '0.75rem 1rem',
                              transition: 'all var(--transition-fast)'
                           }}
                           onMouseEnter={(e) => {
                              if (activeComponent !== 'Complaint') {
                                 e.target.style.background = 'var(--hover-bg)';
                                 e.target.style.color = 'var(--primary-color)';
                              }
                           }}
                           onMouseLeave={(e) => {
                              if (activeComponent !== 'Complaint') {
                                 e.target.style.background = 'transparent';
                                 e.target.style.color = 'var(--text-secondary)';
                              }
                           }}
                        >
                           Complaint Register
                        </button>
                     </li>
                     <li className="nav-item ms-2">
                        <button
                           className={`nav-link btn ${activeComponent === 'Status' ? 'active' : ''}`}
                           onClick={() => handleNavLinkClick('Status')}
                           style={{
                              background: activeComponent === 'Status' ? 'var(--primary-light)' : 'transparent',
                              border: 'none',
                              color: activeComponent === 'Status' ? 'var(--primary-color)' : 'var(--text-secondary)',
                              fontWeight: activeComponent === 'Status' ? '600' : '500',
                              borderRadius: 'var(--radius-md)',
                              padding: '0.75rem 1rem',
                              transition: 'all var(--transition-fast)'
                           }}
                           onMouseEnter={(e) => {
                              if (activeComponent !== 'Status') {
                                 e.target.style.background = 'var(--hover-bg)';
                                 e.target.style.color = 'var(--primary-color)';
                              }
                           }}
                           onMouseLeave={(e) => {
                              if (activeComponent !== 'Status') {
                                 e.target.style.background = 'transparent';
                                 e.target.style.color = 'var(--text-secondary)';
                              }
                           }}
                        >
                           Status
                        </button>
                     </li>
                  </ul>
                  <div className="d-flex align-items-center gap-3">
                     <ThemeToggle />
                     <button 
                        className="btn"
                        onClick={Logout}
                        style={{
                           background: 'var(--error-color)',
                           color: 'white',
                           border: 'none',
                           padding: '0.75rem 1.5rem',
                           borderRadius: 'var(--radius-md)',
                           fontWeight: '600',
                           transition: 'all var(--transition-fast)',
                           boxShadow: 'var(--shadow-sm)'
                        }}
                        onMouseEnter={(e) => {
                           e.target.style.transform = 'translateY(-1px)';
                           e.target.style.boxShadow = 'var(--shadow-md)';
                        }}
                        onMouseLeave={(e) => {
                           e.target.style.transform = 'translateY(0)';
                           e.target.style.boxShadow = 'var(--shadow-sm)';
                        }}
                     >
                        LogOut
                     </button>
                  </div>
               </div>
            </div>
         </nav>
         <div className="body fade-in">
            <div className="container">
               {activeComponent === 'Complaint' ? <Complaint /> : null}
               {activeComponent === 'Status' ? <Status /> : null}
            </div>
         </div>
         <Footer />
      </>
   );
};

export default HomePage;





