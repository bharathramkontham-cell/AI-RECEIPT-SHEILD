// -------------------------------------------------
// Fuzzy string matching — Levenshtein + alias table
// -------------------------------------------------

import { FUZZY_MATCH_THRESHOLD } from '@/lib/constants';

/**
 * Compute Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const aLen = a.length;
  const bLen = b.length;

  for (let i = 0; i <= aLen; i++) matrix[i] = [i];
  for (let j = 0; j <= bLen; j++) matrix[0][j] = j;

  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[aLen][bLen];
}

/**
 * Compute similarity ratio (0–1) between two strings
 */
export function stringSimilarity(a: string, b: string): number {
  const aLower = a.toLowerCase().trim();
  const bLower = b.toLowerCase().trim();

  if (aLower === bLower) return 1;
  if (aLower.length === 0 || bLower.length === 0) return 0;

  const distance = levenshteinDistance(aLower, bLower);
  const maxLen = Math.max(aLower.length, bLower.length);
  return 1 - distance / maxLen;
}

/**
 * Check if merchant name matches against name + aliases
 * Returns { matched: boolean; matchedName: string | null; matchType: 'exact' | 'alias' | 'fuzzy' | null }
 */
export function matchMerchant(
  claimMerchant: string,
  registryName: string,
  aliases: string[]
): { matched: boolean; matchedName: string | null; matchType: 'exact' | 'alias' | 'fuzzy' | null } {
  const claimLower = claimMerchant.toLowerCase().trim();

  // Exact match
  if (claimLower === registryName.toLowerCase().trim()) {
    return { matched: true, matchedName: registryName, matchType: 'exact' };
  }

  // Alias match
  for (const alias of aliases) {
    if (claimLower === alias.toLowerCase().trim()) {
      return { matched: true, matchedName: alias, matchType: 'alias' };
    }
  }

  // Fuzzy match against name and aliases
  if (stringSimilarity(claimMerchant, registryName) >= FUZZY_MATCH_THRESHOLD) {
    return { matched: true, matchedName: registryName, matchType: 'fuzzy' };
  }

  for (const alias of aliases) {
    if (stringSimilarity(claimMerchant, alias) >= FUZZY_MATCH_THRESHOLD) {
      return { matched: true, matchedName: alias, matchType: 'fuzzy' };
    }
  }

  return { matched: false, matchedName: null, matchType: null };
}

/**
 * Check if a txn merchant name matches against a merchant's name + aliases
 */
export function txnMerchantMatches(
  txnMerchant: string,
  registryName: string,
  aliases: string[]
): boolean {
  const txnLower = txnMerchant.toLowerCase().trim();

  if (txnLower === registryName.toLowerCase().trim()) return true;
  for (const alias of aliases) {
    if (txnLower === alias.toLowerCase().trim()) return true;
  }
  if (stringSimilarity(txnMerchant, registryName) >= FUZZY_MATCH_THRESHOLD) return true;
  for (const alias of aliases) {
    if (stringSimilarity(txnMerchant, alias) >= FUZZY_MATCH_THRESHOLD) return true;
  }

  return false;
}
