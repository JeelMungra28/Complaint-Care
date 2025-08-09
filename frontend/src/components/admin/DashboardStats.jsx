import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

const DashboardStats = () => {
   const [stats, setStats] = useState({
      totalUsers: 0,
      totalAgents: 0,
      totalComplaints: 0,
      solvedComplaints: 0,
      pendingComplaints: 0,
      inProgressComplaints: 0,
      loading: true
   });

   const [recentComplaints, setRecentComplaints] = useState([]);

   useEffect(() => {
      fetchDashboardData();
   }, []);

   const fetchDashboardData = async () => {
      try {
         setStats(prev => ({ ...prev, loading: true }));

         // Fetch all required data
         const [usersRes, agentsRes, complaintsRes] = await Promise.all([
            axios.get('http://localhost:8000/OrdinaryUsers'),
            axios.get('http://localhost:8000/AgentUsers'),
            axios.get('http://localhost:8000/status')
         ]);

         const users = usersRes.data || [];
         const agents = agentsRes.data || [];
         const complaints = complaintsRes.data || [];

         // Calculate stats
         const solvedCount = complaints.filter(c => c.status === 'completed').length;
         const pendingCount = complaints.filter(c => c.status === 'pending').length;
         const inProgressCount = complaints.filter(c => c.status === 'in-progress').length;

         setStats({
            totalUsers: users.length,
            totalAgents: agents.length,
            totalComplaints: complaints.length,
            solvedComplaints: solvedCount,
            pendingComplaints: pendingCount,
            inProgressComplaints: inProgressCount,
            loading: false
         });

         // Set recent complaints (last 5)
         setRecentComplaints(complaints.slice(-5).reverse());

      } catch (error) {
         console.error('Error fetching dashboard data:', error);
         setStats(prev => ({ ...prev, loading: false }));
      }
   };

   const StatCard = ({ title, value, icon, color, subtitle }) => (
      <Card className="h-100 shadow-sm border-0">
         <Card.Body>
            <div className="d-flex justify-content-between">
               <div>
                  <h6 className="card-title text-muted mb-2">{title}</h6>
                  <h2 className={`mb-0 fw-bold text-${color}`}>
                     {stats.loading ? <Spinner size="sm" /> : value}
                  </h2>
                  {subtitle && <small className="text-muted">{subtitle}</small>}
               </div>
               <div className={`text-${color} opacity-75`} style={{ fontSize: '2rem' }}>
                  {icon}
               </div>
            </div>
         </Card.Body>
      </Card>
   );

   const getStatusBadge = (status) => {
      const variants = {
         'completed': 'success',
         'pending': 'warning', 
         'in-progress': 'info'
      };
      return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
   };

   return (
      <Container fluid className="p-4">
         {/* Page Header */}
         <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
               <h2 className="mb-1">Admin Dashboard</h2>
               <p className="text-muted mb-0">Overview of system statistics and recent activities</p>
            </div>
            <div>
               <Button variant="outline-primary" size="sm" className="me-2" onClick={fetchDashboardData}>
                  <i className="bi bi-arrow-clockwise"></i> Refresh
               </Button>
               <Button variant="primary" size="sm">
                  <i className="bi bi-download"></i> Export Report
               </Button>
            </div>
         </div>

         {/* Statistics Cards */}
         <Row className="g-3 mb-4">
            <Col xl={3} md={6}>
               <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon="👥"
                  color="primary"
                  subtitle="Registered users"
               />
            </Col>
            <Col xl={3} md={6}>
               <StatCard
                  title="Total Agents"
                  value={stats.totalAgents}
                  icon="🛠️"
                  color="success"
                  subtitle="Active agents"
               />
            </Col>
            <Col xl={3} md={6}>
               <StatCard
                  title="Total Complaints"
                  value={stats.totalComplaints}
                  icon="📋"
                  color="info"
                  subtitle="All complaints"
               />
            </Col>
            <Col xl={3} md={6}>
               <StatCard
                  title="Solved Complaints"
                  value={stats.solvedComplaints}
                  icon="✅"
                  color="success"
                  subtitle={`${stats.totalComplaints > 0 ? Math.round((stats.solvedComplaints / stats.totalComplaints) * 100) : 0}% completion rate`}
               />
            </Col>
         </Row>

         {/* Status Breakdown */}
         <Row className="g-3 mb-4">
            <Col xl={4} md={6}>
               <Card className="h-100 shadow-sm border-0">
                  <Card.Header className="bg-light">
                     <h6 className="mb-0">Complaint Status Breakdown</h6>
                  </Card.Header>
                  <Card.Body>
                     <div className="d-flex justify-content-between mb-2">
                        <span>Pending</span>
                        <Badge bg="warning">{stats.pendingComplaints}</Badge>
                     </div>
                     <div className="d-flex justify-content-between mb-2">
                        <span>In Progress</span>
                        <Badge bg="info">{stats.inProgressComplaints}</Badge>
                     </div>
                     <div className="d-flex justify-content-between">
                        <span>Completed</span>
                        <Badge bg="success">{stats.solvedComplaints}</Badge>
                     </div>
                  </Card.Body>
               </Card>
            </Col>
            <Col xl={8} md={6}>
               <Card className="h-100 shadow-sm border-0">
                  <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                     <h6 className="mb-0">Recent Complaints</h6>
                     <Button variant="outline-primary" size="sm">View All</Button>
                  </Card.Header>
                  <Card.Body>
                     {recentComplaints.length > 0 ? (
                        <div className="list-group list-group-flush">
                           {recentComplaints.map((complaint, index) => (
                              <div key={index} className="list-group-item px-0 py-2 border-0">
                                 <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                       <h6 className="mb-1">{complaint.name}</h6>
                                       <p className="mb-1 text-muted small">{complaint.comment}</p>
                                       <small className="text-muted">{complaint.city}, {complaint.state}</small>
                                    </div>
                                    <div className="text-end ms-2">
                                       {getStatusBadge(complaint.status)}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="text-center py-3 text-muted">
                           <i className="bi bi-inbox" style={{ fontSize: '2rem' }}></i>
                           <p className="mt-2 mb-0">No recent complaints</p>
                        </div>
                     )}
                  </Card.Body>
               </Card>
            </Col>
         </Row>

         {/* Quick Actions */}
         <Row className="g-3">
            <Col>
               <Card className="shadow-sm border-0">
                  <Card.Header className="bg-light">
                     <h6 className="mb-0">Quick Actions</h6>
                  </Card.Header>
                  <Card.Body>
                     <Row className="g-2">
                        <Col auto>
                           <Button variant="outline-primary" size="sm">
                              <i className="bi bi-person-plus"></i> Add New Agent
                           </Button>
                        </Col>
                        <Col auto>
                           <Button variant="outline-info" size="sm">
                              <i className="bi bi-clipboard-plus"></i> View Pending Complaints
                           </Button>
                        </Col>
                        <Col auto>
                           <Button variant="outline-success" size="sm">
                              <i className="bi bi-check-circle"></i> Review Completed
                           </Button>
                        </Col>
                        <Col auto>
                           <Button variant="outline-secondary" size="sm">
                              <i className="bi bi-graph-up"></i> Generate Reports
                           </Button>
                        </Col>
                     </Row>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Container>
   );
};

export default DashboardStats;