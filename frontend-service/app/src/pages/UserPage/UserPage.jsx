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
import { heroeService } from '../../services/heroeService';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [heroes, setHeroes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [hoveredHero, setHoveredHero] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await UserService.getUserDetails();
        let myuser = userData;
        myuser.gold = 3;
        setUser(myuser);
        
        const heroesData = await heroeService.getHeroes(userData.id);
        console.log("Heroes data:", heroesData);
        setHeroes(heroesData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
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

  const handleHeroClick = (hero) => {
    setSelectedHero(hero);
    setShowPopup(true);
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
          <div className="heroes-section">
            <div className="heroes-content">
              <h2 className="section-title">Mes Héros</h2>
              <div className="sprites-grid">
                {heroes && heroes.map(hero => (
                  <div 
                    key={hero.id} 
                    className="hero-sprite-container" 
                    onMouseEnter={() => setHoveredHero(hero)}
                    onMouseLeave={() => setHoveredHero(null)}
                    style={{ position: 'relative', width: '48px', height: '48px', cursor: 'pointer' }}
                  >
                    {hero.bodySprite && (
                      <img 
                        src={hero.bodySprite.url}
                        alt="Body Sprite"
                        style={{
                          position: 'absolute',
                          width: '48px',
                          height: '48px',
                          imageRendering: 'pixelated',
                          zIndex: 1
                        }}
                      />
                    )}
                    {hero.headSprite && (
                      <img 
                        src={hero.headSprite.url} 
                        alt="Head Sprite"
                        style={{
                          position: 'absolute',
                          width: '48px',
                          height: '48px',
                          imageRendering: 'pixelated',
                          zIndex: 2
                        }}
                      />
                    )}
                    {hoveredHero === hero && (
                      <div className="hero-tooltip">
                        <div className="tooltip-content">
                          <div className="tooltip-stat">⭐ Niveau {hero.level}</div>
                          <div className="tooltip-stat">❤️ PV: {hero.healthPoints}</div>
                          <div className="tooltip-stat">⚔️ ATK: {hero.attack}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {showPopup && selectedHero && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
            <div className="popup-header">
              <div className="popup-sprites">
                {selectedHero.bodySprite && (
                  <img 
                    src={selectedHero.bodySprite.url}
                    alt="Body Sprite"
                    style={{
                      position: 'absolute',
                      width: '96px',
                      height: '96px',
                      imageRendering: 'pixelated',
                      zIndex: 1
                    }}
                  />
                )}
                {selectedHero.headSprite && (
                  <img 
                    src={selectedHero.headSprite.url}
                    alt="Head Sprite"
                    style={{
                      position: 'absolute',
                      width: '96px',
                      height: '96px',
                      imageRendering: 'pixelated',
                      zIndex: 2
                    }}
                  />
                )}
              </div>
            </div>
            <div className="popup-body">
              <h3>Statistiques du héros</h3>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-label">Niveau</span>
                  <span className="stat-value">⭐ {selectedHero.level}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Points de vie</span>
                  <span className="stat-value">❤️ {selectedHero.healthPoints}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Attaque</span>
                  <span className="stat-value">⚔️ {selectedHero.attack}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPage;
