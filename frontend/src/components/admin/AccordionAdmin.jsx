import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Form, 
  InputGroup, 
  Modal,
  Dropdown,
  Spinner,
  Alert,
  Toast,
  ToastContainer,
  ProgressBar,
  ButtonGroup
} from 'react-bootstrap';
import Footer from '../common/FooterC';
import axios from 'axios';

const AccordionAdmin = () => {
  const [complaintList, setComplaintList] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  // Statistics
  const [complaintStats, setComplaintStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    critical: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [searchTerm, statusFilter, priorityFilter, complaintList]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [complaintsRes, agentsRes] = await Promise.all([
        axios.get('http://localhost:8000/status'),
        axios.get('http://localhost:8000/AgentUsers')
      ]);

      const complaints = complaintsRes.data || [];
      const agents = agentsRes.data || [];

      setComplaintList(complaints);
      setFilteredComplaints(complaints);
      setAgentList(agents);

      // Calculate statistics
      const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        inProgress: complaints.filter(c => c.status === 'in-progress').length,
        completed: complaints.filter(c => c.status === 'completed').length,
        critical: complaints.filter(c => getPriority(c) === 'High').length
      };
      setComplaintStats(stats);

    } catch (error) {
      console.log('Error fetching data:', error);
      showToast('Error fetching data', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = complaintList;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    // Priority filter (based on comment keywords for demo)
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(complaint => getPriority(complaint) === priorityFilter);
    }

    setFilteredComplaints(filtered);
  };

  const getPriority = (complaint) => {
    const comment = complaint.comment.toLowerCase();
    if (comment.includes('urgent') || comment.includes('emergency') || comment.includes('critical')) {
      return 'High';
    } else if (comment.includes('important') || comment.includes('soon')) {
      return 'Medium';
    }
    return 'Low';
  };

  const getPriorityVariant = (priority) => {
    const variants = {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'success'
    };
    return variants[priority] || 'secondary';
  };

  const getStatusVariant = (status) => {
    const variants = {
      'pending': 'warning',
      'in-progress': 'info',
      'completed': 'success'
    };
    return variants[status] || 'secondary';
  };

  const showToast = (message, variant = 'success') => {
    setToast({ show: true, message, variant });
  };

  const handleAssignComplaint = async (agentId, complaintId, status, agentName) => {
    try {
      const assignedComplaint = {
        agentId,
        complaintId,
        status,
        agentName,
      };

      await axios.post('http://localhost:8000/assignedComplaints', assignedComplaint);
      const updatedComplaintList = complaintList.filter((complaint) => complaint._id !== complaintId);
      setComplaintList(updatedComplaintList);
      setShowAssignModal(false);
      showToast(`Complaint assigned to ${agentName} successfully`, 'success');
      fetchData(); // Refresh data
    } catch (error) {
      console.log('Error assigning complaint:', error);
      showToast('Error assigning complaint', 'danger');
    }
  };

  const openAssignModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowAssignModal(true);
  };

  const openDetailsModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailsModal(true);
  };

  const exportComplaints = () => {
    const csvContent = [
      ['Name', 'Email', 'City', 'State', 'Status', 'Priority', 'Comment', 'Date'],
      ...filteredComplaints.map(complaint => [
        complaint.name,
        complaint.email || 'N/A',
        complaint.city,
        complaint.state,
        complaint.status,
        getPriority(complaint),
        complaint.comment,
        complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaints-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showToast('Complaints exported successfully', 'success');
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
                  <i className="bi bi-clipboard-data me-2"></i>Complaint Management
                </h2>
                <p className="text-muted mb-0">Monitor, filter, and manage all complaints</p>
              </div>
              <div>
                <Button variant="outline-success" className="me-2" onClick={exportComplaints}>
                  <i className="bi bi-download me-1"></i>Export
                </Button>
                <Button variant="outline-secondary" onClick={fetchData}>
                  <i className="bi bi-arrow-clockwise me-1"></i>Refresh
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
                    <h6 className="text-muted mb-2">Total Complaints</h6>
                    <h2 className="mb-0 fw-bold text-primary">
                      {loading ? <Spinner size="sm" /> : complaintStats.total}
                    </h2>
                  </div>
                  <div className="text-primary opacity-75" style={{ fontSize: '2rem' }}>📋</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-2">Pending</h6>
                    <h2 className="mb-0 fw-bold text-warning">
                      {loading ? <Spinner size="sm" /> : complaintStats.pending}
                    </h2>
                  </div>
                  <div className="text-warning opacity-75" style={{ fontSize: '2rem' }}>⏳</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-2">In Progress</h6>
                    <h2 className="mb-0 fw-bold text-info">
                      {loading ? <Spinner size="sm" /> : complaintStats.inProgress}
                    </h2>
                  </div>
                  <div className="text-info opacity-75" style={{ fontSize: '2rem' }}>🔄</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-2">Completed</h6>
                    <h2 className="mb-0 fw-bold text-success">
                      {loading ? <Spinner size="sm" /> : complaintStats.completed}
                    </h2>
                    <small className="text-muted">
                      {complaintStats.total > 0 
                        ? `${Math.round((complaintStats.completed / complaintStats.total) * 100)}% resolution rate`
                        : '0% resolution rate'
                      }
                    </small>
                  </div>
                  <div className="text-success opacity-75" style={{ fontSize: '2rem' }}>✅</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters and Search */}
        <Row className="mb-4">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="all">All Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <div className="d-flex justify-content-end">
              <span className="text-muted small">
                {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? 's' : ''}
              </span>
            </div>
          </Col>
        </Row>

        {/* Complaints Grid */}
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading complaints...</p>
          </div>
        ) : filteredComplaints.length > 0 ? (
          <Row className="g-3">
            {filteredComplaints.map((complaint) => {
              const priority = getPriority(complaint);
              return (
                <Col key={complaint._id} lg={4} md={6}>
                  <Card className="h-100 shadow-sm border-0 position-relative">
                    {priority === 'High' && (
                      <div className="position-absolute top-0 start-0 w-100 h-2" style={{ backgroundColor: '#dc3545', height: '4px', borderRadius: '0.375rem 0.375rem 0 0' }}></div>
                    )}
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                            {complaint.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h6 className="mb-0">{complaint.name}</h6>
                            <small className="text-muted">ID: {complaint._id.substring(0, 8)}</small>
                          </div>
                        </div>
                        <Badge bg={getPriorityVariant(priority)} className="small">
                          {priority} Priority
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <div className="row g-2 small">
                          <div className="col-6">
                            <i className="bi bi-geo-alt me-1 text-muted"></i>
                            <span className="text-muted">{complaint.city}, {complaint.state}</span>
                          </div>
                          <div className="col-6">
                            <i className="bi bi-mailbox2 me-1 text-muted"></i>
                            <span className="text-muted">{complaint.pincode}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-muted small mb-2">
                          {complaint.comment.length > 100 
                            ? `${complaint.comment.substring(0, 100)}...` 
                            : complaint.comment
                          }
                        </p>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <Badge bg={getStatusVariant(complaint.status)}>
                          <i className={`bi ${complaint.status === 'completed' ? 'bi-check-circle' : complaint.status === 'in-progress' ? 'bi-clock' : 'bi-exclamation-circle'} me-1`}></i>
                          {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                        </Badge>
                        <div className="btn-group" role="group">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => openDetailsModal(complaint)}
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          {complaint.status !== 'completed' && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => openAssignModal(complaint)}
                              title="Assign to Agent"
                            >
                              <i className="bi bi-person-plus"></i>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <div className="text-center p-5">
            <i className="bi bi-clipboard-x text-muted" style={{ fontSize: '3rem' }}></i>
            <h5 className="mt-3 text-muted">No complaints found</h5>
            <p className="text-muted">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'No complaints have been submitted yet'
              }
            </p>
          </div>
        )}

        {/* Available Agents Section */}
        {agentList.length > 0 && (
          <Row className="mt-5">
            <Col>
              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">
                    <i className="bi bi-people me-2"></i>Available Agents ({agentList.length})
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    {agentList.map((agent) => (
                      <Col key={agent._id} md={4} lg={3}>
                        <div className="d-flex align-items-center p-2 border rounded">
                          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                            {agent.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-bold small">{agent.name}</div>
                            <div className="text-muted small">{agent.email}</div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Assign Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-plus me-2"></i>Assign Complaint
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <div className="mb-4">
              <h6>Complaint Details:</h6>
              <div className="bg-light p-3 rounded">
                <strong>{selectedComplaint.name}</strong><br />
                <small className="text-muted">{selectedComplaint.city}, {selectedComplaint.state}</small><br />
                <p className="mt-2 mb-0">{selectedComplaint.comment}</p>
              </div>
            </div>
          )}
          <h6>Select Agent:</h6>
          <Row className="g-2">
            {agentList.map((agent) => (
              <Col key={agent._id} md={6}>
                <Card 
                  className="cursor-pointer border-2 h-100"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleAssignComplaint(agent._id, selectedComplaint._id, selectedComplaint.status, agent.name)}
                >
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        {agent.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h6 className="mb-1">{agent.name}</h6>
                        <small className="text-muted">{agent.email}</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-eye me-2"></i>Complaint Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <div>
              <Row className="g-3">
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label text-muted small">NAME</label>
                    <div className="fw-bold">{selectedComplaint.name}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label text-muted small">STATUS</label>
                    <div>
                      <Badge bg={getStatusVariant(selectedComplaint.status)} className="fs-6">
                        {selectedComplaint.status.charAt(0).toUpperCase() + selectedComplaint.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label text-muted small">CITY</label>
                    <div>{selectedComplaint.city}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label text-muted small">STATE</label>
                    <div>{selectedComplaint.state}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label text-muted small">PINCODE</label>
                    <div>{selectedComplaint.pincode}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label text-muted small">PRIORITY</label>
                    <div>
                      <Badge bg={getPriorityVariant(getPriority(selectedComplaint))}>
                        {getPriority(selectedComplaint)} Priority
                      </Badge>
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label text-muted small">ADDRESS</label>
                    <div>{selectedComplaint.address}</div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label text-muted small">COMPLAINT</label>
                    <div className="bg-light p-3 rounded">{selectedComplaint.comment}</div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {selectedComplaint && selectedComplaint.status !== 'completed' && (
            <Button variant="primary" onClick={() => {
              setShowDetailsModal(false);
              openAssignModal(selectedComplaint);
            }}>
              <i className="bi bi-person-plus me-1"></i>Assign to Agent
            </Button>
          )}
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

export default AccordionAdmin;