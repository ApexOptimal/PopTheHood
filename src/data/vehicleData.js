// Common vehicle makes and models with default service intervals
// Intervals are in miles and represent typical manufacturer recommendations

export const vehicleMakes = [
  'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 
  'Dodge', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jeep', 'Kia',
  'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan',
  'Porsche', 'Ram', 'Subaru', 'Toyota', 'Volkswagen', 'Volvo'
];

// Vehicle data structure: Make -> Model -> Years -> Trims
export const vehicleData = {
  'Subaru': {
    'Forester': {
      years: [1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Base': { engine: '2.5L H4', turbo: false },
        'L': { engine: '2.5L H4', turbo: false },
        'S': { engine: '2.5L H4', turbo: false },
        'X': { engine: '2.5L H4', turbo: false },
        'XS': { engine: '2.5L H4', turbo: false },
        'Premium': { engine: '2.5L H4', turbo: false },
        'Sport': { engine: '2.5L H4', turbo: false },
        'Limited': { engine: '2.5L H4', turbo: false },
        'Touring': { engine: '2.5L H4', turbo: false },
        'XT': { engine: '2.5L H4 Turbo', turbo: true },
        'XT Premium': { engine: '2.5L H4 Turbo', turbo: true },
        'XT Limited': { engine: '2.5L H4 Turbo', turbo: true },
        'XT Touring': { engine: '2.0L H4 Turbo', turbo: true },
        'Wilderness': { engine: '2.5L H4', turbo: false }
      }
    },
    'Outback': {
      years: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Base': { engine: '2.5L H4', turbo: false },
        'Premium': { engine: '2.5L H4', turbo: false },
        'Limited': { engine: '2.5L H4', turbo: false },
        'Touring': { engine: '2.5L H4', turbo: false },
        'XT': { engine: '2.4L H4 Turbo', turbo: true },
        'Onyx Edition': { engine: '2.4L H4 Turbo', turbo: true },
        'Wilderness': { engine: '2.4L H4 Turbo', turbo: true }
      }
    },
    'Impreza': {
      years: [1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Base': { engine: '2.0L H4', turbo: false },
        'Premium': { engine: '2.0L H4', turbo: false },
        'Sport': { engine: '2.0L H4', turbo: false },
        'Limited': { engine: '2.0L H4', turbo: false }
      }
    },
    'WRX': {
      years: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Base': { engine: '2.0L H4 Turbo', turbo: true },
        'Premium': { engine: '2.0L H4 Turbo', turbo: true },
        'Limited': { engine: '2.0L H4 Turbo', turbo: true },
        'STI': { engine: '2.5L H4 Turbo', turbo: true }
      }
    },
    'Crosstrek': {
      years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Base': { engine: '2.0L H4', turbo: false },
        'Premium': { engine: '2.0L H4', turbo: false },
        'Sport': { engine: '2.5L H4', turbo: false },
        'Limited': { engine: '2.5L H4', turbo: false },
        'Wilderness': { engine: '2.5L H4', turbo: false }
      }
    },
    'Ascent': {
      years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Base': { engine: '2.4L H4 Turbo', turbo: true },
        'Premium': { engine: '2.4L H4 Turbo', turbo: true },
        'Limited': { engine: '2.4L H4 Turbo', turbo: true },
        'Touring': { engine: '2.4L H4 Turbo', turbo: true }
      }
    },
    'Legacy': {
      years: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Base': { engine: '2.5L H4', turbo: false },
        'Premium': { engine: '2.5L H4', turbo: false },
        'Limited': { engine: '2.5L H4', turbo: false },
        'Sport': { engine: '2.4L H4 Turbo', turbo: true },
        'XT': { engine: '2.4L H4 Turbo', turbo: true }
      }
    }
  },
  'Toyota': {
    'Camry': {
      years: [1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'L': { engine: '2.5L I4', turbo: false },
        'LE': { engine: '2.5L I4', turbo: false },
        'SE': { engine: '2.5L I4', turbo: false },
        'XLE': { engine: '2.5L I4', turbo: false },
        'XSE': { engine: '2.5L I4', turbo: false },
        'TRD': { engine: '3.5L V6', turbo: false },
        'V6': { engine: '3.5L V6', turbo: false }
      }
    },
    'Corolla': {
      years: [1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'L': { engine: '1.8L I4', turbo: false },
        'LE': { engine: '1.8L I4', turbo: false },
        'SE': { engine: '2.0L I4', turbo: false },
        'XLE': { engine: '2.0L I4', turbo: false },
        'XSE': { engine: '2.0L I4', turbo: false },
        'GR': { engine: '1.6L I3 Turbo', turbo: true }
      }
    },
    'RAV4': {
      years: [1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LE': { engine: '2.5L I4', turbo: false },
        'XLE': { engine: '2.5L I4', turbo: false },
        'XLE Premium': { engine: '2.5L I4', turbo: false },
        'Limited': { engine: '2.5L I4', turbo: false },
        'Adventure': { engine: '2.5L I4', turbo: false },
        'TRD Off-Road': { engine: '2.5L I4', turbo: false },
        'Prime': { engine: '2.5L I4 Hybrid', turbo: false }
      }
    },
    '4Runner': {
      years: [1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'SR5': { engine: '4.0L V6', turbo: false },
        'TRD Off-Road': { engine: '4.0L V6', turbo: false },
        'TRD Pro': { engine: '4.0L V6', turbo: false },
        'Limited': { engine: '4.0L V6', turbo: false }
      }
    },
    'Tacoma': {
      years: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'SR': { engine: '2.7L I4', turbo: false },
        'SR5': { engine: '3.5L V6', turbo: false },
        'TRD Sport': { engine: '3.5L V6', turbo: false },
        'TRD Off-Road': { engine: '3.5L V6', turbo: false },
        'Limited': { engine: '3.5L V6', turbo: false },
        'TRD Pro': { engine: '3.5L V6', turbo: false }
      }
    }
  },
  'Honda': {
    'Civic': {
      years: [1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LX': { engine: '2.0L I4', turbo: false },
        'Sport': { engine: '2.0L I4', turbo: false },
        'EX': { engine: '2.0L I4', turbo: false },
        'EX-L': { engine: '2.0L I4', turbo: false },
        'Touring': { engine: '1.5L I4 Turbo', turbo: true },
        'Si': { engine: '1.5L I4 Turbo', turbo: true },
        'Type R': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Accord': {
      years: [1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LX': { engine: '1.5L I4 Turbo', turbo: true },
        'Sport': { engine: '1.5L I4 Turbo', turbo: true },
        'EX': { engine: '1.5L I4 Turbo', turbo: true },
        'EX-L': { engine: '1.5L I4 Turbo', turbo: true },
        'Touring': { engine: '2.0L I4 Turbo', turbo: true },
        'Sport 2.0T': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'CR-V': {
      years: [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LX': { engine: '2.4L I4', turbo: false },
        'EX': { engine: '1.5L I4 Turbo', turbo: true },
        'EX-L': { engine: '1.5L I4 Turbo', turbo: true },
        'Touring': { engine: '1.5L I4 Turbo', turbo: true },
        'Sport': { engine: '1.5L I4 Turbo', turbo: true }
      }
    }
  },
  'Ford': {
    'F-150': {
      years: [1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'XL': { engine: '2.7L V6 Turbo', turbo: true },
        'STX': { engine: '2.7L V6 Turbo', turbo: true },
        'XLT': { engine: '2.7L V6 Turbo', turbo: true },
        'Lariat': { engine: '2.7L V6 Turbo', turbo: true },
        'King Ranch': { engine: '3.5L V6 Turbo', turbo: true },
        'Platinum': { engine: '3.5L V6 Turbo', turbo: true },
        'Limited': { engine: '3.5L V6 Turbo', turbo: true },
        'Tremor': { engine: '5.0L V8', turbo: false },
        'Raptor': { engine: '3.5L V6 High Output Turbo', turbo: true }
      }
    },
    'Mustang': {
      years: [1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'EcoBoost': { engine: '2.3L I4 Turbo', turbo: true },
        'GT': { engine: '5.0L V8', turbo: false },
        'Mach 1': { engine: '5.0L V8', turbo: false },
        'Shelby GT350': { engine: '5.2L V8', turbo: false },
        'Shelby GT500': { engine: '5.2L V8 Supercharged', turbo: false }
      }
    }
  },
  'Mazda': {
    'MX-5 Miata': {
      years: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '1.6L I4', turbo: false },
        'Base (1.8L)': { engine: '1.8L I4', turbo: false },
        'Mazdaspeed': { engine: '1.8L I4 Turbo', turbo: true },
        'Club': { engine: '2.0L I4', turbo: false },
        'Grand Touring': { engine: '2.0L I4', turbo: false },
        'RF': { engine: '2.0L I4', turbo: false },
        'RF Club': { engine: '2.0L I4', turbo: false },
        'RF Grand Touring': { engine: '2.0L I4', turbo: false }
      }
    },
    'Mazda3': {
      years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'i SV': { engine: '2.0L I4', turbo: false },
        'i Sport': { engine: '2.0L I4', turbo: false },
        'i Touring': { engine: '2.0L I4', turbo: false },
        's Touring': { engine: '2.5L I4', turbo: false },
        's Grand Touring': { engine: '2.5L I4', turbo: false },
        'Mazdaspeed3': { engine: '2.3L I4 Turbo', turbo: true },
        '2.5 Turbo': { engine: '2.5L I4 Turbo', turbo: true }
      }
    },
    'Mazda6': {
      years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
      trims: {
        'i Sport': { engine: '2.5L I4', turbo: false },
        'i Touring': { engine: '2.5L I4', turbo: false },
        's Touring': { engine: '3.7L V6', turbo: false },
        's Grand Touring': { engine: '3.7L V6', turbo: false },
        'Mazdaspeed6': { engine: '2.3L I4 Turbo', turbo: true },
        '2.5 Turbo': { engine: '2.5L I4 Turbo', turbo: true }
      }
    },
    'CX-5': {
      years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Sport': { engine: '2.0L I4', turbo: false },
        'Touring': { engine: '2.5L I4', turbo: false },
        'Grand Touring': { engine: '2.5L I4', turbo: false },
        'Signature': { engine: '2.5L I4 Turbo', turbo: true },
        'Turbo': { engine: '2.5L I4 Turbo', turbo: true }
      }
    },
    'CX-9': {
      years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
      trims: {
        'Sport': { engine: '3.7L V6', turbo: false },
        'Touring': { engine: '2.5L I4 Turbo', turbo: true },
        'Grand Touring': { engine: '2.5L I4 Turbo', turbo: true },
        'Signature': { engine: '2.5L I4 Turbo', turbo: true }
      }
    }
  },
  'Porsche': {
    '911': {
      years: [1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Carrera': { engine: '3.0L H6', turbo: false },
        'Carrera S': { engine: '3.0L H6', turbo: false },
        'Carrera 4': { engine: '3.0L H6', turbo: false },
        'Carrera 4S': { engine: '3.0L H6', turbo: false },
        'Turbo': { engine: '3.8L H6 Turbo', turbo: true },
        'Turbo S': { engine: '3.8L H6 Turbo', turbo: true },
        'GT3': { engine: '4.0L H6', turbo: false },
        'GT3 RS': { engine: '4.0L H6', turbo: false },
        'GT2 RS': { engine: '3.8L H6 Turbo', turbo: true }
      }
    },
    'Cayman': {
      years: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '2.7L H6', turbo: false },
        'S': { engine: '3.4L H6', turbo: false },
        'GTS': { engine: '3.4L H6', turbo: false },
        'GT4': { engine: '4.0L H6', turbo: false }
      }
    },
    'Boxster': {
      years: [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Base': { engine: '2.7L H6', turbo: false },
        'S': { engine: '3.4L H6', turbo: false },
        'GTS': { engine: '3.4L H6', turbo: false },
        'Spyder': { engine: '4.0L H6', turbo: false }
      }
    },
    'Cayenne': {
      years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '3.0L V6 Turbo', turbo: true },
        'S': { engine: '2.9L V6 Turbo', turbo: true },
        'GTS': { engine: '4.0L V8 Turbo', turbo: true },
        'Turbo': { engine: '4.0L V8 Turbo', turbo: true },
        'Turbo S': { engine: '4.0L V8 Turbo', turbo: true }
      }
    },
    'Macan': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '2.0L I4 Turbo', turbo: true },
        'S': { engine: '2.9L V6 Turbo', turbo: true },
        'GTS': { engine: '2.9L V6 Turbo', turbo: true },
        'Turbo': { engine: '2.9L V6 Turbo', turbo: true }
      }
    },
    'Panamera': {
      years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '3.0L V6 Turbo', turbo: true },
        '4': { engine: '3.0L V6 Turbo', turbo: true },
        '4S': { engine: '2.9L V6 Turbo', turbo: true },
        'GTS': { engine: '4.0L V8 Turbo', turbo: true },
        'Turbo': { engine: '4.0L V8 Turbo', turbo: true },
        'Turbo S': { engine: '4.0L V8 Turbo', turbo: true }
      }
    }
  },
  'Volkswagen': {
        'Golf': {
      years: [1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'S': { engine: '1.4L I4 Turbo', turbo: true },
        'SE': { engine: '1.4L I4 Turbo', turbo: true },
        'SEL': { engine: '1.4L I4 Turbo', turbo: true },
        'GTI': { engine: '2.0L I4 Turbo (EA888)', turbo: true },
        'GTI S': { engine: '2.0L I4 Turbo (EA888)', turbo: true },
        'GTI SE': { engine: '2.0L I4 Turbo (EA888)', turbo: true },
        'GTI Autobahn': { engine: '2.0L I4 Turbo (EA888)', turbo: true },
        'R': { engine: '2.0L I4 Turbo (EA888)', turbo: true },
        'R32': { engine: '3.2L VR6', turbo: false }
      }
    },
    'Jetta': {
      years: [1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'S': { engine: '1.4L I4 Turbo', turbo: true },
        'SE': { engine: '1.4L I4 Turbo', turbo: true },
        'SEL': { engine: '1.4L I4 Turbo', turbo: true },
        'GLI': { engine: '2.0L I4 Turbo', turbo: true },
        'GLI S': { engine: '2.0L I4 Turbo', turbo: true },
        'GLI Autobahn': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Passat': {
      years: [1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
      trims: {
        'S': { engine: '2.0L I4 Turbo', turbo: true },
        'SE': { engine: '2.0L I4 Turbo', turbo: true },
        'SEL': { engine: '2.0L I4 Turbo', turbo: true },
        'R-Line': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Tiguan': {
      years: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'S': { engine: '2.0L I4 Turbo', turbo: true },
        'SE': { engine: '2.0L I4 Turbo', turbo: true },
        'SEL': { engine: '2.0L I4 Turbo', turbo: true },
        'R-Line': { engine: '2.0L I4 Turbo', turbo: true },
        'SEL Premium R-Line': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Atlas': {
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'S': { engine: '2.0L I4 Turbo', turbo: true },
        'SE': { engine: '2.0L I4 Turbo', turbo: true },
        'SEL': { engine: '3.6L V6', turbo: false },
        'SEL Premium': { engine: '3.6L V6', turbo: false },
        'SEL Premium R-Line': { engine: '3.6L V6', turbo: false }
      }
    }
  },
  'Honda': {
    'Civic': {
      years: [1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LX': { engine: '2.0L I4', turbo: false },
        'Sport': { engine: '2.0L I4', turbo: false },
        'EX': { engine: '2.0L I4', turbo: false },
        'EX-L': { engine: '2.0L I4', turbo: false },
        'Touring': { engine: '1.5L I4 Turbo', turbo: true },
        'Si': { engine: '1.5L I4 Turbo', turbo: true },
        'Type R': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Accord': {
      years: [1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LX': { engine: '1.5L I4 Turbo', turbo: true },
        'Sport': { engine: '1.5L I4 Turbo', turbo: true },
        'EX': { engine: '1.5L I4 Turbo', turbo: true },
        'EX-L': { engine: '1.5L I4 Turbo', turbo: true },
        'Touring': { engine: '2.0L I4 Turbo', turbo: true },
        'Sport 2.0T': { engine: '2.0L I4 Turbo', turbo: true },
        'Hybrid': { engine: '2.0L I4 Hybrid', turbo: false }
      }
    },
    'CR-V': {
      years: [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LX': { engine: '2.4L I4', turbo: false },
        'EX': { engine: '1.5L I4 Turbo', turbo: true },
        'EX-L': { engine: '1.5L I4 Turbo', turbo: true },
        'Touring': { engine: '1.5L I4 Turbo', turbo: true },
        'Sport': { engine: '1.5L I4 Turbo', turbo: true },
        'Hybrid': { engine: '2.0L I4 Hybrid', turbo: false }
      }
    },
    'Pilot': {
      years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'LX': { engine: '3.5L V6', turbo: false },
        'EX': { engine: '3.5L V6', turbo: false },
        'EX-L': { engine: '3.5L V6', turbo: false },
        'Touring': { engine: '3.5L V6', turbo: false },
        'Elite': { engine: '3.5L V6', turbo: false },
        'Black Edition': { engine: '3.5L V6', turbo: false }
      }
    },
    'Odyssey': {
      years: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LX': { engine: '3.5L V6', turbo: false },
        'EX': { engine: '3.5L V6', turbo: false },
        'EX-L': { engine: '3.5L V6', turbo: false },
        'Touring': { engine: '3.5L V6', turbo: false },
        'Elite': { engine: '3.5L V6', turbo: false }
      }
    },
    'HR-V': {
      years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'LX': { engine: '1.8L I4', turbo: false },
        'Sport': { engine: '1.8L I4', turbo: false },
        'EX': { engine: '1.8L I4', turbo: false },
        'EX-L': { engine: '1.8L I4', turbo: false }
      }
    },
    'Ridgeline': {
      years: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'RT': { engine: '3.5L V6', turbo: false },
        'Sport': { engine: '3.5L V6', turbo: false },
        'RTL': { engine: '3.5L V6', turbo: false },
        'RTL-T': { engine: '3.5L V6', turbo: false },
        'RTL-E': { engine: '3.5L V6', turbo: false },
        'Black Edition': { engine: '3.5L V6', turbo: false }
      }
    }
  },
  'Infiniti': {
    'Q50': {
      years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Pure': { engine: '2.0L I4 Turbo', turbo: true },
        'Luxe': { engine: '3.0L V6 Turbo', turbo: true },
        'Sport': { engine: '3.0L V6 Turbo', turbo: true },
        'Red Sport 400': { engine: '3.0L V6 Turbo', turbo: true }
      }
    },
    'Q60': {
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Pure': { engine: '2.0L I4 Turbo', turbo: true },
        'Luxe': { engine: '3.0L V6 Turbo', turbo: true },
        'Sport': { engine: '3.0L V6 Turbo', turbo: true },
        'Red Sport 400': { engine: '3.0L V6 Turbo', turbo: true }
      }
    },
    'QX50': {
      years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Pure': { engine: '2.0L I4 Turbo', turbo: true },
        'Luxe': { engine: '2.0L I4 Turbo', turbo: true },
        'Essential': { engine: '2.0L I4 Turbo', turbo: true },
        'Sensory': { engine: '2.0L I4 Turbo', turbo: true },
        'Autograph': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'QX60': {
      years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Pure': { engine: '3.5L V6', turbo: false },
        'Luxe': { engine: '3.5L V6', turbo: false },
        'Essential': { engine: '3.5L V6', turbo: false },
        'Sensory': { engine: '3.5L V6', turbo: false },
        'Autograph': { engine: '3.5L V6', turbo: false }
      }
    },
    'QX80': {
      years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Luxe': { engine: '5.6L V8', turbo: false },
        'Premium Select': { engine: '5.6L V8', turbo: false },
        'Sensory': { engine: '5.6L V8', turbo: false },
        'Autograph': { engine: '5.6L V8', turbo: false }
      }
    }
  },
  'Dodge': {
    'Challenger': {
      years: [1970, 1971, 1972, 1973, 1974, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SXT': { engine: '3.6L V6', turbo: false },
        'GT': { engine: '3.6L V6', turbo: false },
        'R/T': { engine: '5.7L V8 (Hemi)', turbo: false },
        'R/T Scat Pack': { engine: '6.4L V8 (Hemi)', turbo: false },
        'SRT Hellcat': { engine: '6.2L V8 Supercharged (Hellcat)', turbo: false },
        'SRT Hellcat Redeye': { engine: '6.2L V8 Supercharged (Hellcat)', turbo: false },
        'SRT Demon': { engine: '6.2L V8 Supercharged (Hellcat)', turbo: false },
        'SRT Demon 170': { engine: '6.2L V8 Supercharged (Hellcat)', turbo: false }
      }
    },
    'Charger': {
      years: [1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SXT': { engine: '3.6L V6', turbo: false },
        'GT': { engine: '3.6L V6', turbo: false },
        'R/T': { engine: '5.7L V8 (Hemi)', turbo: false },
        'R/T Scat Pack': { engine: '6.4L V8 (Hemi)', turbo: false },
        'SRT Hellcat': { engine: '6.2L V8 Supercharged (Hellcat)', turbo: false },
        'SRT Hellcat Redeye': { engine: '6.2L V8 Supercharged (Hellcat)', turbo: false },
        'SRT Hellcat Widebody': { engine: '6.2L V8 Supercharged (Hellcat)', turbo: false }
      }
    },
    'Durango': {
      years: [1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SXT': { engine: '3.6L V6', turbo: false },
        'GT': { engine: '3.6L V6', turbo: false },
        'Citadel': { engine: '5.7L V8', turbo: false },
        'R/T': { engine: '5.7L V8', turbo: false },
        'SRT': { engine: '6.4L V8', turbo: false }
      }
    },
    'Grand Caravan': {
      years: [1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      trims: {
        'SE': { engine: '3.6L V6', turbo: false },
        'SXT': { engine: '3.6L V6', turbo: false },
        'GT': { engine: '3.6L V6', turbo: false }
      }
    },
    'Journey': {
      years: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      trims: {
        'SE': { engine: '2.4L I4', turbo: false },
        'SXT': { engine: '3.6L V6', turbo: false },
        'Crossroad': { engine: '3.6L V6', turbo: false },
        'Limited': { engine: '3.6L V6', turbo: false }
      }
    }
  },
  'Ford': {
    'F-150': {
      years: [1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'XL': { engine: '2.7L V6 Turbo', turbo: true },
        'STX': { engine: '2.7L V6 Turbo', turbo: true },
        'XLT': { engine: '2.7L V6 Turbo', turbo: true },
        'Lariat': { engine: '2.7L V6 Turbo', turbo: true },
        'King Ranch': { engine: '3.5L V6 Turbo', turbo: true },
        'Platinum': { engine: '3.5L V6 Turbo', turbo: true },
        'Limited': { engine: '3.5L V6 Turbo', turbo: true },
        'Tremor': { engine: '5.0L V8', turbo: false },
        'Raptor': { engine: '3.5L V6 High Output Turbo', turbo: true }
      }
    },
    'Mustang': {
      years: [1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'EcoBoost': { engine: '2.3L I4 Turbo (EcoBoost)', turbo: true },
        'GT': { engine: '5.0L V8 (Coyote)', turbo: false },
        'Bullitt': { engine: '5.0L V8 (Coyote)', turbo: false },
        'Mach 1': { engine: '5.0L V8 (Coyote)', turbo: false },
        'Shelby GT350': { engine: '5.2L V8 (Voodoo)', turbo: false },
        'Shelby GT350R': { engine: '5.2L V8 (Voodoo)', turbo: false },
        'Shelby GT500': { engine: '5.2L V8 Supercharged (Predator)', turbo: false }
      }
    },
    'Explorer': {
      years: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '2.3L I4 Turbo', turbo: true },
        'XLT': { engine: '2.3L I4 Turbo', turbo: true },
        'Limited': { engine: '3.0L V6 Turbo', turbo: true },
        'Platinum': { engine: '3.0L V6 Turbo', turbo: true },
        'ST': { engine: '3.0L V6 Turbo', turbo: true },
        'Timberline': { engine: '2.3L I4 Turbo', turbo: true }
      }
    },
    'Escape': {
      years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'S': { engine: '1.5L I3 Turbo', turbo: true },
        'SE': { engine: '1.5L I3 Turbo', turbo: true },
        'SEL': { engine: '2.0L I4 Turbo', turbo: true },
        'Titanium': { engine: '2.0L I4 Turbo', turbo: true },
        'Plug-In Hybrid': { engine: '2.5L I4 Hybrid', turbo: false }
      }
    },
    'Edge': {
      years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SE': { engine: '2.0L I4 Turbo', turbo: true },
        'SEL': { engine: '2.0L I4 Turbo', turbo: true },
        'ST': { engine: '2.7L V6 Turbo', turbo: true },
        'Titanium': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Bronco': {
      years: [1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1996, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '2.3L I4 Turbo', turbo: true },
        'Big Bend': { engine: '2.3L I4 Turbo', turbo: true },
        'Black Diamond': { engine: '2.3L I4 Turbo', turbo: true },
        'Outer Banks': { engine: '2.3L I4 Turbo', turbo: true },
        'Badlands': { engine: '2.7L V6 Turbo', turbo: true },
        'Wildtrak': { engine: '2.7L V6 Turbo', turbo: true },
        'Raptor': { engine: '3.0L V6 Turbo', turbo: true }
      }
    },
    'Ranger': {
      years: [1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'XL': { engine: '2.3L I4 Turbo', turbo: true },
        'XLT': { engine: '2.3L I4 Turbo', turbo: true },
        'Lariat': { engine: '2.3L I4 Turbo', turbo: true },
        'Tremor': { engine: '2.3L I4 Turbo', turbo: true },
        'Raptor': { engine: '3.0L V6 Turbo', turbo: true }
      }
    },
    'Expedition': {
      years: [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'XL': { engine: '3.5L V6 Turbo', turbo: true },
        'XLT': { engine: '3.5L V6 Turbo', turbo: true },
        'Limited': { engine: '3.5L V6 Turbo', turbo: true },
        'Platinum': { engine: '3.5L V6 Turbo', turbo: true },
        'King Ranch': { engine: '3.5L V6 Turbo', turbo: true },
        'Timberline': { engine: '3.5L V6 Turbo', turbo: true }
      }
    },
    'F-250': {
      years: [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'XL': { engine: '6.2L V8', turbo: false },
        'XLT': { engine: '6.7L V8 Turbo Diesel', turbo: true },
        'Lariat': { engine: '6.7L V8 Turbo Diesel', turbo: true },
        'King Ranch': { engine: '6.7L V8 Turbo Diesel', turbo: true },
        'Platinum': { engine: '6.7L V8 Turbo Diesel', turbo: true },
        'Tremor': { engine: '6.7L V8 Turbo Diesel', turbo: true }
      }
    },
    'F-350': {
      years: [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'XL': { engine: '6.2L V8', turbo: false },
        'XLT': { engine: '6.7L V8 Turbo Diesel', turbo: true },
        'Lariat': { engine: '6.7L V8 Turbo Diesel', turbo: true },
        'King Ranch': { engine: '6.7L V8 Turbo Diesel', turbo: true },
        'Platinum': { engine: '6.7L V8 Turbo Diesel', turbo: true },
        'Tremor': { engine: '6.7L V8 Turbo Diesel', turbo: true }
      }
    },
    'Fusion': {
      years: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      trims: {
        'S': { engine: '2.5L I4', turbo: false },
        'SE': { engine: '1.5L I4 Turbo', turbo: true },
        'SEL': { engine: '1.5L I4 Turbo', turbo: true },
        'Titanium': { engine: '2.0L I4 Turbo', turbo: true },
        'Sport': { engine: '2.7L V6 Turbo', turbo: true },
        'Energi': { engine: '2.0L I4 Hybrid', turbo: false }
      }
    },
    'Taurus': {
      years: [1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
      trims: {
        'S': { engine: '3.5L V6', turbo: false },
        'SE': { engine: '3.5L V6', turbo: false },
        'SEL': { engine: '3.5L V6', turbo: false },
        'Limited': { engine: '3.5L V6', turbo: false },
        'SHO': { engine: '3.5L V6 Turbo', turbo: true }
      }
    }
  },
  'Chevrolet': {
    'Silverado': {
      years: [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Work Truck': { engine: '2.7L I4 Turbo', turbo: true },
        'Custom': { engine: '2.7L I4 Turbo', turbo: true },
        'Custom Trail Boss': { engine: '2.7L I4 Turbo', turbo: true },
        'LT': { engine: '2.7L I4 Turbo', turbo: true },
        'LT Trail Boss': { engine: '2.7L I4 Turbo', turbo: true },
        'RST': { engine: '5.3L V8', turbo: false },
        'LTZ': { engine: '5.3L V8', turbo: false },
        'High Country': { engine: '5.3L V8', turbo: false },
        'ZR2': { engine: '3.0L I6 Turbo Diesel', turbo: true }
      }
    },
    'Tahoe': {
      years: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LS': { engine: '5.3L V8', turbo: false },
        'LT': { engine: '5.3L V8', turbo: false },
        'RST': { engine: '5.3L V8', turbo: false },
        'Premier': { engine: '5.3L V8', turbo: false },
        'Z71': { engine: '5.3L V8', turbo: false },
        'High Country': { engine: '6.2L V8', turbo: false }
      }
    },
    'Suburban': {
      years: [1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LS': { engine: '5.3L V8', turbo: false },
        'LT': { engine: '5.3L V8', turbo: false },
        'RST': { engine: '5.3L V8', turbo: false },
        'Premier': { engine: '5.3L V8', turbo: false },
        'Z71': { engine: '5.3L V8', turbo: false },
        'High Country': { engine: '6.2L V8', turbo: false }
      }
    },
    'Camaro': {
      years: [1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LS': { engine: '2.0L I4 Turbo', turbo: true },
        'LT': { engine: '2.0L I4 Turbo', turbo: true },
        'LT 1LE': { engine: '2.0L I4 Turbo', turbo: true },
        'SS': { engine: '6.2L V8 (LT1)', turbo: false },
        'SS 1LE': { engine: '6.2L V8 (LT1)', turbo: false },
        'Z28': { engine: '7.0L V8 (LS7)', turbo: false },
        'ZL1': { engine: '6.2L V8 Supercharged (LT4)', turbo: false },
        'ZL1 1LE': { engine: '6.2L V8 Supercharged (LT4)', turbo: false }
      }
    },
    'Corvette': {
      years: [1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Stingray': { engine: '6.2L V8 (LT2)', turbo: false },
        'Z06': { engine: '5.5L V8 (LT6)', turbo: false },
        'ZR1': { engine: '5.5L V8 Supercharged (LT5)', turbo: false },
        'Grand Sport': { engine: '6.2L V8 (LT1)', turbo: false }
      }
    },
    'Equinox': {
      years: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'L': { engine: '1.5L I4 Turbo', turbo: true },
        'LS': { engine: '1.5L I4 Turbo', turbo: true },
        'LT': { engine: '1.5L I4 Turbo', turbo: true },
        'Premier': { engine: '2.0L I4 Turbo', turbo: true },
        'RS': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Malibu': {
      years: [1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'L': { engine: '1.5L I4 Turbo', turbo: true },
        'LS': { engine: '1.5L I4 Turbo', turbo: true },
        'RS': { engine: '2.0L I4 Turbo', turbo: true },
        'LT': { engine: '1.5L I4 Turbo', turbo: true },
        'Premier': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Blazer': {
      years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'L': { engine: '2.5L I4', turbo: false },
        'LT': { engine: '2.0L I4 Turbo', turbo: true },
        'RS': { engine: '2.0L I4 Turbo', turbo: true },
        'Premier': { engine: '3.6L V6', turbo: false }
      }
    },
    'Cruze': {
      years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
      trims: {
        'L': { engine: '1.4L I4 Turbo', turbo: true },
        'LS': { engine: '1.4L I4 Turbo', turbo: true },
        'LT': { engine: '1.4L I4 Turbo', turbo: true },
        'Premier': { engine: '1.4L I4 Turbo', turbo: true },
        'Diesel': { engine: '1.6L I4 Turbo Diesel', turbo: true }
      }
    },
    'Impala': {
      years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      trims: {
        'LS': { engine: '2.5L I4', turbo: false },
        'LT': { engine: '3.6L V6', turbo: false },
        'LTZ': { engine: '3.6L V6', turbo: false },
        'Premier': { engine: '3.6L V6', turbo: false }
      }
    },
    'Traverse': {
      years: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'L': { engine: '3.6L V6', turbo: false },
        'LS': { engine: '3.6L V6', turbo: false },
        'LT': { engine: '3.6L V6', turbo: false },
        'Premier': { engine: '3.6L V6', turbo: false },
        'RS': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Colorado': {
      years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Work Truck': { engine: '2.7L I4 TurboMax', turbo: true },
        'LT': { engine: '2.7L I4 TurboMax', turbo: true },
        'Trail Boss': { engine: '2.7L I4 TurboMax', turbo: true },
        'Z71': { engine: '2.7L I4 TurboMax', turbo: true },
        'ZR2': { engine: '2.7L I4 TurboMax', turbo: true }
      }
    },
    'Trailblazer': {
      years: [2021, 2022, 2023, 2024, 2025],
      trims: {
        'LS': { engine: '1.2L I3 Turbo', turbo: true },
        'LT': { engine: '1.2L I3 Turbo', turbo: true },
        'RS': { engine: '1.3L I3 Turbo', turbo: true },
        'ACTIV': { engine: '1.3L I3 Turbo', turbo: true }
      }
    },
    'Trax': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LS': { engine: '1.2L I3 Turbo', turbo: true },
        '1RS': { engine: '1.2L I3 Turbo', turbo: true },
        'LT': { engine: '1.2L I3 Turbo', turbo: true },
        '2RS': { engine: '1.2L I3 Turbo', turbo: true },
        'ACTIV': { engine: '1.2L I3 Turbo', turbo: true }
      }
    },
    'Bolt EV': {
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LT': { engine: 'Electric', turbo: false },
        'Premier': { engine: 'Electric', turbo: false },
        'EUV LT': { engine: 'Electric', turbo: false },
        'EUV Premier': { engine: 'Electric', turbo: false }
      }
    },
    'Blazer EV': {
      years: [2024, 2025],
      trims: {
        'LT': { engine: 'Electric', turbo: false },
        'RS': { engine: 'Electric', turbo: false },
        'SS': { engine: 'Electric', turbo: false }
      }
    },
    'Equinox EV': {
      years: [2024, 2025],
      trims: {
        '1LT': { engine: 'Electric', turbo: false },
        '2LT': { engine: 'Electric', turbo: false },
        '3LT': { engine: 'Electric', turbo: false },
        '2RS': { engine: 'Electric', turbo: false }
      }
    },
    'Silverado EV': {
      years: [2024, 2025],
      trims: {
        'WT': { engine: 'Electric', turbo: false },
        'RST': { engine: 'Electric', turbo: false },
        'RST First Edition': { engine: 'Electric', turbo: false }
      }
    },
    'Silverado 2500HD': {
      years: [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Work Truck': { engine: '6.6L V8', turbo: false },
        'Custom': { engine: '6.6L V8', turbo: false },
        'LT': { engine: '6.6L V8', turbo: false },
        'LTZ': { engine: '6.6L V8', turbo: false },
        'High Country': { engine: '6.6L V8', turbo: false }
      }
    },
    'Silverado 3500HD': {
      years: [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Work Truck': { engine: '6.6L V8', turbo: false },
        'Custom': { engine: '6.6L V8', turbo: false },
        'LT': { engine: '6.6L V8', turbo: false },
        'LTZ': { engine: '6.6L V8', turbo: false },
        'High Country': { engine: '6.6L V8', turbo: false }
      }
    }
  },
  'Toyota': {
    'Camry': {
      years: [1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'L': { engine: '2.5L I4', turbo: false },
        'LE': { engine: '2.5L I4', turbo: false },
        'SE': { engine: '2.5L I4', turbo: false },
        'XLE': { engine: '2.5L I4', turbo: false },
        'XSE': { engine: '2.5L I4', turbo: false },
        'TRD': { engine: '3.5L V6', turbo: false },
        'V6': { engine: '3.5L V6', turbo: false },
        'Hybrid LE': { engine: '2.5L I4 Hybrid', turbo: false },
        'Hybrid SE': { engine: '2.5L I4 Hybrid', turbo: false },
        'Hybrid XLE': { engine: '2.5L I4 Hybrid', turbo: false }
      }
    },
    'Corolla': {
      years: [1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'L': { engine: '1.8L I4', turbo: false },
        'LE': { engine: '1.8L I4', turbo: false },
        'SE': { engine: '2.0L I4', turbo: false },
        'XLE': { engine: '2.0L I4', turbo: false },
        'XSE': { engine: '2.0L I4', turbo: false },
        'GR': { engine: '1.6L I3 Turbo', turbo: true },
        'Hybrid LE': { engine: '1.8L I4 Hybrid', turbo: false },
        'Hybrid XLE': { engine: '1.8L I4 Hybrid', turbo: false }
      }
    },
    'RAV4': {
      years: [1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LE': { engine: '2.5L I4', turbo: false },
        'XLE': { engine: '2.5L I4', turbo: false },
        'XLE Premium': { engine: '2.5L I4', turbo: false },
        'Limited': { engine: '2.5L I4', turbo: false },
        'Adventure': { engine: '2.5L I4', turbo: false },
        'TRD Off-Road': { engine: '2.5L I4', turbo: false },
        'Prime': { engine: '2.5L I4 Hybrid', turbo: false },
        'Hybrid LE': { engine: '2.5L I4 Hybrid', turbo: false },
        'Hybrid XLE': { engine: '2.5L I4 Hybrid', turbo: false },
        'Hybrid XSE': { engine: '2.5L I4 Hybrid', turbo: false },
        'Hybrid Limited': { engine: '2.5L I4 Hybrid', turbo: false }
      }
    },
    'Highlander': {
      years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'L': { engine: '3.5L V6', turbo: false },
        'LE': { engine: '3.5L V6', turbo: false },
        'XLE': { engine: '3.5L V6', turbo: false },
        'Limited': { engine: '3.5L V6', turbo: false },
        'Platinum': { engine: '3.5L V6', turbo: false },
        'Hybrid LE': { engine: '2.5L I4 Hybrid', turbo: false },
        'Hybrid XLE': { engine: '2.5L I4 Hybrid', turbo: false },
        'Hybrid Limited': { engine: '2.5L I4 Hybrid', turbo: false },
        'Hybrid Platinum': { engine: '2.5L I4 Hybrid', turbo: false }
      }
    },
    '4Runner': {
      years: [1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'SR5': { engine: '4.0L V6', turbo: false },
        'TRD Off-Road': { engine: '4.0L V6', turbo: false },
        'TRD Pro': { engine: '4.0L V6', turbo: false },
        'Limited': { engine: '4.0L V6', turbo: false },
        'Nightshade': { engine: '4.0L V6', turbo: false }
      }
    },
    'Tacoma': {
      years: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'SR': { engine: '2.7L I4', turbo: false },
        'SR5': { engine: '3.5L V6', turbo: false },
        'TRD Sport': { engine: '3.5L V6', turbo: false },
        'TRD Off-Road': { engine: '3.5L V6', turbo: false },
        'Limited': { engine: '3.5L V6', turbo: false },
        'TRD Pro': { engine: '3.5L V6', turbo: false }
      }
    },
    'Tundra': {
      years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SR': { engine: '3.5L V6 Turbo', turbo: true },
        'SR5': { engine: '3.5L V6 Turbo', turbo: true },
        'Limited': { engine: '3.5L V6 Turbo', turbo: true },
        'Platinum': { engine: '3.5L V6 Turbo', turbo: true },
        '1794 Edition': { engine: '3.5L V6 Turbo', turbo: true },
        'TRD Pro': { engine: '3.5L V6 Turbo', turbo: true },
        'Capstone': { engine: '3.5L V6 Turbo Hybrid', turbo: true }
      }
    },
    'Avalon': {
      years: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
      trims: {
        'XLE': { engine: '3.5L V6', turbo: false },
        'XSE': { engine: '3.5L V6', turbo: false },
        'Limited': { engine: '3.5L V6', turbo: false },
        'Touring': { engine: '3.5L V6', turbo: false },
        'Hybrid XLE': { engine: '2.5L I4 Hybrid', turbo: false },
        'Hybrid XSE': { engine: '2.5L I4 Hybrid', turbo: false },
        'Hybrid Limited': { engine: '2.5L I4 Hybrid', turbo: false }
      }
    },
    'Prius': {
      years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'L Eco': { engine: '1.8L I4 Hybrid', turbo: false },
        'LE': { engine: '1.8L I4 Hybrid', turbo: false },
        'XLE': { engine: '1.8L I4 Hybrid', turbo: false },
        'Limited': { engine: '1.8L I4 Hybrid', turbo: false },
        'Prime': { engine: '1.8L I4 Plug-in Hybrid', turbo: false }
      }
    },
    'Sequoia': {
      years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SR5': { engine: '5.7L V8', turbo: false },
        'Limited': { engine: '5.7L V8', turbo: false },
        'Platinum': { engine: '5.7L V8', turbo: false },
        'TRD Pro': { engine: '5.7L V8', turbo: false },
        'Capstone': { engine: '3.5L V6 Turbo Hybrid', turbo: true }
      }
    },
    'Sienna': {
      years: [1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'LE': { engine: '2.5L I4 Hybrid', turbo: false },
        'XLE': { engine: '2.5L I4 Hybrid', turbo: false },
        'XSE': { engine: '2.5L I4 Hybrid', turbo: false },
        'Limited': { engine: '2.5L I4 Hybrid', turbo: false },
        'Platinum': { engine: '2.5L I4 Hybrid', turbo: false },
        'Woodland': { engine: '2.5L I4 Hybrid', turbo: false }
      }
    }
  },
  'Acura': {
    'Integra': {
      years: [1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2006, 2022, 2023, 2024],
      trims: {
        'RS': { engine: '1.8L I4', turbo: false },
        'LS': { engine: '1.8L I4', turbo: false },
        'GS': { engine: '1.8L I4', turbo: false },
        'GS-R': { engine: '1.8L I4 (B18C1)', turbo: false },
        'Type R': { engine: '1.8L I4 (B18C5)', turbo: false },
        'A-Spec': { engine: '1.5L I4 Turbo', turbo: true },
        'Type S': { engine: '1.5L I4 Turbo', turbo: true }
      }
    },
    'MDX': {
      years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '3.5L V6', turbo: false },
        'Technology': { engine: '3.5L V6', turbo: false },
        'Advance': { engine: '3.5L V6', turbo: false },
        'A-Spec': { engine: '3.5L V6', turbo: false },
        'Type S': { engine: '3.0L V6 Turbo', turbo: true }
      }
    },
    'RDX': {
      years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '2.0L I4 Turbo', turbo: true },
        'Technology': { engine: '2.0L I4 Turbo', turbo: true },
        'A-Spec': { engine: '2.0L I4 Turbo', turbo: true },
        'Advance': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'TLX': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '2.4L I4', turbo: false },
        'Technology': { engine: '2.4L I4', turbo: false },
        'A-Spec': { engine: '2.4L I4', turbo: false },
        'Advance': { engine: '3.5L V6', turbo: false },
        'Type S': { engine: '3.0L V6 Turbo', turbo: true }
      }
    },
    'ILX': {
      years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
      trims: {
        'Base': { engine: '2.4L I4', turbo: false },
        'Premium': { engine: '2.4L I4', turbo: false },
        'A-Spec': { engine: '2.4L I4', turbo: false }
      }
    },
    'RLX': {
      years: [2014, 2015, 2016, 2017, 2018, 2019, 2020],
      trims: {
        'Base': { engine: '3.5L V6', turbo: false },
        'Technology': { engine: '3.5L V6', turbo: false },
        'Advance': { engine: '3.5L V6 Hybrid', turbo: false },
        'Sport Hybrid': { engine: '3.5L V6 Hybrid', turbo: false }
      }
    },
    'TL': {
      years: [1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
      trims: {
        'Base': { engine: '3.2L V6', turbo: false },
        'Type-S': { engine: '3.5L V6', turbo: false },
        'SH-AWD': { engine: '3.7L V6', turbo: false }
      }
    }
  },
  'Audi': {
    'A3': {
      years: [1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Premium': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium Plus': { engine: '2.0L I4 Turbo', turbo: true },
        'S3': { engine: '2.0L I4 Turbo (EA888)', turbo: true },
        'RS 3': { engine: '2.5L I5 Turbo (EA855)', turbo: true }
      }
    },
    'A4': {
      years: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Premium': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium Plus': { engine: '2.0L I4 Turbo', turbo: true },
        'Prestige': { engine: '2.0L I4 Turbo', turbo: true },
        'S4': { engine: '3.0L V6 Turbo (EA839)', turbo: true },
        'RS 4': { engine: '2.9L V6 Turbo (EA839)', turbo: true }
      }
    },
    'A5': {
      years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Premium': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium Plus': { engine: '2.0L I4 Turbo', turbo: true },
        'Prestige': { engine: '2.0L I4 Turbo', turbo: true },
        'S5': { engine: '3.0L V6 Turbo (EA839)', turbo: true },
        'RS 5': { engine: '2.9L V6 Turbo (EA839)', turbo: true }
      }
    },
    'A6': {
      years: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'Premium': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium Plus': { engine: '3.0L V6 Turbo', turbo: true },
        'Prestige': { engine: '3.0L V6 Turbo', turbo: true },
        'S6': { engine: '4.0L V8 Turbo (EA825)', turbo: true },
        'RS 6': { engine: '4.0L V8 Turbo (EA825)', turbo: true }
      }
    },
    'A7': {
      years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Premium': { engine: '3.0L V6 Turbo', turbo: true },
        'Premium Plus': { engine: '3.0L V6 Turbo', turbo: true },
        'Prestige': { engine: '3.0L V6 Turbo', turbo: true },
        'S7': { engine: '4.0L V8 Turbo (EA825)', turbo: true },
        'RS 7': { engine: '4.0L V8 Turbo (EA825)', turbo: true }
      }
    },
    'A8': {
      years: [1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'L': { engine: '3.0L V6 Turbo', turbo: true },
        'L 55': { engine: '4.0L V8 Turbo', turbo: true },
        'S8': { engine: '4.0L V8 Turbo (EA825)', turbo: true }
      }
    },
    'Q3': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Premium': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium Plus': { engine: '2.0L I4 Turbo', turbo: true },
        'RS Q3': { engine: '2.5L I5 Turbo (EA855)', turbo: true }
      }
    },
    'Q5': {
      years: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Premium': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium Plus': { engine: '2.0L I4 Turbo', turbo: true },
        'Prestige': { engine: '2.0L I4 Turbo', turbo: true },
        'SQ5': { engine: '3.0L V6 Turbo (EA839)', turbo: true }
      }
    },
    'Q7': {
      years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Premium': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium Plus': { engine: '3.0L V6 Turbo', turbo: true },
        'Prestige': { engine: '3.0L V6 Turbo', turbo: true },
        'SQ7': { engine: '4.0L V8 Turbo (EA825)', turbo: true }
      }
    },
    'Q8': {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Premium': { engine: '3.0L V6 Turbo', turbo: true },
        'Premium Plus': { engine: '3.0L V6 Turbo', turbo: true },
        'Prestige': { engine: '3.0L V6 Turbo', turbo: true },
        'SQ8': { engine: '4.0L V8 Turbo (EA825)', turbo: true },
        'RS Q8': { engine: '4.0L V8 Turbo (EA825)', turbo: true }
      }
    },
    'TT': {
      years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2023],
      trims: {
        'Base': { engine: '2.0L I4 Turbo', turbo: true },
        'S': { engine: '2.0L I4 Turbo (EA888)', turbo: true },
        'RS': { engine: '2.5L I5 Turbo (EA855)', turbo: true }
      }
    }
  },
  'BMW': {
    '3 Series': {
      years: [1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        '320i': { engine: '2.0L I4 Turbo', turbo: true },
        '330i': { engine: '2.0L I4 Turbo', turbo: true },
        'M340i': { engine: '3.0L I6 Turbo', turbo: true },
        'M3': { engine: '3.0L I6 Turbo (S58)', turbo: true },
        'M3 Competition': { engine: '3.0L I6 Turbo (S58)', turbo: true }
      }
    },
    '4 Series': {
      years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        '430i': { engine: '2.0L I4 Turbo', turbo: true },
        '440i': { engine: '3.0L I6 Turbo', turbo: true },
        'M440i': { engine: '3.0L I6 Turbo', turbo: true },
        'M4': { engine: '3.0L I6 Turbo (S58)', turbo: true },
        'M4 Competition': { engine: '3.0L I6 Turbo (S58)', turbo: true }
      }
    },
    '2 Series': {
      years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        '228i': { engine: '2.0L I4 Turbo', turbo: true },
        '230i': { engine: '2.0L I4 Turbo', turbo: true },
        'M235i': { engine: '3.0L I6 Turbo', turbo: true },
        'M240i': { engine: '3.0L I6 Turbo', turbo: true },
        'M2': { engine: '3.0L I6 Turbo (S55/S58)', turbo: true },
        'M2 Competition': { engine: '3.0L I6 Turbo (S55)', turbo: true }
      }
    },
    '5 Series': {
      years: [1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        '530i': { engine: '2.0L I4 Turbo', turbo: true },
        '540i': { engine: '3.0L I6 Turbo', turbo: true },
        'M550i': { engine: '4.4L V8 Turbo', turbo: true },
        'M5': { engine: '4.4L V8 Turbo (S63)', turbo: true },
        'M5 Competition': { engine: '4.4L V8 Turbo (S63)', turbo: true }
      }
    },
    '7 Series': {
      years: [1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        '740i': { engine: '3.0L I6 Turbo', turbo: true },
        '750i': { engine: '4.4L V8 Turbo', turbo: true },
        'M760i': { engine: '6.6L V12 Turbo', turbo: true }
      }
    },
    'X3': {
      years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'xDrive30i': { engine: '2.0L I4 Turbo', turbo: true },
        'M40i': { engine: '3.0L I6 Turbo', turbo: true },
        'X3 M': { engine: '3.0L I6 Turbo (S58)', turbo: true },
        'X3 M Competition': { engine: '3.0L I6 Turbo (S58)', turbo: true }
      }
    },
    'X5': {
      years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'xDrive40i': { engine: '3.0L I6 Turbo', turbo: true },
        'xDrive50i': { engine: '4.4L V8 Turbo', turbo: true },
        'M50i': { engine: '4.4L V8 Turbo', turbo: true },
        'X5 M': { engine: '4.4L V8 Turbo (S63)', turbo: true },
        'X5 M Competition': { engine: '4.4L V8 Turbo (S63)', turbo: true }
      }
    },
    'X6': {
      years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'xDrive40i': { engine: '3.0L I6 Turbo', turbo: true },
        'xDrive50i': { engine: '4.4L V8 Turbo', turbo: true },
        'M50i': { engine: '4.4L V8 Turbo', turbo: true },
        'X6 M': { engine: '4.4L V8 Turbo (S63)', turbo: true },
        'X6 M Competition': { engine: '4.4L V8 Turbo (S63)', turbo: true }
      }
    },
    'X7': {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'xDrive40i': { engine: '3.0L I6 Turbo', turbo: true },
        'xDrive50i': { engine: '4.4L V8 Turbo', turbo: true },
        'M50i': { engine: '4.4L V8 Turbo', turbo: true },
        'M60i': { engine: '4.4L V8 Turbo', turbo: true }
      }
    },
    '8 Series': {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        '840i': { engine: '3.0L I6 Turbo', turbo: true },
        '850i': { engine: '4.4L V8 Turbo', turbo: true },
        'M850i': { engine: '4.4L V8 Turbo', turbo: true },
        'M8': { engine: '4.4L V8 Turbo (S63)', turbo: true },
        'M8 Competition': { engine: '4.4L V8 Turbo (S63)', turbo: true }
      }
    },
    'X1': {
      years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'sDrive28i': { engine: '2.0L I4 Turbo', turbo: true },
        'xDrive28i': { engine: '2.0L I4 Turbo', turbo: true },
        'M35i': { engine: '2.0L I4 Turbo', turbo: true }
      }
    }
  },
  'Buick': {
    'Enclave': {
      years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Essence': { engine: '3.6L V6', turbo: false },
        'Premium': { engine: '3.6L V6', turbo: false },
        'Avenir': { engine: '3.6L V6', turbo: false }
      }
    },
    'Encore': {
      years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
      trims: {
        'Essence': { engine: '1.4L I4 Turbo', turbo: true },
        'Preferred': { engine: '1.4L I4 Turbo', turbo: true },
        'Sport Touring': { engine: '1.4L I4 Turbo', turbo: true }
      }
    },
    'Envision': {
      years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Essence': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium': { engine: '2.0L I4 Turbo', turbo: true },
        'Avenir': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'LaCrosse': {
      years: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
      trims: {
        'Base': { engine: '3.6L V6', turbo: false },
        'Premium': { engine: '3.6L V6', turbo: false },
        'Essence': { engine: '3.6L V6', turbo: false },
        'Avenir': { engine: '3.6L V6', turbo: false }
      }
    },
    'Regal': {
      years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      trims: {
        'Base': { engine: '2.0L I4 Turbo', turbo: true },
        'GS': { engine: '2.0L I4 Turbo', turbo: true },
        'TourX': { engine: '2.0L I4 Turbo', turbo: true }
      }
    }
  },
  'Cadillac': {
    'XT5': {
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Luxury': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium Luxury': { engine: '3.6L V6', turbo: false },
        'Sport': { engine: '3.6L V6', turbo: false },
        'Platinum': { engine: '3.6L V6', turbo: false }
      }
    },
    'XT4': {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Luxury': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium Luxury': { engine: '2.0L I4 Turbo', turbo: true },
        'Sport': { engine: '2.0L I4 Turbo', turbo: true },
        'Platinum': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Escalade': {
      years: [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Luxury': { engine: '6.2L V8', turbo: false },
        'Premium Luxury': { engine: '6.2L V8', turbo: false },
        'Sport': { engine: '6.2L V8', turbo: false },
        'Platinum': { engine: '6.2L V8', turbo: false }
      }
    },
    'ATS': {
      years: [2013, 2014, 2015, 2016, 2017, 2018, 2019],
      trims: {
        'Base': { engine: '2.0L I4 Turbo', turbo: true },
        'Luxury': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium': { engine: '2.0L I4 Turbo', turbo: true },
        'V-Sport': { engine: '3.6L V6 Turbo', turbo: true },
        'V': { engine: '3.6L V6 Turbo', turbo: true }
      }
    },
    'CT4': {
      years: [2020, 2021, 2022, 2023, 2024],
      trims: {
        'Luxury': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium Luxury': { engine: '2.0L I4 Turbo', turbo: true },
        'Sport': { engine: '2.7L I4 Turbo', turbo: true },
        'V': { engine: '2.7L I4 Turbo', turbo: true },
        'V-Blackwing': { engine: '3.6L V6 Turbo', turbo: true }
      }
    },
    'CT5': {
      years: [2020, 2021, 2022, 2023, 2024],
      trims: {
        'Luxury': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium Luxury': { engine: '3.0L V6 Turbo', turbo: true },
        'Sport': { engine: '3.0L V6 Turbo', turbo: true },
        'V': { engine: '3.0L V6 Turbo', turbo: true },
        'V-Blackwing': { engine: '6.2L V8 Supercharged', turbo: false }
      }
    },
    'CT6': {
      years: [2016, 2017, 2018, 2019, 2020],
      trims: {
        'Luxury': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium Luxury': { engine: '3.6L V6', turbo: false },
        'Platinum': { engine: '3.0L V6 Turbo', turbo: true },
        'V-Sport': { engine: '4.2L V8 Turbo', turbo: true }
      }
    },
    'XT6': {
      years: [2020, 2021, 2022, 2023, 2024],
      trims: {
        'Luxury': { engine: '3.6L V6', turbo: false },
        'Premium Luxury': { engine: '3.6L V6', turbo: false },
        'Sport': { engine: '3.6L V6', turbo: false },
        'Platinum': { engine: '3.6L V6', turbo: false }
      }
    }
  },
  'Chrysler': {
    '300': {
      years: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Touring': { engine: '3.6L V6', turbo: false },
        'Limited': { engine: '3.6L V6', turbo: false },
        'S': { engine: '5.7L V8', turbo: false },
        'C': { engine: '6.4L V8', turbo: false }
      }
    },
    'Pacifica': {
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Touring': { engine: '3.6L V6', turbo: false },
        'Touring L': { engine: '3.6L V6', turbo: false },
        'Limited': { engine: '3.6L V6', turbo: false },
        'Pinnacle': { engine: '3.6L V6', turbo: false },
        'Plug-In Hybrid': { engine: '3.6L V6 Hybrid', turbo: false }
      }
    },
    'Voyager': {
      years: [2020, 2021, 2022, 2023, 2024],
      trims: {
        'L': { engine: '3.6L V6', turbo: false },
        'LX': { engine: '3.6L V6', turbo: false },
        'Touring': { engine: '3.6L V6', turbo: false }
      }
    }
  },
  'GMC': {
    'Sierra': {
      years: [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SLE': { engine: '4.3L V6', turbo: false },
        'Elevation': { engine: '2.7L I4 Turbo', turbo: true },
        'SLT': { engine: '5.3L V8', turbo: false },
        'AT4': { engine: '5.3L V8', turbo: false },
        'Denali': { engine: '6.2L V8', turbo: false }
      }
    },
    'Yukon': {
      years: [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SLE': { engine: '5.3L V8', turbo: false },
        'SLT': { engine: '5.3L V8', turbo: false },
        'AT4': { engine: '5.3L V8', turbo: false },
        'Denali': { engine: '6.2L V8', turbo: false }
      }
    },
    'Acadia': {
      years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SLE': { engine: '2.0L I4 Turbo', turbo: true },
        'SLT': { engine: '3.6L V6', turbo: false },
        'AT4': { engine: '3.6L V6', turbo: false },
        'Denali': { engine: '3.6L V6', turbo: false }
      }
    },
    'Terrain': {
      years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SLE': { engine: '1.5L I4 Turbo', turbo: true },
        'SLT': { engine: '2.0L I4 Turbo', turbo: true },
        'Denali': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Canyon': {
      years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SLE': { engine: '2.5L I4', turbo: false },
        'SLT': { engine: '3.6L V6', turbo: false },
        'Denali': { engine: '3.6L V6', turbo: false }
      }
    }
  },
  'Hyundai': {
    'Elantra': {
      years: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SE': { engine: '2.0L I4', turbo: false },
        'SEL': { engine: '2.0L I4', turbo: false },
        'Limited': { engine: '2.0L I4', turbo: false },
        'N Line': { engine: '1.6L I4 Turbo', turbo: true },
        'N': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Sonata': {
      years: [1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SE': { engine: '2.5L I4', turbo: false },
        'SEL': { engine: '2.5L I4', turbo: false },
        'Limited': { engine: '1.6L I4 Turbo', turbo: true },
        'N Line': { engine: '2.5L I4 Turbo', turbo: true }
      }
    },
    'Santa Fe': {
      years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SE': { engine: '2.5L I4 Turbo', turbo: true },
        'SEL': { engine: '2.5L I4 Turbo', turbo: true },
        'Limited': { engine: '2.5L I4 Turbo', turbo: true },
        'Calligraphy': { engine: '2.5L I4 Turbo', turbo: true }
      }
    },
    'Tucson': {
      years: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SE': { engine: '2.5L I4', turbo: false },
        'SEL': { engine: '2.5L I4', turbo: false },
        'Limited': { engine: '1.6L I4 Turbo', turbo: true },
        'N Line': { engine: '2.5L I4 Turbo', turbo: true }
      }
    },
    'Palisade': {
      years: [2020, 2021, 2022, 2023, 2024],
      trims: {
        'SE': { engine: '3.8L V6', turbo: false },
        'SEL': { engine: '3.8L V6', turbo: false },
        'Limited': { engine: '3.8L V6', turbo: false },
        'Calligraphy': { engine: '3.8L V6', turbo: false }
      }
    },
    'Kona': {
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SE': { engine: '2.0L I4', turbo: false },
        'SEL': { engine: '2.0L I4', turbo: false },
        'Limited': { engine: '1.6L I4 Turbo', turbo: true },
        'N Line': { engine: '1.6L I4 Turbo', turbo: true },
        'N': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Venue': {
      years: [2020, 2021, 2022, 2023, 2024],
      trims: {
        'SE': { engine: '1.6L I4', turbo: false },
        'SEL': { engine: '1.6L I4', turbo: false },
        'Limited': { engine: '1.6L I4', turbo: false }
      }
    }
  },
  'Jeep': {
    'Wrangler': {
      years: [1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Sport': { engine: '3.6L V6', turbo: false },
        'Sahara': { engine: '3.6L V6', turbo: false },
        'Rubicon': { engine: '3.6L V6', turbo: false },
        '4xe': { engine: '2.0L I4 Turbo Hybrid', turbo: true },
        '392': { engine: '6.4L V8', turbo: false }
      }
    },
    'Grand Cherokee': {
      years: [1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Laredo': { engine: '3.6L V6', turbo: false },
        'Limited': { engine: '3.6L V6', turbo: false },
        'Trailhawk': { engine: '3.6L V6', turbo: false },
        'Overland': { engine: '5.7L V8', turbo: false },
        'Summit': { engine: '5.7L V8', turbo: false },
        'SRT': { engine: '6.4L V8', turbo: false }
      }
    },
    'Cherokee': {
      years: [1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Latitude': { engine: '2.4L I4', turbo: false },
        'Limited': { engine: '2.4L I4', turbo: false },
        'Trailhawk': { engine: '2.0L I4 Turbo', turbo: true },
        'Trailhawk Elite': { engine: '3.2L V6', turbo: false }
      }
    },
    'Compass': {
      years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Sport': { engine: '2.4L I4', turbo: false },
        'Latitude': { engine: '2.4L I4', turbo: false },
        'Limited': { engine: '2.4L I4', turbo: false },
        'Trailhawk': { engine: '2.4L I4', turbo: false }
      }
    },
    'Renegade': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Sport': { engine: '2.4L I4', turbo: false },
        'Latitude': { engine: '2.4L I4', turbo: false },
        'Limited': { engine: '1.3L I4 Turbo', turbo: true },
        'Trailhawk': { engine: '2.4L I4', turbo: false }
      }
    }
  },
  'Kia': {
    'Forte': {
      years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'FE': { engine: '2.0L I4', turbo: false },
        'LXS': { engine: '2.0L I4', turbo: false },
        'GT-Line': { engine: '2.0L I4', turbo: false },
        'GT': { engine: '1.6L I4 Turbo', turbo: true }
      }
    },
    'K5': {
      years: [2021, 2022, 2023, 2024],
      trims: {
        'LX': { engine: '2.5L I4', turbo: false },
        'LXS': { engine: '2.5L I4', turbo: false },
        'GT-Line': { engine: '2.5L I4', turbo: false },
        'GT': { engine: '2.5L I4 Turbo', turbo: true }
      }
    },
    'Sportage': {
      years: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'LX': { engine: '2.5L I4', turbo: false },
        'EX': { engine: '2.5L I4', turbo: false },
        'SX': { engine: '2.5L I4 Turbo', turbo: true },
        'X-Pro': { engine: '2.5L I4 Turbo', turbo: true }
      }
    },
    'Sorento': {
      years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'LX': { engine: '2.5L I4 Turbo', turbo: true },
        'S': { engine: '2.5L I4 Turbo', turbo: true },
        'EX': { engine: '2.5L I4 Turbo', turbo: true },
        'SX': { engine: '2.5L I4 Turbo', turbo: true },
        'X-Line': { engine: '2.5L I4 Turbo', turbo: true }
      }
    },
    'Telluride': {
      years: [2020, 2021, 2022, 2023, 2024],
      trims: {
        'LX': { engine: '3.8L V6', turbo: false },
        'S': { engine: '3.8L V6', turbo: false },
        'EX': { engine: '3.8L V6', turbo: false },
        'SX': { engine: '3.8L V6', turbo: false },
        'X-Line': { engine: '3.8L V6', turbo: false },
        'X-Pro': { engine: '3.8L V6', turbo: false }
      }
    },
    'Optima': {
      years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      trims: {
        'LX': { engine: '2.4L I4', turbo: false },
        'EX': { engine: '2.4L I4', turbo: false },
        'SX': { engine: '2.0L I4 Turbo', turbo: true },
        'SXL': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Seltos': {
      years: [2021, 2022, 2023, 2024],
      trims: {
        'LX': { engine: '2.0L I4', turbo: false },
        'S': { engine: '2.0L I4', turbo: false },
        'EX': { engine: '1.6L I4 Turbo', turbo: true },
        'SX': { engine: '1.6L I4 Turbo', turbo: true },
        'X-Line': { engine: '1.6L I4 Turbo', turbo: true }
      }
    }
  },
  'Lexus': {
    'RX': {
      years: [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '3.5L V6', turbo: false },
        'Premium': { engine: '3.5L V6', turbo: false },
        'F Sport': { engine: '3.5L V6', turbo: false },
        'Luxury': { engine: '3.5L V6', turbo: false },
        'Hybrid': { engine: '3.5L V6 Hybrid', turbo: false }
      }
    },
    'ES': {
      years: [1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '3.5L V6', turbo: false },
        'Premium': { engine: '3.5L V6', turbo: false },
        'Luxury': { engine: '3.5L V6', turbo: false },
        'F Sport': { engine: '3.5L V6', turbo: false },
        'Hybrid': { engine: '2.5L I4 Hybrid', turbo: false }
      }
    },
    'IS': {
      years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '2.0L I4 Turbo', turbo: true },
        'F Sport': { engine: '2.0L I4 Turbo', turbo: true },
        '350': { engine: '3.5L V6', turbo: false },
        '500 F Sport': { engine: '3.5L V6 Turbo', turbo: true }
      }
    },
    'NX': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '2.0L I4 Turbo', turbo: true },
        'Premium': { engine: '2.0L I4 Turbo', turbo: true },
        'F Sport': { engine: '2.0L I4 Turbo', turbo: true },
        'Luxury': { engine: '2.0L I4 Turbo', turbo: true },
        'Hybrid': { engine: '2.5L I4 Hybrid', turbo: false }
      }
    },
    'GX': {
      years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '4.6L V8', turbo: false },
        'Premium': { engine: '4.6L V8', turbo: false },
        'Luxury': { engine: '4.6L V8', turbo: false }
      }
    },
    'GS': {
      years: [1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      trims: {
        'Base': { engine: '3.5L V6', turbo: false },
        'F Sport': { engine: '3.5L V6', turbo: false },
        '350': { engine: '3.5L V6', turbo: false },
        '450h': { engine: '3.5L V6 Hybrid', turbo: false }
      }
    },
    'LS': {
      years: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
      trims: {
        'Base': { engine: '3.5L V6 Turbo', turbo: true },
        'F Sport': { engine: '3.5L V6 Turbo', turbo: true },
        'Luxury': { engine: '3.5L V6 Turbo', turbo: true },
        '500': { engine: '3.5L V6 Turbo', turbo: true }
      }
    },
    'UX': {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '2.0L I4', turbo: false },
        'F Sport': { engine: '2.0L I4', turbo: false },
        'Luxury': { engine: '2.0L I4', turbo: false },
        'Hybrid': { engine: '2.0L I4 Hybrid', turbo: false }
      }
    }
  },
  'Lincoln': {
    'Navigator': {
      years: [1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '3.5L V6 Turbo', turbo: true },
        'Reserve': { engine: '3.5L V6 Turbo', turbo: true },
        'Black Label': { engine: '3.5L V6 Turbo', turbo: true }
      }
    },
    'Aviator': {
      years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '3.0L V6 Turbo', turbo: true },
        'Reserve': { engine: '3.0L V6 Turbo', turbo: true },
        'Black Label': { engine: '3.0L V6 Turbo', turbo: true },
        'Grand Touring': { engine: '3.0L V6 Turbo Hybrid', turbo: true }
      }
    },
    'Corsair': {
      years: [2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '2.0L I4 Turbo', turbo: true },
        'Reserve': { engine: '2.0L I4 Turbo', turbo: true },
        'Grand Touring': { engine: '2.5L I4 Turbo Hybrid', turbo: true }
      }
    },
    'Nautilus': {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Base': { engine: '2.0L I4 Turbo', turbo: true },
        'Reserve': { engine: '2.0L I4 Turbo', turbo: true },
        'Black Label': { engine: '2.7L V6 Turbo', turbo: true }
      }
    },
    'MKZ': {
      years: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      trims: {
        'Base': { engine: '2.0L I4 Turbo', turbo: true },
        'Reserve': { engine: '2.0L I4 Turbo', turbo: true },
        'Black Label': { engine: '3.0L V6 Turbo', turbo: true },
        'Hybrid': { engine: '2.0L I4 Hybrid', turbo: false }
      }
    }
  },
  'Mercedes-Benz': {
    'A-Class': {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'A 220': { engine: '2.0L I4 Turbo', turbo: true },
        'AMG A 35': { engine: '2.0L I4 Turbo (M260)', turbo: true },
        'AMG A 45': { engine: '2.0L I4 Turbo (M139)', turbo: true },
        'AMG A 45 S': { engine: '2.0L I4 Turbo (M139)', turbo: true }
      }
    },
    'CLA-Class': {
      years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'CLA 250': { engine: '2.0L I4 Turbo', turbo: true },
        'AMG CLA 35': { engine: '2.0L I4 Turbo (M260)', turbo: true },
        'AMG CLA 45': { engine: '2.0L I4 Turbo (M139)', turbo: true },
        'AMG CLA 45 S': { engine: '2.0L I4 Turbo (M139)', turbo: true }
      }
    },
    'GLA-Class': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'GLA 250': { engine: '2.0L I4 Turbo', turbo: true },
        'AMG GLA 35': { engine: '2.0L I4 Turbo (M260)', turbo: true },
        'AMG GLA 45': { engine: '2.0L I4 Turbo (M139)', turbo: true },
        'AMG GLA 45 S': { engine: '2.0L I4 Turbo (M139)', turbo: true }
      }
    },
    'C-Class': {
      years: [1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'C 300': { engine: '2.0L I4 Turbo', turbo: true },
        'AMG C 43': { engine: '3.0L V6 Turbo (M276)', turbo: true },
        'AMG C 63': { engine: '4.0L V8 Turbo (M177)', turbo: true },
        'AMG C 63 S': { engine: '4.0L V8 Turbo (M177)', turbo: true }
      }
    },
    'E-Class': {
      years: [1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'E 350': { engine: '3.0L I6 Turbo', turbo: true },
        'E 450': { engine: '3.0L I6 Turbo', turbo: true },
        'AMG E 53': { engine: '3.0L I6 Turbo (M256)', turbo: true },
        'AMG E 63': { engine: '4.0L V8 Turbo (M177)', turbo: true },
        'AMG E 63 S': { engine: '4.0L V8 Turbo (M177)', turbo: true }
      }
    },
    'S-Class': {
      years: [1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      trims: {
        'S 450': { engine: '3.0L I6 Turbo', turbo: true },
        'S 500': { engine: '4.0L V8 Turbo', turbo: true },
        'S 580': { engine: '4.0L V8 Turbo', turbo: true },
        'AMG S 63': { engine: '4.0L V8 Turbo (M177)', turbo: true },
        'AMG S 65': { engine: '6.0L V12 Turbo (M279)', turbo: true }
      }
    },
    'G-Class': {
      years: [1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'G 550': { engine: '4.0L V8 Turbo', turbo: true },
        'AMG G 63': { engine: '4.0L V8 Turbo (M177)', turbo: true },
        'AMG G 65': { engine: '6.0L V12 Turbo (M279)', turbo: true }
      }
    },
    'AMG GT': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'AMG GT': { engine: '4.0L V8 Turbo (M178)', turbo: true },
        'AMG GT S': { engine: '4.0L V8 Turbo (M178)', turbo: true },
        'AMG GT C': { engine: '4.0L V8 Turbo (M178)', turbo: true },
        'AMG GT R': { engine: '4.0L V8 Turbo (M178)', turbo: true },
        'AMG GT Black Series': { engine: '4.0L V8 Turbo (M178)', turbo: true },
        'AMG GT 4-Door': { engine: '4.0L V8 Turbo (M177)', turbo: true },
        'AMG GT 4-Door 63': { engine: '4.0L V8 Turbo (M177)', turbo: true },
        'AMG GT 4-Door 63 S': { engine: '4.0L V8 Turbo (M177)', turbo: true }
      }
    },
    'GLE': {
      years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'GLE 350': { engine: '2.0L I4 Turbo', turbo: true },
        'GLE 450': { engine: '3.0L I6 Turbo', turbo: true },
        'AMG GLE 53': { engine: '3.0L I6 Turbo (M256)', turbo: true },
        'AMG GLE 63': { engine: '4.0L V8 Turbo (M177)', turbo: true },
        'AMG GLE 63 S': { engine: '4.0L V8 Turbo (M177)', turbo: true }
      }
    },
    'GLC': {
      years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'GLC 300': { engine: '2.0L I4 Turbo', turbo: true },
        'AMG GLC 43': { engine: '3.0L V6 Turbo (M276)', turbo: true },
        'AMG GLC 63': { engine: '4.0L V8 Turbo (M177)', turbo: true },
        'AMG GLC 63 S': { engine: '4.0L V8 Turbo (M177)', turbo: true }
      }
    }
  },
  'Mitsubishi': {
    'Lancer': {
      years: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
      trims: {
        'DE': { engine: '2.0L I4', turbo: false },
        'ES': { engine: '2.0L I4', turbo: false },
        'GTS': { engine: '2.4L I4', turbo: false },
        'Evolution VIII': { engine: '2.0L I4 Turbo (4G63)', turbo: true },
        'Evolution IX': { engine: '2.0L I4 Turbo (4G63)', turbo: true },
        'Evolution X': { engine: '2.0L I4 Turbo (4B11)', turbo: true },
        'Evolution MR': { engine: '2.0L I4 Turbo (4B11)', turbo: true }
      }
    },
    'Outlander': {
      years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'ES': { engine: '2.5L I4', turbo: false },
        'SE': { engine: '2.5L I4', turbo: false },
        'SEL': { engine: '2.5L I4', turbo: false },
        'GT': { engine: '3.0L V6', turbo: false }
      }
    },
    'Outlander Sport': {
      years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'ES': { engine: '2.0L I4', turbo: false },
        'LE': { engine: '2.0L I4', turbo: false },
        'SE': { engine: '2.4L I4', turbo: false }
      }
    },
    'Eclipse Cross': {
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'ES': { engine: '1.5L I4 Turbo', turbo: true },
        'LE': { engine: '1.5L I4 Turbo', turbo: true },
        'SEL': { engine: '1.5L I4 Turbo', turbo: true }
      }
    }
  },
  'Nissan': {
    'Altima': {
      years: [1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'S': { engine: '2.5L I4', turbo: false },
        'SR': { engine: '2.5L I4', turbo: false },
        'SV': { engine: '2.5L I4', turbo: false },
        'SL': { engine: '2.5L I4', turbo: false },
        'SR VC-Turbo': { engine: '2.0L I4 Turbo', turbo: true },
        'Platinum': { engine: '2.0L I4 Turbo', turbo: true }
      }
    },
    'Rogue': {
      years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'S': { engine: '2.5L I4', turbo: false },
        'SV': { engine: '2.5L I4', turbo: false },
        'SL': { engine: '2.5L I4', turbo: false },
        'Platinum': { engine: '2.5L I4', turbo: false }
      }
    },
    'Pathfinder': {
      years: [1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'S': { engine: '3.5L V6', turbo: false },
        'SV': { engine: '3.5L V6', turbo: false },
        'SL': { engine: '3.5L V6', turbo: false },
        'Platinum': { engine: '3.5L V6', turbo: false }
      }
    },
    'Frontier': {
      years: [1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'S': { engine: '3.8L V6', turbo: false },
        'SV': { engine: '3.8L V6', turbo: false },
        'Pro-4X': { engine: '3.8L V6', turbo: false },
        'SL': { engine: '3.8L V6', turbo: false }
      }
    },
    'Titan': {
      years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'S': { engine: '5.6L V8', turbo: false },
        'SV': { engine: '5.6L V8', turbo: false },
        'Pro-4X': { engine: '5.6L V8', turbo: false },
        'Platinum Reserve': { engine: '5.6L V8', turbo: false }
      }
    },
    'Armada': {
      years: [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'SV': { engine: '5.6L V8', turbo: false },
        'SL': { engine: '5.6L V8', turbo: false },
        'Platinum': { engine: '5.6L V8', turbo: false }
      }
    },
    'Maxima': {
      years: [1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
      trims: {
        'S': { engine: '3.5L V6', turbo: false },
        'SV': { engine: '3.5L V6', turbo: false },
        'SL': { engine: '3.5L V6', turbo: false },
        'SR': { engine: '3.5L V6', turbo: false },
        'Platinum': { engine: '3.5L V6', turbo: false }
      }
    },
    'Murano': {
      years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'S': { engine: '3.5L V6', turbo: false },
        'SV': { engine: '3.5L V6', turbo: false },
        'SL': { engine: '3.5L V6', turbo: false },
        'Platinum': { engine: '3.5L V6', turbo: false }
      }
    },
    'Sentra': {
      years: [1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'S': { engine: '2.0L I4', turbo: false },
        'SV': { engine: '2.0L I4', turbo: false },
        'SR': { engine: '2.0L I4', turbo: false },
        'SL': { engine: '2.0L I4', turbo: false }
      }
    }
  },
  'Ram': {
    '1500': {
      years: [1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Tradesman': { engine: '3.6L V6', turbo: false },
        'Tradesman EcoDiesel': { engine: '3.0L V6 Turbo Diesel', turbo: true },
        'Big Horn': { engine: '3.6L V6', turbo: false },
        'Big Horn EcoDiesel': { engine: '3.0L V6 Turbo Diesel', turbo: true },
        'Laramie': { engine: '5.7L V8', turbo: false },
        'Laramie EcoDiesel': { engine: '3.0L V6 Turbo Diesel', turbo: true },
        'Rebel': { engine: '5.7L V8', turbo: false },
        'Longhorn': { engine: '5.7L V8', turbo: false },
        'Longhorn EcoDiesel': { engine: '3.0L V6 Turbo Diesel', turbo: true },
        'Limited': { engine: '5.7L V8', turbo: false },
        'Limited EcoDiesel': { engine: '3.0L V6 Turbo Diesel', turbo: true },
        'TRX': { engine: '6.2L V8 Supercharged (Hellcat)', turbo: false }
      }
    },
    '2500': {
      years: [1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Tradesman': { engine: '6.4L V8', turbo: false },
        'Big Horn': { engine: '6.4L V8', turbo: false },
        'Laramie': { engine: '6.7L I6 Turbo Diesel', turbo: true },
        'Power Wagon': { engine: '6.4L V8', turbo: false }
      }
    },
    '3500': {
      years: [1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Tradesman': { engine: '6.4L V8', turbo: false },
        'Big Horn': { engine: '6.7L I6 Turbo Diesel', turbo: true },
        'Laramie': { engine: '6.7L I6 Turbo Diesel', turbo: true },
        'Limited': { engine: '6.7L I6 Turbo Diesel', turbo: true }
      }
    }
  },
  'Volvo': {
    'XC60': {
      years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Momentum': { engine: '2.0L I4 Turbo', turbo: true },
        'R-Design': { engine: '2.0L I4 Turbo', turbo: true },
        'Inscription': { engine: '2.0L I4 Turbo', turbo: true },
        'Polestar Engineered': { engine: '2.0L I4 Turbo Hybrid', turbo: true }
      }
    },
    'XC90': {
      years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Momentum': { engine: '2.0L I4 Turbo', turbo: true },
        'R-Design': { engine: '2.0L I4 Turbo', turbo: true },
        'Inscription': { engine: '2.0L I4 Turbo', turbo: true },
        'Polestar Engineered': { engine: '2.0L I4 Turbo Hybrid', turbo: true }
      }
    },
    'S60': {
      years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Momentum': { engine: '2.0L I4 Turbo', turbo: true },
        'R-Design': { engine: '2.0L I4 Turbo', turbo: true },
        'Inscription': { engine: '2.0L I4 Turbo', turbo: true },
        'Polestar Engineered': { engine: '2.0L I4 Turbo Hybrid', turbo: true }
      }
    },
    'XC40': {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      trims: {
        'Momentum': { engine: '2.0L I4 Turbo', turbo: true },
        'R-Design': { engine: '2.0L I4 Turbo', turbo: true },
        'Inscription': { engine: '2.0L I4 Turbo', turbo: true }
      }
    }
  }
};

// Legacy model list for backward compatibility (models without full data)
export const vehicleModels = {
  'Acura': ['ILX', 'Integra', 'MDX', 'RDX', 'RLX', 'TLX', 'TL'],
  'Audi': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT'],
  'BMW': ['2 Series', '3 Series', '4 Series', '5 Series', '7 Series', '8 Series', 'X1', 'X3', 'X5', 'X6', 'X7'],
  'Buick': ['Enclave', 'Encore', 'Envision', 'LaCrosse', 'Regal'],
  'Cadillac': ['ATS', 'CT4', 'CT5', 'CT6', 'Escalade', 'XT4', 'XT5', 'XT6'],
  'Chevrolet': ['Blazer', 'Blazer EV', 'Bolt EV', 'Camaro', 'Colorado', 'Corvette', 'Cruze', 'Equinox', 'Equinox EV', 'Impala', 'Malibu', 'Silverado', 'Silverado 2500HD', 'Silverado 3500HD', 'Silverado EV', 'Suburban', 'Tahoe', 'Trailblazer', 'Traverse', 'Trax'],
  'Chrysler': ['300', 'Pacifica', 'Voyager'],
  'Dodge': ['Challenger', 'Charger', 'Durango', 'Grand Caravan', 'Journey', 'Ram 1500'],
  'Ford': ['Bronco', 'Edge', 'Escape', 'Expedition', 'Explorer', 'F-150', 'F-250', 'F-350', 'Fusion', 'Mustang', 'Ranger', 'Taurus'],
  'GMC': ['Acadia', 'Canyon', 'Sierra', 'Terrain', 'Yukon'],
  'Honda': ['Accord', 'Civic', 'CR-V', 'HR-V', 'Odyssey', 'Pilot', 'Ridgeline'],
  'Hyundai': ['Elantra', 'Kona', 'Palisade', 'Santa Fe', 'Sonata', 'Tucson', 'Venue'],
  'Infiniti': ['Q50', 'Q60', 'QX50', 'QX60', 'QX80'],
  'Jeep': ['Cherokee', 'Compass', 'Grand Cherokee', 'Renegade', 'Wrangler'],
  'Kia': ['Forte', 'K5', 'Optima', 'Seltos', 'Sorento', 'Sportage', 'Telluride'],
  'Lexus': ['ES', 'GS', 'GX', 'IS', 'LS', 'NX', 'RX', 'UX'],
  'Lincoln': ['Aviator', 'Corsair', 'MKZ', 'Navigator', 'Nautilus'],
  'Mazda': ['CX-3', 'CX-5', 'CX-9', 'Mazda3', 'Mazda6', 'MX-5 Miata'],
  'Porsche': ['911', 'Boxster', 'Cayenne', 'Cayman', 'Macan', 'Panamera'],
  'Mercedes-Benz': ['A-Class', 'AMG GT', 'C-Class', 'CLA-Class', 'E-Class', 'G-Class', 'GLA-Class', 'GLC', 'GLE', 'S-Class'],
  'Mitsubishi': ['Eclipse Cross', 'Lancer', 'Outlander', 'Outlander Sport'],
  'Nissan': ['Altima', 'Armada', 'Frontier', 'Maxima', 'Murano', 'Pathfinder', 'Rogue', 'Sentra', 'Titan'],
  'Ram': ['1500', '2500', '3500'],
  'Subaru': ['Ascent', 'Crosstrek', 'Forester', 'Impreza', 'Legacy', 'Outback', 'WRX'],
  'Toyota': ['4Runner', 'Avalon', 'Camry', 'Corolla', 'Highlander', 'Prius', 'RAV4', 'Sequoia', 'Sienna', 'Tacoma', 'Tundra'],
  'Volkswagen': ['Atlas', 'Golf', 'Jetta', 'Passat', 'Tiguan'],
  'Volvo': ['S60', 'S90', 'XC40', 'XC60', 'XC90']
};

// Helper function to get available years for a make/model
export const getAvailableYears = (make, model) => {
  if (vehicleData[make] && vehicleData[make][model]) {
    return vehicleData[make][model].years;
  }
  // Fallback: return recent years if model not in detailed data
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 1990; year <= currentYear + 1; year++) {
    years.push(year);
  }
  return years;
};

// Year-based trim availability mapping for vehicles with significant changes over time
// This prevents showing trims/engines that didn't exist for specific years
const trimYearRanges = {
  'Mazda': {
    'MX-5 Miata': {
      'Base': { startYear: 1990, endYear: 2024 }, // Base exists throughout, but engine changes by year (1.6L early, 1.8L later, 2.0L modern)
      'Base (1.8L)': { startYear: 1994, endYear: 2005 }, // 1.8L introduced in 1994
      'Mazdaspeed': { startYear: 2004, endYear: 2005 }, // Turbo model only 2004-2005
      'Club': { startYear: 2006, endYear: 2024 }, // 2.0L introduced in 2006 (NC generation)
      'Grand Touring': { startYear: 2006, endYear: 2024 }, // 2.0L trim from 2006+
      'RF': { startYear: 2017, endYear: 2024 }, // Retractable Fastback introduced 2017
      'RF Club': { startYear: 2017, endYear: 2024 },
      'RF Grand Touring': { startYear: 2017, endYear: 2024 },
    }
  },
  'Subaru': {
    'Forester': {
      // 1998-2002 Generation (SF)
      'Base': { startYear: 1998, endYear: 2024 },
      'L': { startYear: 1998, endYear: 2002 },
      'S': { startYear: 1998, endYear: 2002 },
      // 2003-2008 Generation (SG)
      'X': { startYear: 2003, endYear: 2008 },
      'XS': { startYear: 2003, endYear: 2008 },
      'XT': { startYear: 2003, endYear: 2018 }, // 2.5L turbo 2003-2013, 2.0L turbo 2014-2018
      // 2009-2013 Generation (SH) - 2.5L turbo XT
      'X Premium': { startYear: 2009, endYear: 2013 },
      'X Limited': { startYear: 2009, endYear: 2013 },
      'XT Premium': { startYear: 2009, endYear: 2018 }, // 2.5L turbo 2009-2013, 2.0L turbo 2014-2018
      'XT Limited': { startYear: 2009, endYear: 2013 }, // 2.5L turbo only
      // 2014-2018 Generation (SJ) - 2.0L turbo XT
      'Premium': { startYear: 2014, endYear: 2024 },
      'Sport': { startYear: 2015, endYear: 2024 },
      'Limited': { startYear: 2014, endYear: 2024 },
      'Touring': { startYear: 2014, endYear: 2024 },
      'XT Touring': { startYear: 2014, endYear: 2018 }, // 2.0L turbo only
      // 2019+ Generation (SK) - No XT trim
      'Wilderness': { startYear: 2021, endYear: 2024 },
    }
  }
  // Add more vehicles here as needed when similar issues are found
};

// Helper function to check if a trim is available for a specific year
const isTrimAvailableForYear = (make, model, trim, year) => {
  if (!trimYearRanges[make] || !trimYearRanges[make][model] || !trimYearRanges[make][model][trim]) {
    // If no year range specified, assume trim is available for all years (backward compatibility)
    return true;
  }
  
  const range = trimYearRanges[make][model][trim];
  return year >= range.startYear && year <= range.endYear;
};

// Helper function to get available trims for a make/model/year
export const getAvailableTrims = (make, model, year = null) => {
  if (vehicleData[make] && vehicleData[make][model]) {
    const allTrims = Object.keys(vehicleData[make][model].trims);
    
    // If year is provided, filter trims by year availability
    if (year !== null && year !== undefined) {
      return allTrims.filter(trim => isTrimAvailableForYear(make, model, trim, year));
    }
    
    // Otherwise return all trims (backward compatibility)
    return allTrims;
  }
  return [];
};

// Helper function to get trim details
export const getTrimDetails = (make, model, trim) => {
  if (vehicleData[make] && vehicleData[make][model] && vehicleData[make][model].trims[trim]) {
    return vehicleData[make][model].trims[trim];
  }
  return null;
};

// Default service intervals by make (in miles)
// These are typical manufacturer recommendations and can be customized
export const defaultServiceIntervals = {
  // General defaults (used when make-specific not available)
  default: {
    oilChange: 5000,
    tireRotation: 7500,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 30000,
    sparkPlugs: 100000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  // Turbo engines typically need more frequent oil changes
  turbo: {
    oilChange: 5000,
    tireRotation: 7500,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 30000,
    sparkPlugs: 60000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  // High-performance/track-focused vehicles need more frequent service
  performance: {
    oilChange: 3000,
    tireRotation: 5000,
    brakeInspection: 10000,
    airFilter: 15000,
    cabinFilter: 30000,
    sparkPlugs: 30000,
    transmission: 30000,
    coolant: 60000,
    brakeFluid: 20000
  },
  // Make-specific defaults
  'Toyota': {
    oilChange: 10000,
    tireRotation: 5000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 30000,
    sparkPlugs: 120000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Honda': {
    oilChange: 7500,
    tireRotation: 7500,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 20000,
    sparkPlugs: 105000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Ford': {
    oilChange: 7500,
    tireRotation: 10000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 20000,
    sparkPlugs: 100000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Chevrolet': {
    oilChange: 7500,
    tireRotation: 7500,
    brakeInspection: 15000,
    airFilter: 45000,
    cabinFilter: 24000,
    sparkPlugs: 100000,
    transmission: 45000,
    coolant: 150000,
    brakeFluid: 30000
  },
  'BMW': {
    oilChange: 10000,
    tireRotation: 10000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 15000,
    sparkPlugs: 60000,
    transmission: 60000,
    coolant: 60000,
    brakeFluid: 24000
  },
  'Mercedes-Benz': {
    oilChange: 10000,
    tireRotation: 10000,
    brakeInspection: 20000,
    airFilter: 30000,
    cabinFilter: 20000,
    sparkPlugs: 60000,
    transmission: 60000,
    coolant: 60000,
    brakeFluid: 20000
  },
  'Audi': {
    oilChange: 10000,
    tireRotation: 10000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 20000,
    sparkPlugs: 60000,
    transmission: 40000,
    coolant: 60000,
    brakeFluid: 20000
  },
  'Nissan': {
    oilChange: 5000,
    tireRotation: 5000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 15000,
    sparkPlugs: 105000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Subaru': {
    oilChange: 6000,
    tireRotation: 6000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 12000,
    sparkPlugs: 60000,
    transmission: 60000,
    coolant: 137500,
    brakeFluid: 30000
  },
  'Mazda': {
    oilChange: 7500,
    tireRotation: 7500,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 20000,
    sparkPlugs: 75000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Porsche': {
    oilChange: 10000,
    tireRotation: 10000,
    brakeInspection: 20000,
    airFilter: 30000,
    cabinFilter: 20000,
    sparkPlugs: 60000,
    transmission: 60000,
    coolant: 60000,
    brakeFluid: 20000
  },
  'Volkswagen': {
    oilChange: 10000,
    tireRotation: 10000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 20000,
    sparkPlugs: 60000,
    transmission: 40000,
    coolant: 60000,
    brakeFluid: 20000
  },
  'Infiniti': {
    oilChange: 5000,
    tireRotation: 5000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 15000,
    sparkPlugs: 105000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Dodge': {
    oilChange: 6000,
    tireRotation: 6000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 15000,
    sparkPlugs: 100000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Acura': {
    oilChange: 7500,
    tireRotation: 7500,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 20000,
    sparkPlugs: 105000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Buick': {
    oilChange: 7500,
    tireRotation: 7500,
    brakeInspection: 15000,
    airFilter: 45000,
    cabinFilter: 24000,
    sparkPlugs: 100000,
    transmission: 45000,
    coolant: 150000,
    brakeFluid: 30000
  },
  'Cadillac': {
    oilChange: 7500,
    tireRotation: 7500,
    brakeInspection: 15000,
    airFilter: 45000,
    cabinFilter: 24000,
    sparkPlugs: 100000,
    transmission: 45000,
    coolant: 150000,
    brakeFluid: 30000
  },
  'Chrysler': {
    oilChange: 6000,
    tireRotation: 6000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 15000,
    sparkPlugs: 100000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'GMC': {
    oilChange: 7500,
    tireRotation: 7500,
    brakeInspection: 15000,
    airFilter: 45000,
    cabinFilter: 24000,
    sparkPlugs: 100000,
    transmission: 45000,
    coolant: 150000,
    brakeFluid: 30000
  },
  'Hyundai': {
    oilChange: 5000,
    tireRotation: 5000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 15000,
    sparkPlugs: 105000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Jeep': {
    oilChange: 5000,
    tireRotation: 5000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 15000,
    sparkPlugs: 100000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Kia': {
    oilChange: 5000,
    tireRotation: 5000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 15000,
    sparkPlugs: 105000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Lexus': {
    oilChange: 10000,
    tireRotation: 5000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 30000,
    sparkPlugs: 120000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Lincoln': {
    oilChange: 7500,
    tireRotation: 10000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 20000,
    sparkPlugs: 100000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Mitsubishi': {
    oilChange: 5000,
    tireRotation: 5000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 15000,
    sparkPlugs: 100000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  // Evolution-specific intervals (more aggressive)
  'Mitsubishi Evolution': {
    oilChange: 3000,
    tireRotation: 5000,
    brakeInspection: 10000,
    airFilter: 15000,
    cabinFilter: 15000,
    sparkPlugs: 30000,
    transmission: 30000,
    coolant: 60000,
    brakeFluid: 20000
  },
  'Ram': {
    oilChange: 6000,
    tireRotation: 6000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 15000,
    sparkPlugs: 100000,
    transmission: 60000,
    coolant: 100000,
    brakeFluid: 30000
  },
  'Volvo': {
    oilChange: 10000,
    tireRotation: 10000,
    brakeInspection: 15000,
    airFilter: 30000,
    cabinFilter: 20000,
    sparkPlugs: 60000,
    transmission: 60000,
    coolant: 60000,
    brakeFluid: 20000
  }
};

// Default recommended fluids by make
export const defaultFluids = {
  default: {
    engineOil: '5W-30 Synthetic',
    engineOilCapacity: '5.0 quarts',
    transmissionFluid: 'ATF',
    coolant: '50/50 Pre-mixed',
    brakeFluid: 'DOT 3',
    powerSteering: 'ATF',
    differential: '75W-90'
  },
  // Turbo engines may need different oil
  turbo: {
    engineOil: '5W-30 Synthetic (Turbo Rated)',
    engineOilCapacity: '5.0 quarts',
    transmissionFluid: 'ATF',
    coolant: '50/50 Pre-mixed',
    brakeFluid: 'DOT 3',
    powerSteering: 'ATF',
    differential: '75W-90'
  },
  // Supercharged/high-performance engines need premium synthetic
  supercharged: {
    engineOil: '5W-50 Synthetic (Supercharged/Turbo Rated)',
    engineOilCapacity: '8.0 quarts',
    transmissionFluid: 'ATF',
    coolant: '50/50 Pre-mixed',
    brakeFluid: 'DOT 4',
    powerSteering: 'ATF',
    differential: '75W-140'
  },
  'Toyota': {
    engineOil: '0W-20 Synthetic',
    engineOilCapacity: '4.6 quarts',
    transmissionFluid: 'Toyota WS',
    coolant: 'Toyota Super Long Life',
    brakeFluid: 'DOT 3',
    powerSteering: 'ATF',
    differential: '75W-90'
  },
  'Honda': {
    engineOil: '0W-20 Synthetic',
    engineOilCapacity: '4.2 quarts',
    transmissionFluid: 'Honda ATF',
    coolant: 'Honda Type 2',
    brakeFluid: 'DOT 3',
    powerSteering: 'Honda PSF',
    differential: '80W-90'
  },
  'BMW': {
    engineOil: '5W-30 Synthetic',
    engineOilCapacity: '6.5 quarts',
    transmissionFluid: 'BMW ATF',
    coolant: 'BMW Coolant',
    brakeFluid: 'DOT 4',
    powerSteering: 'Pentosin CHF 11S',
    differential: '75W-90'
  },
  'Mercedes-Benz': {
    engineOil: '5W-40 Synthetic',
    engineOilCapacity: '7.4 quarts',
    transmissionFluid: 'Mercedes ATF',
    coolant: 'Mercedes Coolant',
    brakeFluid: 'DOT 4+',
    powerSteering: 'Mercedes PSF',
    differential: '75W-90'
  },
  'Ford': {
    engineOil: '5W-30 Synthetic',
    engineOilCapacity: '5.7 quarts',
    transmissionFluid: 'Mercon LV',
    coolant: 'Motorcraft Orange',
    brakeFluid: 'DOT 3',
    powerSteering: 'Mercon V',
    differential: '75W-140'
  },
  'Chevrolet': {
    engineOil: '5W-30 Synthetic',
    engineOilCapacity: '5.0 quarts',
    transmissionFluid: 'Dexron VI',
    coolant: 'Dex-Cool',
    brakeFluid: 'DOT 3',
    powerSteering: 'Power Steering Fluid',
    differential: '75W-90'
  },
  'Subaru': {
    engineOil: '0W-20 Synthetic',
    engineOilCapacity: '4.8 quarts',
    transmissionFluid: 'Subaru ATF',
    coolant: 'Subaru Super Coolant',
    brakeFluid: 'DOT 3',
    powerSteering: 'Subaru PSF',
    differential: '75W-90'
  },
  'Mazda': {
    engineOil: '0W-20 Synthetic',
    engineOilCapacity: '4.5 quarts',
    transmissionFluid: 'Mazda ATF',
    coolant: 'Mazda FL22',
    brakeFluid: 'DOT 3',
    powerSteering: 'Mazda PSF',
    differential: '75W-90'
  },
  'Porsche': {
    engineOil: '0W-40 Synthetic',
    engineOilCapacity: '8.5 quarts',
    transmissionFluid: 'Porsche ATF',
    coolant: 'Porsche Coolant',
    brakeFluid: 'DOT 4',
    powerSteering: 'Pentosin CHF 11S',
    differential: '75W-90'
  },
  'Volkswagen': {
    engineOil: '5W-30 Synthetic (VW 502.00)',
    engineOilCapacity: '5.0 quarts',
    transmissionFluid: 'VW G 052 182 A2',
    coolant: 'G12/G13 Coolant',
    brakeFluid: 'DOT 4',
    powerSteering: 'Pentosin CHF 11S',
    differential: '75W-90'
  },
  'Infiniti': {
    engineOil: '5W-30 Synthetic',
    engineOilCapacity: '5.1 quarts',
    transmissionFluid: 'Nissan Matic S',
    coolant: 'Nissan Long Life Coolant',
    brakeFluid: 'DOT 3',
    powerSteering: 'Nissan PSF',
    differential: '75W-90'
  },
  'Dodge': {
    engineOil: '5W-20 Synthetic',
    engineOilCapacity: '5.0 quarts',
    transmissionFluid: 'ATF+4',
    coolant: 'Mopar Coolant',
    brakeFluid: 'DOT 3',
    powerSteering: 'Mopar PSF',
    differential: '75W-90'
  },
  'Acura': {
    engineOil: '0W-20 Synthetic',
    engineOilCapacity: '4.5 quarts',
    transmissionFluid: 'Honda ATF',
    coolant: 'Honda Type 2',
    brakeFluid: 'DOT 3',
    powerSteering: 'Honda PSF',
    differential: '80W-90'
  },
  'Buick': {
    engineOil: '5W-30 Synthetic',
    engineOilCapacity: '5.0 quarts',
    transmissionFluid: 'Dexron VI',
    coolant: 'Dex-Cool',
    brakeFluid: 'DOT 3',
    powerSteering: 'Power Steering Fluid',
    differential: '75W-90'
  },
  'Cadillac': {
    engineOil: '5W-30 Synthetic',
    engineOilCapacity: '6.0 quarts',
    transmissionFluid: 'Dexron VI',
    coolant: 'Dex-Cool',
    brakeFluid: 'DOT 3',
    powerSteering: 'Power Steering Fluid',
    differential: '75W-90'
  },
  'Chrysler': {
    engineOil: '5W-20 Synthetic',
    engineOilCapacity: '5.0 quarts',
    transmissionFluid: 'ATF+4',
    coolant: 'Mopar Coolant',
    brakeFluid: 'DOT 3',
    powerSteering: 'Mopar PSF',
    differential: '75W-90'
  },
  'GMC': {
    engineOil: '5W-30 Synthetic',
    engineOilCapacity: '5.0 quarts',
    transmissionFluid: 'Dexron VI',
    coolant: 'Dex-Cool',
    brakeFluid: 'DOT 3',
    powerSteering: 'Power Steering Fluid',
    differential: '75W-90'
  },
  'Hyundai': {
    engineOil: '5W-30 Synthetic',
    engineOilCapacity: '4.2 quarts',
    transmissionFluid: 'Hyundai SP-IV',
    coolant: 'Hyundai Coolant',
    brakeFluid: 'DOT 3',
    powerSteering: 'PSF-3',
    differential: '75W-90'
  },
  'Jeep': {
    engineOil: '5W-20 Synthetic',
    engineOilCapacity: '5.0 quarts',
    transmissionFluid: 'ATF+4',
    coolant: 'Mopar Coolant',
    brakeFluid: 'DOT 3',
    powerSteering: 'Mopar PSF',
    differential: '75W-90'
  },
  'Kia': {
    engineOil: '5W-30 Synthetic',
    engineOilCapacity: '4.2 quarts',
    transmissionFluid: 'Kia SP-IV',
    coolant: 'Kia Coolant',
    brakeFluid: 'DOT 3',
    powerSteering: 'PSF-3',
    differential: '75W-90'
  },
  'Lexus': {
    engineOil: '0W-20 Synthetic',
    engineOilCapacity: '5.0 quarts',
    transmissionFluid: 'Toyota WS',
    coolant: 'Toyota Super Long Life',
    brakeFluid: 'DOT 3',
    powerSteering: 'ATF',
    differential: '75W-90'
  },
  'Lincoln': {
    engineOil: '5W-30 Synthetic',
    engineOilCapacity: '5.7 quarts',
    transmissionFluid: 'Mercon LV',
    coolant: 'Motorcraft Orange',
    brakeFluid: 'DOT 3',
    powerSteering: 'Mercon V',
    differential: '75W-140'
  },
  'Mitsubishi': {
    engineOil: '5W-30 Synthetic',
    engineOilCapacity: '4.5 quarts',
    transmissionFluid: 'Diamond SP-III',
    coolant: 'Mitsubishi Coolant',
    brakeFluid: 'DOT 3',
    powerSteering: 'Mitsubishi PSF',
    differential: '75W-90'
  },
  'Ram': {
    engineOil: '5W-20 Synthetic',
    engineOilCapacity: '5.0 quarts',
    transmissionFluid: 'ATF+4',
    coolant: 'Mopar Coolant',
    brakeFluid: 'DOT 3',
    powerSteering: 'Mopar PSF',
    differential: '75W-90'
  },
  'Volvo': {
    engineOil: '0W-20 Synthetic',
    engineOilCapacity: '5.9 quarts',
    transmissionFluid: 'Volvo AW-1',
    coolant: 'Volvo Coolant',
    brakeFluid: 'DOT 4+',
    powerSteering: 'Pentosin CHF 11S',
    differential: '75W-90'
  }
};

// Default torque specifications by make (in ft-lb unless noted)
export const defaultTorqueSpecs = {
  default: {
    suspension: {
      wheelLugNuts: '80-100 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '25-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    },
    brake: {
      caliperBracketBolts: '70-120 ft-lb',
      caliperSlidePins: '20-35 ft-lb',
      brakeLineFittings: '10-18 ft-lb'
    }
  },
  'Toyota': {
    suspension: {
      wheelLugNuts: '76-83 ft-lb',
      strutMountBolts: '36-43 ft-lb',
      controlArmBolts: '65-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '55-70 ft-lb',
      tieRodEnds: '36-43 ft-lb'
    },
    engine: {
      sparkPlugs: '13-18 ft-lb',
      oilDrainPlug: '30-37 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '25-30 ft-lb',
      cylinderHeadBolts: '58-65 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    },
    brake: {
      caliperBracketBolts: '76-96 ft-lb',
      caliperSlidePins: '18-26 ft-lb',
      brakeLineFittings: '11-15 ft-lb'
    }
  },
  'Honda': {
    suspension: {
      wheelLugNuts: '80-108 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '13-18 ft-lb',
      oilDrainPlug: '29-36 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '16-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '58-65 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    },
    brake: {
      caliperBracketBolts: '65-87 ft-lb',
      caliperSlidePins: '18-26 ft-lb',
      brakeLineFittings: '10-15 ft-lb'
    }
  },
  'Subaru': {
    suspension: {
      wheelLugNuts: '65-87 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '30-37 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '58-65 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    },
    brake: {
      caliperBracketBolts: '65-87 ft-lb',
      caliperSlidePins: '20-30 ft-lb',
      brakeLineFittings: '10-15 ft-lb'
    }
  },
  'Mazda': {
    suspension: {
      wheelLugNuts: '80-108 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '30-37 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '58-65 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    },
    brake: {
      caliperBracketBolts: '70-100 ft-lb',
      caliperSlidePins: '20-32 ft-lb',
      brakeLineFittings: '10-16 ft-lb'
    }
  },
  'Ford': {
    suspension: {
      wheelLugNuts: '100-150 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '20-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    },
    brake: {
      caliperBracketBolts: '85-125 ft-lb',
      caliperSlidePins: '20-35 ft-lb',
      brakeLineFittings: '10-18 ft-lb'
    }
  },
  'BMW': {
    suspension: {
      wheelLugNuts: '88-103 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '18-22 ft-lb',
      oilDrainPlug: '25-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    },
    brake: {
      caliperBracketBolts: '75-110 ft-lb',
      caliperSlidePins: '22-32 ft-lb',
      brakeLineFittings: '11-16 ft-lb'
    }
  },
  'Mercedes-Benz': {
    suspension: {
      wheelLugNuts: '110-130 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '18-22 ft-lb',
      oilDrainPlug: '25-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Porsche': {
    suspension: {
      wheelLugNuts: '96-118 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '18-22 ft-lb',
      oilDrainPlug: '30-37 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Volkswagen': {
    suspension: {
      wheelLugNuts: '88-103 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '18-22 ft-lb',
      oilDrainPlug: '25-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Infiniti': {
    suspension: {
      wheelLugNuts: '80-103 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '25-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Dodge': {
    suspension: {
      wheelLugNuts: '100-150 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '20-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Chevrolet': {
    suspension: {
      wheelLugNuts: '100-150 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '20-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Acura': {
    suspension: {
      wheelLugNuts: '80-108 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '13-18 ft-lb',
      oilDrainPlug: '29-36 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '16-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '58-65 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Audi': {
    suspension: {
      wheelLugNuts: '88-103 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '18-22 ft-lb',
      oilDrainPlug: '25-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Buick': {
    suspension: {
      wheelLugNuts: '100-150 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '20-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Cadillac': {
    suspension: {
      wheelLugNuts: '100-150 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '20-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Chrysler': {
    suspension: {
      wheelLugNuts: '100-150 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '20-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'GMC': {
    suspension: {
      wheelLugNuts: '100-150 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '20-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Hyundai': {
    suspension: {
      wheelLugNuts: '80-103 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '25-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Jeep': {
    suspension: {
      wheelLugNuts: '100-150 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '20-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Kia': {
    suspension: {
      wheelLugNuts: '80-103 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '25-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Lexus': {
    suspension: {
      wheelLugNuts: '76-83 ft-lb',
      strutMountBolts: '36-43 ft-lb',
      controlArmBolts: '65-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '55-70 ft-lb',
      tieRodEnds: '36-43 ft-lb'
    },
    engine: {
      sparkPlugs: '13-18 ft-lb',
      oilDrainPlug: '30-37 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '25-30 ft-lb',
      cylinderHeadBolts: '58-65 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Lincoln': {
    suspension: {
      wheelLugNuts: '100-150 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '20-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Mitsubishi': {
    suspension: {
      wheelLugNuts: '80-108 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '30-37 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Nissan': {
    suspension: {
      wheelLugNuts: '80-103 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '25-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Ram': {
    suspension: {
      wheelLugNuts: '100-150 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '15-20 ft-lb',
      oilDrainPlug: '20-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  },
  'Volvo': {
    suspension: {
      wheelLugNuts: '103-118 ft-lb',
      strutMountBolts: '40-50 ft-lb',
      controlArmBolts: '60-80 ft-lb',
      swayBarEndLinks: '30-40 ft-lb',
      ballJointNuts: '50-70 ft-lb',
      tieRodEnds: '35-50 ft-lb'
    },
    engine: {
      sparkPlugs: '18-22 ft-lb',
      oilDrainPlug: '25-30 ft-lb',
      oilFilter: 'Hand tight + 3/4 turn',
      valveCoverBolts: '84-120 in-lb (7-10 ft-lb)',
      intakeManifoldBolts: '15-20 ft-lb',
      exhaustManifoldBolts: '20-30 ft-lb',
      cylinderHeadBolts: '60-80 ft-lb (sequence)',
      camshaftSprocketBolts: '40-50 ft-lb'
    }
  }
};

// Default tire and wheel specifications by make
export const defaultTires = {
  default: {
    tireSizeFront: '225/60R16',
    tireSizeRear: '225/60R16',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x114.3',
    lugNutTorque: '80 ft-lbs'
  },
  'Toyota': {
    tireSizeFront: '225/60R16',
    tireSizeRear: '225/60R16',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x114.3',
    lugNutTorque: '76-83 ft-lbs'
  },
  'Honda': {
    tireSizeFront: '215/60R16',
    tireSizeRear: '215/60R16',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x114.3',
    lugNutTorque: '80-108 ft-lbs'
  },
  'Subaru': {
    tireSizeFront: '225/60R17',
    tireSizeRear: '225/60R17',
    tirePressureFront: '33 PSI',
    tirePressureRear: '33 PSI',
    wheelBoltPattern: '5x100',
    lugNutTorque: '65-87 ft-lbs'
  },
  'Ford': {
    tireSizeFront: '265/70R17',
    tireSizeRear: '265/70R17',
    tirePressureFront: '35 PSI',
    tirePressureRear: '35 PSI',
    wheelBoltPattern: '6x135',
    lugNutTorque: '150 ft-lbs'
  },
  'Chevrolet': {
    tireSizeFront: '265/70R17',
    tireSizeRear: '265/70R17',
    tirePressureFront: '35 PSI',
    tirePressureRear: '35 PSI',
    wheelBoltPattern: '6x139.7',
    lugNutTorque: '140 ft-lbs'
  },
  'BMW': {
    tireSizeFront: '225/50R17',
    tireSizeRear: '255/45R17',
    tirePressureFront: '32 PSI',
    tirePressureRear: '35 PSI',
    wheelBoltPattern: '5x120',
    lugNutTorque: '88-103 ft-lbs'
  },
  'Mercedes-Benz': {
    tireSizeFront: '225/50R17',
    tireSizeRear: '245/45R17',
    tirePressureFront: '33 PSI',
    tirePressureRear: '36 PSI',
    wheelBoltPattern: '5x112',
    lugNutTorque: '110 ft-lbs'
  },
  'Mazda': {
    tireSizeFront: '215/60R16',
    tireSizeRear: '215/60R16',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x114.3',
    lugNutTorque: '80-108 ft-lbs'
  },
  'Nissan': {
    tireSizeFront: '215/60R16',
    tireSizeRear: '215/60R16',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x114.3',
    lugNutTorque: '80-108 ft-lbs'
  },
  'Porsche': {
    tireSizeFront: '235/45R18',
    tireSizeRear: '265/40R18',
    tirePressureFront: '36 PSI',
    tirePressureRear: '36 PSI',
    wheelBoltPattern: '5x130',
    lugNutTorque: '96 ft-lbs'
  },
  'Volkswagen': {
    tireSizeFront: '225/50R17',
    tireSizeRear: '225/50R17',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x112',
    lugNutTorque: '88-103 ft-lbs'
  },
  'Audi': {
    tireSizeFront: '225/50R17',
    tireSizeRear: '225/50R17',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x112',
    lugNutTorque: '88-103 ft-lbs'
  },
  'Lexus': {
    tireSizeFront: '225/60R16',
    tireSizeRear: '225/60R16',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x114.3',
    lugNutTorque: '76-83 ft-lbs'
  },
  'Acura': {
    tireSizeFront: '215/60R16',
    tireSizeRear: '215/60R16',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x114.3',
    lugNutTorque: '80-108 ft-lbs'
  },
  'Infiniti': {
    tireSizeFront: '225/55R17',
    tireSizeRear: '225/55R17',
    tirePressureFront: '33 PSI',
    tirePressureRear: '33 PSI',
    wheelBoltPattern: '5x114.3',
    lugNutTorque: '80-108 ft-lbs'
  },
  'Dodge': {
    tireSizeFront: '225/60R17',
    tireSizeRear: '225/60R17',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x115',
    lugNutTorque: '100 ft-lbs'
  },
  'Ram': {
    tireSizeFront: '275/55R20',
    tireSizeRear: '275/55R20',
    tirePressureFront: '35 PSI',
    tirePressureRear: '35 PSI',
    wheelBoltPattern: '5x139.7',
    lugNutTorque: '130 ft-lbs'
  },
  'GMC': {
    tireSizeFront: '265/70R17',
    tireSizeRear: '265/70R17',
    tirePressureFront: '35 PSI',
    tirePressureRear: '35 PSI',
    wheelBoltPattern: '6x139.7',
    lugNutTorque: '140 ft-lbs'
  },
  'Jeep': {
    tireSizeFront: '245/75R16',
    tireSizeRear: '245/75R16',
    tirePressureFront: '33 PSI',
    tirePressureRear: '33 PSI',
    wheelBoltPattern: '5x127',
    lugNutTorque: '85-95 ft-lbs'
  },
  'Buick': {
    tireSizeFront: '225/60R16',
    tireSizeRear: '225/60R16',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x115',
    lugNutTorque: '100 ft-lbs'
  },
  'Cadillac': {
    tireSizeFront: '235/55R17',
    tireSizeRear: '235/55R17',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x115',
    lugNutTorque: '100 ft-lbs'
  },
  'Chrysler': {
    tireSizeFront: '225/60R17',
    tireSizeRear: '225/60R17',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x115',
    lugNutTorque: '100 ft-lbs'
  },
  'Hyundai': {
    tireSizeFront: '215/60R16',
    tireSizeRear: '215/60R16',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x114.3',
    lugNutTorque: '80-108 ft-lbs'
  },
  'Kia': {
    tireSizeFront: '215/60R16',
    tireSizeRear: '215/60R16',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x114.3',
    lugNutTorque: '80-108 ft-lbs'
  },
  'Lincoln': {
    tireSizeFront: '235/55R18',
    tireSizeRear: '235/55R18',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x114.3',
    lugNutTorque: '100 ft-lbs'
  },
  'Mitsubishi': {
    tireSizeFront: '215/60R16',
    tireSizeRear: '215/60R16',
    tirePressureFront: '32 PSI',
    tirePressureRear: '32 PSI',
    wheelBoltPattern: '5x114.3',
    lugNutTorque: '80-108 ft-lbs'
  },
  'Volvo': {
    tireSizeFront: '225/55R17',
    tireSizeRear: '225/55R17',
    tirePressureFront: '35 PSI',
    tirePressureRear: '35 PSI',
    wheelBoltPattern: '5x108',
    lugNutTorque: '103 ft-lbs'
  }
};

// Default hardware specifications by make
export const defaultHardware = {
  default: {
    batteryGroupSize: 'Group 24',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Toyota': {
    batteryGroupSize: 'Group 24F',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Honda': {
    batteryGroupSize: 'Group 51R',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Subaru': {
    batteryGroupSize: 'Group 35', // Most modern Subarus use Group 35 (WRX, STI, Forester, Outback, etc.)
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '18 inches'
  },
  'Ford': {
    batteryGroupSize: 'Group 94R', // Modern Fords use 94R (F-150, Mustang, Explorer, etc.)
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '18 inches'
  },
  'Chevrolet': {
    batteryGroupSize: 'Group 48 AGM', // Modern Chevrolets use 48 AGM (Silverado, Camaro, etc.)
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'BMW': {
    batteryGroupSize: 'Group 94R',
    wiperBladeDriver: '24 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Mercedes-Benz': {
    batteryGroupSize: 'Group 49',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Mazda': {
    batteryGroupSize: 'Group 35', // Modern Mazdas use Group 35 (Mazda3, Mazda6, CX-5, etc.)
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Nissan': {
    batteryGroupSize: 'Group 35', // Modern Nissans use Group 35 (Altima, Sentra, Rogue, etc.)
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Porsche': {
    batteryGroupSize: 'Group 94R',
    wiperBladeDriver: '24 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: 'N/A'
  },
  'Volkswagen': {
    batteryGroupSize: 'Group 94R',
    wiperBladeDriver: '24 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Audi': {
    batteryGroupSize: 'Group 94R',
    wiperBladeDriver: '24 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Lexus': {
    batteryGroupSize: 'Group 24F',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Acura': {
    batteryGroupSize: 'Group 51R', // Correct - Acura uses 51R (TLX, MDX, RDX, etc.)
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Infiniti': {
    batteryGroupSize: 'Group 24F',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Dodge': {
    batteryGroupSize: 'Group 94R', // Modern Dodges use 94R (Challenger, Charger, etc.)
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Ram': {
    batteryGroupSize: 'Group 94R',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '18 inches'
  },
  'GMC': {
    batteryGroupSize: 'Group 78',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Jeep': {
    batteryGroupSize: 'Group 94R',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Buick': {
    batteryGroupSize: 'Group 78',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Cadillac': {
    batteryGroupSize: 'Group 78',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Chrysler': {
    batteryGroupSize: 'Group 78',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Hyundai': {
    batteryGroupSize: 'Group 24F',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Kia': {
    batteryGroupSize: 'Group 24F',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Lincoln': {
    batteryGroupSize: 'Group 65',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '18 inches'
  },
  'Mitsubishi': {
    batteryGroupSize: 'Group 24F',
    wiperBladeDriver: '26 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  },
  'Volvo': {
    batteryGroupSize: 'Group 49',
    wiperBladeDriver: '24 inches',
    wiperBladePassenger: '20 inches',
    wiperBladeRear: '16 inches'
  }
};

// Default lighting specifications by make
export const defaultLighting = {
  default: {
    headlightLow: 'H11',
    headlightHigh: 'H9',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Toyota': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Honda': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Subaru': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Ford': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Chevrolet': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'BMW': {
    headlightLow: 'H7',
    headlightHigh: 'H7',
    fogLight: 'H8',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Mercedes-Benz': {
    headlightLow: 'H7',
    headlightHigh: 'H7',
    fogLight: 'H8',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Mazda': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Nissan': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Porsche': {
    headlightLow: 'H7',
    headlightHigh: 'H7',
    fogLight: 'H8',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Volkswagen': {
    headlightLow: 'H7',
    headlightHigh: 'H7',
    fogLight: 'H8',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Audi': {
    headlightLow: 'H7',
    headlightHigh: 'H7',
    fogLight: 'H8',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Lexus': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Acura': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Infiniti': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Dodge': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Ram': {
    headlightLow: 'H13',
    headlightHigh: 'H13',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'GMC': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Jeep': {
    headlightLow: 'H13',
    headlightHigh: 'H13',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Buick': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Cadillac': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Chrysler': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Hyundai': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Kia': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Lincoln': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Mitsubishi': {
    headlightLow: 'H11',
    headlightHigh: '9005',
    fogLight: 'H11',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  },
  'Volvo': {
    headlightLow: 'H7',
    headlightHigh: 'H7',
    fogLight: 'H8',
    brakeLight: '7443',
    turnSignal: '7440',
    interiorLight: 'T10',
    trunkLight: 'T10'
  }
};

// Default parts SKUs by make (common OEM part numbers - format: Make-Model-Year specific)
// Note: These are example SKUs - users should replace with their actual part numbers
export const defaultPartsSKUs = {
  default: {
    brakePads: 'OEM-XXX-XXX',
    brakeRotors: 'OEM-XXX-XXX',
    wheelHubs: 'OEM-XXX-XXX',
    wheelBearings: 'OEM-XXX-XXX',
    airFilter: 'OEM-XXX-XXX',
    cabinFilter: 'OEM-XXX-XXX',
    oilFilter: 'OEM-XXX-XXX',
    fuelFilter: 'OEM-XXX-XXX',
    transmissionFilter: 'OEM-XXX-XXX'
  },
  'Toyota': {
    brakePads: '04465-XXXXX',
    brakeRotors: '43512-XXXXX',
    wheelHubs: '43530-XXXXX',
    wheelBearings: '90369-XXXXX',
    airFilter: '17801-XXXXX',
    cabinFilter: '87139-XXXXX',
    oilFilter: '90915-XXXXX',
    fuelFilter: '23300-XXXXX',
    transmissionFilter: '35330-XXXXX'
  },
  'Honda': {
    brakePads: '45022-XXXXX',
    brakeRotors: '45251-XXXXX',
    wheelHubs: '44700-XXXXX',
    wheelBearings: '44300-XXXXX',
    airFilter: '17220-XXXXX',
    cabinFilter: '80292-XXXXX',
    oilFilter: '15400-XXXXX',
    fuelFilter: '16900-XXXXX',
    transmissionFilter: '25430-XXXXX'
  },
  'Subaru': {
    brakePads: '26296-XXXXX',
    brakeRotors: '26301-XXXXX',
    wheelHubs: '28015-XXXXX',
    wheelBearings: '28015-XXXXX',
    airFilter: '16546-XXXXX',
    cabinFilter: '72821-XXXXX',
    oilFilter: '15208-XXXXX',
    fuelFilter: '42072-XXXXX',
    transmissionFilter: '31822-XXXXX'
  },
  'Ford': {
    brakePads: 'Motorcraft BRF-XXX',
    brakeRotors: 'Motorcraft BRR-XXX',
    wheelHubs: 'Motorcraft W-XXX',
    wheelBearings: 'Motorcraft BRG-XXX',
    airFilter: 'Motorcraft FA-XXXX',
    cabinFilter: 'Motorcraft FP-XXXX',
    oilFilter: 'Motorcraft FL-XXXX',
    fuelFilter: 'Motorcraft FG-XXXX',
    transmissionFilter: 'Motorcraft FT-XXXX'
  },
  'Chevrolet': {
    brakePads: 'ACDelco 17DXXX',
    brakeRotors: 'ACDelco 18AXXX',
    wheelHubs: 'ACDelco 19AXXX',
    wheelBearings: 'ACDelco 45BXXX',
    airFilter: 'ACDelco AXXXXX',
    cabinFilter: 'ACDelco CFXXX',
    oilFilter: 'ACDelco PFXXXX',
    fuelFilter: 'ACDelco GFXXXX',
    transmissionFilter: 'ACDelco TFXXX'
  },
  'BMW': {
    brakePads: '34-11-XXXXX',
    brakeRotors: '34-11-XXXXX',
    wheelHubs: '33-21-XXXXX',
    wheelBearings: '33-41-XXXXX',
    airFilter: '13-71-XXXXX',
    cabinFilter: '64-31-XXXXX',
    oilFilter: '11-42-XXXXX',
    fuelFilter: '13-32-XXXXX',
    transmissionFilter: '24-11-XXXXX'
  },
  'Mercedes-Benz': {
    brakePads: 'A000-420-XXXX',
    brakeRotors: 'A000-421-XXXX',
    wheelHubs: 'A000-330-XXXX',
    wheelBearings: 'A000-460-XXXX',
    airFilter: 'A000-094-XXXX',
    cabinFilter: 'A000-094-XXXX',
    oilFilter: 'A000-180-XXXX',
    fuelFilter: 'A000-470-XXXX',
    transmissionFilter: 'A000-270-XXXX'
  },
  'Mazda': {
    brakePads: 'B25B-33-2XX',
    brakeRotors: 'B25B-33-2XX',
    wheelHubs: 'B25B-26-1XX',
    wheelBearings: 'B25B-26-1XX',
    airFilter: 'B61P-13-2XX',
    cabinFilter: 'B61P-61-JXX',
    oilFilter: 'B6Y1-14-3XX',
    fuelFilter: 'B61P-13-4XX',
    transmissionFilter: 'B61P-19-4XX'
  },
  'Nissan': {
    brakePads: '41060-XXXXX',
    brakeRotors: '40200-XXXXX',
    wheelHubs: '40201-XXXXX',
    wheelBearings: '40201-XXXXX',
    airFilter: '16546-XXXXX',
    cabinFilter: '27275-XXXXX',
    oilFilter: '15208-XXXXX',
    fuelFilter: '16400-XXXXX',
    transmissionFilter: '31707-XXXXX'
  },
  'Porsche': {
    brakePads: '997.351.939.XX',
    brakeRotors: '997.351.041.XX',
    wheelHubs: '997.331.031.XX',
    wheelBearings: '999.094.016.XX',
    airFilter: '997.110.956.XX',
    cabinFilter: '997.572.087.XX',
    oilFilter: '999.917.557.XX',
    fuelFilter: '997.201.901.XX',
    transmissionFilter: '997.106.021.XX'
  },
  'Volkswagen': {
    brakePads: '1J0-698-XXX',
    brakeRotors: '1J0-615-XXX',
    wheelHubs: '1J0-407-XXX',
    wheelBearings: '1J0-407-XXX',
    airFilter: '1J0-129-XXX',
    cabinFilter: '1K1-819-XXX',
    oilFilter: '06A-115-XXX',
    fuelFilter: '1J0-201-XXX',
    transmissionFilter: '01M-325-XXX'
  },
  'Audi': {
    brakePads: '8E0-698-XXX',
    brakeRotors: '8E0-615-XXX',
    wheelHubs: '8E0-407-XXX',
    wheelBearings: '8E0-407-XXX',
    airFilter: '8E0-129-XXX',
    cabinFilter: '8E1-819-XXX',
    oilFilter: '06A-115-XXX',
    fuelFilter: '8E0-201-XXX',
    transmissionFilter: '01V-325-XXX'
  },
  'Lexus': {
    brakePads: '04465-XXXXX',
    brakeRotors: '43512-XXXXX',
    wheelHubs: '43530-XXXXX',
    wheelBearings: '90369-XXXXX',
    airFilter: '17801-XXXXX',
    cabinFilter: '87139-XXXXX',
    oilFilter: '90915-XXXXX',
    fuelFilter: '23300-XXXXX',
    transmissionFilter: '35330-XXXXX'
  },
  'Acura': {
    brakePads: '45022-XXXXX',
    brakeRotors: '45251-XXXXX',
    wheelHubs: '44700-XXXXX',
    wheelBearings: '44300-XXXXX',
    airFilter: '17220-XXXXX',
    cabinFilter: '80292-XXXXX',
    oilFilter: '15400-XXXXX',
    fuelFilter: '16900-XXXXX',
    transmissionFilter: '25430-XXXXX'
  },
  'Infiniti': {
    brakePads: '41060-XXXXX',
    brakeRotors: '40200-XXXXX',
    wheelHubs: '40201-XXXXX',
    wheelBearings: '40201-XXXXX',
    airFilter: '16546-XXXXX',
    cabinFilter: '27275-XXXXX',
    oilFilter: '15208-XXXXX',
    fuelFilter: '16400-XXXXX',
    transmissionFilter: '31707-XXXXX'
  },
  'Dodge': {
    brakePads: 'Mopar 6803XXXXX',
    brakeRotors: 'Mopar 6803XXXXX',
    wheelHubs: 'Mopar 6802XXXXX',
    wheelBearings: 'Mopar 6802XXXXX',
    airFilter: 'Mopar 5303XXXXX',
    cabinFilter: 'Mopar 6827XXXXX',
    oilFilter: 'Mopar 5281XXXXX',
    fuelFilter: 'Mopar 5303XXXXX',
    transmissionFilter: 'Mopar 5301XXXXX'
  },
  'Ram': {
    brakePads: 'Mopar 6803XXXXX',
    brakeRotors: 'Mopar 6803XXXXX',
    wheelHubs: 'Mopar 6802XXXXX',
    wheelBearings: 'Mopar 6802XXXXX',
    airFilter: 'Mopar 5303XXXXX',
    cabinFilter: 'Mopar 6827XXXXX',
    oilFilter: 'Mopar 5281XXXXX',
    fuelFilter: 'Mopar 5303XXXXX',
    transmissionFilter: 'Mopar 5301XXXXX'
  },
  'GMC': {
    brakePads: 'ACDelco 17DXXX',
    brakeRotors: 'ACDelco 18AXXX',
    wheelHubs: 'ACDelco 19AXXX',
    wheelBearings: 'ACDelco 45BXXX',
    airFilter: 'ACDelco AXXXXX',
    cabinFilter: 'ACDelco CFXXX',
    oilFilter: 'ACDelco PFXXXX',
    fuelFilter: 'ACDelco GFXXXX',
    transmissionFilter: 'ACDelco TFXXX'
  },
  'Jeep': {
    brakePads: 'Mopar 6803XXXXX',
    brakeRotors: 'Mopar 6803XXXXX',
    wheelHubs: 'Mopar 6802XXXXX',
    wheelBearings: 'Mopar 6802XXXXX',
    airFilter: 'Mopar 5303XXXXX',
    cabinFilter: 'Mopar 6827XXXXX',
    oilFilter: 'Mopar 5281XXXXX',
    fuelFilter: 'Mopar 5303XXXXX',
    transmissionFilter: 'Mopar 5301XXXXX'
  },
  'Buick': {
    brakePads: 'ACDelco 17DXXX',
    brakeRotors: 'ACDelco 18AXXX',
    wheelHubs: 'ACDelco 19AXXX',
    wheelBearings: 'ACDelco 45BXXX',
    airFilter: 'ACDelco AXXXXX',
    cabinFilter: 'ACDelco CFXXX',
    oilFilter: 'ACDelco PFXXXX',
    fuelFilter: 'ACDelco GFXXXX',
    transmissionFilter: 'ACDelco TFXXX'
  },
  'Cadillac': {
    brakePads: 'ACDelco 17DXXX',
    brakeRotors: 'ACDelco 18AXXX',
    wheelHubs: 'ACDelco 19AXXX',
    wheelBearings: 'ACDelco 45BXXX',
    airFilter: 'ACDelco AXXXXX',
    cabinFilter: 'ACDelco CFXXX',
    oilFilter: 'ACDelco PFXXXX',
    fuelFilter: 'ACDelco GFXXXX',
    transmissionFilter: 'ACDelco TFXXX'
  },
  'Chrysler': {
    brakePads: 'Mopar 6803XXXXX',
    brakeRotors: 'Mopar 6803XXXXX',
    wheelHubs: 'Mopar 6802XXXXX',
    wheelBearings: 'Mopar 6802XXXXX',
    airFilter: 'Mopar 5303XXXXX',
    cabinFilter: 'Mopar 6827XXXXX',
    oilFilter: 'Mopar 5281XXXXX',
    fuelFilter: 'Mopar 5303XXXXX',
    transmissionFilter: 'Mopar 5301XXXXX'
  },
  'Hyundai': {
    brakePads: '58201-XXXXX',
    brakeRotors: '58111-XXXXX',
    wheelHubs: '59700-XXXXX',
    wheelBearings: '59700-XXXXX',
    airFilter: '28113-XXXXX',
    cabinFilter: '97133-XXXXX',
    oilFilter: '26300-XXXXX',
    fuelFilter: '31910-XXXXX',
    transmissionFilter: '46800-XXXXX'
  },
  'Kia': {
    brakePads: '58201-XXXXX',
    brakeRotors: '58111-XXXXX',
    wheelHubs: '59700-XXXXX',
    wheelBearings: '59700-XXXXX',
    airFilter: '28113-XXXXX',
    cabinFilter: '97133-XXXXX',
    oilFilter: '26300-XXXXX',
    fuelFilter: '31910-XXXXX',
    transmissionFilter: '46800-XXXXX'
  },
  'Lincoln': {
    brakePads: 'Motorcraft BRF-XXX',
    brakeRotors: 'Motorcraft BRR-XXX',
    wheelHubs: 'Motorcraft W-XXX',
    wheelBearings: 'Motorcraft BRG-XXX',
    airFilter: 'Motorcraft FA-XXXX',
    cabinFilter: 'Motorcraft FP-XXXX',
    oilFilter: 'Motorcraft FL-XXXX',
    fuelFilter: 'Motorcraft FG-XXXX',
    transmissionFilter: 'Motorcraft FT-XXXX'
  },
  'Mitsubishi': {
    brakePads: 'MB99XXXXX',
    brakeRotors: 'MB41XXXXX',
    wheelHubs: 'MB37XXXXX',
    wheelBearings: 'MB37XXXXX',
    airFilter: 'MD34XXXXX',
    cabinFilter: 'MD36XXXXX',
    oilFilter: 'MD36XXXXX',
    fuelFilter: 'MD36XXXXX',
    transmissionFilter: 'MD36XXXXX'
  },
  'Volvo': {
    brakePads: '307XXXXX',
    brakeRotors: '312XXXXX',
    wheelHubs: '313XXXXX',
    wheelBearings: '313XXXXX',
    airFilter: '272XXXXX',
    cabinFilter: '307XXXXX',
    oilFilter: '312XXXXX',
    fuelFilter: '307XXXXX',
    transmissionFilter: '313XXXXX'
  }
};

/**
 * Vehicle-specific specifications that override make-level defaults
 * Structure: Make -> Model -> Year (or Year Range) -> Trim-specific specs or base specs
 * 
 * Priority: Trim-specific > Base specs > Make defaults
 * 
 * Key format:
 * - Year range: '2015-2021' (for generations with same specs)
 * - Single year: '2015' or 2015
 * - Trim overrides: trims: { 'Trim Name': { specs } } (most specific)
 * - Base specs: Direct object properties (apply to all trims of that year/range)
 */
export const vehicleSpecificSpecs = {
  'Subaru': {
    'WRX': {
      // 2002-2014 WRX (Bugeye, Blobeye, Hawkeye, Narrowbody) - 5x100 bolt pattern, Group 35 battery, 5W-30 oil
      '2002-2014': {
        tires: {
          tireSizeFront: '205/55R16', // Base trims
          tireSizeRear: '205/55R16',
          tirePressureFront: '33 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x100',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '14"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (Turbo Rated)',
          engineOilCapacity: '4.8 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        },
        trims: {
          'Premium': {
            tires: {
              tireSizeFront: '215/45R17',
              tireSizeRear: '215/45R17',
              wheelBoltPattern: '5x100'
            }
          }
        }
      },
      // 2015-2021 WRX (VA generation) - 5x114.3 bolt pattern, Group 35 battery, 5W-30 oil
      '2015-2021': {
        tires: {
          tireSizeFront: '235/45R17', // Base/Premium trims
          tireSizeRear: '235/45R17',
          tirePressureFront: '33 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '14"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (Turbo Rated)',
          engineOilCapacity: '4.8 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        },
        trims: {
          'Limited': {
            tires: {
              tireSizeFront: '245/40R18',
              tireSizeRear: '245/40R18',
              wheelBoltPattern: '5x114.3'
            }
          }
        }
      },
      // 2022+ WRX (VB generation) - Group 35 battery, 5W-30 oil
      '2022-2024': {
        tires: {
          tireSizeFront: '245/40R18',
          tireSizeRear: '245/40R18',
          tirePressureFront: '33 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '14"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (Turbo Rated)',
          engineOilCapacity: '4.8 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        }
      }
    },
    'STI': {
      // 2004-2007 STI (Bugeye/Blobeye/Hawkeye) - Group 35 battery, 5W-30 oil, Brembo brakes
      '2004-2007': {
        tires: {
          tireSizeFront: '225/45R17',
          tireSizeRear: '225/45R17',
          tirePressureFront: '35 PSI',
          tirePressureRear: '33 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '14"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (Turbo Rated)',
          engineOilCapacity: '4.9 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        },
        torqueValues: {
          brake: {
            caliperBracketBolts: '80 ft-lb (Brembo)',
            caliperSlidePins: '20-30 ft-lb',
            brakeLineFittings: '10-15 ft-lb'
          }
        },
        partsSKUs: {
          brakePads: '26296-FE000 (Front), 26296-FE010 (Rear)',
          brakeRotors: '26301-FE000 (Front), 26301-FE010 (Rear)',
          brakeCaliper: 'Brembo 4-piston front, 2-piston rear'
        }
      },
      // 2008-2014 STI (Widebody) - Group 35 battery, 5W-30 oil, Brembo brakes
      '2008-2014': {
        tires: {
          tireSizeFront: '245/40R18',
          tireSizeRear: '245/40R18',
          tirePressureFront: '35 PSI',
          tirePressureRear: '33 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '14"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (Turbo Rated)',
          engineOilCapacity: '4.9 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        },
        torqueValues: {
          brake: {
            caliperBracketBolts: '80 ft-lb (Brembo)',
            caliperSlidePins: '20-30 ft-lb',
            brakeLineFittings: '10-15 ft-lb'
          }
        },
        partsSKUs: {
          brakePads: '26296-FE000 (Front), 26296-FE010 (Rear)',
          brakeRotors: '26301-FE000 (Front), 26301-FE010 (Rear)',
          brakeCaliper: 'Brembo 4-piston front, 2-piston rear'
        }
      },
      // 2015-2021 STI (VA generation) - Group 35 battery, 5W-30 oil, Brembo brakes
      '2015-2021': {
        tires: {
          tireSizeFront: '245/40R18',
          tireSizeRear: '245/40R18',
          tirePressureFront: '35 PSI',
          tirePressureRear: '33 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '14"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (Turbo Rated)',
          engineOilCapacity: '4.9 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        },
        torqueValues: {
          brake: {
            caliperBracketBolts: '80 ft-lb (Brembo)',
            caliperSlidePins: '20-30 ft-lb',
            brakeLineFittings: '10-15 ft-lb'
          }
        },
        partsSKUs: {
          brakePads: '26296-FE000 (Front), 26296-FE010 (Rear)',
          brakeRotors: '26301-FE000 (Front), 26301-FE010 (Rear)',
          brakeCaliper: 'Brembo 4-piston front, 2-piston rear'
        }
      }
    },
    'Forester': {
      // 1998-2002 Forester (first generation, no XT) - 5W-30 oil, Group 35 battery
      '1998-2002': {
        tires: {
          tireSizeFront: '215/60R16',
          tireSizeRear: '215/60R16',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x100',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '18"',
          wiperBladeRear: '12"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.4 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        }
      },
      // 2003-2013 Forester (second/third generation, XT with 2.5L turbo) - 5W-30 oil, Group 35 battery
      '2003-2013': {
        tires: {
          tireSizeFront: '215/60R16', // Base trims
          tireSizeRear: '215/60R16',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x100',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '18"',
          wiperBladeRear: '12"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.4 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        },
        trims: {
          'XT': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (Turbo Rated)',
              engineOilCapacity: '5.0 quarts'
            }
          },
          'XT Premium': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (Turbo Rated)',
              engineOilCapacity: '5.0 quarts'
            }
          },
          'XT Limited': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (Turbo Rated)',
              engineOilCapacity: '5.0 quarts'
            }
          }
        }
      },
      // 2014-2018 Forester (fourth generation, XT with 2.0L turbo) - 0W-20 for non-turbo, 5W-30 for XT
      '2014-2018': {
        tires: {
          tireSizeFront: '225/60R17', // Base trims
          tireSizeRear: '225/60R17',
          tirePressureFront: '33 PSI',
          tirePressureRear: '33 PSI',
          wheelBoltPattern: '5x100',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '18"',
          wiperBladeRear: '12"'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.8 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        },
        trims: {
          'XT': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (Turbo Rated)',
              engineOilCapacity: '5.3 quarts'
            }
          },
          'XT Premium': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (Turbo Rated)',
              engineOilCapacity: '5.3 quarts'
            }
          },
          'XT Touring': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (Turbo Rated)',
              engineOilCapacity: '5.3 quarts'
            }
          }
        }
      },
      // 2019-2024 Forester (fifth generation, no XT) - 0W-20 oil, Group 35 battery
      '2019-2024': {
        tires: {
          tireSizeFront: '225/60R17',
          tireSizeRear: '225/60R17',
          tirePressureFront: '33 PSI',
          tirePressureRear: '33 PSI',
          wheelBoltPattern: '5x100',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '18"',
          wiperBladeRear: '12"'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.8 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        }
      }
    },
    'Outback': {
      // 1995-2014 Outback (non-turbo) - 5W-30 oil for older models, Group 35 battery
      '1995-2014': {
        tires: {
          tireSizeFront: '225/60R16', // Base trims
          tireSizeRear: '225/60R16',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x100',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '18"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.2 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        },
        trims: {
          'XT': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (Turbo Rated)',
              engineOilCapacity: '5.0 quarts'
            }
          }
        }
      },
      // 2015-2024 Outback (non-turbo 2.5L H4) - 0W-20 oil, Group 35 battery
      '2015-2024': {
        tires: {
          tireSizeFront: '225/65R17', // Base trims
          tireSizeRear: '225/65R17',
          tirePressureFront: '33 PSI',
          tirePressureRear: '33 PSI',
          wheelBoltPattern: '5x100',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '18"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '5.1 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        },
        trims: {
          'XT': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '5.3 quarts'
            }
          },
          'Onyx Edition': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '5.3 quarts'
            }
          },
          'Wilderness': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '5.3 quarts'
            }
          }
        }
      }
    },
    'Impreza': {
      // 1993-2014 Impreza (non-turbo) - 5W-30 oil for older models, Group 35 battery
      '1993-2014': {
        tires: {
          tireSizeFront: '185/70R14', // Base trims (varies by year)
          tireSizeRear: '185/70R14',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x100',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '18"',
          wiperBladeRear: '14"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.2 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        }
      },
      // 2015-2024 Impreza (2.0L H4) - 0W-20 oil, Group 35 battery
      '2015-2024': {
        tires: {
          tireSizeFront: '205/55R16', // Base trims
          tireSizeRear: '205/55R16',
          tirePressureFront: '33 PSI',
          tirePressureRear: '33 PSI',
          wheelBoltPattern: '5x100',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '18"',
          wiperBladeRear: '12"'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.8 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        }
      }
    },
    'Crosstrek': {
      // 2013-2024 Crosstrek (2.0L and 2.5L H4) - 0W-20 oil, Group 35 battery (all years use 0W-20)
      '2013-2024': {
        tires: {
          tireSizeFront: '225/60R17', // Base trims
          tireSizeRear: '225/60R17',
          tirePressureFront: '33 PSI',
          tirePressureRear: '33 PSI',
          wheelBoltPattern: '5x100',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '18"',
          wiperBladeRear: '12"'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.8 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        }
      }
    },
    'Ascent': {
      // 2019-2024 Ascent (2.4L H4 Turbo) - 0W-20 oil, Group 35 battery
      '2019-2024': {
        tires: {
          tireSizeFront: '245/60R18', // Base trims
          tireSizeRear: '245/60R18',
          tirePressureFront: '33 PSI',
          tirePressureRear: '33 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '5.3 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        }
      }
    },
    'Legacy': {
      // 1990-2014 Legacy (non-turbo) - 5W-30 oil for older models, Group 35 battery
      '1990-2014': {
        tires: {
          tireSizeFront: '205/60R15', // Base trims (varies by year)
          tireSizeRear: '205/60R15',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x100',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '18"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.2 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        },
        trims: {
          'GT': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (Turbo Rated)',
              engineOilCapacity: '5.0 quarts'
            }
          }
        }
      },
      // 2015-2024 Legacy (non-turbo 2.5L H4) - 0W-20 oil, Group 35 battery
      '2015-2024': {
        tires: {
          tireSizeFront: '225/55R17', // Base trims
          tireSizeRear: '225/55R17',
          tirePressureFront: '33 PSI',
          tirePressureRear: '33 PSI',
          wheelBoltPattern: '5x100',
          lugNutTorque: '65-87 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '18"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '5.1 quarts',
          transmissionFluid: 'Subaru ATF',
          coolant: 'Subaru Super Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Subaru PSF',
          differential: '75W-90'
        },
        trims: {
          'Sport': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '5.3 quarts'
            }
          },
          'XT': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '5.3 quarts'
            }
          }
        }
      }
    }
  },
  'Toyota': {
    'Camry': {
      // 1983-2009 Camry - 5W-30 oil for older models
      '1983-2009': {
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.5 quarts',
          transmissionFluid: 'Toyota WS',
          coolant: 'Toyota Super Long Life',
          brakeFluid: 'DOT 3',
          powerSteering: 'ATF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      },
      // 2010-2024 Camry - 0W-20 oil for newer models
      '2010-2024': {
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.6 quarts',
          transmissionFluid: 'Toyota WS',
          coolant: 'Toyota Super Long Life',
          brakeFluid: 'DOT 3',
          powerSteering: 'ATF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        },
        trims: {
          'V6': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '6.4 quarts'
            }
          },
          'TRD': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '6.4 quarts'
            }
          }
        }
      }
    },
    'Corolla': {
      // 1983-2009 Corolla - 5W-30 oil for older models
      '1983-2009': {
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.0 quarts',
          transmissionFluid: 'Toyota WS',
          coolant: 'Toyota Super Long Life',
          brakeFluid: 'DOT 3',
          powerSteering: 'ATF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      },
      // 2010-2024 Corolla - 0W-20 oil for newer models
      '2010-2024': {
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.2 quarts',
          transmissionFluid: 'Toyota WS',
          coolant: 'Toyota Super Long Life',
          brakeFluid: 'DOT 3',
          powerSteering: 'ATF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      }
    },
    'RAV4': {
      // 1996-2009 RAV4 - 5W-30 oil for older models
      '1996-2009': {
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.5 quarts',
          transmissionFluid: 'Toyota WS',
          coolant: 'Toyota Super Long Life',
          brakeFluid: 'DOT 3',
          powerSteering: 'ATF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      },
      // 2010-2024 RAV4 - 0W-20 oil for newer models
      '2010-2024': {
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.6 quarts',
          transmissionFluid: 'Toyota WS',
          coolant: 'Toyota Super Long Life',
          brakeFluid: 'DOT 3',
          powerSteering: 'ATF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      }
    }
  },
  'Honda': {
    'Civic': {
      // 1973-2009 Civic - 5W-30 oil for older models
      '1973-2009': {
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.0 quarts',
          transmissionFluid: 'Honda ATF',
          coolant: 'Honda Type 2',
          brakeFluid: 'DOT 3',
          powerSteering: 'Honda PSF',
          differential: '80W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      },
      // 2010-2024 Civic - 0W-20 oil for newer models
      '2010-2024': {
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.2 quarts',
          transmissionFluid: 'Honda ATF',
          coolant: 'Honda Type 2',
          brakeFluid: 'DOT 3',
          powerSteering: 'Honda PSF',
          differential: '80W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      }
    },
    'Accord': {
      // 1976-2009 Accord - 5W-30 oil for older models
      '1976-2009': {
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.5 quarts',
          transmissionFluid: 'Honda ATF',
          coolant: 'Honda Type 2',
          brakeFluid: 'DOT 3',
          powerSteering: 'Honda PSF',
          differential: '80W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      },
      // 2010-2024 Accord - 0W-20 oil for newer models
      '2010-2024': {
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.2 quarts',
          transmissionFluid: 'Honda ATF',
          coolant: 'Honda Type 2',
          brakeFluid: 'DOT 3',
          powerSteering: 'Honda PSF',
          differential: '80W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        },
        trims: {
          'V6': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '5.0 quarts'
            }
          }
        }
      }
    },
    'CR-V': {
      // 1997-2009 CR-V - 5W-30 oil for older models
      '1997-2009': {
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.5 quarts',
          transmissionFluid: 'Honda ATF',
          coolant: 'Honda Type 2',
          brakeFluid: 'DOT 3',
          powerSteering: 'Honda PSF',
          differential: '80W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      },
      // 2010-2024 CR-V - 0W-20 oil for newer models
      '2010-2024': {
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.2 quarts',
          transmissionFluid: 'Honda ATF',
          coolant: 'Honda Type 2',
          brakeFluid: 'DOT 3',
          powerSteering: 'Honda PSF',
          differential: '80W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      }
    }
  },
  'Mazda': {
    'Mazda3': {
      // 2004-2009 Mazda3 - 5W-30 oil for older models
      '2004-2009': {
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.3 quarts',
          transmissionFluid: 'Mazda ATF',
          coolant: 'Mazda FL22',
          brakeFluid: 'DOT 3',
          powerSteering: 'Mazda PSF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      },
      // 2010-2024 Mazda3 - 0W-20 oil for newer models
      '2010-2024': {
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.5 quarts',
          transmissionFluid: 'Mazda ATF',
          coolant: 'Mazda FL22',
          brakeFluid: 'DOT 3',
          powerSteering: 'Mazda PSF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      }
    },
    'Mazda6': {
      // 2003-2009 Mazda6 - 5W-30 oil for older models
      '2003-2009': {
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.5 quarts',
          transmissionFluid: 'Mazda ATF',
          coolant: 'Mazda FL22',
          brakeFluid: 'DOT 3',
          powerSteering: 'Mazda PSF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      },
      // 2010-2024 Mazda6 - 0W-20 oil for newer models
      '2010-2024': {
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.5 quarts',
          transmissionFluid: 'Mazda ATF',
          coolant: 'Mazda FL22',
          brakeFluid: 'DOT 3',
          powerSteering: 'Mazda PSF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      }
    },
    'CX-5': {
      // 2013-2024 CX-5 - 0W-20 oil (all years use 0W-20)
      '2013-2024': {
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.5 quarts',
          transmissionFluid: 'Mazda ATF',
          coolant: 'Mazda FL22',
          brakeFluid: 'DOT 3',
          powerSteering: 'Mazda PSF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI'
        }
      }
    },
    'MX-5 Miata': {
      // 1990-2005 MX-5 Miata (NA/NB) - 10W-30 or 5W-30 oil
      '1990-2005': {
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.0 quarts',
          transmissionFluid: 'Mazda ATF',
          coolant: 'Mazda FL22',
          brakeFluid: 'DOT 3',
          powerSteering: 'Mazda PSF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '26 PSI',
          tirePressureRear: '26 PSI'
        }
      },
      // 2006-2024 MX-5 Miata (NC/ND) - 5W-30 or 0W-20 oil depending on year
      '2006-2014': {
        recommendedFluids: {
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '4.5 quarts',
          transmissionFluid: 'Mazda ATF',
          coolant: 'Mazda FL22',
          brakeFluid: 'DOT 3',
          powerSteering: 'Mazda PSF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '29 PSI',
          tirePressureRear: '29 PSI'
        }
      },
      // 2015-2024 MX-5 Miata (ND) - 0W-20 oil
      '2015-2024': {
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.5 quarts',
          transmissionFluid: 'Mazda ATF',
          coolant: 'Mazda FL22',
          brakeFluid: 'DOT 3',
          powerSteering: 'Mazda PSF',
          differential: '75W-90'
        },
        tires: {
          tirePressureFront: '29 PSI',
          tirePressureRear: '29 PSI'
        }
      }
    }
  },
  'Ford': {
    'Mustang': {
      // 2015-2023 S550 Mustang (EcoBoost, GT) - Group 94R battery
      '2015-2023': {
        tires: {
          tireSizeFront: '235/55R17', // Base EcoBoost
          tireSizeRear: '235/55R17',
          tirePressureFront: '35 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '100-150 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '5W-20 Synthetic', // Base EcoBoost
          engineOilCapacity: '5.7 quarts',
          transmissionFluid: 'Mercon LV',
          coolant: 'Motorcraft Orange',
          brakeFluid: 'DOT 3',
          powerSteering: 'Mercon V',
          differential: '75W-140'
        },
        trims: {
          'EcoBoost': {
            tires: {
              tireSizeFront: '235/55R17',
              tireSizeRear: '235/55R17',
              wheelBoltPattern: '5x114.3'
            }
          },
          'GT': {
            tires: {
              tireSizeFront: '255/40R19',
              tireSizeRear: '275/40R19',
              wheelBoltPattern: '5x114.3'
            },
            recommendedFluids: {
              engineOil: '5W-30 Synthetic',
              engineOilCapacity: '8.0 quarts'
            }
          },
          'Mach 1': {
            tires: {
              tireSizeFront: '255/40R19',
              tireSizeRear: '275/40R19',
              wheelBoltPattern: '5x114.3'
            },
            recommendedFluids: {
              engineOil: '5W-30 Synthetic',
              engineOilCapacity: '8.0 quarts'
            }
          },
          'Shelby GT350': {
            tires: {
              tireSizeFront: '295/35R19',
              tireSizeRear: '305/35R19',
              tirePressureFront: '32 PSI',
              tirePressureRear: '32 PSI',
              wheelBoltPattern: '5x114.3'
            },
            recommendedFluids: {
              engineOil: '5W-50 Synthetic',
              engineOilCapacity: '10.0 quarts',
              brakeFluid: 'DOT 4'
            },
            torqueValues: {
              brake: {
                caliperBracketBolts: '136 ft-lb (Brembo 6-piston)',
                caliperSlidePins: '20-35 ft-lb',
                brakeLineFittings: '10-18 ft-lb'
              }
            },
            partsSKUs: {
              brakePads: 'Motorcraft BRF-XXX (Brembo 6-piston)',
              brakeRotors: 'Motorcraft BRR-XXX (Brembo specific)',
              brakeCaliper: 'Brembo 6-piston front, 4-piston rear'
            }
          },
          'Shelby GT350R': {
            tires: {
              tireSizeFront: '305/30R19',
              tireSizeRear: '315/30R19',
              wheelBoltPattern: '5x114.3'
            },
            recommendedFluids: {
              engineOil: '5W-50 Synthetic',
              engineOilCapacity: '10.0 quarts',
              brakeFluid: 'DOT 4'
            },
            torqueValues: {
              brake: {
                caliperBracketBolts: '136 ft-lb (Brembo 6-piston)',
                caliperSlidePins: '20-35 ft-lb',
                brakeLineFittings: '10-18 ft-lb'
              }
            },
            partsSKUs: {
              brakePads: 'Motorcraft BRF-XXX (Brembo 6-piston)',
              brakeRotors: 'Motorcraft BRR-XXX (Brembo specific)',
              brakeCaliper: 'Brembo 6-piston front, 4-piston rear'
            }
          },
          'Shelby GT500': {
            tires: {
              tireSizeFront: '305/30R20',
              tireSizeRear: '315/30R20',
              wheelBoltPattern: '5x114.3'
            },
            recommendedFluids: {
              engineOil: '5W-50 Synthetic (Supercharged Rated)',
              engineOilCapacity: '10.0 quarts',
              brakeFluid: 'DOT 4'
            },
            torqueValues: {
              brake: {
                caliperBracketBolts: '136 ft-lb (Brembo 6-piston)',
                caliperSlidePins: '20-35 ft-lb',
                brakeLineFittings: '10-18 ft-lb'
              }
            },
            partsSKUs: {
              brakePads: 'Motorcraft BRF-XXX (Brembo 6-piston)',
              brakeRotors: 'Motorcraft BRR-XXX (Brembo specific)',
              brakeCaliper: 'Brembo 6-piston front, 4-piston rear'
            }
          }
        }
      },
      // 2024+ S650 Mustang - Group 94R battery
      '2024-2024': {
        tires: {
          tireSizeFront: '255/40R19',
          tireSizeRear: '275/40R19',
          tirePressureFront: '35 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '100-150 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        trims: {
          'EcoBoost': {
            tires: {
              tireSizeFront: '255/40R19',
              tireSizeRear: '275/40R19'
            }
          },
          'GT': {
            tires: {
              tireSizeFront: '255/40R19',
              tireSizeRear: '275/40R19'
            }
          }
        }
      }
    }
  },
  'Chevrolet': {
    'Camaro': {
      // 2010-2015 5th Gen Camaro - Group 94R battery
      '2010-2015': {
        tires: {
          tireSizeFront: '245/45R20',
          tireSizeRear: '275/40R20',
          tirePressureFront: '35 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '100 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        trims: {
          'SS': {
            tires: {
              tireSizeFront: '245/45R20',
              tireSizeRear: '275/40R20'
            }
          },
          'ZL1': {
            tires: {
              tireSizeFront: '285/35ZR20',
              tireSizeRear: '305/35ZR20'
            }
          }
        }
      },
      // 2016-2024 6th Gen Camaro - Group 48 AGM battery
      '2016-2024': {
        tires: {
          tireSizeFront: '245/40R20', // LT/LS base
          tireSizeRear: '275/35R20',
          tirePressureFront: '35 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '100 ft-lb'
        },
        hardware: {
          batteryGroupSize: '48 AGM',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          // Default for 2.0L I4 Turbo (LS/LT base)
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '5.0 quarts',
          transmissionFluid: 'Dexron VI',
          coolant: 'Dex-Cool',
          brakeFluid: 'DOT 3',
          powerSteering: 'Power Steering Fluid',
          differential: '75W-90'
        },
        trims: {
          'LS': {
            tires: {
              tireSizeFront: '245/50R18',
              tireSizeRear: '245/50R18'
            },
            recommendedFluids: {
              // 2.0L I4 Turbo
              engineOil: '5W-30 Synthetic',
              engineOilCapacity: '5.0 quarts'
            }
          },
          'LT': {
            tires: {
              tireSizeFront: '245/40R20',
              tireSizeRear: '275/35R20'
            },
            recommendedFluids: {
              // 2.0L I4 Turbo
              engineOil: '5W-30 Synthetic',
              engineOilCapacity: '5.0 quarts'
            }
          },
          'LT 1LE': {
            recommendedFluids: {
              // 2.0L I4 Turbo
              engineOil: '5W-30 Synthetic',
              engineOilCapacity: '5.0 quarts',
              brakeFluid: 'DOT 4'
            },
            torqueValues: {
              brake: {
                caliperBracketBolts: '85-125 ft-lb (Brembo)',
                caliperSlidePins: '20-35 ft-lb',
                brakeLineFittings: '10-18 ft-lb'
              }
            },
            partsSKUs: {
              brakePads: 'ACDelco 17DXXX (Brembo specific)',
              brakeRotors: 'ACDelco 18AXXX (Brembo specific)',
              brakeCaliper: 'Brembo 4-piston front'
            }
          },
          'SS': {
            tires: {
              tireSizeFront: '245/40R20',
              tireSizeRear: '275/35R20'
            },
            recommendedFluids: {
              // LT1 6.2L V8
              engineOil: '5W-30 Synthetic',
              engineOilCapacity: '10.0 quarts'
            }
          },
          'SS 1LE': {
            recommendedFluids: {
              // LT1 6.2L V8
              engineOil: '5W-30 Synthetic',
              engineOilCapacity: '10.0 quarts',
              brakeFluid: 'DOT 4'
            },
            torqueValues: {
              brake: {
                caliperBracketBolts: '85-125 ft-lb (Brembo)',
                caliperSlidePins: '20-35 ft-lb',
                brakeLineFittings: '10-18 ft-lb'
              }
            },
            partsSKUs: {
              brakePads: 'ACDelco 17DXXX (Brembo specific)',
              brakeRotors: 'ACDelco 18AXXX (Brembo specific)',
              brakeCaliper: 'Brembo 6-piston front, 4-piston rear'
            }
          },
          'ZL1': {
            tires: {
              tireSizeFront: '285/30ZR20',
              tireSizeRear: '305/30ZR20',
              tirePressureFront: '32 PSI',
              tirePressureRear: '32 PSI'
            },
            recommendedFluids: {
              engineOil: '5W-50 Synthetic (Supercharged Rated)',
              engineOilCapacity: '10.0 quarts',
              brakeFluid: 'DOT 4'
            },
            torqueValues: {
              brake: {
                caliperBracketBolts: '30 ft-lb + 90° (Brembo)',
                caliperSlidePins: '20-35 ft-lb',
                brakeLineFittings: '10-18 ft-lb'
              }
            },
            partsSKUs: {
              brakePads: 'ACDelco 17DXXX (Brembo specific)',
              brakeRotors: 'ACDelco 18AXXX (Brembo specific)',
              brakeCaliper: 'Brembo 6-piston front, 4-piston rear'
            }
          },
          'Z28': {
            tires: {
              tireSizeFront: '305/30ZR19',
              tireSizeRear: '305/30ZR19'
            },
            recommendedFluids: {
              engineOil: '5W-50 Synthetic',
              engineOilCapacity: '10.0 quarts',
              brakeFluid: 'DOT 4'
            }
          }
        }
      }
    }
  },
  'Dodge': {
    'Challenger': {
      // 2008-2024 Challenger (LX platform) - Group 94R battery
      '2008-2024': {
        tires: {
          tireSizeFront: '235/55R18', // Base SXT
          tireSizeRear: '235/55R18',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x115',
          lugNutTorque: '100-130 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        trims: {
          'SXT': {
            tires: {
              tireSizeFront: '235/55R18',
              tireSizeRear: '235/55R18'
            }
          },
          'RT': {
            tires: {
              tireSizeFront: '245/45R20',
              tireSizeRear: '245/45R20'
            }
          },
          'Scat Pack': {
            tires: {
              tireSizeFront: '245/45ZR20',
              tireSizeRear: '275/40ZR20'
            }
          },
          'Hellcat': {
            tires: {
              tireSizeFront: '275/40ZR20',
              tireSizeRear: '315/35ZR20',
              tirePressureFront: '32 PSI',
              tirePressureRear: '32 PSI'
            },
            recommendedFluids: {
              engineOil: '0W-40 Synthetic (Supercharged Rated)',
              engineOilCapacity: '7.0 quarts',
              brakeFluid: 'DOT 4'
            },
            torqueValues: {
              brake: {
                caliperBracketBolts: '85-125 ft-lb (Brembo)',
                caliperSlidePins: '20-35 ft-lb',
                brakeLineFittings: '10-18 ft-lb'
              }
            },
            partsSKUs: {
              brakePads: 'Mopar 6803XXXXX (Brembo specific)',
              brakeRotors: 'Mopar 6803XXXXX (Brembo specific)',
              brakeCaliper: 'Brembo 6-piston front, 4-piston rear'
            }
          },
          'Redeye': {
            tires: {
              tireSizeFront: '275/40ZR20',
              tireSizeRear: '315/35ZR20'
            },
            recommendedFluids: {
              engineOil: '0W-40 Synthetic (Supercharged Rated)',
              engineOilCapacity: '7.0 quarts',
              brakeFluid: 'DOT 4'
            },
            torqueValues: {
              brake: {
                caliperBracketBolts: '85-125 ft-lb (Brembo)',
                caliperSlidePins: '20-35 ft-lb',
                brakeLineFittings: '10-18 ft-lb'
              }
            },
            partsSKUs: {
              brakePads: 'Mopar 6803XXXXX (Brembo specific)',
              brakeRotors: 'Mopar 6803XXXXX (Brembo specific)',
              brakeCaliper: 'Brembo 6-piston front, 4-piston rear'
            }
          },
          'Demon': {
            tires: {
              tireSizeFront: '315/40R18',
              tireSizeRear: '315/40R18'
            },
            recommendedFluids: {
              engineOil: '0W-40 Synthetic (Supercharged Rated)',
              engineOilCapacity: '7.0 quarts',
              brakeFluid: 'DOT 4'
            },
            torqueValues: {
              brake: {
                caliperBracketBolts: '85-125 ft-lb (Brembo)',
                caliperSlidePins: '20-35 ft-lb',
                brakeLineFittings: '10-18 ft-lb'
              }
            },
            partsSKUs: {
              brakePads: 'Mopar 6803XXXXX (Brembo specific)',
              brakeRotors: 'Mopar 6803XXXXX (Brembo specific)',
              brakeCaliper: 'Brembo 6-piston front, 4-piston rear'
            }
          }
        }
      }
    },
    'Charger': {
      // 2006-2024 Charger (LX platform) - Group 94R battery
      '2006-2024': {
        tires: {
          tireSizeFront: '225/60R18',
          tireSizeRear: '225/60R18',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x115',
          lugNutTorque: '100-130 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        trims: {
          'SXT': {
            tires: {
              tireSizeFront: '225/60R18',
              tireSizeRear: '225/60R18'
            }
          },
          'RT': {
            tires: {
              tireSizeFront: '245/45R20',
              tireSizeRear: '245/45R20'
            }
          },
          'Scat Pack': {
            tires: {
              tireSizeFront: '245/45ZR20',
              tireSizeRear: '275/40ZR20'
            }
          },
          'Hellcat': {
            tires: {
              tireSizeFront: '275/40ZR20',
              tireSizeRear: '315/35ZR20'
            }
          },
          'Redeye': {
            tires: {
              tireSizeFront: '275/40ZR20',
              tireSizeRear: '315/35ZR20'
            }
          }
        }
      }
    }
  },
  'Honda': {
    'Civic': {
      // 2016-2021 10th Gen Civic - Group 51R battery
      '2016-2021': {
        tires: {
          tireSizeFront: '215/55R16', // Base trims
          tireSizeRear: '215/55R16',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '80-108 ft-lb'
        },
        hardware: {
          batteryGroupSize: '51R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '14"'
        },
        trims: {
          'Si': {
            tires: {
              tireSizeFront: '235/40R18',
              tireSizeRear: '235/40R18',
              tirePressureFront: '35 PSI',
              tirePressureRear: '35 PSI'
            }
          },
          'Type R': {
            tires: {
              tireSizeFront: '245/30R20',
              tireSizeRear: '245/30R20',
              tirePressureFront: '35 PSI',
              tirePressureRear: '35 PSI',
              wheelBoltPattern: '5x120'
            },
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '4.2 quarts',
              brakeFluid: 'DOT 4'
            },
            torqueValues: {
              brake: {
                caliperBracketBolts: '37-50 ft-lb (Brembo)',
                caliperSlidePins: '18-26 ft-lb',
                brakeLineFittings: '10-15 ft-lb'
              }
            },
            partsSKUs: {
              brakePads: '45022-TGH-A01 (Front), 43022-TGH-A01 (Rear)',
              brakeRotors: '09.C338.11 (Front), 08.D713.11 (Rear)',
              brakeCaliper: 'Brembo 4-piston front'
            }
          }
        }
      },
      // 2022+ 11th Gen Civic - Group 51R battery
      '2022-2024': {
        tires: {
          tireSizeFront: '215/55R16',
          tireSizeRear: '215/55R16',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '80-108 ft-lb'
        },
        hardware: {
          batteryGroupSize: '51R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '14"'
        },
        trims: {
          'Si': {
            tires: {
              tireSizeFront: '235/40R18',
              tireSizeRear: '235/40R18'
            }
          },
          'Type R': {
            tires: {
              tireSizeFront: '265/30R19',
              tireSizeRear: '265/30R19',
              wheelBoltPattern: '5x120'
            },
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '4.2 quarts',
              brakeFluid: 'DOT 4'
            }
          }
        }
      }
    }
  },
  'Acura': {
    'Integra': {
      '2023-2024': {
        tires: {
          tireSizeFront: '235/40R18',
          tireSizeRear: '235/40R18',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '80-108 ft-lb'
        },
        trims: {
          'A-Spec': {
            tires: {
              tireSizeFront: '235/40R18',
              tireSizeRear: '235/40R18'
            }
          },
          'Type S': {
            tires: {
              tireSizeFront: '255/35ZR19',
              tireSizeRear: '265/30ZR19',
              wheelBoltPattern: '5x114.3'
            }
          }
        }
      }
    },
    'TLX': {
      '2015-2020': {
        tires: {
          tireSizeFront: '235/50R18',
          tireSizeRear: '235/50R18',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '80-108 ft-lb'
        },
        trims: {
          'Type S': {
            tires: {
              tireSizeFront: '245/40R19',
              tireSizeRear: '245/40R19'
            }
          }
        }
      },
      '2021-2024': {
        tires: {
          tireSizeFront: '235/50R18',
          tireSizeRear: '235/50R18',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '80-108 ft-lb'
        },
        trims: {
          'Type S': {
            tires: {
              tireSizeFront: '255/40ZR20',
              tireSizeRear: '275/35ZR20'
            }
          }
        }
      }
    }
  },
  'BMW': {
    '2 Series': {
      // 2014-2024 2 Series (F22/F23/F87)
      '2014-2024': {
        tires: {
          tireSizeFront: '225/45R17',
          tireSizeRear: '245/40R17',
          tirePressureFront: '32 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (BMW LL-01)',
          engineOilCapacity: '5.0 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          'M2': {
            tires: {
              tireSizeFront: '245/35ZR19',
              tireSizeRear: '265/35ZR19',
              tirePressureFront: '32 PSI',
              tirePressureRear: '32 PSI'
            },
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '6.5 quarts'
            }
          },
          'M2 Competition': {
            tires: {
              tireSizeFront: '245/35ZR19',
              tireSizeRear: '265/35ZR19',
              tirePressureFront: '32 PSI',
              tirePressureRear: '32 PSI'
            },
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '6.5 quarts'
            }
          }
        }
      }
    },
    '3 Series': {
      // 1975-2018 3 Series (E21/E30/E36/E46/E90/F30) - 5W-30 oil
      '1975-2018': {
        tires: {
          tireSizeFront: '225/50R16',
          tireSizeRear: '225/50R16',
          tirePressureFront: '32 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '16"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (BMW LL-01)',
          engineOilCapacity: '6.5 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          'M3': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '7.0 quarts'
            }
          }
        }
      },
      // 2019-2024 3 Series (G20) - 0W-20 or 5W-30 depending on engine
      '2019-2024': {
        tires: {
          tireSizeFront: '225/45R18',
          tireSizeRear: '255/40R18',
          tirePressureFront: '32 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '16"'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
          engineOilCapacity: '5.0 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          'M340i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '6.5 quarts'
            }
          },
          'M3': {
            tires: {
              tireSizeFront: '275/35ZR19',
              tireSizeRear: '285/30ZR20',
              tirePressureFront: '32 PSI',
              tirePressureRear: '32 PSI'
            },
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '7.0 quarts'
            }
          },
          'M3 Competition': {
            tires: {
              tireSizeFront: '275/35ZR19',
              tireSizeRear: '285/30ZR20',
              tirePressureFront: '32 PSI',
              tirePressureRear: '32 PSI'
            },
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '7.0 quarts'
            }
          }
        }
      }
    },
    '4 Series': {
      // 2014-2024 4 Series (F32/F33/F36/G22) - 5W-30 or 0W-20 depending on year
      '2014-2018': {
        tires: {
          tireSizeFront: '225/50R17',
          tireSizeRear: '255/45R17',
          tirePressureFront: '32 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (BMW LL-01)',
          engineOilCapacity: '6.5 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          'M4': {
            tires: {
              tireSizeFront: '255/35ZR19',
              tireSizeRear: '275/35ZR19',
              tirePressureFront: '32 PSI',
              tirePressureRear: '32 PSI'
            },
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '7.0 quarts'
            }
          }
        }
      },
      '2019-2024': {
        tires: {
          tireSizeFront: '225/50R17',
          tireSizeRear: '255/45R17',
          tirePressureFront: '32 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
          engineOilCapacity: '5.0 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          'M440i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '6.5 quarts'
            }
          },
          'M4': {
            tires: {
              tireSizeFront: '275/35ZR19',
              tireSizeRear: '285/30ZR20',
              tirePressureFront: '32 PSI',
              tirePressureRear: '32 PSI'
            },
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '7.0 quarts'
            }
          },
          'M4 Competition': {
            tires: {
              tireSizeFront: '275/35ZR19',
              tireSizeRear: '285/30ZR20',
              tirePressureFront: '32 PSI',
              tirePressureRear: '32 PSI'
            },
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '7.0 quarts'
            }
          }
        }
      }
    },
    '5 Series': {
      // 1972-2016 5 Series (E12/E28/E34/E39/E60/F10) - 5W-30 oil
      '1972-2016': {
        tires: {
          tireSizeFront: '225/55R17',
          tireSizeRear: '255/50R17',
          tirePressureFront: '32 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '16"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (BMW LL-01)',
          engineOilCapacity: '6.5 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          'M5': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '8.5 quarts'
            }
          }
        }
      },
      // 2017-2024 5 Series (G30) - 0W-20 or 5W-30
      '2017-2024': {
        tires: {
          tireSizeFront: '245/45R18',
          tireSizeRear: '275/40R18',
          tirePressureFront: '32 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '16"'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
          engineOilCapacity: '5.0 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          '540i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '6.5 quarts'
            }
          },
          'M550i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'M5': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'M5 Competition': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '8.5 quarts'
            }
          }
        }
      }
    },
    '7 Series': {
      // 1977-2015 7 Series (E23/E32/E38/E65/F01) - 5W-30 oil
      '1977-2015': {
        tires: {
          tireSizeFront: '245/50R18',
          tireSizeRear: '275/45R18',
          tirePressureFront: '32 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '16"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (BMW LL-01)',
          engineOilCapacity: '7.0 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        }
      },
      // 2016-2024 7 Series (G11/G12) - 0W-20 or 5W-30
      '2016-2024': {
        tires: {
          tireSizeFront: '245/45R19',
          tireSizeRear: '275/40R19',
          tirePressureFront: '32 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '16"'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
          engineOilCapacity: '6.5 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          '750i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'M760i': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '10.0 quarts'
            }
          }
        }
      }
    },
    '8 Series': {
      // 2019-2024 8 Series (G15/G16) - 0W-20 or 5W-30
      '2019-2024': {
        tires: {
          tireSizeFront: '245/35R20',
          tireSizeRear: '275/30R20',
          tirePressureFront: '32 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
          engineOilCapacity: '6.5 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          '850i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'M850i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'M8': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'M8 Competition': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '8.5 quarts'
            }
          }
        }
      }
    },
    'X1': {
      // 2013-2024 X1 (E84/F48/U11) - 5W-30 or 0W-20
      '2013-2022': {
        tires: {
          tireSizeFront: '225/50R17',
          tireSizeRear: '225/50R17',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '16"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (BMW LL-01)',
          engineOilCapacity: '5.0 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        }
      },
      '2023-2024': {
        tires: {
          tireSizeFront: '225/50R17',
          tireSizeRear: '225/50R17',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '16"'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
          engineOilCapacity: '5.0 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        }
      }
    },
    'X3': {
      // 2004-2017 X3 (E83/F25) - 5W-30 oil
      '2004-2017': {
        tires: {
          tireSizeFront: '225/60R17',
          tireSizeRear: '225/60R17',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '16"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (BMW LL-01)',
          engineOilCapacity: '6.5 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        }
      },
      // 2018-2024 X3 (G01) - 0W-20 or 5W-30
      '2018-2024': {
        tires: {
          tireSizeFront: '245/50R18',
          tireSizeRear: '245/50R18',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '24"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '16"'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
          engineOilCapacity: '5.0 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          'M40i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '6.5 quarts'
            }
          },
          'X3 M': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '7.0 quarts'
            }
          },
          'X3 M Competition': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '7.0 quarts'
            }
          }
        }
      }
    },
    'X5': {
      // 2000-2018 X5 (E53/F15) - 5W-30 oil
      '2000-2018': {
        tires: {
          tireSizeFront: '255/55R18',
          tireSizeRear: '255/55R18',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '16"'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (BMW LL-01)',
          engineOilCapacity: '7.0 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          'X5 M': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '8.5 quarts'
            }
          }
        }
      },
      // 2019-2024 X5 (G05) - 0W-20 or 5W-30
      '2019-2024': {
        tires: {
          tireSizeFront: '275/45R20',
          tireSizeRear: '305/40R20',
          tirePressureFront: '32 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '16"'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
          engineOilCapacity: '6.5 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          'xDrive50i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'M50i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'X5 M': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'X5 M Competition': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '8.5 quarts'
            }
          }
        }
      }
    },
    'X6': {
      // 2008-2019 X6 (E71/F16) - 5W-30 oil
      '2008-2019': {
        tires: {
          tireSizeFront: '255/50R19',
          tireSizeRear: '285/45R19',
          tirePressureFront: '32 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '5W-30 Synthetic (BMW LL-01)',
          engineOilCapacity: '7.0 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          'X6 M': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '8.5 quarts'
            }
          }
        }
      },
      // 2020-2024 X6 (G06) - 0W-20 or 5W-30
      '2020-2024': {
        tires: {
          tireSizeFront: '275/45R20',
          tireSizeRear: '305/40R20',
          tirePressureFront: '32 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
          engineOilCapacity: '6.5 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          'xDrive50i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'M50i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'X6 M': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'X6 M Competition': {
            recommendedFluids: {
              engineOil: '5W-30 Synthetic (BMW LL-01)',
              engineOilCapacity: '8.5 quarts'
            }
          }
        }
      }
    },
    'X7': {
      // 2019-2024 X7 (G07) - 0W-20 or 5W-30
      '2019-2024': {
        tires: {
          tireSizeFront: '275/50R20',
          tireSizeRear: '275/50R20',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x120',
          lugNutTorque: '88-103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '94R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: '16"'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
          engineOilCapacity: '6.5 quarts',
          transmissionFluid: 'BMW ATF',
          coolant: 'BMW Coolant',
          brakeFluid: 'DOT 4',
          powerSteering: 'Pentosin CHF 11S',
          differential: '75W-90'
        },
        trims: {
          'xDrive50i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'M50i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '8.5 quarts'
            }
          },
          'M60i': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic (BMW LL-17FE+)',
              engineOilCapacity: '8.5 quarts'
            }
          }
        }
      }
    }
  },
  'Audi': {
    'A4': {
      '2017-2024': {
        tires: {
          tireSizeFront: '245/40R18',
          tireSizeRear: '245/40R18',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x112',
          lugNutTorque: '88-103 ft-lb'
        },
        trims: {
          'S4': {
            tires: {
              tireSizeFront: '255/35ZR19',
              tireSizeRear: '255/35ZR19'
            }
          }
        }
      }
    },
    'S3': {
      '2015-2024': {
        tires: {
          tireSizeFront: '225/40R18',
          tireSizeRear: '225/40R18',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x112',
          lugNutTorque: '88-103 ft-lb'
        }
      }
    },
    'RS3': {
      '2017-2024': {
        tires: {
          tireSizeFront: '255/30ZR19',
          tireSizeRear: '235/35ZR19',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x112',
          lugNutTorque: '88-103 ft-lb'
        }
      }
    }
  },
  'Nissan': {
    '370Z': {
      '2009-2021': {
        tires: {
          tireSizeFront: '225/50R18',
          tireSizeRear: '245/45R18',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '80-108 ft-lb'
        },
        trims: {
          'Nismo': {
            tires: {
              tireSizeFront: '245/40R19',
              tireSizeRear: '285/35R19'
            }
          }
        }
      }
    },
    'GT-R': {
      '2009-2024': {
        tires: {
          tireSizeFront: '255/40ZR20',
          tireSizeRear: '285/35ZR20',
          tirePressureFront: '36 PSI',
          tirePressureRear: '36 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '80-103 ft-lb'
        }
      }
    },
    'Altima': {
      '2019-2024': {
        tires: {
          tireSizeFront: '215/60R16',
          tireSizeRear: '215/60R16',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '80-108 ft-lb'
        },
        trims: {
          'SR VC-Turbo': {
            tires: {
              tireSizeFront: '235/40R19',
              tireSizeRear: '235/40R19'
            }
          }
        }
      }
    }
  },
  'Toyota': {
    'Supra': {
      '2020-2024': {
        tires: {
          tireSizeFront: '255/35ZR19',
          tireSizeRear: '275/35ZR19',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x112',
          lugNutTorque: '88-103 ft-lb'
        },
        trims: {
          '3.0 Premium': {
            tires: {
              tireSizeFront: '255/35ZR19',
              tireSizeRear: '275/35ZR19'
            }
          }
        }
      }
    },
    'Camry': {
      '2018-2024': {
        tires: {
          tireSizeFront: '215/55R17',
          tireSizeRear: '215/55R17',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '76-83 ft-lb'
        },
        trims: {
          'TRD': {
            tires: {
              tireSizeFront: '235/40R19',
              tireSizeRear: '235/40R19'
            }
          }
        }
      }
    }
  },
  'Mitsubishi': {
    'Lancer Evolution': {
      '2008-2015': {
        tires: {
          tireSizeFront: '245/40R18',
          tireSizeRear: '245/40R18',
          tirePressureFront: '35 PSI',
          tirePressureRear: '33 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '80-103 ft-lb'
        },
        trims: {
          'Evolution X GSR': {
            tires: {
              tireSizeFront: '245/40R18',
              tireSizeRear: '245/40R18'
            }
          },
          'Evolution X MR': {
            tires: {
              tireSizeFront: '245/40R18',
              tireSizeRear: '245/40R18'
            }
          }
        }
      }
    }
  },
  'Ford': {
    'F-150': {
      '2015-2024': {
        tires: {
          tireSizeFront: '275/65R18', // Base trims
          tireSizeRear: '275/65R18',
          tirePressureFront: '35 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '6x135',
          lugNutTorque: '150 ft-lb'
        },
        trims: {
          'Raptor': {
            tires: {
              tireSizeFront: '315/70R17',
              tireSizeRear: '315/70R17',
              tirePressureFront: '38 PSI',
              tirePressureRear: '38 PSI'
            }
          },
          'Tremor': {
            tires: {
              tireSizeFront: '275/70R18',
              tireSizeRear: '275/70R18'
            }
          }
        }
      }
    }
  },
  'Chevrolet': {
    'Silverado': {
      '2019-2024': {
        tires: {
          tireSizeFront: '265/70R17',
          tireSizeRear: '265/70R17',
          tirePressureFront: '35 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '6x139.7',
          lugNutTorque: '140 ft-lb'
        },
        hardware: {
          batteryGroupSize: '48 AGM',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          // Default for 2.7L TurboMax (most common base engine)
          engineOil: '5W-30 Synthetic',
          engineOilCapacity: '6.0 quarts',
          transmissionFluid: 'Dexron VI',
          coolant: 'Dex-Cool',
          brakeFluid: 'DOT 3',
          powerSteering: 'Power Steering Fluid',
          differential: '75W-90'
        },
        trims: {
          'Custom Trail Boss': {
            tires: {
              tireSizeFront: '275/65R18',
              tireSizeRear: '275/65R18'
            }
          },
          'LT Trail Boss': {
            tires: {
              tireSizeFront: '275/65R18',
              tireSizeRear: '275/65R18'
            }
          },
          'RST': {
            recommendedFluids: {
              // 5.3L V8 EcoTec
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '8.0 quarts'
            }
          },
          'LTZ': {
            recommendedFluids: {
              // 5.3L V8 EcoTec (standard), optional 6.2L or 3.0L Duramax
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '8.0 quarts'
            }
          },
          'High Country': {
            recommendedFluids: {
              // 5.3L V8 EcoTec (standard), optional 6.2L or 3.0L Duramax
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '8.0 quarts'
            }
          },
          'ZR2': {
            recommendedFluids: {
              // 3.0L Duramax Turbo Diesel (standard), optional 6.2L V8
              engineOil: '0W-20 Synthetic Diesel (DexosD)',
              engineOilCapacity: '10.0 quarts'
            }
          }
        }
      }
    },
    'Corvette': {
      '2020-2024': {
        tires: {
          tireSizeFront: '245/35ZR19',
          tireSizeRear: '305/30ZR20',
          tirePressureFront: '30 PSI',
          tirePressureRear: '30 PSI',
          wheelBoltPattern: '5x120.65',
          lugNutTorque: '100 ft-lb'
        },
        hardware: {
          batteryGroupSize: '48 AGM',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          // Default for Stingray (LT2 6.2L V8)
          engineOil: '0W-40 Synthetic (Dexos 2)',
          engineOilCapacity: '7.5 quarts',
          transmissionFluid: 'Dexron VI',
          coolant: 'Dex-Cool',
          brakeFluid: 'DOT 4',
          powerSteering: 'Power Steering Fluid',
          differential: '75W-90'
        },
        trims: {
          'Stingray': {
            recommendedFluids: {
              // LT2 6.2L V8
              engineOil: '0W-40 Synthetic (Dexos 2)',
              engineOilCapacity: '7.5 quarts'
            }
          },
          'Z06': {
            tires: {
              tireSizeFront: '275/30ZR20',
              tireSizeRear: '345/25ZR21'
            },
            recommendedFluids: {
              // LT6 5.5L V8 (flat-plane crank)
              engineOil: '0W-40 Synthetic (Dexos 2)',
              engineOilCapacity: '7.5 quarts',
              brakeFluid: 'DOT 4'
            }
          },
          'ZR1': {
            tires: {
              tireSizeFront: '275/30ZR20',
              tireSizeRear: '345/25ZR21'
            },
            recommendedFluids: {
              // LT5 5.5L V8 Supercharged
              engineOil: '0W-40 Synthetic (Dexos 2)',
              engineOilCapacity: '7.5 quarts',
              brakeFluid: 'DOT 4'
            }
          },
          'Grand Sport': {
            recommendedFluids: {
              // LT1 6.2L V8 (C7 Grand Sport, but included for completeness)
              engineOil: '0W-40 Synthetic (Dexos 2)',
              engineOilCapacity: '7.5 quarts',
              brakeFluid: 'DOT 4'
            }
          }
        }
      }
    },
    'Tahoe': {
      '2015-2024': {
        tires: {
          tireSizeFront: '265/70R17',
          tireSizeRear: '265/70R17',
          tirePressureFront: '35 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '6x139.7',
          lugNutTorque: '140 ft-lb'
        },
        hardware: {
          batteryGroupSize: '48 AGM',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          // Default for 5.3L V8 (most common)
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '8.0 quarts',
          transmissionFluid: 'Dexron VI',
          coolant: 'Dex-Cool',
          brakeFluid: 'DOT 3',
          powerSteering: 'Power Steering Fluid',
          differential: '75W-90'
        },
        trims: {
          'High Country': {
            recommendedFluids: {
              // 6.2L V8 EcoTec
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '8.0 quarts'
            }
          }
        }
      }
    },
    'Suburban': {
      '2015-2024': {
        tires: {
          tireSizeFront: '265/70R17',
          tireSizeRear: '265/70R17',
          tirePressureFront: '35 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '6x139.7',
          lugNutTorque: '140 ft-lb'
        },
        hardware: {
          batteryGroupSize: '48 AGM',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          // Default for 5.3L V8 (most common)
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '8.0 quarts',
          transmissionFluid: 'Dexron VI',
          coolant: 'Dex-Cool',
          brakeFluid: 'DOT 3',
          powerSteering: 'Power Steering Fluid',
          differential: '75W-90'
        },
        trims: {
          'High Country': {
            recommendedFluids: {
              // 6.2L V8 EcoTec
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '8.0 quarts'
            }
          }
        }
      }
    },
    'Equinox': {
      '2018-2024': {
        tires: {
          tireSizeFront: '225/65R17',
          tireSizeRear: '225/65R17',
          tirePressureFront: '35 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x115',
          lugNutTorque: '100 ft-lb'
        },
        hardware: {
          batteryGroupSize: '48 AGM',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          // Default for 1.5L I4 Turbo (most common)
          engineOil: '5W-30 Synthetic (Dexos1)',
          engineOilCapacity: '5.0 quarts',
          transmissionFluid: 'Dexron VI',
          coolant: 'Dex-Cool',
          brakeFluid: 'DOT 3',
          powerSteering: 'Power Steering Fluid',
          differential: '75W-90'
        },
        trims: {
          'Premier': {
            recommendedFluids: {
              // 2.0L I4 Turbo
              engineOil: '5W-30 Synthetic (Dexos1)',
              engineOilCapacity: '5.5 quarts'
            }
          },
          'RS': {
            recommendedFluids: {
              // 2.0L I4 Turbo
              engineOil: '5W-30 Synthetic (Dexos1)',
              engineOilCapacity: '5.5 quarts'
            }
          }
        }
      }
    },
    'Malibu': {
      '2016-2024': {
        tires: {
          tireSizeFront: '225/55R17',
          tireSizeRear: '225/55R17',
          tirePressureFront: '35 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x115',
          lugNutTorque: '100 ft-lb'
        },
        hardware: {
          batteryGroupSize: '48 AGM',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          // Default for 1.5L I4 Turbo (most common)
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '5.0 quarts',
          transmissionFluid: 'Dexron VI',
          coolant: 'Dex-Cool',
          brakeFluid: 'DOT 3',
          powerSteering: 'Power Steering Fluid',
          differential: '75W-90'
        },
        trims: {
          'RS': {
            recommendedFluids: {
              // 2.0L I4 Turbo
              engineOil: '5W-30 Synthetic',
              engineOilCapacity: '5.5 quarts'
            }
          },
          'Premier': {
            recommendedFluids: {
              // 2.0L I4 Turbo
              engineOil: '5W-30 Synthetic',
              engineOilCapacity: '5.5 quarts'
            }
          }
        }
      }
    }
  },
  'Jeep': {
    'Wrangler': {
      '2018-2024': {
        tires: {
          tireSizeFront: '245/75R17', // Sport
          tireSizeRear: '245/75R17',
          tirePressureFront: '37 PSI',
          tirePressureRear: '37 PSI',
          wheelBoltPattern: '5x127',
          lugNutTorque: '100-130 ft-lb'
        },
        trims: {
          'Rubicon': {
            tires: {
              tireSizeFront: '285/70R17',
              tireSizeRear: '285/70R17'
            }
          },
          '392': {
            tires: {
              tireSizeFront: '285/70R17',
              tireSizeRear: '285/70R17'
            }
          }
        }
      }
    }
  },
  'Ram': {
    '1500': {
      // 2014-2018 Ram 1500 (4th generation) - Multiple engine options with different oil capacities
      '2014-2018': {
        recommendedFluids: {
          // Default for 3.6L V6 Pentastar
          engineOil: '5W-20 Synthetic',
          engineOilCapacity: '5.9 quarts',
          transmissionFluid: 'ATF+4',
          coolant: 'Mopar OAT Coolant',
          brakeFluid: 'DOT 3',
          powerSteering: 'Mopar PSF',
          differential: '75W-90'
        },
        trims: {
          // 3.6L V6 Pentastar engine specs (5.9 quarts)
          'Tradesman': {
            recommendedFluids: {
              engineOil: '5W-20 Synthetic',
              engineOilCapacity: '5.9 quarts',
              transmissionFluid: 'ATF+4',
              coolant: 'Mopar OAT Coolant',
              brakeFluid: 'DOT 3',
              powerSteering: 'Mopar PSF',
              differential: '75W-90'
            },
            tires: {
              tireSizeFront: 'P275/70R17',
              tireSizeRear: 'P275/70R17',
              tirePressureFront: '35 PSI',
              tirePressureRear: '35 PSI',
              wheelBoltPattern: '5x127',
              lugNutTorque: '130 ft-lb'
            }
          },
          'Big Horn': {
            recommendedFluids: {
              engineOil: '5W-20 Synthetic',
              engineOilCapacity: '5.9 quarts',
              transmissionFluid: 'ATF+4',
              coolant: 'Mopar OAT Coolant',
              brakeFluid: 'DOT 3',
              powerSteering: 'Mopar PSF',
              differential: '75W-90'
            },
            tires: {
              tireSizeFront: 'P275/70R17',
              tireSizeRear: 'P275/70R17',
              tirePressureFront: '35 PSI',
              tirePressureRear: '35 PSI',
              wheelBoltPattern: '5x127',
              lugNutTorque: '130 ft-lb'
            }
          },
          // 5.7L HEMI V8 engine specs (7.0 quarts)
          'Laramie': {
            recommendedFluids: {
              engineOil: '5W-20 Synthetic',
              engineOilCapacity: '7.0 quarts',
              transmissionFluid: 'ATF+4',
              coolant: 'Mopar OAT Coolant',
              brakeFluid: 'DOT 3',
              powerSteering: 'Mopar PSF',
              differential: '75W-90'
            },
            tires: {
              tireSizeFront: 'P275/70R18',
              tireSizeRear: 'P275/70R18',
              tirePressureFront: '35 PSI',
              tirePressureRear: '35 PSI',
              wheelBoltPattern: '5x127',
              lugNutTorque: '130 ft-lb'
            }
          },
          'Rebel': {
            recommendedFluids: {
              engineOil: '5W-20 Synthetic',
              engineOilCapacity: '7.0 quarts',
              transmissionFluid: 'ATF+4',
              coolant: 'Mopar OAT Coolant',
              brakeFluid: 'DOT 3',
              powerSteering: 'Mopar PSF',
              differential: '75W-90'
            },
            tires: {
              tireSizeFront: 'LT285/70R17',
              tireSizeRear: 'LT285/70R17',
              tirePressureFront: '45 PSI',
              tirePressureRear: '45 PSI',
              wheelBoltPattern: '5x127',
              lugNutTorque: '130 ft-lb'
            }
          },
          'Longhorn': {
            recommendedFluids: {
              engineOil: '5W-20 Synthetic',
              engineOilCapacity: '7.0 quarts',
              transmissionFluid: 'ATF+4',
              coolant: 'Mopar OAT Coolant',
              brakeFluid: 'DOT 3',
              powerSteering: 'Mopar PSF',
              differential: '75W-90'
            },
            tires: {
              tireSizeFront: 'P275/70R18',
              tireSizeRear: 'P275/70R18',
              tirePressureFront: '35 PSI',
              tirePressureRear: '35 PSI',
              wheelBoltPattern: '5x127',
              lugNutTorque: '130 ft-lb'
            }
          },
          'Limited': {
            recommendedFluids: {
              engineOil: '5W-20 Synthetic',
              engineOilCapacity: '7.0 quarts',
              transmissionFluid: 'ATF+4',
              coolant: 'Mopar OAT Coolant',
              brakeFluid: 'DOT 3',
              powerSteering: 'Mopar PSF',
              differential: '75W-90'
            },
            tires: {
              tireSizeFront: 'P275/70R20',
              tireSizeRear: 'P275/70R20',
              tirePressureFront: '35 PSI',
              tirePressureRear: '35 PSI',
              wheelBoltPattern: '5x127',
              lugNutTorque: '130 ft-lb'
            }
          },
          // 3.0L EcoDiesel V6 engine specs (10.6 quarts, 5W-40 diesel)
          'Tradesman EcoDiesel': {
            recommendedFluids: {
              engineOil: '5W-40 Synthetic Diesel',
              engineOilCapacity: '10.6 quarts',
              transmissionFluid: 'ATF+4',
              coolant: 'Mopar OAT Coolant',
              brakeFluid: 'DOT 3',
              powerSteering: 'Mopar PSF',
              differential: '75W-90'
            },
            tires: {
              tireSizeFront: 'P275/70R17',
              tireSizeRear: 'P275/70R17',
              tirePressureFront: '35 PSI',
              tirePressureRear: '35 PSI',
              wheelBoltPattern: '5x127',
              lugNutTorque: '130 ft-lb'
            }
          },
          'Big Horn EcoDiesel': {
            recommendedFluids: {
              engineOil: '5W-40 Synthetic Diesel',
              engineOilCapacity: '10.6 quarts',
              transmissionFluid: 'ATF+4',
              coolant: 'Mopar OAT Coolant',
              brakeFluid: 'DOT 3',
              powerSteering: 'Mopar PSF',
              differential: '75W-90'
            },
            tires: {
              tireSizeFront: 'P275/70R17',
              tireSizeRear: 'P275/70R17',
              tirePressureFront: '35 PSI',
              tirePressureRear: '35 PSI',
              wheelBoltPattern: '5x127',
              lugNutTorque: '130 ft-lb'
            }
          },
          'Laramie EcoDiesel': {
            recommendedFluids: {
              engineOil: '5W-40 Synthetic Diesel',
              engineOilCapacity: '10.6 quarts',
              transmissionFluid: 'ATF+4',
              coolant: 'Mopar OAT Coolant',
              brakeFluid: 'DOT 3',
              powerSteering: 'Mopar PSF',
              differential: '75W-90'
            },
            tires: {
              tireSizeFront: 'P275/70R18',
              tireSizeRear: 'P275/70R18',
              tirePressureFront: '35 PSI',
              tirePressureRear: '35 PSI',
              wheelBoltPattern: '5x127',
              lugNutTorque: '130 ft-lb'
            }
          },
          'Longhorn EcoDiesel': {
            recommendedFluids: {
              engineOil: '5W-40 Synthetic Diesel',
              engineOilCapacity: '10.6 quarts',
              transmissionFluid: 'ATF+4',
              coolant: 'Mopar OAT Coolant',
              brakeFluid: 'DOT 3',
              powerSteering: 'Mopar PSF',
              differential: '75W-90'
            },
            tires: {
              tireSizeFront: 'P275/70R18',
              tireSizeRear: 'P275/70R18',
              tirePressureFront: '35 PSI',
              tirePressureRear: '35 PSI',
              wheelBoltPattern: '5x127',
              lugNutTorque: '130 ft-lb'
            }
          },
          'Limited EcoDiesel': {
            recommendedFluids: {
              engineOil: '5W-40 Synthetic Diesel',
              engineOilCapacity: '10.6 quarts',
              transmissionFluid: 'ATF+4',
              coolant: 'Mopar OAT Coolant',
              brakeFluid: 'DOT 3',
              powerSteering: 'Mopar PSF',
              differential: '75W-90'
            },
            tires: {
              tireSizeFront: 'P275/70R20',
              tireSizeRear: 'P275/70R20',
              tirePressureFront: '35 PSI',
              tirePressureRear: '35 PSI',
              wheelBoltPattern: '5x127',
              lugNutTorque: '130 ft-lb'
            }
          }
        }
      }
    }
  },
  'Honda': {
    'Civic': {
      // 2015-2024 Civic (2.0L I4 and 1.5L Turbo) - 0W-20 oil, Group 51R battery
      '2015-2024': {
        tires: {
          tireSizeFront: '215/55R16', // Base trims
          tireSizeRear: '215/55R16',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '80 ft-lb'
        },
        hardware: {
          batteryGroupSize: '51R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '16"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '3.7 quarts',
          transmissionFluid: 'Honda ATF',
          coolant: 'Honda Type 2',
          brakeFluid: 'DOT 3',
          powerSteering: 'Honda PSF',
          differential: '80W-90'
        },
        trims: {
          'Touring': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '3.7 quarts'
            }
          },
          'Si': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '3.7 quarts'
            }
          },
          'Type R': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '4.4 quarts',
              brakeFluid: 'DOT 4'
            },
            tires: {
              tireSizeFront: '245/30ZR20',
              tireSizeRear: '245/30ZR20',
              tirePressureFront: '35 PSI',
              tirePressureRear: '33 PSI'
            },
            torqueValues: {
              brake: {
                caliperBracketBolts: '37-50 ft-lb (Brembo)',
                caliperSlidePins: '18-26 ft-lb',
                brakeLineFittings: '10-15 ft-lb'
              }
            },
            partsSKUs: {
              brakePads: '45022-TGH-A01 (Front), 43022-TGH-A01 (Rear)',
              brakeRotors: '09.C338.11 (Front), 08.D713.11 (Rear)',
              brakeCaliper: 'Brembo 4-piston front'
            }
          }
        }
      }
    },
    'Accord': {
      // 2015-2024 Accord (1.5L Turbo and 2.0L Turbo) - 0W-20 oil, Group 24F battery
      '2015-2024': {
        tires: {
          tireSizeFront: '235/50R17', // Base trims
          tireSizeRear: '235/50R17',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '80 ft-lb'
        },
        hardware: {
          batteryGroupSize: '24F',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '3.7 quarts',
          transmissionFluid: 'Honda ATF',
          coolant: 'Honda Type 2',
          brakeFluid: 'DOT 3',
          powerSteering: 'Honda PSF',
          differential: '80W-90'
        },
        trims: {
          'Touring': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '4.2 quarts'
            }
          },
          'Sport 2.0T': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '4.2 quarts'
            }
          }
        }
      }
    },
    'CR-V': {
      // 2015-2024 CR-V (1.5L Turbo and 2.4L) - 0W-20 oil, Group 51R battery
      '2015-2024': {
        tires: {
          tireSizeFront: '235/65R17', // Base trims
          tireSizeRear: '235/65R17',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '80 ft-lb'
        },
        hardware: {
          batteryGroupSize: '51R',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '18"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.2 quarts',
          transmissionFluid: 'Honda ATF',
          coolant: 'Honda Type 2',
          brakeFluid: 'DOT 3',
          powerSteering: 'Honda PSF',
          differential: '80W-90'
        },
        trims: {
          'LX': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '4.4 quarts'
            }
          }
        }
      }
    }
  },
  'Toyota': {
    'Camry': {
      // 2015-2024 Camry (2.5L I4 and 3.5L V6) - 0W-20 oil, Group 24F battery
      '2015-2024': {
        tires: {
          tireSizeFront: '215/55R17', // Base trims
          tireSizeRear: '215/55R17',
          tirePressureFront: '35 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '76 ft-lb'
        },
        hardware: {
          batteryGroupSize: '24F',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.6 quarts',
          transmissionFluid: 'Toyota WS',
          coolant: 'Toyota Super Long Life',
          brakeFluid: 'DOT 3',
          powerSteering: 'ATF',
          differential: '75W-90'
        },
        trims: {
          'TRD': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '6.4 quarts'
            }
          },
          'V6': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '6.4 quarts'
            }
          }
        }
      }
    },
    'Corolla': {
      // 2015-2024 Corolla (1.8L I4 and 2.0L I4) - 0W-20 oil, Group 35 battery
      '2015-2024': {
        tires: {
          tireSizeFront: '205/55R16', // Base trims
          tireSizeRear: '205/55R16',
          tirePressureFront: '35 PSI',
          tirePressureRear: '35 PSI',
          wheelBoltPattern: '5x100',
          lugNutTorque: '76 ft-lb'
        },
        hardware: {
          batteryGroupSize: '35',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '16"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.4 quarts',
          transmissionFluid: 'Toyota WS',
          coolant: 'Toyota Super Long Life',
          brakeFluid: 'DOT 3',
          powerSteering: 'ATF',
          differential: '75W-90'
        },
        trims: {
          'SE': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '4.4 quarts'
            }
          },
          'XSE': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '4.4 quarts'
            }
          },
          'GR': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '4.8 quarts'
            }
          }
        }
      }
    },
    'RAV4': {
      // 2015-2024 RAV4 (2.5L I4) - 0W-20 oil, Group 24F battery
      '2015-2024': {
        tires: {
          tireSizeFront: '225/65R17', // Base trims
          tireSizeRear: '225/65R17',
          tirePressureFront: '33 PSI',
          tirePressureRear: '33 PSI',
          wheelBoltPattern: '5x114.3',
          lugNutTorque: '76 ft-lb'
        },
        hardware: {
          batteryGroupSize: '24F',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '20"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.6 quarts',
          transmissionFluid: 'Toyota WS',
          coolant: 'Toyota Super Long Life',
          brakeFluid: 'DOT 3',
          powerSteering: 'ATF',
          differential: '75W-90'
        }
      }
    },
    '4Runner': {
      // 2015-2024 4Runner (4.0L V6) - 0W-20 oil, Group 27F battery
      '2015-2024': {
        tires: {
          tireSizeFront: '265/70R17', // Base trims
          tireSizeRear: '265/70R17',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '6x139.7',
          lugNutTorque: '103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '27F',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '18"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '6.2 quarts',
          transmissionFluid: 'Toyota WS',
          coolant: 'Toyota Super Long Life',
          brakeFluid: 'DOT 3',
          powerSteering: 'ATF',
          differential: '75W-90'
        }
      }
    },
    'Tacoma': {
      // 2015-2024 Tacoma (2.7L I4 and 3.5L V6) - 0W-20 oil, Group 27F battery
      '2015-2024': {
        tires: {
          tireSizeFront: '245/75R16', // Base trims
          tireSizeRear: '245/75R16',
          tirePressureFront: '32 PSI',
          tirePressureRear: '32 PSI',
          wheelBoltPattern: '6x139.7',
          lugNutTorque: '103 ft-lb'
        },
        hardware: {
          batteryGroupSize: '27F',
          wiperBladeDriver: '26"',
          wiperBladePassenger: '18"',
          wiperBladeRear: 'N/A'
        },
        recommendedFluids: {
          engineOil: '0W-20 Synthetic',
          engineOilCapacity: '4.8 quarts',
          transmissionFluid: 'Toyota WS',
          coolant: 'Toyota Super Long Life',
          brakeFluid: 'DOT 3',
          powerSteering: 'ATF',
          differential: '75W-90'
        },
        trims: {
          'SR5': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '6.2 quarts'
            }
          },
          'TRD Sport': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '6.2 quarts'
            }
          },
          'TRD Off-Road': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '6.2 quarts'
            }
          },
          'Limited': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '6.2 quarts'
            }
          },
          'TRD Pro': {
            recommendedFluids: {
              engineOil: '0W-20 Synthetic',
              engineOilCapacity: '6.2 quarts'
            }
          }
        }
      }
    }
  }
};
