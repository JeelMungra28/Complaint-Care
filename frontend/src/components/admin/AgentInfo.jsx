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
         <Container fluid className="p-4">
            {/* Page Header */}
            <Row className="mb-4">
               <Col>
                  <div className="d-flex justify-content-between align-items-center">
                     <div>
                        <h2 className="mb-1">
                           <i className="bi bi-person-gear me-2"></i>Agent Management
                        </h2>
                        <p className="text-muted mb-0">Manage system agents and their permissions</p>
                     </div>
                     <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        <i className="bi bi-person-plus me-2"></i>Add New Agent
                     </Button>
                  </div>
               </Col>
            </Row>

            {/* Search and Filter */}
            <Row className="mb-4">
               <Col md={6}>
                  <InputGroup>
                     <InputGroup.Text>
                        <i className="bi bi-search"></i>
                     </InputGroup.Text>
                     <Form.Control
                        type="text"
                        placeholder="Search agents by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </InputGroup>
               </Col>
               <Col md={6}>
                  <div className="d-flex justify-content-end align-items-center">
                     <span className="text-muted me-3">
                        Showing {currentAgents.length} of {filteredAgents.length} agents
                     </span>
                     <Button variant="outline-secondary" size="sm" onClick={fetchAgents}>
                        <i className="bi bi-arrow-clockwise me-1"></i>Refresh
                     </Button>
                  </div>
               </Col>
            </Row>

            {/* Agents Table */}
            <Card className="shadow-sm">
               <Card.Body className="p-0">
                  {loading ? (
                     <div className="text-center p-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">Loading agents...</p>
                     </div>
                  ) : currentAgents.length > 0 ? (
                     <>
                        <Table responsive hover className="mb-0">
                           <thead className="table-light">
                              <tr>
                                 <th>
                                    <i className="bi bi-person me-1"></i>Name
                                 </th>
                                 <th>
                                    <i className="bi bi-envelope me-1"></i>Email
                                 </th>
                                 <th>
                                    <i className="bi bi-telephone me-1"></i>Phone
                                 </th>
                                 <th>
                                    <i className="bi bi-shield-check me-1"></i>Status
                                 </th>
                                 <th width="150">
                                    <i className="bi bi-gear me-1"></i>Actions
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              {currentAgents.map((agent) => (
                                 <tr key={agent._id}>
                                    <td className="align-middle">
                                       <div className="d-flex align-items-center">
                                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                                             {agent.name.charAt(0).toUpperCase()}
                                          </div>
                                          <strong>{agent.name}</strong>
                                       </div>
                                    </td>
                                    <td className="align-middle">{agent.email}</td>
                                    <td className="align-middle">{agent.phone || 'Not provided'}</td>
                                    <td className="align-middle">
                                       <Badge bg="success">
                                          <i className="bi bi-check-circle me-1"></i>Active
                                       </Badge>
                                    </td>
                                    <td className="align-middle">
                                       <div className="btn-group" role="group">
                                          <Button
                                             variant="outline-primary"
                                             size="sm"
                                             onClick={() => openEditModal(agent)}
                                             title="Edit Agent"
                                          >
                                             <i className="bi bi-pencil"></i>
                                          </Button>
                                          <Button
                                             variant="outline-danger"
                                             size="sm"
                                             onClick={() => openDeleteModal(agent)}
                                             title="Delete Agent"
                                          >
                                             <i className="bi bi-trash"></i>
                                          </Button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </Table>
                     </>
                  ) : (
                     <div className="text-center p-5">
                        <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
                        <h5 className="mt-3 text-muted">No agents found</h5>
                        <p className="text-muted">
                           {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first agent'}
                        </p>
                        {!searchTerm && (
                           <Button variant="primary" onClick={() => setShowAddModal(true)} className="mt-2">
                              <i className="bi bi-person-plus me-2"></i>Add New Agent
                           </Button>
                        )}
                     </div>
                  )}
               </Card.Body>
            </Card>

            {/* Pagination */}
            {renderPagination()}
         </Container>

         {/* Add Agent Modal */}
         <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
            <Modal.Header closeButton>
               <Modal.Title>
                  <i className="bi bi-person-plus me-2"></i>Add New Agent
               </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleAddAgent}>
               <Modal.Body>
                  <Row>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label>Full Name *</Form.Label>
                           <Form.Control
                              type="text"
                              placeholder="Enter full name"
                              value={newAgent.name}
                              onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                              required
                           />
                        </Form.Group>
                     </Col>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label>Email Address *</Form.Label>
                           <Form.Control
                              type="email"
                              placeholder="Enter email address"
                              value={newAgent.email}
                              onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                              required
                           />
                        </Form.Group>
                     </Col>
                  </Row>
                  <Row>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label>Phone Number</Form.Label>
                           <Form.Control
                              type="tel"
                              placeholder="Enter phone number"
                              value={newAgent.phone}
                              onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                           />
                        </Form.Group>
                     </Col>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label>Password *</Form.Label>
                           <Form.Control
                              type="password"
                              placeholder="Enter password"
                              value={newAgent.password}
                              onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                              required
                           />
                        </Form.Group>
                     </Col>
                  </Row>
               </Modal.Body>
               <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                     Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                     <i className="bi bi-check-lg me-2"></i>Add Agent
                  </Button>
               </Modal.Footer>
            </Form>
         </Modal>

         {/* Edit Agent Modal */}
         <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
            <Modal.Header closeButton>
               <Modal.Title>
                  <i className="bi bi-pencil me-2"></i>Edit Agent
               </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleUpdateAgent}>
               <Modal.Body>
                  <Row>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label>Full Name</Form.Label>
                           <Form.Control
                              type="text"
                              placeholder="Enter full name"
                              value={updateAgent.name}
                              onChange={(e) => setUpdateAgent({ ...updateAgent, name: e.target.value })}
                           />
                        </Form.Group>
                     </Col>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label>Email Address</Form.Label>
                           <Form.Control
                              type="email"
                              placeholder="Enter email address"
                              value={updateAgent.email}
                              onChange={(e) => setUpdateAgent({ ...updateAgent, email: e.target.value })}
                           />
                        </Form.Group>
                     </Col>
                  </Row>
                  <Row>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label>Phone Number</Form.Label>
                           <Form.Control
                              type="tel"
                              placeholder="Enter phone number"
                              value={updateAgent.phone}
                              onChange={(e) => setUpdateAgent({ ...updateAgent, phone: e.target.value })}
                           />
                        </Form.Group>
                     </Col>
                  </Row>
               </Modal.Body>
               <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                     Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                     <i className="bi bi-check-lg me-2"></i>Update Agent
                  </Button>
               </Modal.Footer>
            </Form>
         </Modal>

         {/* Delete Confirmation Modal */}
         <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title className="text-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>Confirm Delete
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <p className="mb-0">
                  Are you sure you want to delete agent <strong>{selectedAgent?.name}</strong>?
               </p>
               <p className="text-muted small mt-2">
                  This action cannot be undone and will also remove all associated data.
               </p>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
               </Button>
               <Button variant="danger" onClick={handleDeleteAgent}>
                  <i className="bi bi-trash me-2"></i>Delete Agent
               </Button>
            </Modal.Footer>
         </Modal>

         {/* Toast Notifications */}
         <ToastContainer position="top-end" className="p-3">
            <Toast
               show={toast.show}
               onClose={() => setToast({ ...toast, show: false })}
               delay={4000}
               autohide
               bg={toast.variant}
            >
               <Toast.Body className={toast.variant === 'danger' ? 'text-white' : ''}>
                  <i className={`bi ${toast.variant === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
                  {toast.message}
               </Toast.Body>
            </Toast>
         </ToastContainer>

         <Footer />
      </>
   );
};

export default AgentInfo;