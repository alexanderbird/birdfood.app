
import { useLocation } from 'preact-iso';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const assembleAction = ({ href, label, IconComponent }) =>
  <BottomNavigationAction
    component="a"
    value={href}
    href={href}
    label={label}
    icon={<IconComponent />}
  />;

export function Footer() {
  const { url } = useLocation();
  return (
    <BottomNavigation showLabels={true} value={url}>{[
      assembleAction({ href:"/schedule", label: "Schedule", IconComponent: EventRepeatIcon }),
      assembleAction({ href:"/plan", label: "Plan", IconComponent: ShoppingCartIcon }),
      assembleAction({ href:"/shop", label: "Shop", IconComponent: CheckBoxIcon })
    ]}
    </BottomNavigation>
  );
}
