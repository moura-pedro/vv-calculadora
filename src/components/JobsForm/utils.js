export const getMonthsBetweenDates = (startDate, endDate) => {
    if (!startDate || !endDate) return [];
    
    const start = new Date(startDate + "-01");
    const end = new Date(endDate + "-01");
    const months = [];
    
    const current = new Date(start);
    
    while (current <= end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };