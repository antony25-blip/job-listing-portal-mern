import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Landing = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/login');
        }
    }, [navigate]);

    const fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            minHeight: '100vh',
            backgroundColor: 'white',
            fontFamily: fontFamily
        }}>
            {/* Left Column - Lottie Animation */}
            <div style={{
                flex: '0 0 50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                backgroundColor: '#f8f9fa'
            }}>
                <DotLottieReact
                    src="/Login.lottie"
                    loop
                    autoplay
                    style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
                />
            </div>

            {/* Right Column - Content */}
            <div style={{
                flex: '0 0 50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                textAlign: 'center'
            }}>
                <h1 style={{
                    fontSize: '50px',
                    fontWeight: 300,
                    color: 'rgb(33, 37, 41)',
                    lineHeight: '1.2',
                    letterSpacing: 'normal',
                    textTransform: 'none',
                    marginBottom: '0.5rem',
                    fontFamily: fontFamily
                }}>
                    MERN Authentication
                </h1>
                <p style={{
                    fontSize: '1.5rem',
                    fontWeight: 300,
                    color: 'rgb(33, 37, 41)',
                    lineHeight: 1.2,
                    marginBottom: '2rem',
                    fontFamily: fontFamily,
                    maxWidth: '600px'
                }}>
                    A complete authentication system built with the MERN stack (MongoDB, Express, React, Node.js)
                </p>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '15px',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Link to="/login" style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        transition: 'all 0.3s',
                        width: '140px',
                        fontFamily: fontFamily,
                        textAlign: 'center',
                        boxShadow: '0 3px 6px rgba(0,123,255,0.3)',
                        transform: 'translateY(0)',
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
                        }}>
                        Login
                    </Link>
                    <Link to="/signup" style={{
                        backgroundColor: 'transparent',
                        color: '#6c757d',
                        textDecoration: 'none',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        border: '1px solid #6c757d',
                        transition: 'all 0.3s',
                        width: '140px',
                        fontFamily: fontFamily,
                        textAlign: 'center',
                        boxShadow: '0 3px 6px rgba(108,117,125,0.3)',
                        transform: 'translateY(0)',
                    }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#6c757d';
                            e.target.style.color = 'white';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 5px 10px rgba(108,117,125,0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#6c757d';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 3px 6px rgba(108,117,125,0.3)';
                        }}>
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default Landing;