import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer mt-5 py-3 bg-light">
      <Container className="text-center">
        <p className="text-muted">
          Workout Routines &copy; {new Date().getFullYear()} | 
          Share and discover the best workout routines
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
