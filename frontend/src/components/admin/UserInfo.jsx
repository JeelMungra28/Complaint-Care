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
   ToastContainer,
   ProgressBar
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../common/FooterC';
import axios from 'axios';

const UserInfo = () => {
   const navigate = useNavigate();
   const [userList, setUserList] = useState([]);
   const [filteredUsers, setFilteredUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage] = useState(12);
   const [filterStatus, setFilterStatus] = useState('all');
   
   // Modal states
   const [showEditModal, setShowEditModal] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [showBulkModal, setShowBulkModal] = useState(false);
   const [selectedUser, setSelectedUser] = useState(null);
   const [selectedUsers, setSelectedUsers] = useState([]);
   
   // Form states
   const [updateUser, setUpdateUser] = useState({
      name: '',
      email: '',
      phone: ''
   });
   
   // Toast state
   const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

   // User stats
   const [userStats, setUserStats] = useState({
      total: 0,
      active: 0,
      inactive: 0,
      newThisMonth: 0
   });

   useEffect(() => {
      fetchUsers();
   }, []);

   useEffect(() => {
      filterUsers();
   }, [searchTerm, userList, filterStatus]);

   const fetchUsers = async () => {
      try {
         setLoading(true);
         const response = await axios.get('http://localhost:8000/OrdinaryUsers');
         const users = response.data || [];
         setUserList(users);
         setFilteredUsers(users);
         
         // Calculate stats
         const stats = {
            total: users.length,
            active: users.length, // All users are considered active for now
            inactive: 0,
            newThisMonth: users.filter(user => {
               const createdAt = new Date(user.createdAt);
               const thisMonth = new Date();
               thisMonth.setDate(1);
               thisMonth.setHours(0, 0, 0, 0);
               return createdAt >= thisMonth;
            }).length
         };
         setUserStats(stats);
      } catch (error) {
         console.log('Error fetching users:', error);
         showToast('Error fetching users', 'danger');
      } finally {
         setLoading(false);
      }
   };

   const filterUsers = () => {
      let filtered = userList;
      
      // Apply search filter
      if (searchTerm) {
         filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.phone && user.phone.includes(searchTerm))
         );
      }
      
      // Apply status filter (placeholder for future implementation)
      if (filterStatus !== 'all') {
         // Add status filtering logic here
      }
      
      setFilteredUsers(filtered);
      setCurrentPage(1); // Reset to first page when filtering
   };

   const showToast = (message, variant = 'success') => {
      setToast({ show: true, message, variant });
   };

   const handleUpdateUser = async (e) => {
      e.preventDefault();
      if (!updateUser.name && !updateUser.email && !updateUser.phone) {
         showToast('Please fill in at least one field to update', 'danger');
         return;
      }

      try {
         await axios.put(`http://localhost:8000/user/${selectedUser._id}`, updateUser);
         showToast('User updated successfully', 'success');
         setShowEditModal(false);
         setUpdateUser({ name: '', email: '', phone: '' });
         fetchUsers();
      } catch (error) {
         console.log('Error updating user:', error);
         showToast('Error updating user', 'danger');
      }
   };

   const handleDeleteUser = async () => {
      try {
         await axios.delete(`http://localhost:8000/OrdinaryUsers/${selectedUser._id}`);
         showToast('User deleted successfully', 'success');
         setShowDeleteModal(false);
         fetchUsers();
      } catch (error) {
         console.log('Error deleting user:', error);
         showToast('Error deleting user', 'danger');
      }
   };

   const handleBulkDelete = async () => {
      try {
         const deletePromises = selectedUsers.map(userId =>
            axios.delete(`http://localhost:8000/OrdinaryUsers/${userId}`)
         );
         await Promise.all(deletePromises);
         showToast(`${selectedUsers.length} users deleted successfully`, 'success');
         setShowBulkModal(false);
         setSelectedUsers([]);
         fetchUsers();
      } catch (error) {
         console.log('Error deleting users:', error);
         showToast('Error deleting users', 'danger');
      }
   };

   const openEditModal = (user) => {
      setSelectedUser(user);
      setUpdateUser({
         name: user.name,
         email: user.email,
         phone: user.phone || ''
      });
      setShowEditModal(true);
   };

   const openDeleteModal = (user) => {
      setSelectedUser(user);
      setShowDeleteModal(true);
   };

   const toggleUserSelection = (userId) => {
      setSelectedUsers(prev => 
         prev.includes(userId)
            ? prev.filter(id => id !== userId)
            : [...prev, userId]
      );
   };

   const toggleAllUsers = () => {
      if (selectedUsers.length === currentUsers.length) {
         setSelectedUsers([]);
      } else {
         setSelectedUsers(currentUsers.map(user => user._id));
      }
   };

   // Pagination logic
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

   const renderPagination = () => {
      if (totalPages <= 1) return null;

      let items = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
         startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      items.push(
         <Pagination.Prev 
            key="prev" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(currentPage - 1)} 
         />
      );

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

      items.push(
         <Pagination.Next 
            key="next" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(currentPage + 1)} 
         />
      );

      return <Pagination className="justify-content-center mb-4">{items}</Pagination>;
   };

   const getActivityStatus = (user) => {
      // Placeholder logic - in a real app, you'd check last login, etc.
      const isActive = Math.random() > 0.3; // Random for demo
      return isActive ? 'Active' : 'Inactive';
   };

   const getActivityVariant = (status) => {
      return status === 'Active' ? 'success' : 'warning';
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
                           <i className="bi bi-people me-2"></i>User Management
                        </h2>
                        <p className="text-muted mb-0">Manage registered users and their activities</p>
                     </div>
                     <div>
                        {selectedUsers.length > 0 && (
                           <Button variant="danger" className="me-2" onClick={() => setShowBulkModal(true)}>
                              <i className="bi bi-trash me-1"></i>Delete Selected ({selectedUsers.length})
                           </Button>
                        )}
                        <Button variant="outline-secondary" size="sm">
                           <i className="bi bi-download me-1"></i>Export
                        </Button>
                     </div>
                  </div>
               </Col>
            </Row>

            {/* Statistics Cards */}
            <Row className="g-3 mb-4">
               <Col xl={3} md={6}>
                  <Card className="h-100 shadow-sm border-0">
                     <Card.Body>
                        <div className="d-flex justify-content-between">
                           <div>
                              <h6 className="text-muted mb-2">Total Users</h6>
                              <h2 className="mb-0 fw-bold text-primary">
                                 {loading ? <Spinner size="sm" /> : userStats.total}
                              </h2>
                           </div>
                           <div className="text-primary opacity-75" style={{ fontSize: '2rem' }}>👥</div>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
               <Col xl={3} md={6}>
                  <Card className="h-100 shadow-sm border-0">
                     <Card.Body>
                        <div className="d-flex justify-content-between">
                           <div>
                              <h6 className="text-muted mb-2">Active Users</h6>
                              <h2 className="mb-0 fw-bold text-success">
                                 {loading ? <Spinner size="sm" /> : userStats.active}
                              </h2>
                           </div>
                           <div className="text-success opacity-75" style={{ fontSize: '2rem' }}>✅</div>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
               <Col xl={3} md={6}>
                  <Card className="h-100 shadow-sm border-0">
                     <Card.Body>
                        <div className="d-flex justify-content-between">
                           <div>
                              <h6 className="text-muted mb-2">New This Month</h6>
                              <h2 className="mb-0 fw-bold text-info">
                                 {loading ? <Spinner size="sm" /> : userStats.newThisMonth}
                              </h2>
                           </div>
                           <div className="text-info opacity-75" style={{ fontSize: '2rem' }}>📈</div>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
               <Col xl={3} md={6}>
                  <Card className="h-100 shadow-sm border-0">
                     <Card.Body>
                        <div className="d-flex justify-content-between">
                           <div>
                              <h6 className="text-muted mb-2">Activity Rate</h6>
                              <h2 className="mb-0 fw-bold text-primary">
                                 {loading ? <Spinner size="sm" /> : Math.round((userStats.active / (userStats.total || 1)) * 100)}%
                              </h2>
                           </div>
                           <div className="text-primary opacity-75" style={{ fontSize: '2rem' }}>⚡</div>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>

            {/* Search, Filter and Actions */}
            <Row className="mb-4">
               <Col md={6}>
                  <InputGroup>
                     <InputGroup.Text>
                        <i className="bi bi-search"></i>
                     </InputGroup.Text>
                     <Form.Control
                        type="text"
                        placeholder="Search users by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </InputGroup>
               </Col>
               <Col md={3}>
                  <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                     <option value="all">All Users</option>
                     <option value="active">Active Users</option>
                     <option value="inactive">Inactive Users</option>
                  </Form.Select>
               </Col>
               <Col md={3}>
                  <div className="d-flex justify-content-end align-items-center">
                     <span className="text-muted me-3">
                        Showing {currentUsers.length} of {filteredUsers.length} users
                     </span>
                     <Button variant="outline-secondary" size="sm" onClick={fetchUsers}>
                        <i className="bi bi-arrow-clockwise me-1"></i>Refresh
                     </Button>
                  </div>
               </Col>
            </Row>

            {/* Users Table */}
            <Card className="shadow-sm">
               <Card.Body className="p-0">
                  {loading ? (
                     <div className="text-center p-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">Loading users...</p>
                     </div>
                  ) : currentUsers.length > 0 ? (
                     <>
                        <Table responsive hover className="mb-0">
                           <thead className="table-light">
                              <tr>
                                 <th width="50">
                                    <Form.Check
                                       type="checkbox"
                                       checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                                       onChange={toggleAllUsers}
                                    />
                                 </th>
                                 <th>
                                    <i className="bi bi-person me-1"></i>User
                                 </th>
                                 <th>
                                    <i className="bi bi-envelope me-1"></i>Email
                                 </th>
                                 <th>
                                    <i className="bi bi-telephone me-1"></i>Phone
                                 </th>
                                 <th>
                                    <i className="bi bi-activity me-1"></i>Status
                                 </th>
                                 <th>
                                    <i className="bi bi-calendar me-1"></i>Joined
                                 </th>
                                 <th width="150">
                                    <i className="bi bi-gear me-1"></i>Actions
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              {currentUsers.map((user) => {
                                 const activityStatus = getActivityStatus(user);
                                 return (
                                    <tr key={user._id}>
                                       <td className="align-middle">
                                          <Form.Check
                                             type="checkbox"
                                             checked={selectedUsers.includes(user._id)}
                                             onChange={() => toggleUserSelection(user._id)}
                                          />
                                       </td>
                                       <td className="align-middle">
                                          <div className="d-flex align-items-center">
                                             <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                                                {user.name.charAt(0).toUpperCase()}
                                             </div>
                                             <div>
                                                <strong>{user.name}</strong>
                                                <br />
                                                <small className="text-muted">ID: {user._id.substring(0, 8)}</small>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="align-middle">{user.email}</td>
                                       <td className="align-middle">{user.phone || 'Not provided'}</td>
                                       <td className="align-middle">
                                          <Badge bg={getActivityVariant(activityStatus)}>
                                             <i className={`bi bi-${activityStatus === 'Active' ? 'check-circle' : 'clock'} me-1`}></i>
                                             {activityStatus}
                                          </Badge>
                                       </td>
                                       <td className="align-middle">
                                          <small>
                                             {user.createdAt 
                                                ? new Date(user.createdAt).toLocaleDateString()
                                                : 'Unknown'
                                             }
                                          </small>
                                       </td>
                                       <td className="align-middle">
                                          <div className="btn-group" role="group">
                                             <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => openEditModal(user)}
                                                title="Edit User"
                                             >
                                                <i className="bi bi-pencil"></i>
                                             </Button>
                                             <Button
                                                variant="outline-info"
                                                size="sm"
                                                title="View Activity"
                                             >
                                                <i className="bi bi-activity"></i>
                                             </Button>
                                             <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => openDeleteModal(user)}
                                                title="Delete User"
                                             >
                                                <i className="bi bi-trash"></i>
                                             </Button>
                                          </div>
                                       </td>
                                    </tr>
                                 );
                              })}
                           </tbody>
                        </Table>
                     </>
                  ) : (
                     <div className="text-center p-5">
                        <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
                        <h5 className="mt-3 text-muted">No users found</h5>
                        <p className="text-muted">
                           {searchTerm ? 'Try adjusting your search criteria' : 'No users have registered yet'}
                        </p>
                     </div>
                  )}
               </Card.Body>
            </Card>

            {/* Pagination */}
            {renderPagination()}
         </Container>

         {/* Edit User Modal */}
         <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
            <Modal.Header closeButton>
               <Modal.Title>
                  <i className="bi bi-pencil me-2"></i>Edit User
               </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleUpdateUser}>
               <Modal.Body>
                  <Row>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label>Full Name</Form.Label>
                           <Form.Control
                              type="text"
                              placeholder="Enter full name"
                              value={updateUser.name}
                              onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
                           />
                        </Form.Group>
                     </Col>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label>Email Address</Form.Label>
                           <Form.Control
                              type="email"
                              placeholder="Enter email address"
                              value={updateUser.email}
                              onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
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
                              value={updateUser.phone}
                              onChange={(e) => setUpdateUser({ ...updateUser, phone: e.target.value })}
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
                     <i className="bi bi-check-lg me-2"></i>Update User
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
                  Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?
               </p>
               <p className="text-muted small mt-2">
                  This action cannot be undone and will also remove all associated data.
               </p>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
               </Button>
               <Button variant="danger" onClick={handleDeleteUser}>
                  <i className="bi bi-trash me-2"></i>Delete User
               </Button>
            </Modal.Footer>
         </Modal>

         {/* Bulk Delete Modal */}
         <Modal show={showBulkModal} onHide={() => setShowBulkModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title className="text-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>Confirm Bulk Delete
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <p className="mb-0">
                  Are you sure you want to delete <strong>{selectedUsers.length} selected users</strong>?
               </p>
               <p className="text-muted small mt-2">
                  This action cannot be undone and will remove all associated data for these users.
               </p>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setShowBulkModal(false)}>
                  Cancel
               </Button>
               <Button variant="danger" onClick={handleBulkDelete}>
                  <i className="bi bi-trash me-2"></i>Delete {selectedUsers.length} Users
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

export default UserInfo;