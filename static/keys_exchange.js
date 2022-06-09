$(document).ready(async function () {
    const superUserNameKeys = JSON.parse(document.getElementById('json-superusername').textContent);
    const userNameKeys = JSON.parse(document.getElementById('json-username').textContent);
    const roomNameKeys = JSON.parse(document.getElementById('json-roomname').textContent);

    if (userNameKeys === superUserNameKeys) {
        const superUserSocket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/messanger/'
            + roomNameKeys
            + '/'
            + superUserNameKeys
            + '/'
        );

        superUserSocket.onmessage = async function (e) {
            const data = JSON.parse(e.data);
            if (data.publicKeyRSA) {
                let publicKeyRSA = await importPublicRSA(data.publicKeyRSA)
                let importedAES = await importAES(
                    JSON.parse(window.localStorage.getItem(`keyAES_${data.room}`))
                );
                let encryptionKeyAES = await encryptRSA(publicKeyRSA, JSON.stringify(await exportAES(importedAES)));
                encryptionKeyAES = new Uint8Array(encryptionKeyAES);
                await superUserSocket.send(JSON.stringify({
                    'type': 'from_superuser_to_user',
                    'encryptionKeyAES': encryptionKeyAES.toString(),
                    'username': data.username,
                    'room': data.room,
                }));
            }
        }
    }

    window.connectToSuperUser = async function () {
        let websocketForUserToSuperUser = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/messanger/'
            + roomNameKeys
            + '/'
            + superUserNameKeys
            + '/'
        );

        websocketForUserToSuperUser.onmessage = async function(e) {
            const data = JSON.parse(e.data);
            if (data.encryptionKeyAES) {
                let encryptionKeyAES = await Uint8Array.from(data.encryptionKeyAES.split(','));
                encryptionKeyAES = encryptionKeyAES.buffer;
                let importedPrivate = await importPrivateRSA(JSON.parse(window.localStorage.getItem(`privateKeyRSA_${data.room}`)))
                let resultKeyAES = await decryptRSA(importedPrivate, encryptionKeyAES);
                localStorage.setItem(`keyAES_${roomNameKeys}`, resultKeyAES);
            }
        }

        return websocketForUserToSuperUser
    }

    window.sendRSAKeyToSuperUser = async function(publicRSA, superUserWebsocket) {
        await superUserWebsocket.send(
            JSON.stringify({
                'type': 'from_user_to_superuser',
                'username': userNameKeys,
                'publicKeyRSA': publicRSA,
                'room': roomName,
            })
        )
    }
})