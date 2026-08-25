const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 5;

export function generateInviteCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}
