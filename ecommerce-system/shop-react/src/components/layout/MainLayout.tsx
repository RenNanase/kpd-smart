import { Outlet } from 'react-router-dom';

import { CartDrawer } from '../../features/cart/CartDrawer';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="site-shell">
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <CartDrawer />
      <footer className="site-footer">
        <p>Demo storefront — mock API & cart state.</p>
      </footer>
    </div>
  );
}
