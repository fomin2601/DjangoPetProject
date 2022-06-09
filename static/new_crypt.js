//import { generateLargePrime, generateRandomBigInt } from './generateLargePrime.js'
import * as cryptico from '../static/node_modules/cryptico/lib/cryptico.js'


//const cryptico = require("cryptico");

window.genarationKeyRSA = function (roomname) {
//Закрытые
        let PassPhrase = "The Capital of Great Britain";
        let bits = 1024;
        let MattsRSAkey = cryptico.generateRSAKey(PassPhrase, bits);
        localStorage.setItem(`privateKeyRSA_${roomname}`, JSON.stringify(MattsRSAkey));
//Строка открытого ключа для отправки
        let MattsPublicMyKeyString = cryptico.publicKeyString(genarationPrivateKeyRSA);
        return MattsPublicMyKeyString
}


window.encrypt = function (plainText, publicKey) {
        let EncriptionResult = cryptico.encrypt(plainText, publicKey);
        return EncriptionResult

}

window.decrypt = function (cipherText, roomname) {
        let privateMyKey = JSON.parse( localStorage.getItem(`privateKeyRSA_${roomname}`) )
        let DecryptionResult = cryptico.decrypt(cipherText, privateMyKey);
        localStorage.removeItem(`privateKeyRSA_${roomname}`)
        return DecryptionResult.plaintext
}


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
        alert ('not key aes');
        //let key = window.crypto.getRandomValues(new Uint8Array(12))
    }
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
window.genarationKeyAES = function (){
    window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    ).then((key) => {
        return key;
    });
}
   /* const decryptButton = document.querySelector(".aes-gcm .decrypt-button");
    decryptButton.addEventListener("click", () => {
      decryptMessage(key);
    });
  });*/

