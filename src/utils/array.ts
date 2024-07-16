export function copy2DArrayElements<T>(source: T[][], dest: T[][]) {
  for (let x = 0; x < source.length; x++) {
    const sourceRow = source[x];
    if (!sourceRow) continue;
    for (let y = 0; y < sourceRow.length; y++) {
      const destRow = dest[x];
      if (destRow && Array.isArray(destRow) && y <= destRow.length - 1) {
        const sourceElem = sourceRow[y];
        if (sourceElem) {
          destRow[y] = sourceElem;
        }
      }
    }
  }
}
