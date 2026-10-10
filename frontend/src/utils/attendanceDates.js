const DATE_FORMATTER = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function getAttendanceWeekDateRange(startDate, week) {
  if (
    typeof startDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
    !Number.isInteger(Number(week)) ||
    Number(week) < 1
  ) {
    return null;
  }

  const [year, month, day] = startDate.split("-").map(Number);
  if (!year || !month || !day) return null;
  const parsedStart = new Date(Date.UTC(year, month - 1, day));
  if (parsedStart.toISOString().slice(0, 10) !== startDate) return null;

  const start = new Date(
    Date.UTC(year, month - 1, day + (Number(week) - 1) * 7),
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);

  return `${DATE_FORMATTER.format(start)} – ${DATE_FORMATTER.format(end)}`;
}
