export const Currency = ({ children }) => {
  if (Number.isNaN(Number(children))) {
    return "$-";
  }
  const formatter = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });
  return formatter.format(children);
};
