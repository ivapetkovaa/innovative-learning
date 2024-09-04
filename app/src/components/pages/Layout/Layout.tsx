import { Outlet } from 'react-router-dom';
import Navigation from '../../navigation/Navigation';
import styles from'./Layout.module.css';

const Layout = () => {
  return (
    <>
      <Navigation />
      <div className={styles.main}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;