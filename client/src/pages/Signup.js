import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Signup() {

    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('Name, email and password are required')
        }

        // Name validation
        if (name.length < 3) {
            return handleError('Name must be at least 3 characters long');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return handleError('Please enter a valid email address');
        }

        // Password validation (min 6 chars, at least 1 letter and 1 number, special chars allowed)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            return handleError('Password must be at least 6 characters long and contain both letters and numbers');
        }

        try {
            const url = `http://localhost:8080/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    console.log('Navigating to /login...');
                    navigate('/login')
                }, 500)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }

    const fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

    return (
        <div className='container' style={{ fontFamily }}>
            <h1 style={{
                fontSize: '50px',
                fontWeight: 300,
                color: 'rgb(33, 37, 41)',
                textAlign: 'center',
                lineHeight: '1.2',
                letterSpacing: 'normal',
                textTransform: 'none',
                marginBottom: '1rem'
            }}>Signup</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <label htmlFor='name' style={{
                        fontSize: '1.5rem',
                        fontWeight: 300,
                        color: 'rgb(33, 37, 41)',
                        textAlign: 'left',
                        lineHeight: 1.2,
                        marginBottom: '0.5rem'
                    }}>Name</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='name'
                        autoFocus
                        placeholder='Enter your name...'
                        value={signupInfo.name}
                        style={{
                            fontSize: '1rem',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            border: '1px solid #6c757d',
                            fontFamily: fontFamily
                        }}
                    />
                </div>
                <div>
                    <label htmlFor='email' style={{
                        fontSize: '1.5rem',
                        fontWeight: 300,
                        color: 'rgb(33, 37, 41)',
                        textAlign: 'left',
                        lineHeight: 1.2,
                        marginBottom: '0.5rem'
                    }}>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={signupInfo.email}
                        style={{
                            fontSize: '1rem',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            border: '1px solid #6c757d',
                            fontFamily: fontFamily
                        }}
                    />
                </div>
                <div>
                    <label htmlFor='password' style={{
                        fontSize: '1.5rem',
                        fontWeight: 300,
                        color: 'rgb(33, 37, 41)',
                        textAlign: 'left',
                        lineHeight: 1.2,
                        marginBottom: '0.5rem'
                    }}>Password</label>
                    <div className="password-container">
                        <input
                            onChange={handleChange}
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            placeholder='Enter your password...'
                            value={signupInfo.password}
                            style={{
                                fontSize: '1rem',
                                padding: '12px 24px',
                                borderRadius: '6px',
                                border: '1px solid #6c757d',
                                fontFamily: fontFamily,
                                paddingRight: '40px'
                            }}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="toggle-password"
                            style={{
                                fontFamily: fontFamily
                            }}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                    </div>
                </div>
                <button type='submit' style={{
                    backgroundColor: '#007bff',
                    border: 'none',
                    fontSize: '1rem',
                    color: 'white',
                    borderRadius: '6px',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    margin: '10px 0',
                    fontFamily: fontFamily,
                    width: '100%',
                    boxShadow: '0 3px 6px rgba(0,123,255,0.3)',
                    transform: 'translateY(0)',
                    transition: 'all 0.3s'
                }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#0056b3';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 5px 10px rgba(0,123,255,0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#007bff';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 3px 6px rgba(0,123,255,0.3)';
                    }}
                >Signup</button>
                <span style={{
                    fontSize: '1rem',
                    color: 'rgb(33, 37, 41)',
                    fontFamily: fontFamily
                }}>Already have an account ?
                    <Link to="/login" style={{
                        color: '#007bff',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Signup
