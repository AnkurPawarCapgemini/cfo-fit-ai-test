import React, { useEffect, useState } from 'react';
import useFormStore from '../../../store';

export default function CrudForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: ''
    });

    const addForm = useFormStore((state) => state.addForm); // Function to add form data to store
    const formList = useFormStore((state) => state.formList);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile) {
            alert('Please fill in all fields.');  
            return;  
        }
        addForm(formData); 
    };
   useEffect(()=>{ 
   },[formList])

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <div className="bg-white p-4">
                        <h3 className="mb-2">Sign up</h3>
                        <h5 className="mb-3">
                            Create your new account. It is free and only takes a minute.
                        </h5>
                        <form className="needs-validation" action="" onSubmit={handleSubmit} noValidate>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-floating mb-3 with-leading-icon">
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            className="form-control form-control-lg"
                                            name="firstName"
                                            placeholder="First name"
                                            onChange={handleChange}
                                            autoComplete="off"
                                            required
                                        />
                                        <label htmlFor="userFirstName">
                                            First name
                                            <span className="form-required">*</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-floating mb-3 with-leading-icon">
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last name"
                                            autoComplete="off"
                                            required
                                        />
                                        <label htmlFor="userLastName">
                                            Last name
                                            <span className="form-required">*</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-floating mb-3 with-leading-icon">
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email address"
                                    autoComplete="off"
                                    required
                                />
                                <label htmlFor="userEmail">
                                    Email address
                                    <span className="form-required">*</span>
                                </label>
                            </div>
                            <div className="form-floating mb-3 with-leading-icon">
                                <input
                                    type="text"
                                    value={formData.mobile}
                                    className="form-control form-control-lg"
                                    name="mobile"
                                    placeholder="Mobile"
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required
                                />
                                <label htmlFor="userMobile">
                                    Mobile
                                    <span className="form-required">*</span>
                                </label>
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary btn-lg">
                                    Sign up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
