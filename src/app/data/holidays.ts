// Public holidays data for different countries
export interface PublicHoliday {
  date: Date;
  name: string;
  country: string;
}

export const publicHolidays: Record<string, PublicHoliday[]> = {
  "United States": [
    { date: new Date(2026, 0, 1), name: "New Year's Day", country: "United States" },
    { date: new Date(2026, 0, 19), name: "Martin Luther King Jr. Day", country: "United States" },
    { date: new Date(2026, 1, 16), name: "Presidents' Day", country: "United States" },
    { date: new Date(2026, 4, 25), name: "Memorial Day", country: "United States" },
    { date: new Date(2026, 6, 3), name: "Independence Day (Observed)", country: "United States" },
    { date: new Date(2026, 8, 7), name: "Labor Day", country: "United States" },
    { date: new Date(2026, 9, 12), name: "Columbus Day", country: "United States" },
    { date: new Date(2026, 10, 11), name: "Veterans Day", country: "United States" },
    { date: new Date(2026, 10, 26), name: "Thanksgiving Day", country: "United States" },
    { date: new Date(2026, 11, 25), name: "Christmas Day", country: "United States" },
  ],
  "United Kingdom": [
    { date: new Date(2026, 0, 1), name: "New Year's Day", country: "United Kingdom" },
    { date: new Date(2026, 3, 3), name: "Good Friday", country: "United Kingdom" },
    { date: new Date(2026, 3, 6), name: "Easter Monday", country: "United Kingdom" },
    { date: new Date(2026, 4, 4), name: "Early May Bank Holiday", country: "United Kingdom" },
    { date: new Date(2026, 4, 25), name: "Spring Bank Holiday", country: "United Kingdom" },
    { date: new Date(2026, 7, 31), name: "Summer Bank Holiday", country: "United Kingdom" },
    { date: new Date(2026, 11, 25), name: "Christmas Day", country: "United Kingdom" },
    { date: new Date(2026, 11, 28), name: "Boxing Day (Observed)", country: "United Kingdom" },
  ],
  "Canada": [
    { date: new Date(2026, 0, 1), name: "New Year's Day", country: "Canada" },
    { date: new Date(2026, 3, 3), name: "Good Friday", country: "Canada" },
    { date: new Date(2026, 4, 18), name: "Victoria Day", country: "Canada" },
    { date: new Date(2026, 6, 1), name: "Canada Day", country: "Canada" },
    { date: new Date(2026, 7, 3), name: "Civic Holiday", country: "Canada" },
    { date: new Date(2026, 8, 7), name: "Labour Day", country: "Canada" },
    { date: new Date(2026, 9, 12), name: "Thanksgiving", country: "Canada" },
    { date: new Date(2026, 10, 11), name: "Remembrance Day", country: "Canada" },
    { date: new Date(2026, 11, 25), name: "Christmas Day", country: "Canada" },
    { date: new Date(2026, 11, 28), name: "Boxing Day", country: "Canada" },
  ],
  "Australia": [
    { date: new Date(2026, 0, 1), name: "New Year's Day", country: "Australia" },
    { date: new Date(2026, 0, 26), name: "Australia Day", country: "Australia" },
    { date: new Date(2026, 3, 3), name: "Good Friday", country: "Australia" },
    { date: new Date(2026, 3, 4), name: "Easter Saturday", country: "Australia" },
    { date: new Date(2026, 3, 6), name: "Easter Monday", country: "Australia" },
    { date: new Date(2026, 3, 25), name: "ANZAC Day", country: "Australia" },
    { date: new Date(2026, 5, 8), name: "Queen's Birthday", country: "Australia" },
    { date: new Date(2026, 11, 25), name: "Christmas Day", country: "Australia" },
    { date: new Date(2026, 11, 28), name: "Boxing Day", country: "Australia" },
  ],
  "Germany": [
    { date: new Date(2026, 0, 1), name: "New Year's Day", country: "Germany" },
    { date: new Date(2026, 3, 3), name: "Good Friday", country: "Germany" },
    { date: new Date(2026, 3, 6), name: "Easter Monday", country: "Germany" },
    { date: new Date(2026, 4, 1), name: "Labour Day", country: "Germany" },
    { date: new Date(2026, 4, 14), name: "Ascension Day", country: "Germany" },
    { date: new Date(2026, 4, 25), name: "Whit Monday", country: "Germany" },
    { date: new Date(2026, 9, 3), name: "German Unity Day", country: "Germany" },
    { date: new Date(2026, 11, 25), name: "Christmas Day", country: "Germany" },
    { date: new Date(2026, 11, 26), name: "Boxing Day", country: "Germany" },
  ],
  "France": [
    { date: new Date(2026, 0, 1), name: "New Year's Day", country: "France" },
    { date: new Date(2026, 3, 6), name: "Easter Monday", country: "France" },
    { date: new Date(2026, 4, 1), name: "Labour Day", country: "France" },
    { date: new Date(2026, 4, 8), name: "Victory in Europe Day", country: "France" },
    { date: new Date(2026, 4, 14), name: "Ascension Day", country: "France" },
    { date: new Date(2026, 4, 25), name: "Whit Monday", country: "France" },
    { date: new Date(2026, 6, 14), name: "Bastille Day", country: "France" },
    { date: new Date(2026, 7, 15), name: "Assumption Day", country: "France" },
    { date: new Date(2026, 10, 1), name: "All Saints' Day", country: "France" },
    { date: new Date(2026, 10, 11), name: "Armistice Day", country: "France" },
    { date: new Date(2026, 11, 25), name: "Christmas Day", country: "France" },
  ],
  "Belgium": [
    { date: new Date(2026, 0, 1), name: "New Year's Day", country: "Belgium" },
    { date: new Date(2026, 3, 6), name: "Easter Monday", country: "Belgium" },
    { date: new Date(2026, 4, 1), name: "Labour Day", country: "Belgium" },
    { date: new Date(2026, 4, 14), name: "Ascension Day", country: "Belgium" },
    { date: new Date(2026, 4, 25), name: "Whit Monday", country: "Belgium" },
    { date: new Date(2026, 6, 21), name: "Belgian National Day", country: "Belgium" },
    { date: new Date(2026, 7, 15), name: "Assumption of Mary", country: "Belgium" },
    { date: new Date(2026, 10, 1), name: "All Saints' Day", country: "Belgium" },
    { date: new Date(2026, 10, 11), name: "Armistice Day", country: "Belgium" },
    { date: new Date(2026, 11, 25), name: "Christmas Day", country: "Belgium" },
  ],
};

export const countries = Object.keys(publicHolidays);