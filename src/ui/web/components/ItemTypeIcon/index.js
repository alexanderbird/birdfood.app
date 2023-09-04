import { DryGoodIcon } from './DryGoodIcon';
import { BakeryIcon } from './BakeryIcon';
import { DeliIcon } from './DeliIcon';
import { DairyIcon } from './DairyIcon';
import { BabyIcon } from './BabyIcon';

export const ItemTypeIcon = ({ type }) => {
  if (type === "DRY_GOOD") return <DryGoodIcon />
  if (type === "BAKERY") return <BakeryIcon />
  if (type === "DELI") return <DeliIcon />
  if (type === "DAIRY") return <DairyIcon />
  if (type === "BABY") return <BabyIcon />
  return null;
}
