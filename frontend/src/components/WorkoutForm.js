import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getWorkout, createWorkout, updateWorkout } from '../api';

const WorkoutForm = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: ''
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (isEditing && id) {
        try {
          const data = await getWorkout(id);
          setFormData({
            title: data.title,
            description: data.description || '',
            content: data.content
          });
          setLoading(false);
        } catch (error) {
          console.error('Error fetching workout:', error);
          setError('Failed to load workout for editing. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchWorkout();
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (isEditing) {
        await updateWorkout(id, formData);
        navigate(`/workout/${id}`);
      } else {
        const newWorkout = await createWorkout(formData);
        navigate(`/workout/${newWorkout.id}`);
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      setError('Failed to save workout. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <Container><p>Loading workout data...</p></Container>;

  return (
    <Container>
      <h1>{isEditing ? 'Edit Workout Routine' : 'Create New Workout Routine'}</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter workout title"
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Description (optional)</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of this workout routine"
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Workout Content</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Describe your workout routine in detail. You can use markdown formatting."
            rows={10}
            required
          />
          <Form.Text className="text-muted">
            You can use Markdown to format your workout details.
          </Form.Text>
        </Form.Group>
        
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Workout'}
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate(isEditing ? `/workout/${id}` : '/')}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default WorkoutForm;
