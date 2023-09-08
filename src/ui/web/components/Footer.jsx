import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import Badge from '@mui/material/Badge';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ChecklistIcon from '@mui/icons-material/Checklist';
import HistoryIcon from '@mui/icons-material/History';

const actionProps = ({ href, label, badge, badgeColor, IconComponent }) => ({
  component: 'a',
  href,
  label,
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
    return () => {
      core.offShoppingListUpdate("components.Footer");
    };
  });
  return (
    <BottomNavigation showLabels={true} value={url} sx={{ paddingTop: 5, paddingBottom: 4 }}>
      <BottomNavigationAction {...actionProps({ href:"/schedule", label: "Schedule", IconComponent: EventRepeatIcon })} />
      <BottomNavigationAction {...actionProps({ href:"/plan", label: "Plan", badge: badgeCounts.cart, badgeColor: "secondary", IconComponent: FormatListBulletedIcon })} />
      <BottomNavigationAction {...actionProps({ href:"/shop", label: "Shop", IconComponent: ChecklistIcon })} />
      <BottomNavigationAction {...actionProps({ href:"/history", label: "History", IconComponent: HistoryIcon })} />
    </BottomNavigation>
  );
}
