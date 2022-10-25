export const emptyFilters = {
  from: {
    value: "",
    defaultValue: "",
  },
  to: {
    value: "",
    defaultValue: "",
  },
  regions: [],
  keywords: [],
};

export function getYears(firstYear, lastYear) {
  const numYears = lastYear - firstYear + 1;
  const years = new Array(numYears);

  for (let i = 0; i < numYears; i += 1) {
    const year = firstYear + i;
    years[i] = year.toString();
  }
  return years;
}
