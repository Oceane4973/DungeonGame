import "./Header.css"
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import goldIcon from '../../assets/gold_1_256x256.png';

function Header() {
    const { user } = useContext(AuthContext);

    return (
        <header className="header">
            <Link to="/" className="logo">DungeonGame</Link>
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
        </header>
    );
}

export default Header;
