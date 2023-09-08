import { useEffect, useRef } from 'preact/hooks';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

export const CurrencyTextField = ({ setValue, ...props }) => {
  const ref = useRef();
  useEffect(() => {
    if (props.value === undefined) {
      return;
    }
    if (document.activeElement === ref.current.querySelector('input')) {
      return;
    }
    const formattedValue = Number(props.value).toFixed(2);
    setValue(formattedValue);
  }, [!!props.value]);
  return (
    <TextField
      ref={ref}
      onChange={event => setValue(event.target.value)}
      onBlur={event => {
        const value = Number(event.target.value);
        if (Number.isNaN(value)) {
          setValue("");
        } else {
          const formattedValue = value.toFixed(2);
          setValue(formattedValue);
        }
      }}
      onFocus={event => {
        const formattedValue = Number(event.target.value);
        setTimeout(() => event.target.select());
        setValue(formattedValue);
      }}
      inputProps={{
        sx: { textAlign: 'right' },
        type: 'number',
        inputMode: 'decimal'
      }}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
      {...props}
    />
  );
};
