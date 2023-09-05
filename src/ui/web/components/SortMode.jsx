
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


export function lexicalComparison(lhs, rhs) {
  if (lhs === rhs) return 0;
  return lhs < rhs ? -1 : 1;
}

function reverseLexicalComparison(lhs, rhs) {
  return -1 * lexicalComparison(lhs, rhs);
}

export const SortMode = {
  NEWEST_FIRST: {
    key: "NEWEST_FIRST",
    label: "Newest First",
    sortFunction: (lhs, rhs) => reverseLexicalComparison(lhs.value.LastUpdated, rhs.value.LastUpdated)
  },
  BY_TYPE: {
    key: "BY_TYPE",
    label: "By Type",
    sortFunction: (lhs, rhs) => lexicalComparison(lhs.value.Type, rhs.value.Type)
  },
  ALPHABETICAL: {
    key: "ALPHABETICAL",
    label: "A-Z",
    sortFunction: (lhs, rhs) => lexicalComparison(lhs.label, rhs.label)
  },
};

export function SortModeToggle({ value, onChange }) {
  return (
    <Box flexDirection="row" justifyContent="space-around" sx={{ marginY: 2, display: 'flex' }}>
      <ToggleButtonGroup value={value} exclusive onChange={(e, v) => onChange(v)}>
        { Object.values(SortMode).map(x =>
          <ToggleButton key={x.key} value={x.key} sx={{ paddingY: 0 }}>{x.label}</ToggleButton>
        )}
      </ToggleButtonGroup>
    </Box>
  );
}

