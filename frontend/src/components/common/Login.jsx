import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState({});

   const validateForm = () => {
   const newErrors = {};

   // Email validation
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!user.email) {
      newErrors.email = 'Email is required';
   } else if (!emailRegex.test(user.email)) {
      newErrors.email = 'Please enter a valid email address';
   }

   // Password validation
   if (!user.password) {
      newErrors.password = 'Password is required';
   } else if (user.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
   }

   setErrors(newErrors);
   return Object.keys(newErrors).length === 0;
};

const handleSocialLogin = (provider) => {
   alert(`${provider} login integration would be implemented here. For demo purposes, redirecting to home page.`);
   navigate('/');
};

const handleChange = (e) => {
   const { name, value } = e.target;
   setUser({ ...user, [name]: value });
   // Clear error when user starts typing
   if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
   }
};

const handleSubmit = async (e) => {
   e.preventDefault();

   if (!validateForm()) {
      return;
   }

   setIsLoading(true);

   try {
      const res = await axios.post("http://localhost:8000/Login", user);
      alert("Successfully logged in");
      localStorage.setItem("user", JSON.stringify(res.data));
      const isLoggedIn = JSON.parse(localStorage.getItem("user"));
      const { userType } = isLoggedIn;

      switch (userType) {
         case "Admin":
            navigate("/AdminHome");
            break;
         case "Ordinary":
            navigate("/HomePage");
            break;
         case "Agent":
            navigate("/AgentHome");
            break;
         default:
            navigate("/");
            break;
      }
   } catch (err) {
      if (err.response && err.response.status === 401) {
         setErrors({ general: "Invalid credentials. Please check your email and password." });
      } else {
         setErrors({ general: "Login failed. Please try again." });
      }
   } finally {
      setIsLoading(false);
   }
};

return (
   <>
      <Navbar className="modern-navbar" expand="lg">
         <Container>
            <Navbar.Brand as={Link} to="/" className="navbar-brand animated-brand">
               <span className="brand-icon">🛡️</span>
               ComplaintCare
            </Navbar.Brand>
            <div className="navbar-content">
               <ul className="navbar-nav d-flex flex-row align-items-center">
                  <li className="nav-item">
                     <Link to="/" className="nav-link">
                        <span className="nav-icon">🏠</span>
                        Home
                     </Link>
                  </li>
                  <li className="nav-item">
                     <Link to="/signup" className="nav-link">
                        <span className="nav-icon">👤</span>
                        SignUp
                     </Link>
                  </li>
                  <li className="nav-item">
                     <Link to="/login" className="nav-link active">
                        <span className="nav-icon">🔐</span>
                        Login
                     </Link>
                  </li>
               </ul>
               <div className="theme-toggle-container">
                  <ThemeToggle />
               </div>
            </div>
         </Container>
      </Navbar>

      <section className="min-vh-100 d-flex align-items-center justify-content-center py-5 auth-section">
         <div className="container">
            <div className="row d-flex justify-content-center">
               <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                  <div className="card-modern auth-card">
                     <div className="p-5">
                        <div className="text-center mb-5">
                           <div className="auth-icon mb-3">🔐</div>
                           <h2 className="fw-bold mb-4 auth-title">
                              Welcome Back!
                           </h2>
                           <p className="mb-4 auth-subtitle">
                              Please sign in to your account to continue
                           </p>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="social-login-section mb-4">
                           <div className="social-buttons">
                              <button
                                 type="button"
                                 className="social-btn google-btn"
                                 onClick={() => handleSocialLogin('Google')}
                              >
                                 <span className="social-icon">🔍</span>
                                 Continue with Google
                              </button>
                              <button
                                 type="button"
                                 className="social-btn apple-btn"
                                 onClick={() => handleSocialLogin('Apple')}
                              >
                                 <span className="social-icon">🍎</span>
                                 Continue with Apple
                              </button>
                              <button
                                 type="button"
                                 className="social-btn microsoft-btn"
                                 onClick={() => handleSocialLogin('Microsoft')}
                              >
                                 <span className="social-icon">🪟</span>
                                 Continue with Microsoft
                              </button>
                           </div>
                           <div className="divider">
                              <span>or sign in with email</span>
                           </div>
                        </div>

                        {errors.general && (
                           <div className="alert alert-danger mb-4">
                              {errors.general}
                           </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                           <div className="mb-4">
                              <label className="form-label-modern" htmlFor="email">
                                 <span className="label-icon">📧</span>
                                 Email Address
                              </label>
                              <input
                                 type="email"
                                 name="email"
                                 value={user.email}
                                 onChange={handleChange}
                                 className={`form-control-modern w-100 ${errors.email ? 'error' : ''}`}
                                 placeholder="Enter your email"
                                 required
                              />
                              {errors.email && <div className="error-message">{errors.email}</div>}
                           </div>

                           <div className="mb-4">
                              <label className="form-label-modern" htmlFor="password">
                                 <span className="label-icon">🔒</span>
                                 Password
                              </label>
                              <div className="password-input-container">
                                 <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    className={`form-control-modern w-100 ${errors.password ? 'error' : ''}`}
                                    placeholder="Enter your password"
                                    required
                                 />
                                 <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                 >
                                    {showPassword ? '🙈' : '👁️'}
                                 </button>
                              </div>
                              {errors.password && <div className="error-message">{errors.password}</div>}
                           </div>

                           <button
                              className={`btn-primary-custom w-100 mb-4 ${isLoading ? 'loading' : ''}`}
                              type="submit"
                              disabled={isLoading}
                           >
                              {isLoading ? (
                                 <>
                                    <span className="spinner"></span>
                                    Signing In...
                                 </>
                              ) : (
                                 <>
                                    <span>🚀</span>
                                    Sign In
                                 </>
                              )}
                           </button>
                        </form>

                        <div className="text-center">
                           <p className="mb-0 auth-footer">
                              Don't have an account? {' '}
                              <Link
                                 to="/SignUp"
                                 className="auth-link"
                              >
                                 Create Account
                              </Link>
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
      <Footer />
   </>
);
};

export default Login;
