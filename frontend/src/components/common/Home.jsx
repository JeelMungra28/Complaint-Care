import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image1 from '../../Images/Image1.png'
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Footer from './FooterC'
import ThemeToggle from './ThemeToggle';

const Home = () => {
   return (
      <>
         <Navbar className="modern-navbar" expand="lg">
            <Container>
               <Navbar.Brand as={Link} to="/" className="navbar-brand">
                  ComplaintCare
               </Navbar.Brand>
               <div className="d-flex align-items-center">
                  <ul className="navbar-nav d-flex flex-row align-items-center">
                     <li className="nav-item">
                        <Link to="/" className="nav-link">
                           Home
                        </Link>
                     </li>
                     <li className="nav-item">
                        <Link to="/signup" className="nav-link">
                           SignUp
                        </Link>
                     </li>
                     <li className="nav-item">
                        <Link to="/login" className="nav-link">
                           Login
                        </Link>
                     </li>
                  </ul>
                  <ThemeToggle className="ms-3" />
               </div>
            </Container>
         </Navbar>
         <Container className='home-container'>
            <div className="left-side">
               <img src={Image1} alt="Complaint Management" />
            </div>
            <div className="right-side">
               <div>
                  <span className='f-letter'>Empower Your Team,</span>
                  <span className='s-letter'>Exceed Customer Expectations: Discover our</span>
                  <span className='t-letter'>Complaint Management Solution</span>
                  <Link to='/Login'>
                     <Button className='register'>Register your Complaint</Button>
                  </Link>
               </div>
            </div>
         </Container>
         <Footer/>
      </>
   )
}

export default Home
