// Miller-Rabin probabilistic primality test
function isProbablePrime(n, k = 5) {
    if (n < 2n) return false;
    if (n === 2n || n === 3n) return true;
    if (n % 2n === 0n) return false;

    let s = 0n;
    let d = n - 1n;
    while (d % 2n === 0n) {
        d /= 2n;
        s++;
    }

    for (let i = 0; i < k; i++) {
        const a = 2n + BigInt(Math.floor(Math.random() * (Number(n - 4n))));
        let x = modPow(a, d, n);
        if (x === 1n || x === n - 1n) continue;

        let continueOuter = false;
        for (let r = 1n; r < s; r++) {
            x = modPow(x, 2n, n);
            if (x === n - 1n) {
                continueOuter = true;
                break;
            }
        }

        if (continueOuter) continue;
        return false;
    }

    return true;
}

// Generate random BigInt in range [min, max]
function randomBigInt(min, max) {
    const range = max - min + 1n;
    const bits = range.toString(2).length;
    let rnd;
    do {
        rnd = 0n;
        const bytes = Math.ceil(bits / 8);
        for (let i = 0; i < bytes; i++) {
            rnd = (rnd << 8n) + BigInt(Math.floor(Math.random() * 256));
        }
    } while (rnd > range);
    return min + rnd;
}

// Generate a random prime of given bit length
function generateRandomPrime(bits = 32) {
    const min = 1n << BigInt(bits - 1);
    const max = (1n << BigInt(bits)) - 1n;

    while (true) {
        let candidate = randomBigInt(min, max);
        if (candidate % 2n === 0n) candidate += 1n;
        while (candidate <= max) {
            if (isProbablePrime(candidate)) return candidate;
            candidate += 2n;
        }
    }
}

// Greatest Common Divisor
function gcd(a, b) {
    while (b !== 0n) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Modular Inverse using Extended Euclidean Algorithm
function modInverse(e, phi) {
    let [a, b] = [phi, e];
    let [x0, x1] = [0n, 1n];
    while (b !== 0n) {
        const q = a / b;
        [a, b] = [b, a % b];
        [x0, x1] = [x1, x0 - q * x1];
    }
    return (x0 + phi) % phi;
}

// Modular Exponentiation (fast and safe)
function modPow(base, exponent, modulus) {
    if (modulus === 1n) return 0n;
    let result = 1n;
    base = base % modulus;
    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % modulus;
        }
        exponent = exponent / 2n;
        base = (base * base) % modulus;
    }
    return result;
}

// RSA Key Pair Generation
function generateRSAKeyPair() {
    let p = generateRandomPrime(32);
    let q = generateRandomPrime(32);
    while (q === p) q = generateRandomPrime(32);

    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    let e = 65537n;

    while (gcd(e, phi) !== 1n) {
        e += 2n;
    }

    const d = modInverse(e, phi);

    return {
        publicKey: { e: e.toString(), n: n.toString() },
        privateKey: { d: d.toString(), n: n.toString() }
    };
}

// RSA Encryption: ciphertext = (message^e) mod n
function rsaEncrypt(messageInt, publicKey) {
    const e = BigInt(publicKey.e);
    const n = BigInt(publicKey.n);
    return modPow(messageInt, e, n);
}

// RSA Decryption: plaintext = (cipher^d) mod n
function rsaDecrypt(cipherInt, privateKey) {
    const d = BigInt(privateKey.d);
    const n = BigInt(privateKey.n);
    return modPow(cipherInt, d, n);
}

// Convert a string to BigInt by encoding each char as a byte
function packMessage(str) {
    let result = 0n;
    for (let i = 0; i < str.length; i++) {
        result = (result << 8n) + BigInt(str.charCodeAt(i));
    }
    return result;
}

// Convert BigInt back to string assuming each byte is a char
function unpackMessage(bigint) {
    let hex = bigint.toString(16);
    if (hex.length % 2) hex = '0' + hex; // pad hex to full bytes

    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        const byte = parseInt(hex.slice(i, i + 2), 16);
        if (byte === 0) break; // stop at null padding
        str += String.fromCharCode(byte);
    }
    return str;
}
