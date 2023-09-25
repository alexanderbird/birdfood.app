import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import Badge from '@mui/material/Badge';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChecklistIcon from '@mui/icons-material/Checklist';
import HistoryIcon from '@mui/icons-material/History';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

const actionProps = ({ value, href, label, badge, badgeColor, IconComponent }) => ({
  component: 'a',
  href,
  label: value === href ? label : '',
  value: href,
  icon: <Badge color={badgeColor} badgeContent={badge}><IconComponent /></Badge>
});

export function Footer({ core }) {
  const [badgeCounts, setBadgeCounts] = useState({ repeat: 0, cart: 0 });
  const { url } = useLocation();
  useEffect(() => {
    core.onShoppingListUpdate("components.Footer", shoppingList => {
      setBadgeCounts({
        cart: shoppingList.shoppingList.length,
      });
      
    });
    core.getShoppingPlan();
    return () => {
      core.offShoppingListUpdate("components.Footer");
    };
  }, [core]);
  const value = `/${  url.split(/[/?]/)[1]}`;
  return (
    <BottomNavigation showLabels={true} value={value} sx={{ paddingTop: 5, paddingBottom: 4 }}>
      <BottomNavigationAction {...actionProps({ value, href:"/catalog", label: "Catalog", IconComponent: ManageSearchIcon })} />
      <BottomNavigationAction {...actionProps({ value, href:"/plan", label: "Plan", badge: badgeCounts.cart, badgeColor: "secondary", IconComponent: ShoppingCartIcon })} />
      <BottomNavigationAction {...actionProps({ value, href:"/shop", label: "Shop", IconComponent: ChecklistIcon })} />
      <BottomNavigationAction {...actionProps({ value, href:"/history", label: "History", IconComponent: HistoryIcon })} />
    </BottomNavigation>
  );
}
