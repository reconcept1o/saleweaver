/**
 * Verilen TC Kimlik Numarasının algoritma kurallarına göre geçerli olup olmadığını kontrol eder.
 * @param {string | number} tckn - Kontrol edilecek TC Kimlik Numarası.
 * @returns {boolean} - Geçerli ise true, değilse false döner.
 */
export const validateTCKN = (tckn) => {
  let tc = String(tckn);

  // 11 haneli ve sadece rakamlardan oluşmalı
  if (!/^[0-9]{11}$/.test(tc)) {
    return false;
  }

  // İlk hane 0 olamaz
  if (tc[0] === "0") {
    return false;
  }

  const digits = tc.split("").map(Number);

  // 10. hanenin doğrulaması
  const sumOfOdds = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const sumOfEvens = digits[1] + digits[3] + digits[5] + digits[7];
  const tenthDigitCheck = (sumOfOdds * 7 - sumOfEvens) % 10;

  if (tenthDigitCheck !== digits[9]) {
    return false;
  }

  // 11. hanenin doğrulaması
  const totalSumFirstTen = digits
    .slice(0, 10)
    .reduce((acc, curr) => acc + curr, 0);
  const eleventhDigitCheck = totalSumFirstTen % 10;

  if (eleventhDigitCheck !== digits[10]) {
    return false;
  }

  // Tüm kontrollerden geçerse
  return true;
};
