/**
 * Remove tags HTML e caracteres residuais das descrições e sinopses recebidas da API (RF03).
 */
export function cleanHtmlText(rawText?: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/<[^>]*>/g, '') // Remove tags <p>, <b>, etc.
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}
