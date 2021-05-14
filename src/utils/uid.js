function genUid() {
  if (typeof genUid.__x == 'undefined') {
    genUid.__x = 0;
  }
  return ++genUid.__x;
}

export default genUid;
