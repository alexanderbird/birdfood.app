import { useState } from 'preact/hooks';

import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


export const FilterMode = {
  ALL: {
    key: "ALL",
    label: "All",
    filterFunction: () => true,
  },
  ONLY_INCOMPLETE: {
    key: "ONLY_INCOMPLETE",
    label: "Incomplete",
    filterFunction: x => x.BoughtQuantity < x.RequiredQuantity,
  },
  ONLY_COMPLETE: {
    key: "ONLY_COMPLETE",
    label: "Complete",
    filterFunction: x => x.BoughtQuantity >= x.RequiredQuantity,
  },
};

export function useFilterModeToggle() {
  const [value, setValue] = useState(FilterMode.ALL.key);
  const StatefulFilterModeToggle = props => (
    <FilterModeToggle {...props} value={value} onChange={setValue} />
  );
  return [FilterMode[value], StatefulFilterModeToggle];
}

export function FilterModeToggle({ value, onChange }) {
  return (
    <Box flexDirection="row" justifyContent="space-around" sx={{ marginY: 2, display: 'flex' }}>
      <ToggleButtonGroup value={value} exclusive onChange={(e, v) => onChange(v)}>
        { Object.values(FilterMode).map(x =>
          <ToggleButton key={x.key} value={x.key} sx={{ paddingY: 0 }}>{x.label}</ToggleButton>
        )}
      </ToggleButtonGroup>
    </Box>
  );
}

