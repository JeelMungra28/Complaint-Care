import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Footer from './FooterC'
import ThemeToggle from './ThemeToggle';

const SignUp = () => {
   const navigate = useNavigate();
   const [title, setTitle] = useState("Select User Type")
   const [user, setUser] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      userType: ""
   });

   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState({});
   const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });
   const checkPasswordStrength = (password) => {
      let score = 0;
      let feedback = [];

      if (password.length >= 8) {
         score += 1;
      } else {
         feedback.push('At least 8 characters');
      }

      if (/[a-z]/.test(password)) {
         score += 1;
      } else {
         feedback.push('Lowercase letter');
      }

      if (/[A-Z]/.test(password)) {
         score += 1;
      } else {
         feedback.push('Uppercase letter');
      }

      if (/[0-9]/.test(password)) {
         score += 1;
      } else {
         feedback.push('Number');
      }

      if (/[^A-Za-z0-9]/.test(password)) {
         score += 1;
      } else {
         feedback.push('Special character');
      }

      return { score, feedback };
   };

   const validateForm = () => {
      const newErrors = {};

      // Name validation
      if (!user.name.trim()) {
         newErrors.name = 'Full name is required';
      } else if (user.name.trim().length < 2) {
         newErrors.name = 'Name must be at least 2 characters';
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!user.email) {
         newErrors.email = 'Email is required';
      } else if (!emailRegex.test(user.email)) {
         newErrors.email = 'Please enter a valid email address';
      }

      // Phone validation
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
      if (!user.phone) {
         newErrors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(user.phone)) {
         newErrors.phone = 'Please enter a valid phone number';
      }

      // Password validation
      if (!user.password) {
         newErrors.password = 'Password is required';
      } else if (passwordStrength.score < 3) {
         newErrors.password = 'Password is too weak. Please include: ' + passwordStrength.feedback.join(', ');
      }

      // User type validation
      if (title === "Select User Type") {
         newErrors.userType = 'Please select a user type';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSocialSignup = (provider) => {
      alert(`${provider} signup integration would be implemented here. For demo purposes, redirecting to home page.`);
      navigate('/');
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value });

      // Real-time password strength check
      if (name === 'password') {
         setPasswordStrength(checkPasswordStrength(value));
      }

      // Clear error when user starts typing
      if (errors[name]) {
         setErrors(prev => ({ ...prev, [name]: '' }));
      }
   };

   const handleTitle = (select) => {
      setTitle(select)
      setUser({ ...user, userType: select });
      // Clear error when user selects a type
      if (errors.userType) {
         setErrors(prev => ({ ...prev, userType: '' }));
      }
   }

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) {
         return;
      }

      setIsLoading(true);

      const updatedUser = { ...user, userType: title };

      try {
         const res = await axios.post("http://localhost:8000/SignUp", updatedUser);
         alert("Account created successfully! Redirecting to home page...");
         console.log(res.data.user);
         // Redirect to home page after successful registration
         navigate('/');
      } catch (err) {
         console.log(err);
         if (err.response && err.response.status === 409) {
            setErrors({ general: "An account with this email already exists." });
         } else {
            setErrors({ general: "Error creating account. Please try again." });
         }
      } finally {
         setIsLoading(false);
      }
   }
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
                        <Link to="/signup" className="nav-link active">
                           <span className="nav-icon">👤</span>
                           SignUp
                        </Link>
                     </li>
                     <li className="nav-item">
                        <Link to="/login" className="nav-link">
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
                  <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                     <div className="card-modern auth-card">
                        <div className="p-5">
                           <div className="text-center mb-4">
                              <div className="auth-icon mb-3">👤</div>
                              <h2 className="fw-bold mb-4 auth-title">
                                 Join ComplaintCare
                              </h2>
                              <p className="mb-4 auth-subtitle">
                                 Create your account to start managing complaints efficiently
                              </p>
                           </div>

                           {/* Social Signup Buttons */}
                           <div className="social-login-section mb-4">
                              <div className="social-buttons">
                                 <button
                                    type="button"
                                    className="social-btn google-btn"
                                    onClick={() => handleSocialSignup('Google')}
                                 >
                                    <span className="social-icon">🔍</span>
                                    Sign up with Google
                                 </button>
                                 <button
                                    type="button"
                                    className="social-btn apple-btn"
                                    onClick={() => handleSocialSignup('Apple')}
                                 >
                                    <span className="social-icon">🍎</span>
                                    Sign up with Apple
                                 </button>
                                 <button
                                    type="button"
                                    className="social-btn microsoft-btn"
                                    onClick={() => handleSocialSignup('Microsoft')}
                                 >
                                    <span className="social-icon">🪟</span>
                                    Sign up with Microsoft
                                 </button>
                              </div>
                              <div className="divider">
                                 <span>or create account with email</span>
                              </div>
                           </div>

                           {errors.general && (
                              <div className="alert alert-danger mb-4">
                                 {errors.general}
                              </div>
                           )}

                           <form onSubmit={handleSubmit} className="auth-form">
                              <div className="row">
                                 <div className="col-md-6">
                                    <div className="mb-3">
                                       <label className="form-label-modern" htmlFor="name">
                                          <span className="label-icon">👤</span>
                                          Full Name
                                       </label>
                                       <input
                                          type="text"
                                          name="name"
                                          value={user.name}
                                          onChange={handleChange}
                                          className={`form-control-modern w-100 ${errors.name ? 'error' : ''}`}
                                          placeholder="Enter your full name"
                                          required
                                       />
                                       {errors.name && <div className="error-message">{errors.name}</div>}
                                    </div>
                                 </div>
                                 <div className="col-md-6">
                                    <div className="mb-3">
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
                                 </div>
                              </div>

                              <div className="row">
                                 <div className="col-md-6">
                                    <div className="mb-3">
                                       <label className="form-label-modern" htmlFor="phone">
                                          <span className="label-icon">📱</span>
                                          Phone Number
                                       </label>
                                       <input
                                          type="tel"
                                          name="phone"
                                          value={user.phone}
                                          onChange={handleChange}
                                          className={`form-control-modern w-100 ${errors.phone ? 'error' : ''}`}
                                          placeholder="Enter your phone number"
                                          required
                                       />
                                       {errors.phone && <div className="error-message">{errors.phone}</div>}
                                    </div>
                                 </div>
                                 <div className="col-md-6">
                                    <div className="mb-3">
                                       <label className="form-label-modern">
                                          <span className="label-icon">🎭</span>
                                          User Type
                                       </label>
                                       <Dropdown>
                                          <Dropdown.Toggle
                                             className={`w-100 form-control-modern d-flex align-items-center justify-content-between ${errors.userType ? 'error' : ''}`}
                                          >
                                             {title}
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu className="dropdown-menu-custom">
                                             <Dropdown.Item
                                                onClick={() => handleTitle("Ordinary")}
                                                className="dropdown-item-custom"
                                             >
                                                <span className="dropdown-icon">👤</span>
                                                Ordinary User
                                             </Dropdown.Item>
                                             <Dropdown.Item
                                                onClick={() => handleTitle("Admin")}
                                                className="dropdown-item-custom"
                                             >
                                                <span className="dropdown-icon">⚙️</span>
                                                Admin
                                             </Dropdown.Item>
                                             <Dropdown.Item
                                                onClick={() => handleTitle("Agent")}
                                                className="dropdown-item-custom"
                                             >
                                                <span className="dropdown-icon">🛠️</span>
                                                Agent
                                             </Dropdown.Item>
                                          </Dropdown.Menu>
                                       </Dropdown>
                                       {errors.userType && <div className="error-message">{errors.userType}</div>}
                                    </div>
                                 </div>
                              </div>

                              <div className="mb-3">
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
                                       placeholder="Create a strong password"
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
                                 {user.password && (
                                    <div className="password-strength-indicator">
                                       <div className="strength-bar">
                                          <div
                                             className={`strength-fill strength-${passwordStrength.score}`}
                                             style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                          ></div>
                                       </div>
                                       <div className="strength-feedback">
                                          {passwordStrength.score < 3 ? (
                                             <span className="weak">Weak - Add: {passwordStrength.feedback.join(', ')}</span>
                                          ) : passwordStrength.score < 5 ? (
                                             <span className="medium">Medium - Add: {passwordStrength.feedback.join(', ')}</span>
                                          ) : (
                                             <span className="strong">Strong password! ✅</span>
                                          )}
                                       </div>
                                    </div>
                                 )}
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
                                       Creating Account...
                                    </>
                                 ) : (
                                    <>
                                       <span>🚀</span>
                                       Create Account
                                    </>
                                 )}
                              </button>
                           </form>

                           <div className="text-center">
                              <p className="mb-0 auth-footer">
                                 Already have an account? {' '}
                                 <Link
                                    to="/Login"
                                    className="auth-link"
                                 >
                                    Sign In
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
   )
}

export default SignUp