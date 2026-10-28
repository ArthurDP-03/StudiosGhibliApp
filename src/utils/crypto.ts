import * as Crypto from 'expo-crypto';

/**
 * Gera um hash SHA-256 da senha para evitar armazenamento em texto puro (atendendo ao RF07).
 */
export async function hashPassword(password: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return digest;
}
