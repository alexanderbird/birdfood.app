import { DryGoodIcon } from './DryGoodIcon';
import { BakeryIcon } from './BakeryIcon';
import { DeliIcon } from './DeliIcon';
import { DairyIcon } from './DairyIcon';
import { BabyIcon } from './BabyIcon';
import { ProduceIcon } from './ProduceIcon';
import { FrozenFoodIcon } from './FrozenFoodIcon';
import { SpecialtyItemIcon } from './SpecialtyItemIcon';
import { PharmacyIcon } from './PharmacyIcon';
import { OtherFoodIcon } from './OtherFoodIcon';

export const ItemTypeIcon = ({ type, ...props }) => {
  if (type === "DRY_GOOD") return <DryGoodIcon {...props} />;
  if (type === "BAKERY") return <BakeryIcon {...props} />;
  if (type === "DELI") return <DeliIcon {...props} />;
  if (type === "DAIRY") return <DairyIcon {...props} />;
  if (type === "BABY") return <BabyIcon {...props} />;
  if (type === "PRODUCE") return <ProduceIcon {...props} />;
  if (type === "FROZEN") return <FrozenFoodIcon {...props} />;
  if (type === "PHARMACY") return <PharmacyIcon {...props} />;
  if (type === "SPECIALTY") return <SpecialtyItemIcon {...props} />;
  if (type === "OTHER") return <OtherFoodIcon {...props} />;
  return null;
};

export const ItemType = {
  BABY: { key: "BABY", label: "Baby Product" },
  DRY_GOOD: { key: "DRY_GOOD", label: "Dry Goods" },
  DAIRY: { key: "DAIRY", label: "Dairy" },
  DELI: { key: "DELI", label: "Deli" },
  BAKERY: { key: "BAKERY", label: "Bakery" },
  PRODUCE: { key: "PRODUCE", label: "Produce" },
  FROZEN: { key: "FROZEN", label: "Frozen" },
  SPECIALTY: { key: "SPECIALTY", label: "Specialty Item" },
  PHARMACY: { key: "PHARMACY", label: "Pharmacy" },
  OTHER: { key: "OTHER", label: "Other" }
};
