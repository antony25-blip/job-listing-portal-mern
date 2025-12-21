import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login() {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required')
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return handleError('Please enter a valid email address');
        }

        try {
            const url = `http://localhost:8080/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    console.log('Navigating to /home...');
                    navigate('/home')
                }, 500)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                // User requested "No records" for authentication failures
                handleError(
                    message === "Auth failed email or password is wrong" ||
                        message === "Auth failed" ||
                        message === "User not found" ||
                        message === "Incorrect password"
                        ? "No records"
                        : message
                );
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
            }}>Login</h1>
            <form onSubmit={handleLogin}>
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
                        value={loginInfo.email}
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
                            value={loginInfo.password}
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
                >Login</button>
                <span style={{
                    fontSize: '1rem',
                    color: 'rgb(33, 37, 41)',
                    fontFamily: fontFamily
                }}>Does't have an account ?
                    <Link to="/signup" style={{
                        color: '#007bff',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Login
