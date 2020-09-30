import crypto from 'crypto';

const SALT_LENGTH = 64; // Length of the salt, in bytes
const TOKEN_LENGTH = 64;
const HASH_LENGTH = 64; // Length of the hash, in bytes
const HASH_ITERATIONS = 1000; // Number of pbkdf2 iterations
const IV_LENGTH = 16; // For AES, this is always 16

function generateToken(tokenLength) {
  return crypto.randomBytes(tokenLength || TOKEN_LENGTH);
}

function generateSalt() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(SALT_LENGTH, (err, salt) => {
      if (err) reject(err);
      resolve(salt);
    });
  });
}

function makeHash(data, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(data, salt, HASH_ITERATIONS, HASH_LENGTH, 'sha1', (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve({
        salt,
        hash,
      });
    });
  });
}

function createKey(ENCRYPTION_KEY) {
  return crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest('base64').substr(0, 32);
}

function saltAndHash(data) {
  return generateSalt().then((salt) => makeHash(data, salt));
}

function encrypt(text, ENCRYPTION_KEY) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(createKey(ENCRYPTION_KEY)), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(text, ENCRYPTION_KEY) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(createKey(ENCRYPTION_KEY)), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export default {
  encrypt,
  decrypt,
  generateSalt,
  generateToken,
  makeHash,
  saltAndHash,
};
