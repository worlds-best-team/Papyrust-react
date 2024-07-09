export function generateRandomHexString(length: number) {
  const characters = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
export async function sha256(message: string, algo = 'SHA-256') {
  return Array.from(new Uint8Array(await crypto.subtle.digest(algo, new TextEncoder().encode(message))), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}
