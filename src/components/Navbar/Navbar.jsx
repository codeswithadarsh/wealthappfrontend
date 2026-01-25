import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import { logout } from "../../store/auth/auth.slice";
import { selectIsAuthenticated } from "../../store/auth/auth.selectors";
import styles from "./Navbar.module.css";
import wealthLogo from "../../assets/images/logos/logo.png"

const Navbar = ({ hideIcons, noRedirect }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    useEffect(() => {
        const handleClickOutside = event => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // if (!isAuthenticated) return null;

    return (
        <header className={styles.NavbarContainer}>
            <div className={styles.NavbarInner}>

                <div className={styles.NavbarLeft}>
                    <img
                        src={wealthLogo}
                        alt="Logo"
                        className={styles.NavbarLogo}
                        onClick={() => (noRedirect ? null : navigate("/dashboard"))}
                    />

                    {!hideIcons && (
                        <nav className={styles.NavbarNav}>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.NavbarNavItem} ${styles.NavbarNavItemActive}`
                                        : styles.NavbarNavItem
                                }
                            >
                                Dashboard
                            </NavLink>

                            <NavLink
                                to="/digitalGold"
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.NavbarNavItem} ${styles.NavbarNavItemActive}`
                                        : styles.NavbarNavItem
                                }
                            >
                                Digital Gold
                            </NavLink>

            
                        </nav>
                    )}
                </div>

                {hideIcons ? null : (
                    <div className={styles.NavbarRight} ref={dropdownRef}>
                        <div
                            className={styles.NavbarProfileIcon}
                            onClick={() => setIsProfileOpen(prev => !prev)}
                        >
                            👤
                        </div>

                        {isProfileOpen && (
                            <div className={styles.NavbarProfileDropdown}>
                                <div
                                    className={styles.NavbarProfileItem}
                                    onClick={() => navigate("/profile")}
                                >
                                    View Profile
                                </div>
                                <div
                                    className={styles.NavbarProfileItem}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </header>
    );
};

export default Navbar;
