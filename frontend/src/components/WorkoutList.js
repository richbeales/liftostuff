import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getWorkouts } from '../api';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setError('Failed to load workouts. Please try again later.');
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) return <Container><p>Loading workouts...</p></Container>;
  if (error) return <Container><p className="text-danger">{error}</p></Container>;

  return (
    <Container>
      <h1 className="mb-4">Workout Routines</h1>
      {workouts.length === 0 ? (
        <p>No workout routines found. Create your first one!</p>
      ) : (
        <Row>
          {workouts.map(workout => (
            <Col md={4} className="mb-4" key={workout.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{workout.title}</Card.Title>
                  <Card.Text>
                    {workout.description || 'No description provided'}
                  </Card.Text>
                  <Link to={`/workout/${workout.id}`}>
                    <Button variant="primary">View Details</Button>
                  </Link>
                </Card.Body>
                <Card.Footer className="text-muted">
                  Created: {new Date(workout.created_at).toLocaleDateString()}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <div className="mt-4 text-center">
        <Link to="/create">
          <Button variant="success" size="lg">Create New Workout</Button>
        </Link>
      </div>
    </Container>
  );
};

export default WorkoutList;
