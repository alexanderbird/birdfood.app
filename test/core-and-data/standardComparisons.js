export function sortByDate(lhs, rhs) {
  return lhs.Date < rhs.Date ? -1 : 1;
}

export function sortById(lhs, rhs) {
  return lhs.Id < rhs.Id ? -1 : 1;
}

export function sortByName(lhs, rhs) {
  return lhs.Name < rhs.Name ? -1 : 1;
}
