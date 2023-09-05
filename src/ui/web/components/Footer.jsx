import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import Badge from '@mui/material/Badge';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const assembleAction = ({ href, label, badge, badgeColor, IconComponent }) =>
  <BottomNavigationAction
    component="a"
    value={href}
    href={href}
    label={label}
    icon={<Badge color={badgeColor} badgeContent={badge}><IconComponent /></Badge>}
  />;

export function Footer({ core }) {
  const [badgeCounts, setBadgeCounts] = useState({ repeat: 0, cart: 0 });
  const { url } = useLocation();
  useEffect(() => {
    core.onShoppingListUpdate("components.Footer", shoppingList => {
      setBadgeCounts({
        cart: shoppingList.shoppingList.length,
      });
      
    });
    return () => {
      core.offShoppingListUpdate("components.Footer");
    };
  });
  return (
    <BottomNavigation showLabels={true} value={url} sx={{ paddingTop: 5, paddingBottom: 4 }}>{[
      assembleAction({ href:"/schedule", label: "Schedule", IconComponent: EventRepeatIcon }),
      assembleAction({ href:"/plan", label: "Plan", badge: badgeCounts.cart, badgeColor: "secondary", IconComponent: ShoppingCartIcon }),
      assembleAction({ href:"/shop", label: "Shop", IconComponent: CheckBoxIcon })
    ]}
    </BottomNavigation>
  );
}
