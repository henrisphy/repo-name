import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import styles from './Header.module.css'; 
import '../styles.css';
export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <div className={styles.navButton}>
                    <Link to="/" className={styles.logoText} onClick={closeMenu}>
                        <span>MyScheduler</span>
                    </Link>

                    

                    <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                        <Link 
                            to="/" className={styles.navLink} onClick={closeMenu}>
                            Home
                        </Link>
                        <Link 
                            to="/about" className={styles.navLink} onClick={closeMenu}>
                            About
                        </Link>
                        <Link 
                            to="/contact" className={styles.navLink} onClick={closeMenu}>
                            Contact
                        </Link>
                        <div className={styles.loginNavButton}>
                            <Link
                            to="/login" className={styles.navLink} onClick={closeMenu}>
                            Login
                        </Link>
                        </div>
                        
                    </nav>
                </div>
            </div>
        </header>
    );
}