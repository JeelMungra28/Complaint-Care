import React, { useEffect, useState } from 'react';
import { 
   Button, 
   Table, 
   Alert, 
   Container, 
   Form, 
   Modal,
   Row,
   Col,
   Card,
   InputGroup,
   Badge,
   Pagination,
   Spinner,
   Toast,
   ToastContainer
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../common/FooterC';
import axios from 'axios';

const AgentInfo = () => {
   const navigate = useNavigate();
   const [agentList, setAgentList] = useState([]);
   const [filteredAgents, setFilteredAgents] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage] = useState(10);
   
   // Modal states
   const [showAddModal, setShowAddModal] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [selectedAgent, setSelectedAgent] = useState(null);
   
   // Form states
   const [newAgent, setNewAgent] = useState({
      name: '',
      email: '',
      phone: '',
      password: ''
   });
   const [updateAgent, setUpdateAgent] = useState({
      name: '',
      email: '',
      phone: ''
   });
   
   // Toast state
   const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

   useEffect(() => {
      fetchAgents();
   }, []);

   useEffect(() => {
      filterAgents();
   }, [searchTerm, agentList]);

   const fetchAgents = async () => {
      try {
         setLoading(true);
         const response = await axios.get('http://localhost:8000/AgentUsers');
         const agents = response.data || [];
         setAgentList(agents);
         setFilteredAgents(agents);
      } catch (error) {
         console.log('Error fetching agents:', error);
         showToast('Error fetching agents', 'danger');
      } finally {
         setLoading(false);
      }
   };

   const filterAgents = () => {
      if (!searchTerm) {
         setFilteredAgents(agentList);
         return;
      }
      
      const filtered = agentList.filter(agent =>
         agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (agent.phone && agent.phone.includes(searchTerm))
      );
      setFilteredAgents(filtered);
      setCurrentPage(1); // Reset to first page when filtering
   };

   const showToast = (message, variant = 'success') => {
      setToast({ show: true, message, variant });
   };

   const handleAddAgent = async (e) => {
      e.preventDefault();
      if (!newAgent.name || !newAgent.email || !newAgent.password) {
         showToast('Please fill in all required fields', 'danger');
         return;
      }

      try {
         const agentData = {
            ...newAgent,
            userType: 'Agent'
         };
         await axios.post('http://localhost:8000/SignUp', agentData);
         showToast('Agent added successfully', 'success');
         setShowAddModal(false);
         setNewAgent({ name: '', email: '', phone: '', password: '' });
         fetchAgents();
      } catch (error) {
         console.log('Error adding agent:', error);
         const message = error.response?.data?.message || 'Error adding agent';
         showToast(message, 'danger');
      }
   };

   const handleUpdateAgent = async (e) => {
      e.preventDefault();
      if (!updateAgent.name && !updateAgent.email && !updateAgent.phone) {
         showToast('Please fill in at least one field to update', 'danger');
         return;
      }

      try {
         await axios.put(`http://localhost:8000/user/${selectedAgent._id}`, updateAgent);
         showToast('Agent updated successfully', 'success');
         setShowEditModal(false);
         setUpdateAgent({ name: '', email: '', phone: '' });
         fetchAgents();
      } catch (error) {
         console.log('Error updating agent:', error);
         showToast('Error updating agent', 'danger');
      }
   };

   const handleDeleteAgent = async () => {
      try {
         await axios.delete(`http://localhost:8000/OrdinaryUsers/${selectedAgent._id}`);
         showToast('Agent deleted successfully', 'success');
         setShowDeleteModal(false);
         fetchAgents();
      } catch (error) {
         console.log('Error deleting agent:', error);
         showToast('Error deleting agent', 'danger');
      }
   };

   const openEditModal = (agent) => {
      setSelectedAgent(agent);
      setUpdateAgent({
         name: agent.name,
         email: agent.email,
         phone: agent.phone || ''
      });
      setShowEditModal(true);
   };

   const openDeleteModal = (agent) => {
      setSelectedAgent(agent);
      setShowDeleteModal(true);
   };

   // Pagination logic
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentAgents = filteredAgents.slice(indexOfFirstItem, indexOfLastItem);
   const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

   const renderPagination = () => {
      if (totalPages <= 1) return null;

      let items = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
         startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      // Previous button
      items.push(
         <Pagination.Prev 
            key="prev" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(currentPage - 1)} 
         />
      );

      // Page numbers
      for (let number = startPage; number <= endPage; number++) {
         items.push(
            <Pagination.Item
               key={number}
               active={number === currentPage}
               onClick={() => setCurrentPage(number)}
            >
               {number}
            </Pagination.Item>
         );
      }

      // Next button
      items.push(
         <Pagination.Next 
            key="next" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(currentPage + 1)} 
         />
      );

      return <Pagination className="justify-content-center mb-4">{items}</Pagination>;
   };


   return (
      <>
         <div className="body">

            <Container>
               <Table striped bordered hover>
                  <thead>
                     <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {ordinaryList.length > 0 ? (
                        ordinaryList.map((agent) => {
                           const open = toggle[agent._id] || false;

                           return (
                              <tr key={agent._id}>
                                 <td>{agent.name}</td>
                                 <td>{agent.email}</td>
                                 <td>{agent.phone}</td>
                                 <td><Button onClick={() => handleToggle(agent._id)}
                                    aria-controls={`collapse-${agent._id}`}
                                    aria-expanded={open}
                                    className='mx-2'
                                    variant="outline-warning">
                                    Update
                                 </Button>
                                    <Collapse in={open}>
                                       <Form onSubmit={() => handleSubmit(agent._id)} className='p-5'>
                                          <Form.Group className="mb-3" controlId="formBasic">
                                             <Form.Label>Full Name </Form.Label>
                                             <Form.Control type="text" name='name' value={updateAgent.name} onChange={handleChange} placeholder="Enter name" />
                                          </Form.Group>
                                          <Form.Group className="mb-3" value controlId="formBasicEmail">
                                             <Form.Label>Email address</Form.Label>
                                             <Form.Control type="email" name='email' value={updateAgent.email} onChange={handleChange} placeholder="Enter email" />
                                          </Form.Group>

                                          <Form.Group className="mb-3" value controlId="formBasicTel">
                                             <Form.Label>Phone</Form.Label>
                                             <Form.Control type="tel" name='phone' value={updateAgent.phone} onChange={handleChange} placeholder="Enter Phone no." />
                                          </Form.Group>

                                          <Button size='sm' variant="outline-success" type="submit">
                                             Submit
                                          </Button>
                                       </Form>
                                    </Collapse>
                                    <Button onClick={() => deleteUser(agent._id)} className='mx-2' variant="outline-danger">Delete</Button></td>
                              </tr>
                           )
                        })
                     ) : (
                        <Alert variant="info">
                           <Alert.Heading>No Agents to show</Alert.Heading>
                        </Alert>
                     )}
                  </tbody>
               </Table>
            </Container>
         </div>
         <Footer />
      </>
   )
}
export default AgentInfo
