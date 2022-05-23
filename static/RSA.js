import NodeRSA from 'encrypt-rsa';
"https://cdn.jsdelivr.net/npm/encrypt-rsa@2.0.1/build/index.min.js"


const NodeRSA = require('encrypt-rsa').default;

const fs = require('fs'); // Or import * as fs from 'fs';

const nodeRSA = new NodeRSA();

// create public and private keys

const { privateKey, publicKey } = nodeRSA.createPrivateAndPublicKeys()


// you must have 'public-key' file the key you want to encrypt by it

const encryptedText = nodeRSA.encryptStringWithRsaPublicKey({
  text: 'hello',
  publicKey: public
});

console.log({ encryptedText });

//result:  {
//   encryptedText: 'QAoJBAj7ZqYR9Qb9vFGfpjBVY7BP0MtlPywyxMSodA7WmOmOn0glOlrLxUqjJrmaKsqxdJxZadEMAM8+6gLNhwcLtbFPRLQEUTSHk2NNhehsPOESoNjwbXOj5Y+zBCSkjVuW6MRkdaTZeGXi0sii1OqvIQGmOaOR2xzEdDj2eD8='
// }

// you must have 'private-key' file the key you want to decrypt by it

const decryptedText = nodeRSA.decryptStringWithRsaPrivateKey({
  text: encryptedText,
  privateKey: private
});

console.log({ decryptedText });
// result: { decryptedText: 'hello' }