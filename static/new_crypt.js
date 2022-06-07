//import { generateLargePrime, generateRandomBigInt } from './generateLargePrime.js'

import * as cryptico from '../static/node_modules/cryptico/lib/cryptico.js'


//const cryptico = require("cryptico");

/*window.genarationKeyRSA = function (roomname) {
//Закрытые
        let PassPhrase = "The Capital of Great Britain";
        let bits = 1024;
        let MattsRSAkey = generateRSAKey(PassPhrase, bits);
        localStorage.setItem(`privateKeyRSA_${roomname}`, JSON.stringify(MattsRSAkey));
//Строка открытого ключа для отправки
        let MattsPublicMyKeyString = publicKeyString(MattsRSAkey);
        return MattsPublicMyKeyString
}


window.encrypt = function (plainText, publicKey) {
        let EncriptionResult = encrypt(plainText, publicKey);
        return EncriptionResult

}

window.decrypt = function (cipherText, roomname) {
        let privateMyKey = JSON.parse( localStorage.getItem(`privateKeyRSA_${roomname}`) )
        let DecryptionResult = decrypt(cipherText, privateMyKey);
        localStorage.removeItem(`privateKeyRSA_${roomname}`)
        return DecryptionResult.plaintext
}
*/
// генерация пары РСА
window.generateRSA = async function() {
  let keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  return keyPair;
}

// экспорт публичного (чтобы можно было его сохранять с локалсторадже)
window.exportPublicRSA = async function(keyPair) {
  let exportedPublic = await window.crypto.subtle.exportKey(
    "jwk",
    keyPair.publicKey
  );

  return exportedPublic;
}

// экспорт частного (чтобы можно было его сохранять с локалсторадже)
window.exportPrivateRSA = async function(keyPair) {
  let exportedPrivate = await window.crypto.subtle.exportKey(
    "jwk",
    keyPair.privateKey
  );

  return exportedPrivate;
}

// имопрт ключа публичного (в локалсторадже хранится не в том формате, с которым работает прога, поэтому нам нажо их преобраозвать)
window.importPublicRSA = async function(jwk) {
  let imported = await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      //these are the algorithm options
      name: "RSA-OAEP",
      hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    true,
    ["encrypt"]
  );

  return imported;
}

// имопрт ключа приватного (в локалсторадже хранится не в том формате, с которым работает прога, поэтому нам нажо их преобраозвать)
window.importPrivateRSA = async function(jwk) {
  let imported = await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      //these are the algorithm options
      name: "RSA-OAEP",
      hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    true,
    ["decrypt"]
  );

  return imported;
}

// message encode (нужно чтобы можно было работать с текстом, чтобы можно было его зашифровать)
window.encodeRSA = function(message) {
  let enc = new TextEncoder();

  return enc.encode(message);
}

// декодирование (расшифрованное сообщение нужно ещё и раскодировать, т.е. представить в читаемом виде)
window.decodeRSA = function(trash) {
  let dec = new TextDecoder();

  return dec.decode(trash);
}

// шифрование сообщения
window.encryptRSA = async function(key, message) {
  let encoded = encodeRSA(message);
  let cipherText = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    key,
    encoded
  );

  return cipherText;
}

// дешифрование
window.decryptRSA = async function(key, cipher) {
  let decrypted = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    key,
    cipher
  );
  let message = decodeRSA(decrypted);

  return message;
}
/*
async function main() {
  // генерируем пару
  //let keyPair = await generateRSA();

  // экспортируем ключи, чтобы потом сохранить их в локалсторадже
 /* let exportedPublic = await exportPublicRSA(keyPair);
  let exportedPrivate = await exportPrivateRSA(keyPair);

  // сохраняем их в локалсторадже
  window.localStorage.setItem("public RSA", JSON.stringify(exportedPublic));
  window.localStorage.setItem("private RSA", JSON.stringify(exportedPrivate));*/

  // достаём ключ из локалстораджа и импортиуруем его
  /*let importedPublic = await importPublicRSA(
    JSON.parse(window.localStorage.getItem("public RSA"))
  );
  let importedPrivate = await importPrivateRSA(
    JSON.parse(window.localStorage.getItem("private RSA"))
  );

  // шифруем сообщение публичным ключом
  let cipherText = await encryptRSA(importedPublic, "Hello!");

  // дешифруем частным
  let decrypted = await decryptRSA(importedPrivate, cipherText);

  console.log(decrypted);
}

main();*/



//встроенная библиотка, этот код для aes

  /*
  Fetch the contents of the "message" textbox, and encode it
  in a form we can use for the encrypt operation.
  */

function getMessageEncoding(message) {
    let enc = new TextEncoder();
    return enc.encode(message);
  }

  /*
  Get the encoded message, encrypt it and display a representation
  of the ciphertext in the "Ciphertext" element.
  */
window.encryptMessage = async function(message, roomname) {
    if (!(localStorage.getItem(`keyAES_${roomname}`))) {
        alert('not key aes');
        //let key = window.crypto.getRandomValues(new Uint8Array(12))
    } else {
        let key = JSON.parse(localStorage.getItem(`keyAES_${roomname}`))
        let iv = window.crypto.getRandomValues(new Uint8Array(12))
        let encoded = getMessageEncoding(message);
        let encrypted = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            encoded
        );
        return {
            'iv': iv,
            'encrypted': encrypted
        }
    }
}
  /*
  Fetch the ciphertext and decrypt it.
  Write the decrypted message into the "Decrypted" box.
  */
window.decryptMessage = async function(ciphertext, iv, roomname) {
    if (!(localStorage.getItem(`keyAES_${roomname}`))) {
        alert ('not de-key aes');
        //let key = window.crypto.getRandomValues(new Uint8Array(12))
    }
        let key = JSON.parse(localStorage.getItem(`keyAES_${roomname}`));
        let decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            ciphertext
        );

        let dec = new TextDecoder();
        return dec.decode(decrypted);

}
  /*
  Generate an encryption key, then set up event listeners
  on the "Encrypt" and "Decrypt" buttons.
  */
window.genarationKeyAES = async function (){
   let key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  return key;
}

window.exportAES = async function(key) {
  let exported =  await window.crypto.subtle.exportKey("jwk", key);

  return exported;
}

// импорт АЕС ключа
window.importAES = async function(jwk) {
  let imported = await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "AES-GCM",
    },
    true,
    ["encrypt", "decrypt"]
  );

  return imported;
}



   /* const decryptButton = document.querySelector(".aes-gcm .decrypt-button");
    decryptButton.addEventListener("click", () => {
      decryptMessage(key);
    });
  });*/

