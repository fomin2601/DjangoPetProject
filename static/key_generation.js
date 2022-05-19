import { generateLargePrime, generateRandomBigInt } from './generateLargePrime.js'

BigInt.prototype.toJSON = function() { return this.toString() }

function gcd(a, b) {
    while (a !== BigInt(0)) {
        let sub_v = BigInt(b % a)
        b = a
        a = sub_v
    }
    return b
}


function findModInverse(a, m) {
    if (gcd(a, m) !== BigInt(1)) {
        return null
    }
    //u1, u2, u3 = 1, 0, a;
    let u1 = BigInt(1)
    let u2 = BigInt(0)
    let u3 = BigInt(a)
    let v1 = BigInt(0)
    let v2 = BigInt(1)
    let v3 = BigInt(m)
    while (v3 !== BigInt(0)) {
        //let q = u3 // v3
        let q = BigInt(u3) / BigInt(v3)
        //let k_t = Math.trunc(u3 / v3)
        v1 = u1 - q * v1
        v2 = u2 - q * v2
        v3 = u3 - q * v3
        u1 = v1
        u2 = v2
        u3 = v3
    }
    return u1 % m
}

window.makeKeyFiles = function (username, room) {
    let keySize = 10
    let namePublicKey = String(`${username}_${room}_pubkey`)
    let namePrivateKey = String(`${username}_${room}_privkey`)
    if (localStorage.getItem(namePublicKey) && localStorage.getItem(namePrivateKey)) return 0
    let publicKey = generateKey('pub', keySize)
    let privateKey = generateKey('priv', keySize)
    localStorage.setItem(namePrivateKey, JSON.stringify(privateKey))
    localStorage.setItem(namePublicKey, JSON.stringify(publicKey))
}

function generateKey(determinant, keySize) {
    let p = generateLargePrime(keySize)
    let q = generateLargePrime(keySize)
    let n = p*q
    let e
    while (true) {
        //e = BigInt(Math.floor(Math.random() * (BigInt(2) ** (BigInt(keySize)) - (BigInt(2) ** (BigInt(keySize) - BigInt(1)))) + BigInt(2) ** (BigInt(keySize) - BigInt(1))))
        e = generateRandomBigInt(BigInt(2**(keySize-1)), BigInt(2**keySize))
        if (gcd(e, (p - BigInt(1)) * (q - BigInt(1))) === BigInt(1)) break
    }
    let d = findModInverse(e, (p-BigInt(1))*(q-BigInt(1)))
    if (determinant === 'pub') {
        return {
            keySize: keySize,
            n: n,
            e: e
        }
    } else if (determinant === 'priv') {
        return {
            keySize: keySize,
            n: n,
            d: d
        }
    }
}
