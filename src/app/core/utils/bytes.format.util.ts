export const bytesFormat = (bytes: number, decimals: number = 2, binaryUnits: boolean = false): string => {
   if (bytes === 0)
      return '0 Bytes';

   // 1000 bytes in 1 Kilobyte (KB) or 1024 bytes for the binary version (KiB)
   const unitMultiple = (binaryUnits) ? 1024 : 1000;

   const sizes = (binaryUnits) ?
      ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'] :
      ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

   const decimal = decimals <= 0 ? 0 : decimals;
   const unitChanges = Math.floor(Math.log(bytes) / Math.log(unitMultiple));

   return parseFloat((bytes / Math.pow(unitMultiple, unitChanges)).toFixed(decimal)) + ' ' + sizes[unitChanges];
}
