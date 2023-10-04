import { useEffect, useRef, useState } from 'preact/hooks';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

const moneyFormat = number => {
  if (!number) {
    return number;
  }
  return Number(number).toFixed(2);
};

export const CurrencyTextField = ({ setValue, value, ...props }) => {
  const [formattedValue, setFormattedValue] = useState(moneyFormat(value));
  const ref = useRef();
  useEffect(() => {
    if (document.activeElement === ref.current.querySelector('input')) {
      // don't change the value when the input is active
      return;
    }
    setFormattedValue(moneyFormat(value));
  }, [!!value]);
  const onChange = event => {
    setFormattedValue(event.target.value);
    setValue(Number(event.target.value));
  };
  return (
    <TextField
      ref={ref}
      onChange={onChange}
      onBlur={event => {
        const number = Number(event.target.value);
        if (!Number.isNaN(number)) {
          const formattedValue = number.toFixed(2);
          setFormattedValue(formattedValue);
        }
      }}
      onFocus={event => {
        const editableValue = Number(event.target.value);
        if (!Number.isNaN(editableValue)) {
          setFormattedValue(editableValue);
        }
        setTimeout(() => event.target.select());
      }}
      inputProps={{
        sx: { textAlign: 'right' },
        inputMode: 'decimal'
      }}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
      {...props}
      value={formattedValue}
    />
  );
};
