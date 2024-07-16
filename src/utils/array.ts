export function copy2DArrayElements<T>(source: T[][], dest: T[][]): T[] {
  for (let x = 0; x < source.length; x++) {
    for (let y = 0; y < source[x].length; y++) {
      if (dest[x] && Array.isArray(dest[x]) && y <= dest[x]?.length - 1) {
        dest[x][y] = source[x][y];
      }
    }
  }
}
