// UAE Currency (AED / Fils) Number-to-Words Converter (English & Arabic)

const onesEn = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tensEn = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function convertHundredsEn(n: number): string {
  let str = "";
  if (n >= 100) {
    str += onesEn[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }
  if (n >= 20) {
    str += tensEn[Math.floor(n / 10)] + " ";
    n %= 10;
  }
  if (n > 0) {
    str += onesEn[n] + " ";
  }
  return str.trim();
}

export function amountToWordsEn(amount: number): string {
  if (amount === 0) return "Zero UAE Dirhams Only";
  const dirhams = Math.floor(amount);
  const fils = Math.round((amount - dirhams) * 100);

  let parts: string[] = [];

  const billions = Math.floor(dirhams / 1_000_000_000);
  const millions = Math.floor((dirhams % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((dirhams % 1_000_000) / 1_000);
  const remainder = dirhams % 1_000;

  if (billions > 0) parts.push(convertHundredsEn(billions) + " Billion");
  if (millions > 0) parts.push(convertHundredsEn(millions) + " Million");
  if (thousands > 0) parts.push(convertHundredsEn(thousands) + " Thousand");
  if (remainder > 0 || parts.length === 0) parts.push(convertHundredsEn(remainder));

  let result = parts.join(" ") + " UAE Dirhams";
  if (fils > 0) {
    result += ` and ${convertHundredsEn(fils)} Fils`;
  }
  return result + " Only";
}

// Arabic Number-to-words for common commercial amounts
const onesAr = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة", "عشرة"];

export function amountToWordsAr(amount: number): string {
  if (amount === 0) return "فقط صفر درهم إماراتي لا غير";
  const dirhams = Math.floor(amount);
  const fils = Math.round((amount - dirhams) * 100);

  let words = "فقط ";

  if (dirhams >= 1000) {
    const thousands = Math.floor(dirhams / 1000);
    const rem = dirhams % 1000;
    if (thousands === 1) words += "ألف ";
    else if (thousands === 2) words += "ألفان ";
    else if (thousands >= 3 && thousands <= 10) words += onesAr[thousands] + " آلاف ";
    else words += thousands + " ألف ";

    if (rem > 0) {
      words += "و" + rem + " ";
    }
  } else {
    words += dirhams + " ";
  }

  words += "درهم إماراتي";
  if (fils > 0) {
    words += ` و${fils} فلس`;
  }
  words += " لا غير";
  return words;
}
