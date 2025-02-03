import "./Header.css"
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import goldIcon from '../../assets/gold_1_256x256.png';

function Header() {
    const { isLoggedIn, user } = useContext(AuthContext);

    return (
        <header className="header">
            <Link to="/" className="logo" style={{
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
            )}
        </header>
    );
}

export default Header;
