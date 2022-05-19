import random, sys, os
from encrypt_by_alena import rabinMiller


def gcd(a, b):
    while a != 0:
        a, b = b % a, a
    return b


def findModInverse(a, m):
    if gcd(a, m) != 1:
        return None
    u1, u2, u3 = 1, 0, a
    v1, v2, v3 = 0, 1, m
    while v3 != 0:
        q = u3 // v3
        v1, v2, v3, u1, u2, u3 = (u1 - q * v1), (u2 - q * v2), (u3 - q * v3), v1, v2, v3
    return u1 % m


def makeKeyFiles(name):
    keySize = 1024
    if os.path.exists('%s_pubkey.txt' %name) or os.path.exists('%s_privkey.txt' %name):
        return
    publicKey, privateKey = generateKey(keySize)
    print('The public key is a %s and %s digit number.' %(len(str(publicKey[0])), len(str(publicKey[1]))))
    print('Writing public key to file %s_pubkey.txt...' %(name))
    fo = open('%s_pubkey.txt' % (name), 'w')
    fo.write('%s,%s,%s' % (keySize, publicKey[0], publicKey[1]))
    fo.close()
    print('The private key is a %s and %s digit number.' % (len(str(privateKey[0])), len(str(privateKey[1]))))
    print('Writing private key to file %s_privkey.txt...' % (name))
    fo = open('%s_privkey.txt' % (name), 'w')
    fo.write('%s,%s,%s' % (keySize, privateKey[0], privateKey[1]))
    fo.close()

def generateKey(keysize):
    p = rabinMiller.generateLargePrime(keysize)
    q = rabinMiller.generateLargePrime(keysize)
    n = p*q
    while True:
        e = random.randrange(2 ** (keysize - 1), 2 ** (keysize))
        if gcd(e, (p - 1) * (q - 1)) == 1: break
    d = findModInverse(e, (p-1)*(q-1))
    publicKey = (n, e)
    privateKey = (n, d)
    return (publicKey, privateKey)

