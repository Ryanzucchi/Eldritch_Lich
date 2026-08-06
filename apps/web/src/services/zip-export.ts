const crcTable = new Uint32Array(256).map((_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});

const crc32 = (data: Uint8Array) => {
  let value = 0xffffffff;
  for (const byte of data) value = crcTable[(value ^ byte) & 0xff] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
};

const write16 = (view: DataView, offset: number, value: number) => view.setUint16(offset, value, true);
const write32 = (view: DataView, offset: number, value: number) => view.setUint32(offset, value, true);

/** Cria um ZIP "store" (sem compressão), compatível com leitores padrão, sem dependência externa. */
export function createStoredZip(files: Array<{ name: string; data: Uint8Array }>): Blob {
  const encoder = new TextEncoder();
  const entries = files.map(file => ({ ...file, nameBytes: encoder.encode(file.name), crc: crc32(file.data) }));
  const localSize = entries.reduce((size, entry) => size + 30 + entry.nameBytes.length + entry.data.length, 0);
  const centralSize = entries.reduce((size, entry) => size + 46 + entry.nameBytes.length, 0);
  const output = new Uint8Array(localSize + centralSize + 22);
  const view = new DataView(output.buffer);
  let offset = 0;
  const centralOffsets: number[] = [];

  for (const entry of entries) {
    centralOffsets.push(offset);
    write32(view, offset, 0x04034b50); write16(view, offset + 4, 20); write16(view, offset + 6, 0); write16(view, offset + 8, 0);
    write32(view, offset + 14, entry.crc); write32(view, offset + 18, entry.data.length); write32(view, offset + 22, entry.data.length);
    write16(view, offset + 26, entry.nameBytes.length); write16(view, offset + 28, 0);
    output.set(entry.nameBytes, offset + 30); output.set(entry.data, offset + 30 + entry.nameBytes.length);
    offset += 30 + entry.nameBytes.length + entry.data.length;
  }
  const centralStart = offset;
  entries.forEach((entry, index) => {
    write32(view, offset, 0x02014b50); write16(view, offset + 4, 20); write16(view, offset + 6, 20); write16(view, offset + 8, 0); write16(view, offset + 10, 0);
    write32(view, offset + 16, entry.crc); write32(view, offset + 20, entry.data.length); write32(view, offset + 24, entry.data.length);
    write16(view, offset + 28, entry.nameBytes.length); write16(view, offset + 30, 0); write16(view, offset + 32, 0); write16(view, offset + 34, 0); write16(view, offset + 36, 0); write32(view, offset + 38, 0); write32(view, offset + 42, centralOffsets[index]);
    output.set(entry.nameBytes, offset + 46); offset += 46 + entry.nameBytes.length;
  });
  write32(view, offset, 0x06054b50); write16(view, offset + 4, 0); write16(view, offset + 6, 0); write16(view, offset + 8, entries.length); write16(view, offset + 10, entries.length); write32(view, offset + 12, centralSize); write32(view, offset + 16, centralStart); write16(view, offset + 20, 0);
  return new Blob([output], { type: 'application/zip' });
}
