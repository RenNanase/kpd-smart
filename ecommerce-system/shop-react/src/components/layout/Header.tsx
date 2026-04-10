import { Link, NavLink } from 'react-router-dom';

import { useCart } from '../../features/cart/useCart';

const navClass = ({ isActive }: { isActive: boolean }) =>
  'nav-link' + (isActive ? ' nav-link--active' : '');

export function Header() {
  const { itemCount, openDrawer } = useCart();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-logo">
          Shop
        </Link>
        <nav className="site-nav" aria-label="Main">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navClass}>
            Products
          </NavLink>
          <NavLink to="/account" className={navClass}>
            Account
          </NavLink>
          <NavLink to="/orders" className={navClass}>
            Orders
          </NavLink>
        </nav>
        <div className="site-header__actions">
          <button
            type="button"
            className="cart-trigger"
            onClick={openDrawer}
            aria-label={`Open cart, ${itemCount} items`}
          >
            Cart
            {itemCount > 0 ? (
              <span className="cart-trigger__badge">{itemCount}</span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
