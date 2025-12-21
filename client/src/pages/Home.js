import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import Lottie from 'lottie-react';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    const fetchProducts = async () => {
        try {
            const url = "http://localhost:8080/products";
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await fetch(url, headers);
            const result = await response.json();
            console.log(result);
            setProducts(result);
        } catch (err) {
            handleError(err);
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div style={{
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
        }}>
            <h1 style={{
                fontSize: '32px',
                fontWeight: 300,
                color: 'rgb(33, 37, 41)',
                textAlign: 'center',
                marginBottom: '2rem'
            }}>
                Welcome {loggedInUser}
            </h1>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px'
            }}>
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '12px 24px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 3px 6px rgba(0,123,255,0.3)',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#0056b3';
                        e.target.style.boxShadow = '0 5px 10px rgba(0,123,255,0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#007bff';
                        e.target.style.boxShadow = '0 3px 6px rgba(0,123,255,0.3)';
                    }}
                >
                    Logout
                </button>
            </div>


            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px',
                marginTop: '20px'
            }}>
                {
                    products && products.length > 0 ? (
                        products.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    border: '1px solid #dee2e6',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    backgroundColor: '#fff',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-5px)';
                                    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                }}
                            >
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: 'rgb(33, 37, 41)',
                                    margin: '0 0 10px 0'
                                }}>
                                    {item.name}
                                </h3>
                                <p style={{
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#007bff',
                                    margin: '0'
                                }}>
                                    ${item.price}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gridColumn: '1 / -1',
                            height: '300px',
                            fontSize: '24px',
                            color: '#007bff'
                        }}>

                        </div>
                    )
                }
            </div>
            <ToastContainer />
        </div>
    )
}

export default Home
