// src/components/JobsForm/Teto.js
export const tetoValues = [
    { date: '2024-01', value: 7786.02 },
    { date: '2023-01', value: 7507.49 },
    { date: '2022-01', value: 7087.22 },
    { date: '2021-01', value: 6433.57 },
    { date: '2020-01', value: 6101.06 },
    { date: '2019-01', value: 5839.45 },
    { date: '2018-01', value: 5645.80 },
    { date: '2017-01', value: 5531.31 },
    { date: '2016-01', value: 5189.82 },
    { date: '2015-01', value: 4663.75 },
    { date: '2014-01', value: 4390.24 },
    { date: '2013-01', value: 4159.00 },
    { date: '2012-01', value: 3916.20 },
    { date: '2011-01', value: 3691.74 },
    { date: '2010-01', value: 3467.40 },
    { date: '2009-02', value: 3218.90 },
    { date: '2008-03', value: 3038.99 },
    { date: '2007-04', value: 2894.28 },
    { date: '2006-04', value: 2801.82 },
    { date: '2006-01', value: 2668.15 },
    { date: '2005-05', value: 2668.15 },
    { date: '2004-05', value: 2508.72 },
    { date: '2004-01', value: 2400.00 },
    { date: '2003-06', value: 1869.34 },
    { date: '2002-06', value: 1561.56 },
    { date: '2001-06', value: 1430.00 },
    { date: '2000-06', value: 1328.25 },
    { date: '1999-06', value: 1255.32 },
    { date: '1998-12', value: 1200.00 },
    { date: '1998-06', value: 1081.50 },
    { date: '1997-06', value: 1031.87 },
    { date: '1996-05', value: 957.56 },
    { date: '1995-05', value: 832.66 },
    { date: '1994-09', value: 582.86 }
  ];
  
  export const getTetoForDate = (dateStr) => {
    const targetDate = dateStr;
    for (const teto of tetoValues) {
      if (targetDate >= teto.date) {
        return teto.value;
      }
    }
    return tetoValues[tetoValues.length - 1].value;
  };