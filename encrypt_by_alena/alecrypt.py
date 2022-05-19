import sys

DEFAULT_BLOCK_SIZE = 128  # Размер блока по умолчанию составляет 128 байт
BYTE_SIZE = 256  # 1 байт по умолчанию имеет 256 различных значений


def encrypt(message, name):
    pubKeyFilename = ('%s_pubkey.txt' %name)
    # Чтение открытых и закрытых ключей
    keySize, n, e = readKeyFile(pubKeyFilename)
    blockSize = DEFAULT_BLOCK_SIZE

    # Подтвердите, что размер правильный
    if keySize < blockSize * 8:  # 8 бит на блок
        sys.exit(
            'ERROR: Block size is %s bits and key size is %s bits. The RSA cipher requires the block size to be equal to or greater than the key size. Either decrease the block size or use different keys.' % (
                blockSize * 8, keySize))

    # Процесс шифрования
    encryptedBlocks = encryptMessage(message, (n, e), blockSize)

    # Конвертировать большие числа в строки
    for i in range(len(encryptedBlocks)):
        encryptedBlocks[i] = str(encryptedBlocks[i])
    encryptedContent = ','.join(encryptedBlocks)

    encryptedContent = '%s_%s_%s' % (len(message), blockSize, encryptedContent)
    print('Содержимое зашифрованного сообщения:')
    print(encryptedContent)
    # И вернуть зашифрованный контент
    return encryptedContent


def decrypt(encryptedText, name):
    privKeyFilename = ('%s_privkey.txt' %name)
    keySize, n, d = readKeyFile(privKeyFilename)

    # Процесс дешифрования
    messageLength, blockSize, encryptedMessage = encryptedText.split('_')
    messageLength = int(messageLength)
    blockSize = int(blockSize)

    # Check that key size is greater than block size.
    if keySize < blockSize * 8:  # * 8 to convert bytes to bits
        sys.exit(
            'ERROR: Block size is %s bits and key size is %s bits. The RSA cipher requires the block size to be equal to or greater than the key size. Did you specify the correct key file and encrypted file?' % (
                blockSize * 8, keySize))

        # Конвертировать зашифрованный текст в большие числа
    encryptedBlocks = []
    for block in encryptedMessage.split(','):
        encryptedBlocks.append(int(block))

        # Вернуть результат расшифровки
    decryptedContent = decryptMessage(encryptedBlocks, messageLength, (n, d), blockSize)
    print('Расшифровать содержимое имени файла:')
    print(decryptedContent)
    return decryptedContent


# getBlocksFromText () функция принимает сообщение и возвращает представляющий его список, элементами которого являются блоки
def getBlocksFromText(message, blockSize=DEFAULT_BLOCK_SIZE):
    messageBytes = message.encode('ascii')  # Преобразовать в число, соответствующее коду ASCII
    blockInts = []
    # for цикл для создания больших целых чисел и, наконец, сохранения в blockInt
    for blockStart in range(0, len(messageBytes), blockSize):
        blockInt = 0
        for i in range(blockStart, min(blockStart + blockSize, len(messageBytes))):
            blockInt += messageBytes[i] * (BYTE_SIZE ** (i % blockSize))
        blockInts.append(blockInt)
        # Возвращает список blockInts вместо больших чисел blockInt
    return blockInts


# Преобразовать список блоков в исходную строку
def getTextFromBlocks(blockInts, messageLength, blockSize=DEFAULT_BLOCK_SIZE):
    message = []
    for blockInt in blockInts:
        blockMessage = []
        for i in range(blockSize - 1, -1, -1):
            if len(message) + i < messageLength:
                asciiNumber = blockInt // (BYTE_SIZE ** i)
                blockInt = blockInt % (BYTE_SIZE ** i)
                blockMessage.insert(0, chr(asciiNumber))
        message.extend(blockMessage)
    return ''.join(message)


def encryptMessage(message, key, blockSize=DEFAULT_BLOCK_SIZE):
    encryptedBlocks = []
    n, e = key
    for block in getBlocksFromText(message, blockSize):
        # Следующая операция - это блок ^ e mod n
        encryptedBlocks.append(pow(block, e, n))
    return encryptedBlocks


# dexryptMessage сохраняет дешифрованный список целых блоков, а ключ назначается n и d посредством многократного назначения
def decryptMessage(encryptedBlocks, messageLength, key, blockSize=DEFAULT_BLOCK_SIZE):
    decryptedBlocks = []
    n, d = key
    for block in encryptedBlocks:
        # Расшифровать предыдущий блок ^ e mod n операция
        decryptedBlocks.append(pow(block, d, n))
        return getTextFromBlocks(decryptedBlocks, messageLength, blockSize)


# Читать открытый ключ и закрытый ключ из файла ключей
# Format: размер ключа целое, n большое целое, e или d большое целое
# split () делится в соответствии с запятой и сохраняется в переменной содержимого в строковом формате
def readKeyFile(keyFilename):
    fo = open(keyFilename)
    content = fo.read()
    fo.close()
    keySize, n, EorD = content.split(',')
    return (int(keySize), int(n), int(EorD))
