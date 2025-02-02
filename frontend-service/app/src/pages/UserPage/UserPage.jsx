import React, { useState, useEffect } from 'react';
import UserService from '../../services/userService';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import goldIcon from '../../assets/gold_1_256x256.png';
import './UserPage.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await UserService.getUserDetails();
        setUser(userData);
      } catch (err) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      try {
        await UserService.deleteAccount();
        logout();
        navigate('/login');
      } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);
      }
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="loading-spinner">Loading...</div>;

  return (
    <>
      <Header />
      <div className="profile-card">
        <div className="left-section">
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="avatar-letter">{user.username.charAt(0).toUpperCase()}</span>
            </div>
            <h1 className="username">{user.username}</h1>
            <button onClick={handleLogout} className="logout-btn">
              Se déconnecter
            </button>
          </div>

          <div className="gold-section">
            <div className="gold-content">
              <div className="gold-label">
                <img src={goldIcon} alt="Gold" className="gold-icon" />
                <span className="gold-text">Gold Balance</span>
              </div>
              <span className="gold-amount">{user.gold}</span>
            </div>
          </div>

          <div className="account-section">
            <h2 className="account-title">Account Details</h2>
            <div className="account-details">
              <div className="detail-row">
                <span className="detail-label">Created on:</span>
                <span className="detail-value">
                  {new Date().toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Last updated:</span>
                <span className="detail-value">
                  {new Date().toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="separator"></div>

        <div className="right-section">
          <div className="heroes-section info-section">
            <h2 className="section-title">Mes Héros</h2>
            <div className="heroes-grid">
              {user.heroes && user.heroes.length > 0 ? (
                user.heroes.map(hero => (
                  <div key={hero.id} className="hero-card">
                    <img 
                      src={hero.sprite} 
                      alt={hero.name} 
                      className="hero-sprite"
                    />
                    <span className="hero-name">{hero.name}</span>
                    <div className="hero-stats">
                      <div>⚔️ Attaque: {hero.attack}</div>
                      <div>❤️ PV: {hero.healthPoints}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Vous n'avez pas encore de héros. Créez-en un !</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserPage;
