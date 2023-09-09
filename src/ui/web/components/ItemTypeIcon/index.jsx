import { DryGoodIcon } from './DryGoodIcon';
import { BakeryIcon } from './BakeryIcon';
import { DeliIcon } from './DeliIcon';
import { DairyIcon } from './DairyIcon';
import { BabyIcon } from './BabyIcon';
import { ProduceIcon } from './ProduceIcon';
import { FrozenFoodIcon } from './FrozenFoodIcon';

export const ItemTypeIcon = ({ type }) => {
  if (type === "DRY_GOOD") return <DryGoodIcon />;
  if (type === "BAKERY") return <BakeryIcon />;
  if (type === "DELI") return <DeliIcon />;
  if (type === "DAIRY") return <DairyIcon />;
  if (type === "BABY") return <BabyIcon />;
  if (type === "PRODUCE") return <ProduceIcon />;
  if (type === "FROZEN") return <FrozenFoodIcon />;
  return null;
};

export const ItemType = {
  BABY: { key: "BABY", label: "Baby Food" },
  DRY_GOOD: { key: "DRY_GOOD", label: "Dry Goods" },
  DAIRY: { key: "DAIRY", label: "Dairy" },
  DELI: { key: "DELI", label: "Deli" },
  BAKERY: { key: "BAKERY", label: "Bakery" },
  PRODUCE: { key: "PRODUCE", label: "Produce" },
  FROZEN: { key: "FROZEN", label: "Frozen" },
  OTHER: { key: "OTHER", label: "Other" }
};
