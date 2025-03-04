import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import WorkoutList from './components/WorkoutList';
import WorkoutDetail from './components/WorkoutDetail';
import WorkoutForm from './components/WorkoutForm';

const App = () => {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<WorkoutList />} />
            <Route path="/workout/:id" element={<WorkoutDetail />} />
            <Route path="/create" element={<WorkoutForm isEditing={false} />} />
            <Route path="/edit/:id" element={<WorkoutForm isEditing={true} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
