// src/components/JobsForm/utils.js
export const getMonthsBetweenDates = (startDate, endDate) => {
  if (!startDate || !endDate) return [];
  
  // Create dates for first day of each month
  const start = new Date(startDate + "-01");
  const end = new Date(endDate + "-01");
  
  // Make sure dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];
  
  const months = [];
  const currentDate = new Date(start);
  
  // Reset to start of month
  currentDate.setDate(1);
  currentDate.setHours(0, 0, 0, 0);
  
  // Include both start and end months
  while (currentDate <= end) {
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return months;
};