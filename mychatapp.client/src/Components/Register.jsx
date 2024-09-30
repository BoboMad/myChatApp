import { useState, useContext } from 'react'
import '../assets/css/buttons.css'
import '../assets/css/login-register.css'
import { AuthContext } from '../Contexts/AuthContext'
import {Navigate } from 'react-router-dom'

const Register = () => {

    const [formData, SetFormData] = useState({
        username: '',
        email: '',
        password:'',
        confirmPassword:'',

    });

    const [message, SetMessage] = useState('');
    const { isAuthenticated } = useContext(AuthContext);

    if (isAuthenticated) {
        return <Navigate to="/chat" />
    }

    const handleChange = (e) => {
        SetFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('https://localhost:7292/auth/register',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if(response.ok){
                SetMessage('User registration successful!');
                <Navigate to='/chat'/>
            }
            else{
                SetMessage('User registration failed, please try agian.')
            }
        }
        catch(error)
        {
            SetMessage('Error during user registration.')
        }
    };

  return (
      <div className="form-wrapper">
          <div className="form-container">
            <h2 className="form-title">Register your account</h2>
            <form className="form" onSubmit={handleSubmit}>
                <div>
                      <div className="input-container">
                          <label htmlFor="username" className="label">Username <span className="required">*</span></label>
                        <input className='input' type="text" name="username" value={formData.username} onChange={handleChange} required />
                      </div>

                      <div className="input-container">
                          <label htmlFor="email" className="label">E-mail <span className="required">*</span></label>
                        <input className='input' type="email"  name="email" value={formData.email} onChange={handleChange} required />
                      </div>

                      <div className="input-container">
                          <label htmlFor="password" className="label">Password <span className="required">*</span></label>
                        <input className='input' type="password" name="password" value={formData.password} onChange={handleChange} required />
                      </div>

                      <div className="input-container">
                          <label htmlFor="confirmPassword" className="label">Confirm password <span className="required">*</span></label>
                        <input className='input' type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                      </div>

                      <div className="button-container">
                        <button className="custom-button" type='submit'>Register</button>
                      </div>

                        <div className="link-container">
                            <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">{"< Login"}</a>
                        </div>
                      
                    {message && <p>{message}</p>}
                </div>
            </form>
          </div>
    </div>
  )
}

export default Register