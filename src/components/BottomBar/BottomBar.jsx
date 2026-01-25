import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Coins, 
  History, 
  Briefcase 
} from 'lucide-react'; // Using lucide-react for clean icons
import styles from './BottomBar.module.css';

const BottomBar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard /> },
    { id: 'digitalGold', label: 'Digital Gold', path: '/digitalGold', icon: <Coins /> },
    { id: 'goldOrders', label: 'Orders', path: '/digitalGold/GoldOrders', icon: <History /> },
    { id: 'portfolio', label: 'Portfolio', path: '/portfolio', icon: <Briefcase /> },
  ];


  const getVisibleItems = () => {
    if (pathname.startsWith('/digitalGold')) {
      return navItems.filter(item => 
        ['dashboard', 'digitalGold', 'goldOrders'].includes(item.id)
      );
    }
    
    if (pathname === '/dashboard') {
      return navItems.filter(item => 
        ['dashboard', 'digitalGold'].includes(item.id)
      );
    }

    return navItems.filter(item => ['dashboard', 'digitalGold'].includes(item.id));
  };

  const visibleItems = getVisibleItems();

  return (
    <nav className={styles.BottomBarContainer}>
      <div className={styles.BottomBarWrapper}>
        {visibleItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={item.id} 
              to={item.path} 
              className={`${styles.BottomBarItem} ${isActive ? styles.BottomBarItemActive : ''}`}
            >
              <div className={styles.BottomBarIcon}>
                {item.icon}
              </div>
              <span className={styles.BottomBarLabel}>{item.label}</span>
              {isActive && <div className={styles.BottomBarIndicator} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomBar;