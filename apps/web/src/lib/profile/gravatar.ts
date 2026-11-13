// MD5 ringkas (RFC 1321) vanilla JS — teruji terhadap node:crypto.

function md5(s: string): string {
  // sumber UTF-8 bytes
  const bytes: number[] = [];
  for (let i = 0; i < s.length; i++) {
    let c = s.charCodeAt(i);
    if (c < 0x80) bytes.push(c);
    else if (c < 0x800) bytes.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0xd800 || c >= 0xe000) bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else {
      c = 0x10000 + (((c & 1023) << 10) | (s.charCodeAt(++i) & 1023));
      bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
  }
  const origLen = bytes.length;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const bitLenLo = (origLen * 8) & 0xffffffff;
  const bitLenHi = Math.floor(origLen * 8 / 0x100000000);
  for (let i = 0; i < 8; i++) bytes.push(((i < 4 ? bitLenLo : bitLenHi) >>> (i * 8)) & 0xff);

  const S = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
            5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
            4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
            6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  const K: number[] = [];
  for (let i = 0; i < 64; i++) K.push(Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296));
  const rot = (x: number, nS: number) => ((x << nS) | (x >>> (32 - nS))) >>> 0;

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  for (let off = 0; off < bytes.length; off += 64) {
    const M: number[] = [];
    for (let j = 0; j < 16; j++) {
      M[j] = bytes[off + j * 4] | (bytes[off + j * 4 + 1] << 8) | (bytes[off + j * 4 + 2] << 16) | (bytes[off + j * 4 + 3] << 24);
    }
    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) { f = (b & c) | (~b & d); g = i; }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; }
      const t = d < 0 ? 0 : 0;
      const tt = d;
      d = c;
      c = b;
      b = (b + rot((a + f + K[i] + M[g]) >>> 0, S[i])) >>> 0;
      a = tt;
      void t;
    }
    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const le = (n: number) =>
    [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]
      .map((x) => x.toString(16).padStart(2, "0")).join("");
  return le(a0) + le(b0) + le(c0) + le(d0);
}

export function getAvatarUrl(email: string, size = 256): string {
  return `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}?s=${size}&d=mp`;
}