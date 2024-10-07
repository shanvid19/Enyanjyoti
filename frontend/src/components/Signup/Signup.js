// src/Signup.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase'; // Import Firebase auth

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [createUserWithEmailAndPassword, user, loading, firebaseError] = useCreateUserWithEmailAndPassword(auth);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        navigate('/dashboard', { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Firebase signup
    try {
      await createUserWithEmailAndPassword(email, password);
      setSuccessMessage('Signup successful! Redirecting to login...');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirect after 2 seconds
    } catch (firebaseError) {
      setError(firebaseError?.message || 'Error signing up.');
    }
  };

  return (
    <div className="container mt-5 justify-content-center" style={{ height: 'auto' }}>
      <div className="row justify-content-center" style={{ width: '100%' }}>
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              <form onSubmit={handleSignup}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button onClick={handlePasswordVisibility} style={{
                    backgroundColor: '#fff',
                    position: 'relative',
                    bottom: '30px',
                    left: '550px',
                    height: '1px'
                  }}>
                    <span style={{ color: "black", position: 'relative', bottom: '10px' }} className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button onClick={handleConfirmPasswordVisibility} style={{
                    backgroundColor: '#fff',
                    position: 'relative',
                    bottom: '30px',
                    left: '550px',
                    height: '1px'
                  }}>
                    <span style={{ color: "black", position: 'relative', bottom: '10px' }} className="material-symbols-outlined">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>
              </form>
              <p className="mt-3 text-center">
                Already have an account? <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
