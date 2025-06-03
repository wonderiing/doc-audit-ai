export function cleanText(text: string) {
    const cleanText = text
          .replace(/\u0000/g, '')
          .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, '')
          .replace(/\n/g, '');

    return cleanText
  }