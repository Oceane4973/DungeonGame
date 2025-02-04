import "./Header.css";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import goldIcon from '../../assets/gold_1_256x256.png';

function Header({ gaming = false }) {  // Correction ici pour récupérer correctement la prop gaming
    const { isLoggedIn, user } = useContext(AuthContext);

    return (
        <header className="header">
            <Link className="logo" style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                position: 'relative'
            }}>
                <div style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <img
                        src={require('../../assets/large_panel_1024x1024.png')}
                        alt="Logo background"
                        style={{
                            width: '240px',
                            height: '56px',
                            objectFit: 'contain',
                            filter: 'brightness(1.2)'
                        }}
                    />
                    <span style={{
                        position: 'absolute',
                        width: '100%',
                        textAlign: 'center',
                        color: '#000000',
                        fontSize: '22px',
                        fontFamily: "'VT323', monospace",
                        letterSpacing: '1px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        paddingTop: '1px'
                    }}>DungeonGame</span>
                </div>
            </Link>

            {isLoggedIn && (
                <>
                    {!gaming ? (
                        <>
                            <nav className="header-nav">
                                <Link to="/createHero">Création du héro</Link>
                                <Link to="/hero">Sélection du héro</Link>
                            </nav>
                            <div className="header-right">
                                <div className="gold-display">
                                    <img
                                        src={goldIcon}
                                        alt="Gold"
                                        className="gold-icon-small"
                                        style={{ width: '32px', height: '32px' }}
                                    />
                                    <span className="gold-amount-header">{user ? user.gold || 0 : 0}</span>
                                </div>
                                <div className="profile-icon">
                                    <Link to="/profile" className="profile-icon">
                                        <FaUserCircle size={24} color="white" className="hover:opacity-80 transition-opacity" />
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <nav className="header-nav">
                            <Link to="/hero">Sortir du donjon</Link>
                        </nav>
                    )}
                </>
            )}
        </header>
    );
}

export default Header;
