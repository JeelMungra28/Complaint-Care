import React, { useState, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Row, Col, Card } from 'react-bootstrap';
import Image1 from '../../Images/Image1.png'
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Footer from './FooterC'
import ThemeToggle from './ThemeToggle';

const Home = () => {
   const [isVisible, setIsVisible] = useState(false);
   const [currentFeature, setCurrentFeature] = useState(0);

   const features = [
      {
         title: "Quick Resolution",
         description: "Get your complaints resolved faster with our streamlined process",
         icon: "⚡"
      },
      {
         title: "24/7 Support",
         description: "Round-the-clock support to address your concerns anytime",
         icon: "🕒"
      },
      {
         title: "Track Progress",
         description: "Monitor your complaint status in real-time with detailed updates",
         icon: "📊"
      },
      {
         title: "Expert Agents",
         description: "Professional agents trained to handle your complaints efficiently",
         icon: "👥"
      }
   ];

   const stats = [
      { number: "10,000+", label: "Complaints Resolved" },
      { number: "95%", label: "Customer Satisfaction" },
      { number: "24/7", label: "Support Available" },
      { number: "2 mins", label: "Average Response" }
   ];

   useEffect(() => {
      setIsVisible(true);
      const interval = setInterval(() => {
         setCurrentFeature((prev) => (prev + 1) % features.length);
      }, 3000);
      return () => clearInterval(interval);
   }, [features.length]);

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

         <Container fluid className={`home-container ${isVisible ? 'fade-in-up' : ''}`}>
            <Row className="hero-section align-items-center min-vh-100">
               <Col lg={6} className="left-side">
                  <div className="image-container">
                     <img src={Image1} alt="Complaint Management" className="hero-image" />
                     <div className="floating-elements">
                        <div className="floating-card card-1">
                           <span>✅ Quick Response</span>
                        </div>
                        <div className="floating-card card-2">
                           <span>🔔 Real-time Updates</span>
                        </div>
                        <div className="floating-card card-3">
                           <span>⭐ Expert Support</span>
                        </div>
                     </div>
                  </div>
               </Col>
               <Col lg={6} className="right-side">
                  <div className="hero-content">
                     <div className="hero-text">
                        <span className='f-letter typing-effect'>Empower Your Team,</span>
                        <span className='s-letter slide-in-left'>Exceed Customer Expectations: Discover our</span>
                        <span className='t-letter slide-in-right'>Advanced Complaint Management Solution</span>
                     </div>
                     <div className="hero-description">
                        <p>Transform your customer service experience with our comprehensive complaint management system.
                           Handle complaints efficiently, track progress seamlessly, and maintain customer satisfaction.</p>
                     </div>
                     <div className="cta-section">
                        <Link to='/Login'>
                           <Button className='register pulse-button'>
                              <span>📝</span>
                              Register your Complaint
                           </Button>
                        </Link>
                        <div className="quick-stats">
                           {stats.map((stat, index) => (
                              <div key={index} className={`stat-item bounce-in-${index + 1}`}>
                                 <div className="stat-number">{stat.number}</div>
                                 <div className="stat-label">{stat.label}</div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </Col>
            </Row>

            {/* Features Section */}
            <Row className="features-section py-5">
               <Col xs={12}>
                  <div className="section-header text-center mb-5">
                     <h2 className="section-title">Why Choose ComplaintCare?</h2>
                     <p className="section-subtitle">Discover the features that make us the best choice for complaint management</p>
                  </div>
               </Col>
               {features.map((feature, index) => (
                  <Col key={index} md={6} lg={3} className="mb-4">
                     <Card className={`feature-card h-100 ${currentFeature === index ? 'active-feature' : ''}`}>
                        <Card.Body className="text-center">
                           <div className="feature-icon">{feature.icon}</div>
                           <Card.Title className="feature-title">{feature.title}</Card.Title>
                           <Card.Text className="feature-description">{feature.description}</Card.Text>
                        </Card.Body>
                     </Card>
                  </Col>
               ))}
            </Row>

            {/* Process Steps */}
            <Row className="process-section py-5">
               <Col xs={12}>
                  <div className="section-header text-center mb-5">
                     <h2 className="section-title">How It Works</h2>
                     <p className="section-subtitle">Simple steps to get your complaint resolved</p>
                  </div>
               </Col>
               <Col md={4} className="mb-4">
                  <div className="process-step">
                     <div className="step-number">1</div>
                     <h4>Submit Complaint</h4>
                     <p>Fill out our easy-to-use complaint form with all the necessary details</p>
                  </div>
               </Col>
               <Col md={4} className="mb-4">
                  <div className="process-step">
                     <div className="step-number">2</div>
                     <h4>Track Progress</h4>
                     <p>Monitor your complaint status and receive real-time updates</p>
                  </div>
               </Col>
               <Col md={4} className="mb-4">
                  <div className="process-step">
                     <div className="step-number">3</div>
                     <h4>Get Resolution</h4>
                     <p>Receive prompt resolution from our expert support team</p>
                  </div>
               </Col>
            </Row>
         </Container>
         <Footer />
      </>
   )
}

export default Home
