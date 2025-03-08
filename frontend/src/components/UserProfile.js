import React from 'react';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <Container className="mt-5">
        <p>Please log in to view your profile.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4" className="text-center">User Profile</Card.Header>
            <Card.Body className="text-center">
              {currentUser.profile_picture && (
                <Image 
                  src={currentUser.profile_picture} 
                  roundedCircle 
                  width="100" 
                  height="100" 
                  className="mb-3"
                />
              )}
              <h3>{currentUser.username}</h3>
              <p className="text-muted">{currentUser.email}</p>
              
              {currentUser.oauth_provider && (
                <p>
                  <small>
                    Connected with: {currentUser.oauth_provider.charAt(0).toUpperCase() + currentUser.oauth_provider.slice(1)}
                  </small>
                </p>
              )}
              
              <div className="mt-4">
                <Button as={Link} to="/my-workouts" variant="primary" className="me-2">
                  My Workouts
                </Button>
                <Button as={Link} to="/create" variant="success">
                  Create New Workout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
