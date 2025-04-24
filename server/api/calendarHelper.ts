export const getMeetingDays = (days: string): number[] => {
    const map: Record<string, number> = { M: 1, T: 2, W: 3, R: 4, F: 5 };
    return [...days].map(d => map[d]);
  };
  
  export const generateCourseDates = (
    startDate: string,
    endDate: string,
    days: string
  ): string[] => {
    const result: string[] = [];
    const meetingDays = getMeetingDays(days);
  
    let current = new Date(startDate);
    const end = new Date(endDate);
  
    while (current <= end) {
      if (meetingDays.includes(current.getDay())) {
        result.push(current.toISOString().split("T")[0]); // "YYYY-MM-DD"
      }
      current.setDate(current.getDate() + 1);
    }
  
    return result;
  };