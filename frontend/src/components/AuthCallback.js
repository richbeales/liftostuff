import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const { handleAuthCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processAuth = () => {
      try {
        const success = handleAuthCallback(location.search);
        if (success) {
          navigate('/');
        } else {
          setError('Authentication failed. Missing tokens.');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');
      }
    };

    processAuth();
  }, [handleAuthCallback, location.search, navigate]);

  if (error) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 text-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="mt-3">Completing authentication...</p>
    </Container>
  );
};

export default AuthCallback;
