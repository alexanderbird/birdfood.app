
import * as colors from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { Currency } from '../../components/Currency';

export const ItemPriceSummary = ({ item }) => {
  if (item.BoughtQuantity) {
    return (
      <Typography component="span">
        <Currency>{(item.ActualUnitPrice || item.UnitPriceEstimate) * item.BoughtQuantity}</Currency>
        <Typography component="span" sx={{ ml: 1, color: colors.grey[500] }}>
          ({item.BoughtQuantity} @ <Currency>{(item.ActualUnitPrice || item.UnitPriceEstimate)}</Currency>)
        </Typography>
      </Typography>
    );
  }
  return (
    <Typography component="span">
      <Currency>{(item.ActualUnitPrice || item.UnitPriceEstimate)}</Currency> each
    </Typography>
  );
};

