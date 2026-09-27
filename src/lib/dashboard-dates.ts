export function getStudioMonthBounds(today: string): {
  firstDay: string;
  nextMonth: string;
} {
  const [year, month] = today.split("-").map(Number);
  const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
  const next = new Date(Date.UTC(year, month, 1));
  const nextMonth = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-01`;

  return { firstDay, nextMonth };
}
