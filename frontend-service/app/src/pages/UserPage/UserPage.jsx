import React, { useState, useEffect } from 'react';
import UserService from '../../services/userService';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import goldIcon from '../../assets/gold_1_256x256.png';
import './UserPage.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext, useTheme } from '../../contexts/ThemeContext';
import { FaSun, FaMoon } from "react-icons/fa";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

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
            <div className="profile-banner" style={{ paddingTop: '20px', position: 'relative' }}>
              <img src={require('../../assets/large_panel_1024x1024.png')} alt="banner" />
              <h1 style={{
                position: 'absolute',
                width: '100%',
                textAlign: 'center',
                color: '#111111',
                fontSize: '22px',
                fontFamily: "'VT323', monospace",
                letterSpacing: '1px',
                top: '55%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                paddingTop: '1px',
                textTransform: 'uppercase',
                margin: 0,
                textShadow: '0 0 1px rgba(0,0,0,0.3)'
              }}>{user.username}</h1>
            </div>
          </div>

          <div className="gold-section">
            <div className="gold-content">
              <div className="gold-label">
                <img src={goldIcon} alt="Or" className="gold-icon" />
                <span className="gold-text">Solde d'or</span>
              </div>
              <span className="gold-amount">{user.gold}</span>
            </div>
          </div>

          <div className="account-section">
            <h2 className="account-title">Détails du compte</h2>
            <div className="account-details">
              <div className="detail-row">
                <span className="detail-label">Créé le :</span>
                <span className="detail-value">
                  {new Date().toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Dernière mise à jour :</span>
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

          <div className="preferences-section">
            <h2 className="preferences-title">Préférences</h2>
            <div className="preferences-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '16px', fontWeight: '500' }}>Thème :</span>
                <button 
                  onClick={toggleTheme}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {theme === 'dark' ? 
                    <FaSun size={24} color="#FFB800" /> : 
                    <FaMoon size={24} color="#4A4A4A" />
                  }
                </button>
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: 'auto',
            paddingTop: '20px'
          }}>
            <button 
              onClick={handleLogout} 
              className="logout-btn"
              style={{
                backgroundColor: '#F8F9FC',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#4A5568',
                fontWeight: '600',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              Se déconnecter
            </button>
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
