import axios from 'axios'
import React, { useState } from 'react'

const Complaint = () => {
   const user = JSON.parse(localStorage.getItem('user'))
   const [userComplaint, setUserComplaint] = useState({
      userId: user._id,
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      status: 'pending',
      comment: ''
   })

   const handleChange = (e) => {
      const { name, value } = e.target
      setUserComplaint({ ...userComplaint, [name]: value })
   }

   const handleClear = () => {
      setUserComplaint({
         userId: user._id,
         name: '',
         address: '',
         city: '',
         state: '',
         pincode: '',
         status: 'pending',
         comment: ''
      })
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      const user = JSON.parse(localStorage.getItem('user'))
      const { _id } = user
      axios.post(`http://localhost:8000/Complaint/${_id}`, userComplaint)
         .then(res => {
            JSON.stringify(res.data.userComplaint)
            alert("Your complaint has been submitted successfully!")
            handleClear()
         })
         .catch(err => {
            console.log(err)
            alert("Something went wrong. Please try again.")
         })
   }

   return (
      <>
         <div className="container py-4">
            <div className="row justify-content-center">
               <div className="col-12 col-lg-10">
                  <div className="card-modern">
                     <div className="p-4">
                        <div className="text-center mb-4">
                           <h2 className="fw-bold mb-3" style={{color: 'var(--text-primary)'}}>
                              Register Your Complaint
                           </h2>
                           <p style={{color: 'var(--text-muted)'}}>
                              Please provide detailed information about your complaint
                           </p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="row">
                           <div className="col-md-6 mb-3">
                              <label className="form-label-modern" htmlFor="name">Full Name</label>
                              <input 
                                 name="name" 
                                 onChange={handleChange} 
                                 value={userComplaint.name} 
                                 type="text" 
                                 className="form-control-modern w-100" 
                                 id="name"
                                 placeholder="Enter your full name"
                                 required 
                              />
                           </div>
                           <div className="col-md-6 mb-3">
                              <label className="form-label-modern" htmlFor="address">Address</label>
                              <input 
                                 name="address" 
                                 onChange={handleChange} 
                                 value={userComplaint.address} 
                                 type="text" 
                                 className="form-control-modern w-100" 
                                 id="address"
                                 placeholder="Enter your address"
                                 required 
                              />
                           </div>

                           <div className="col-md-6 mb-3">
                              <label className="form-label-modern" htmlFor="city">City</label>
                              <input 
                                 name="city" 
                                 onChange={handleChange} 
                                 value={userComplaint.city} 
                                 type="text" 
                                 className="form-control-modern w-100" 
                                 id="city"
                                 placeholder="Enter your city"
                                 required 
                              />
                           </div>
                           <div className="col-md-6 mb-3">
                              <label className="form-label-modern" htmlFor="state">State</label>
                              <input 
                                 name="state" 
                                 onChange={handleChange} 
                                 value={userComplaint.state} 
                                 type="text" 
                                 className="form-control-modern w-100" 
                                 id="state"
                                 placeholder="Enter your state"
                                 required 
                              />
                           </div>

                           <div className="col-md-6 mb-3">
                              <label className="form-label-modern" htmlFor="pincode">Pincode</label>
                              <input 
                                 name="pincode" 
                                 onChange={handleChange} 
                                 value={userComplaint.pincode} 
                                 type="text" 
                                 className="form-control-modern w-100" 
                                 id="pincode"
                                 placeholder="Enter pincode"
                                 required 
                              />
                           </div>

                           <div className="col-md-6 mb-3">
                              <label className="form-label-modern" htmlFor="status">Status</label>
                              <input 
                                 name="status" 
                                 onChange={handleChange} 
                                 value={userComplaint.status} 
                                 type="text" 
                                 className="form-control-modern w-100" 
                                 id="status"
                                 placeholder="Default: pending"
                                 readOnly
                                 style={{background: 'var(--bg-tertiary)', cursor: 'not-allowed'}}
                              />
                           </div>

                           <div className="col-12 mb-4">
                              <label className="form-label-modern" htmlFor="comment">Complaint Description</label>
                              <textarea 
                                 name="comment" 
                                 onChange={handleChange} 
                                 value={userComplaint.comment} 
                                 className="form-control-modern w-100"
                                 id="comment"
                                 rows="4"
                                 placeholder="Please describe your complaint in detail..."
                                 required
                                 style={{resize: 'vertical', minHeight: '120px'}}
                              />
                           </div>
                           
                           <div className="col-12 text-center">
                              <div className="d-flex justify-content-center gap-3">
                                 <button 
                                    type="button" 
                                    onClick={handleClear}
                                    className="btn-outline-custom"
                                    style={{minWidth: '120px'}}
                                 >
                                    Clear Form
                                 </button>
                                 <button 
                                    type="submit" 
                                    className="btn-primary-custom"
                                    style={{minWidth: '120px'}}
                                 >
                                    Submit Complaint
                                 </button>
                              </div>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default Complaint
