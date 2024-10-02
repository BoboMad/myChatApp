import { useState, useContext } from 'react'
import '../assets/css/login-register.css'
import '../assets/css/buttons.css'
import { AuthContext } from '../Contexts/AuthContext';
import {Navigate }  from 'react-router-dom'

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",

    });

    const [message, setMessage] = useState("");
    const { token, updateToken, isAuthenticated } = useContext(AuthContext);

    if (isAuthenticated) {
       return <Navigate to="/chat" />
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://localhost:7292/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                const data = await response.json();
                updateToken(data.token);
                localStorage.setItem('jwtToken', data.token)
                setMessage('Login successful!');
            }
            else {
                setMessage('Login failed, please check your credentials.')
            }
        }
        catch(error)
        {
            setMessage('Error during login, please try agian.');
        }
    }

  return (
      <div className="form-wrapper">
          <div className="form-container">
            <h2 className="form-title">Sign in to your account</h2>


            <form className='form' onSubmit={handleSubmit}>
              <div className="input-container">

                <div className='input-container'>
                  <label htmlFor="username" className="label">Username</label>
                  <input className='input' type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>

                  <div className='input-container'>
                          <label htmlFor="password" className="label">Password</label>
                    <input className='input' type="password" name="password" value={formData.password} onChange={handleChange} required />
                  </div>

                  <div className="button-container">
                    <button className='custom-button' type="submit">Login</button>
                  </div>

                  <div className="link-container">
                    <a href="/register">{"< Register"}</a>
                  </div>
              </div>
            </form>
              {message && <p>{message}</p>}
          </div>
      </div>
  )
}

export default Login