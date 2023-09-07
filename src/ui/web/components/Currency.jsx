export const Currency = ({ children }) => {
  const formatter = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });
  return formatter.format(children);
}
