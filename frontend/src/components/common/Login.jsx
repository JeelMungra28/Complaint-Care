import axios from 'axios';
import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Footer from './FooterC'
import ThemeToggle from './ThemeToggle';

const Login = () => {
   const navigate = useNavigate();
   const [user, setUser] = useState({
      email: "",
      password: ""
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      await axios.post("http://localhost:8000/Login", user)
         .then((res) => {
            alert("Successfully logged in");
            localStorage.setItem("user", JSON.stringify(res.data));
            const isLoggedIn = JSON.parse(localStorage.getItem("user"));
            const { userType } = isLoggedIn
            switch (userType) {
               case "Admin":
                  navigate("/AdminHome")
                  break;
               case "Ordinary":
                  navigate("/HomePage")
                  break;
               case "Agent":
                  navigate("/AgentHome")
                  break;

               default:
                  navigate("/Login")
                  break;
            }
         })
         .catch((err) => {
            if (err.response && err.response.status === 401) {
               alert("User doesn`t exists");
            }
            navigate("/Login");
         });
   };

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
                        <Link to="/login" className="nav-link active">
                           Login
                        </Link>
                     </li>
                  </ul>
                  <ThemeToggle className="ms-3" />
               </div>
            </Container>
         </Navbar>
         <section className="min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="container">
               <div className="row d-flex justify-content-center">
                  <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                     <div className="card-modern">
                        <div className="p-5">
                           <div className="text-center mb-5">
                              <h2 className="fw-bold mb-4" style={{color: 'var(--text-primary)'}}>
                                 Login For Registering the Complaint
                              </h2>
                              <p className="mb-4" style={{color: 'var(--text-muted)'}}>
                                 Please enter your credentials to continue
                              </p>
                           </div>
                           <form onSubmit={handleSubmit}>
                              <div className="mb-4">
                                 <label className="form-label-modern" htmlFor="email">Email Address</label>
                                 <input 
                                    type="email" 
                                    name="email" 
                                    value={user.email} 
                                    onChange={handleChange} 
                                    className="form-control-modern w-100" 
                                    placeholder="Enter your email"
                                    required 
                                 />
                              </div>
                              <div className="mb-4">
                                 <label className="form-label-modern" htmlFor="password">Password</label>
                                 <input 
                                    type="password" 
                                    name="password" 
                                    value={user.password} 
                                    onChange={handleChange} 
                                    className="form-control-modern w-100" 
                                    placeholder="Enter your password"
                                    autoComplete="off" 
                                    required 
                                 />
                              </div>

                              <button className="btn-primary-custom w-100 mb-4" type="submit">
                                 Login
                              </button>
                           </form>
                           <div className="text-center">
                              <p className="mb-0" style={{color: 'var(--text-secondary)'}}>
                                 Don't have an account? {' '}
                                 <Link 
                                    to="/SignUp" 
                                    style={{
                                       color: 'var(--primary-color)', 
                                       textDecoration: 'none',
                                       fontWeight: '600'
                                    }}
                                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                 >
                                    SignUp
                                 </Link>
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
         <Footer/>
      </>
   );
};

export default Login;
