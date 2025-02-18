/**
 * Reports web vitals metrics to the provided callback function.
 *
 * This function dynamically imports the 'web-vitals' library and uses it to measure
 * various web performance metrics, such as Cumulative Layout Shift (CLS), First Input Delay (FID),
 * First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Time to First Byte (TTFB).
 *
 * @param {Function} onPerfEntry - A callback function that will be called with the performance
 * metrics. The callback function should accept a single argument which will be the metric object.
 */
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
