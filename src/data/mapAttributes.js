export function mapAttributes(object, mapOneAttribute) {
  return Object.fromEntries(Object.entries(object)
    .map(entry => [entry[0], mapOneAttribute({ key: entry[0], value: entry[1] })]));
}
