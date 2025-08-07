import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Collapse from 'react-bootstrap/Collapse';
import ChatWindow from '../common/ChatWindow';
import Footer from '../common/FooterC'

const AgentHome = () => {
   const style = {
      marginTop: '66px',
   }

   const navigate = useNavigate();
   const [userName, setUserName] = useState('');
   const [toggle, setToggle] = useState({})
   const [agentComplaintList, setAgentComplaintList] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   useEffect(() => {
      const getData = async () => {
         try {
            setLoading(true);
            setError('');
            const user = JSON.parse(localStorage.getItem('user'));
            console.log('User from localStorage:', user);
            if (user) {
               const { _id, name } = user;
               setUserName(name);
               console.log('Fetching complaints for agent:', _id);

               // Add timeout to the request
               const response = await axios.get(`http://localhost:8000/allcomplaints/${_id}`, {
                  timeout: 10000
               });

               console.log('API Response:', response);
               console.log('Response data:', response.data);
               const complaints = response.data;

               if (Array.isArray(complaints)) {
                  setAgentComplaintList(complaints);
                  console.log(`Found ${complaints.length} complaints for agent`);
               } else {
                  console.error('Response is not an array:', complaints);
                  setError('Invalid response format from server');
               }
            } else {
               console.log('No user found in localStorage, redirecting to login');
               navigate('/');
            }
         } catch (error) {
            console.error('Error fetching complaints:', error);
            if (error.code === 'ECONNABORTED') {
               setError('Request timeout - server may be down');
            } else if (error.response) {
               setError(`Server error: ${error.response.data?.error || error.response.statusText}`);
            } else if (error.request) {
               setError('Cannot connect to server - check if backend is running');
            } else {
               setError(`Request failed: ${error.message}`);
            }
         } finally {
            setLoading(false);
         }
      };

      getData();
   }, [navigate]);

   const handleStatusChange = async (complaintId) => {
      try {
         await axios.put(`http://localhost:8000/complaint/${complaintId}`, { status: 'completed' });
         setAgentComplaintList((prevComplaints) =>
            prevComplaints.map((complaint) =>
               complaint.complaintId === complaintId
                  ? { ...complaint, status: 'completed' }
                  : complaint
            )
         );
      } catch (error) {
         console.error('Error updating complaint status:', error);
         setError('Failed to update complaint status');
      }
   };

   const handleToggle = (complaintId) => {
      setToggle((prevState) => ({
         ...prevState,
         [complaintId]: !prevState[complaintId],
      }));
   };

   const LogOut = () => {
      localStorage.removeItem('user');
      navigate('/');
   };

   return (
      <>
         <div className="body">
            <Navbar className="text-white" bg="dark" expand="lg">
               <Container fluid>
                  <Navbar.Brand className="text-white">
                     Hi Agent {userName}
                  </Navbar.Brand>
                  <Navbar.Toggle aria-controls="navbarScroll" />
                  <Navbar.Collapse id="navbarScroll">
                     <Nav className="text-white me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                        <NavLink style={{ textDecoration: 'none' }} className="text-white">
                           View Complaints
                        </NavLink>
                     </Nav>
                     <Button onClick={LogOut} variant="outline-danger">
                        Log out
                     </Button>
                  </Navbar.Collapse>
               </Container>
            </Navbar>
            <div className="container" style={{ display: 'flex', flexWrap: 'wrap', margin: '20px' }}>
               {loading ? (
                  <Alert variant="info">
                     <Alert.Heading>Loading complaints...</Alert.Heading>
                  </Alert>
               ) : error ? (
                  <Alert variant="danger">
                     <Alert.Heading>Error</Alert.Heading>
                     <p>{error}</p>
                     <Button variant="outline-danger" onClick={() => window.location.reload()}>
                        Retry
                     </Button>
                  </Alert>
               ) : agentComplaintList && agentComplaintList.length > 0 ? (
                  agentComplaintList.map((complaint, index) => {
                     const open = toggle[complaint.complaintId] || false;

                     return (
                        <Card key={index} style={{ width: '18rem', margin: '15px' }}>
                           <Card.Body>
                              <Card.Title><b>Name:</b> {complaint.name}</Card.Title>
                              <Card.Text><b>Address:</b> {complaint.address}</Card.Text>
                              <Card.Text><b>City:</b> {complaint.city}</Card.Text>
                              <Card.Text><b>State:</b> {complaint.state}</Card.Text>
                              <Card.Text><b>Pincode:</b> {complaint.pincode}</Card.Text>
                              <Card.Text><b>Comment:</b> {complaint.comment}</Card.Text>
                              <Card.Text><b>Status:</b>
                                 <span className={complaint.status === 'completed' ? 'text-success fw-bold' : 'text-warning fw-bold'}>
                                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                 </span>
                              </Card.Text>

                              {complaint.status !== 'completed' && (
                                 <Button onClick={() => handleStatusChange(complaint.complaintId)} variant="success" size="sm" className="me-2">
                                    Mark Completed
                                 </Button>
                              )}
                              <Button onClick={() => handleToggle(complaint.complaintId)}
                                 aria-controls={`collapse-${complaint.complaintId}`}
                                 aria-expanded={!open} variant="primary" size="sm">
                                 {open ? 'Hide Chat' : 'Show Chat'}
                              </Button>
                              <div>
                                 <Collapse in={!open} dimension="width">
                                    <div id="example-collapse-text">
                                       <Card body style={{ width: '250px', marginTop: '12px' }}>
                                          <ChatWindow key={complaint.complaintId} complaintId={complaint.complaintId} name={userName} />
                                       </Card>
                                    </div>
                                 </Collapse>
                              </div>

                           </Card.Body>
                        </Card>
                     );
                  })
               ) : (
                  <Alert variant="info">
                     <Alert.Heading>No complaints assigned</Alert.Heading>
                     <p>You don't have any complaints assigned to you at the moment.</p>
                  </Alert>
               )}
            </div>
         </div>
         <Footer style={style} />
      </>
   );
};

export default AgentHome;



