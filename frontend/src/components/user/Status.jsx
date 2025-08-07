import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { Button } from 'react-bootstrap';
import ChatWindow from '../common/ChatWindow';
import Collapse from 'react-bootstrap/Collapse';

const Status = () => {
  const [toggle, setToggle] = useState({})
  const [statusCompliants, setStatusCompliants] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { _id } = user;

    axios.get(`http://localhost:8000/status/${_id}`)
      .then((res) => {
        setStatusCompliants(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  const handleToggle = (complaintId) => {
    setToggle((prevState) => ({
       ...prevState,
       [complaintId]: !prevState[complaintId],
    }));
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'var(--warning-color)';
      case 'in-progress': return 'var(--info-color)';
      case 'resolved': return 'var(--success-color)';
      case 'closed': return 'var(--success-color)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusBadgeStyle = (status) => ({
    background: getStatusColor(status),
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  });

  return (
    <>
      <div className="container py-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-3" style={{color: 'var(--text-primary)'}}>
            Complaint Status
          </h2>
          <p style={{color: 'var(--text-muted)'}}>
            Track the progress of your submitted complaints
          </p>
        </div>

        {statusCompliants.length > 0 ? (
          <div className="row">
            {statusCompliants.map((complaint, index) => {
              const open = toggle[complaint._id] || false;
              return (
                <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div className="card-modern h-100">
                    <div className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="fw-bold mb-0" style={{color: 'var(--text-primary)'}}>
                          {complaint.name}
                        </h5>
                        <span style={getStatusBadgeStyle(complaint.status)}>
                          {complaint.status || 'pending'}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="row g-2">
                          <div className="col-12">
                            <small className="form-label-modern">Address</small>
                            <p className="mb-1" style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                              {complaint.address}
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="form-label-modern">City</small>
                            <p className="mb-1" style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                              {complaint.city}
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="form-label-modern">State</small>
                            <p className="mb-1" style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                              {complaint.state}
                            </p>
                          </div>
                          <div className="col-12">
                            <small className="form-label-modern">Pincode</small>
                            <p className="mb-1" style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                              {complaint.pincode}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <small className="form-label-modern">Complaint Description</small>
                        <p style={{
                          color: 'var(--text-secondary)', 
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          maxHeight: '60px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {complaint.comment}
                        </p>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <Button 
                          onClick={() => handleToggle(complaint._id)}
                          aria-controls={`collapse-${complaint._id}`}
                          aria-expanded={open}
                          className="btn-outline-custom"
                          style={{fontSize: '0.875rem', padding: '0.5rem 1rem'}}
                        >
                          {open ? 'Hide Messages' : 'View Messages'}
                        </Button>
                      </div>
                      
                      <div style={{ minHeight: '0' }}>
                        <Collapse in={open}>
                          <div id={`collapse-${complaint._id}`} className="mt-3">
                            <div style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-lg)',
                              overflow: 'hidden'
                            }}>
                              <ChatWindow 
                                key={complaint._id} 
                                complaintId={complaint._id} 
                                name={complaint.name} 
                              />
                            </div>
                          </div>
                        </Collapse>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="card-modern">
              <div className="p-5">
                <div style={{color: 'var(--text-muted)', fontSize: '3rem'}} className="mb-3">
                  📋
                </div>
                <h4 style={{color: 'var(--text-primary)'}} className="mb-3">
                  No Complaints Found
                </h4>
                <p style={{color: 'var(--text-muted)'}}>
                  You haven't submitted any complaints yet. Click on "Complaint Register" to submit your first complaint.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Status;









// import React, { useEffect, useState } from 'react'
// const Status = () => {
//   const [city, setCity] = useState('');
//   const [state, setState] = useState('');
//   const [complaint, setComplaint] = useState("")

//   // useEffect(()=>{
//   //   const id = localStorage.getItem("user")
//   //   console.log(id)

//   //     // axios.get(`http://localhost:8000/status${id}`)
//   //     // .then((res)=>{
//   //     //   const { city, state, complaint } = res.data;
//   //     //   console.log(city,state,complaint)
//   //     //   setState(state);
//   //     //   setCity(city);
//   //     //   setComplaint(complaint)
//   //     // })
//   //     // .catch((err)=>{
//   //     //   console.log(err)
//   //     // })
//   // },[])
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     const { _id } = user;
//     console.log(_id);
//     axios.get(`http://localhost:8000/status/${_id}`)
//       .then((res) => {
//         axios.get('http://localhost:8000/Complaint')
//           .then((res) => {
//             const { city, state, complaint } = res.data;
//             console.log(city, state, complaint)
//             setState(state);
//             setCity(city);
//             setComplaint(complaint)
//           })
//           .catch((err) => {
//             console.log(err)
//           })
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//   }, []);

//   return (
//     <>
//       <div className="row">
//         <div className="status col-sm-6 mb-sm-0">
//           <div className="card status-card">
//             <div className="card-body">
//               <h5 className="card-title">City:{city}</h5>
//               <p className="card-text">State:{state} </p>
//               <p className="card-text">Complaint:{complaint} </p>

//             </div>
//           </div>
//         </div>
//         <div className="status col-sm-6 mb-sm-0">
//           <div className="card status-card">
//             <div className="card-body">
//               <h5 className="card-title">h</h5>
//               <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. <br />In, voluptatibus!</p>

//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Status
