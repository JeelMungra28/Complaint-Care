import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Footer from './FooterC'
import ThemeToggle from './ThemeToggle';

const SignUp = () => {
   const [title, setTitle] = useState("Select User Type")
   const [user, setUser] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      userType: ""
   })
   const handleChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value })
   }

   const handleTitle = (select) => {
      setTitle(select)
      setUser({ ...user, userType: select });
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      const updatedUser = { ...user, userType: title };
      axios.post("http://localhost:8000/SignUp", updatedUser)
         .then((res) => {
            alert("Account created successfully!")
            JSON.stringify(res.data.user)
         })
         .catch((err) => {
            console.log(err)
            alert("Error creating account. Please try again.")
         })
      setUser({
        name: "",
        email: "",
        password: "",
        phone: "",
        userType: ""
      })
      setTitle("Select User Type")
   }
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
                        <Link to="/signup" className="nav-link active">
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
         <section className="min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="container">
               <div className="row d-flex justify-content-center">
                  <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                     <div className="card-modern">
                        <div className="p-5">
                           <div className="text-center mb-4">
                              <h2 className="fw-bold mb-4" style={{color: 'var(--text-primary)'}}>
                                 SignUp For Registering the Complaint
                              </h2>
                              <p className="mb-4" style={{color: 'var(--text-muted)'}}>
                                 Create your account to get started
                              </p>
                           </div>
                           <form onSubmit={handleSubmit}>
                              <div className="mb-3">
                                 <label className="form-label-modern" htmlFor="name">Full Name</label>
                                 <input 
                                    type="text" 
                                    name="name" 
                                    value={user.name} 
                                    onChange={handleChange} 
                                    className="form-control-modern w-100" 
                                    placeholder="Enter your full name"
                                    required 
                                 />
                              </div>
                              <div className="mb-3">
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
                              <div className="mb-3">
                                 <label className="form-label-modern" htmlFor="password">Password</label>
                                 <input 
                                    type="password" 
                                    name="password" 
                                    value={user.password} 
                                    onChange={handleChange} 
                                    className="form-control-modern w-100" 
                                    placeholder="Enter your password"
                                    required 
                                 />
                              </div>
                              <div className="mb-3">
                                 <label className="form-label-modern" htmlFor="phone">Phone Number</label>
                                 <input 
                                    type="tel" 
                                    name="phone" 
                                    value={user.phone} 
                                    onChange={handleChange} 
                                    className="form-control-modern w-100" 
                                    placeholder="Enter your phone number"
                                    required 
                                 />
                              </div>
                              <div className="mb-4">
                                 <label className="form-label-modern">User Type</label>
                                 <Dropdown>
                                    <Dropdown.Toggle 
                                       className="w-100 form-control-modern d-flex align-items-center justify-content-between"
                                       style={{
                                          background: 'var(--bg-secondary)',
                                          border: '2px solid var(--border-color)',
                                          color: 'var(--text-primary)'
                                       }}
                                    >
                                       {title}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu 
                                       style={{
                                          background: 'var(--bg-primary)',
                                          border: '1px solid var(--border-color)',
                                          borderRadius: 'var(--radius-md)'
                                       }}
                                    >
                                       <Dropdown.Item 
                                          onClick={() => handleTitle("Ordinary")}
                                          style={{
                                             color: 'var(--text-primary)',
                                             background: 'transparent'
                                          }}
                                          onMouseEnter={(e) => e.target.style.background = 'var(--hover-bg)'}
                                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                       >
                                          Ordinary User
                                       </Dropdown.Item>
                                       <Dropdown.Item 
                                          onClick={() => handleTitle("Admin")}
                                          style={{
                                             color: 'var(--text-primary)',
                                             background: 'transparent'
                                          }}
                                          onMouseEnter={(e) => e.target.style.background = 'var(--hover-bg)'}
                                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                       >
                                          Admin
                                       </Dropdown.Item>
                                       <Dropdown.Item 
                                          onClick={() => handleTitle("Agent")}
                                          style={{
                                             color: 'var(--text-primary)',
                                             background: 'transparent'
                                          }}
                                          onMouseEnter={(e) => e.target.style.background = 'var(--hover-bg)'}
                                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                       >
                                          Agent
                                       </Dropdown.Item>
                                    </Dropdown.Menu>
                                 </Dropdown>
                              </div>
                              <button className="btn-primary-custom w-100 mb-4" type="submit">
                                 Create Account
                              </button>
                           </form>
                           <div className="text-center">
                              <p className="mb-0" style={{color: 'var(--text-secondary)'}}>
                                 Already have an account? {' '}
                                 <Link 
                                    to="/Login" 
                                    style={{
                                       color: 'var(--primary-color)', 
                                       textDecoration: 'none',
                                       fontWeight: '600'
                                    }}
                                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                 >
                                    Login
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
   )
}

export default SignUp