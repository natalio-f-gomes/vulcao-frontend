import { styles } from "../BusinessModel/BusinessSidebar";

export type ShoppingView = "cartView" | "orderView" | "favoritesView";

interface Parameters {
  activeView: ShoppingView;
  onNavigate: (view: ShoppingView) => void;
}

interface SidebarLink {
  icon: string;
  label: string;
  href: ShoppingView;
  active?: boolean;
}

function ShoppingSidebar({ activeView, onNavigate }: Parameters) {
  const itemStyle = (view: ShoppingView): React.CSSProperties =>
    activeView === view
      ? { ...styles.navItem, ...styles.navItemActive }
      : styles.navItem;

  return (
    <>
      <div className="cart-sidebar-inner">
        <div className="cart-sidebar-title">Menu</div>
        <nav className="cart-sidebar-nav">
          <a
            style={itemStyle("cartView")}
            onClick={() => onNavigate("cartView")}
          >
            <i className="bi bi-box-seam" /> O Meu Carrinho
          </a>
          <a
            style={itemStyle("orderView")}
            onClick={() => onNavigate("orderView")}
          >
            <i className="bi bi-box-seam" /> Encomendas
          </a>
        </nav>
      </div>
    </>
  );
}

export default ShoppingSidebar;
