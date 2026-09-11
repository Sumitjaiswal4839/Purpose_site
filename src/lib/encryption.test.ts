import { encryptAES, decryptAES } from './encryption';

describe('Encryption Utils', () => {
  it('should successfully encrypt and decrypt a message', () => {
    const message = 'Test Secret Message';
    const encrypted = encryptAES(message);
    
    expect(encrypted).not.toBe(message);
    expect(encrypted).toContain(':'); // IV and encrypted data separator
    
    const decrypted = decryptAES(encrypted);
    expect(decrypted).toBe(message);
  });

  it('should produce different ciphertexts for the same message (due to random IV)', () => {
    const message = 'Another Secret';
    const enc1 = encryptAES(message);
    const enc2 = encryptAES(message);
    
    expect(enc1).not.toBe(enc2);
  });

  it('should throw or return null on invalid ciphertext', () => {
    expect(() => decryptAES('invalid:ciphertext')).toThrow();
  });
});
