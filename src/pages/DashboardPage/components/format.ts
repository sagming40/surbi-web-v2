export function formatKrw(value: number) {
  const jo = Math.floor(value / 1e12);
  const eok = Math.floor((value % 1e12) / 1e8);
  if (jo > 0) return eok === 0 ? `${jo}조` : `${jo}조 ${eok.toLocaleString()}억`;
  return `${eok.toLocaleString()}억`;
}