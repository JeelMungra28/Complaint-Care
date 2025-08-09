import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';

import UserInfo from './UserInfo';
import AccordionAdmin from "./AccordionAdmin";
import AgentInfo from './AgentInfo';
import DashboardStats from './DashboardStats';

const AdminHome = () => {
   const navigate = useNavigate();
   const [activeComponent, setActiveComponent] = useState('dashboard');

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

   const LogOut = () => {
      localStorage.removeItem('user');
      navigate('/');
   };

   return (
      <>
         <Navbar className="shadow-sm" bg="dark" variant="dark" expand="lg" sticky="top">
            <Container fluid>
               <Navbar.Brand className="fw-bold">
                  <i className="bi bi-shield-check me-2"></i>
                  Complaint Care Admin
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                     <Nav.Link
                        className={`px-3 ${activeComponent === 'dashboard' ? 'active fw-bold' : ''}`}
                        onClick={() => handleNavLinkClick('dashboard')}
                        style={{ cursor: 'pointer' }}
                     >
                        <i className="bi bi-speedometer2 me-1"></i> Dashboard
                     </Nav.Link>
                     <Nav.Link
                        className={`px-3 ${activeComponent === 'complaints' ? 'active fw-bold' : ''}`}
                        onClick={() => handleNavLinkClick('complaints')}
                        style={{ cursor: 'pointer' }}
                     >
                        <i className="bi bi-clipboard-data me-1"></i> Complaints
                     </Nav.Link>
                     <Nav.Link
                        className={`px-3 ${activeComponent === 'UserInfo' ? 'active fw-bold' : ''}`}
                        onClick={() => handleNavLinkClick('UserInfo')}
                        style={{ cursor: 'pointer' }}
                     >
                        <i className="bi bi-people me-1"></i> Users
                     </Nav.Link>
                     <Nav.Link
                        className={`px-3 ${activeComponent === 'Agent' ? 'active fw-bold' : ''}`}
                        onClick={() => handleNavLinkClick('Agent')}
                        style={{ cursor: 'pointer' }}
                     >
                        <i className="bi bi-person-gear me-1"></i> Agents
                     </Nav.Link>
                  </Nav>
                  <div className="d-flex align-items-center">
                     <span className="text-light me-3">
                        <i className="bi bi-person-circle me-1"></i>
                        Welcome, {userName}
                     </span>
                     <Button onClick={LogOut} variant="outline-light" size="sm">
                        <i className="bi bi-box-arrow-right me-1"></i>
                        Logout
                     </Button>
                  </div>
               </Navbar.Collapse>
            </Container>
         </Navbar>
         
         <div className="content" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {activeComponent === 'dashboard' && <DashboardStats />}
            {activeComponent === 'complaints' && <AccordionAdmin />}
            {activeComponent === 'Agent' && <AgentInfo />}
            {activeComponent === 'UserInfo' && <UserInfo />}
         </div>
      </>
   )


};

export default AdminHome;


