
function rabinMiller(num) {
    let s = num - BigInt(1)
    let t = BigInt(0)
    while (s % BigInt(2) === BigInt(0)) {
        //s = s // 2
        s = s / BigInt(2)
        //s = Math.trunc(s)
        t += BigInt(1)
    }

    for (let j = 0; j < 5; j++) {
        //let a = Math.floor(Math.random() * (num - 1 - 2) + 2)
        let a = generateRandomBigInt(BigInt(2), num-1)
        let v = (a ** s) % num
        if (v !== 1n) {
            let i = 0n
            while (v !== (num - 1)) {
                if (i === (t - 1)) return false
                else {
                    i = i + 1
                    v = (v ** 2n) % num
                }
            }
        }
    }
    return true
}

function isPrime(num) {
    if (num < BigInt(2)) return false
    let lowPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n,
        67n, 71n, 73n, 79n, 83n, 89n, 97n, 101n, 103n, 107n, 109n, 113n, 127n, 131n, 137n, 139n, 149n, 151n,
        157n, 163n, 167n, 173n, 179n, 181n, 191n, 193n, 197n, 199n, 211n, 223n, 227n, 229n, 233n, 239n, 241n,
        251n, 257n, 263n, 269n, 271n, 277n, 281n, 283n, 293n, 307n, 311n, 313n, 317n, 331n, 337n, 347n, 349n,
        353n, 359n, 367n, 373n, 379n, 383n, 389n, 397n, 401n, 409n, 419n, 421n, 431n, 433n, 439n, 443n, 449n,
        457n, 461n, 463n, 467n, 479n, 487n, 491n, 499n, 503n, 509n, 521n, 523n, 541n, 547n, 557n, 563n, 569n,
        571n, 577n, 587n, 593n, 599n, 601n, 607n, 613n, 617n, 619n, 631n, 641n, 643n, 647n, 653n, 659n, 661n,
        673n, 677n, 683n, 691n, 701n, 709n, 719n, 727n, 733n, 739n, 743n, 751n, 757n, 761n, 769n, 773n, 787n,
        797n, 809n, 811n, 821n, 823n, 827n, 829n, 839n, 853n, 857n, 859n, 863n, 877n, 881n, 883n, 887n, 907n,
        911n, 919n, 929n, 937n, 941n, 947n, 953n, 967n, 971n, 977n, 983n, 991n, 997n]
    //if (num in lowPrimes) return true
    //let prime = BigInt(2)
    for (let prime = 0n; prime < (lowPrimes.length + 1); prime++) {
        if (num == lowPrimes[prime]) return true
        if (num % lowPrimes[prime] == 0n) return false
    }
    return rabinMiller(num)
}


export function generateLargePrime(keysize) {
    while (true) {
        //let num = BigInt(Math.floor(Math.random() * ((2**keysize) - 2 ** (keysize - 1)) + 2 ** (keysize - 1)))
        let num = generateRandomBigInt( BigInt(2n ** BigInt(keysize - 1)), BigInt(2n ** BigInt(keysize)))
        if (isPrime(num)) {
            return num
        }
    }
}

export function generateRandomBigInt(lowBigInt, highBigInt) {
  if (lowBigInt >= highBigInt) {
    throw new Error('lowBigInt must be smaller than highBigInt');
  }

  const difference = highBigInt - lowBigInt;
  const differenceLength = difference.toString().length;
  let multiplier = '';
  while (multiplier.length < differenceLength) {
    multiplier += Math.random()
      .toString()
      .split('.')[1];
  }
  multiplier = multiplier.slice(0, differenceLength);
  const divisor = '1' + '0'.repeat(differenceLength);

  const randomDifference = (difference * BigInt(multiplier)) / BigInt(divisor);

  return lowBigInt + randomDifference;
}