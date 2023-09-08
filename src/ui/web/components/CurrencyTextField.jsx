import { useEffect } from 'preact/hooks';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

export const CurrencyTextField = ({ setValue, ...props }) => {
  useEffect(() => {
    const formattedValue = Number(props.value).toFixed(2);
    setValue(formattedValue);
  }, [!!props.value]);
  return (
    <TextField
      onChange={event => setValue(event.target.value)}
      onBlur={event => {
        const formattedValue = Number(event.target.value).toFixed(2);
        setValue(formattedValue);
      }}
      onFocus={event => {
        const formattedValue = Number(event.target.value);
        setTimeout(() => event.target.select());
        setValue(formattedValue);
      }}
      inputProps={{
        sx: { textAlign: 'right' },
      }}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
      {...props}
    />
  );
};
