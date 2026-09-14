const KHMER_DIGITS = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"]

export function toKhmerNumber(value: number | string): string {
  return String(value).replace(/\d/g, (d) => KHMER_DIGITS[Number(d)])
}
