const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS && getCLS(onPerfEntry);
      getFID && getFID(onPerfEntry);
      getFCP && getFCP(onPerfEntry);
      getLCP && getLCP(onPerfEntry);
      getTTFB && getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
