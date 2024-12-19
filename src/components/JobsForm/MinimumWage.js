export const minimumWages = [
  { date: '2024-01', value: 1412.00 },
  { date: '2023-05', value: 1320.00 },
  { date: '2023-01', value: 1302.00 },
  { date: '2022-01', value: 1212.00 },
  { date: '2021-01', value: 1100.00 },
  { date: '2020-02', value: 1045.00 },
  { date: '2020-01', value: 1039.00 },
  { date: '2019-01', value: 998.00 },
  { date: '2018-01', value: 954.00 },
  { date: '2017-01', value: 937.00 },
  { date: '2016-01', value: 880.00 },
  { date: '2015-01', value: 788.00 },
  { date: '2014-01', value: 724.00 },
  { date: '2013-01', value: 678.00 },
  { date: '2012-01', value: 622.00 },
  { date: '2011-03', value: 545.00 },
  { date: '2011-01', value: 540.00 },
  { date: '2010-01', value: 510.00 },
  { date: '2009-02', value: 465.00 },
  { date: '2008-03', value: 415.00 },
  { date: '2007-04', value: 380.00 },
  { date: '2006-04', value: 350.00 },
  { date: '2005-05', value: 300.00 },
  { date: '2004-05', value: 260.00 },
  { date: '2003-06', value: 240.00 },
  { date: '2002-06', value: 200.00 },
  { date: '2001-06', value: 180.00 },
  { date: '2000-06', value: 151.00 },
  { date: '1999-05', value: 136.00 },
  { date: '1998-05', value: 130.00 },
  { date: '1997-05', value: 120.00 },
  { date: '1996-05', value: 112.00 },
  { date: '1995-05', value: 100.00 },
  { date: '1994-09', value: 70.00 },
  { date: '1994-07', value: 64.79 }
  ];
  
  export const getMinimumWageForDate = (dateStr) => {
    const targetDate = dateStr;
    for (const wage of minimumWages) {
      if (targetDate >= wage.date) {
        return wage.value;
      }
    }
    return minimumWages[minimumWages.length - 1].value;
  };