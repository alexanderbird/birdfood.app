import { DryGoodIcon } from './DryGoodIcon';
import { BakeryIcon } from './BakeryIcon';
import { DeliIcon } from './DeliIcon';

export const ItemTypeIcon = ({ type }) => {
  if (type === "DRY_GOOD") return <DryGoodIcon />
  if (type === "BAKERY") return <BakeryIcon />
  if (type === "DELI") return <DeliIcon />
  return null;
}
