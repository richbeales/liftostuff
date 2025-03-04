import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getWorkout, deleteWorkout } from '../api';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const data = await getWorkout(id);
        setWorkout(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching workout:', error);
        setError('Failed to load workout details. Please try again later.');
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await deleteWorkout(id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting workout:', error);
        setError('Failed to delete workout. Please try again later.');
      }
    }
  };

  if (loading) return <Container><p>Loading workout details...</p></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;
  if (!workout) return <Container><Alert variant="warning">Workout not found</Alert></Container>;

  return (
    <Container>
      <Card className="workout-detail">
        <Card.Header as="h1">{workout.title}</Card.Header>
        <Card.Body>
          {workout.description && (
            <Card.Subtitle className="mb-3 text-muted">
              {workout.description}
            </Card.Subtitle>
          )}
          <div className="workout-content">
            <ReactMarkdown>{workout.content}</ReactMarkdown>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="d-flex justify-content-between">
            <small className="text-muted">
              Created: {new Date(workout.created_at).toLocaleDateString()}
              {workout.updated_at !== workout.created_at && 
                ` (Updated: ${new Date(workout.updated_at).toLocaleDateString()})`}
            </small>
            <div>
              <Link to={`/edit/${workout.id}`} className="me-2">
                <Button variant="warning" size="sm">Edit</Button>
              </Link>
              <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </Card.Footer>
      </Card>
      <div className="mt-3">
        <Link to="/">
          <Button variant="secondary">Back to List</Button>
        </Link>
      </div>
    </Container>
  );
};

export default WorkoutDetail;
