const objectConversionStr2Num = (obj) => {
  for (const key in obj) {
    obj[key] = parseInt(obj[key]);
  }
  return obj;
};

export { objectConversionStr2Num };
