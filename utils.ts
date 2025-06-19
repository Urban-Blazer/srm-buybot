export function decimalToHexSignedBigInt(decimal: number, bitWidth: number = 64): string {
    // Convertir a BigInt (aseguramos que la entrada se trate como BigInt)
    let dec: bigint = BigInt(decimal);

    // Si el número es negativo, calcular el complemento a dos
    if (dec < 0n) {
        dec = (2n ** BigInt(bitWidth)) + dec;
    }

    // Convertir el número a cadena hexadecimal en mayúsculas
    let hex: string = dec.toString(16).toUpperCase();

    // Calcular la cantidad de dígitos necesarios (cada dígito = 4 bits)
    const hexDigits: number = Math.ceil(bitWidth / 4);

    // Rellenar con ceros a la izquierda si es necesario
    while (hex.length < hexDigits) {
        hex = "0" + hex;
    }

    return hex;
}

export function hexToDecimalSignedBigInt(hex: string, bitWidth: number = 64): number {
    // Convertir la cadena hexadecimal a BigInt
    let num: bigint = BigInt("0x" + hex);

    // Calcular el umbral para determinar si el número es negativo
    const half: bigint = 2n ** BigInt(bitWidth - 1);
    const max: bigint = 2n ** BigInt(bitWidth);

    // Si num es mayor o igual que half, se interpretará como un número negativo
    if (num >= half) {
        return Number(num - max);
    }
    return Number(num);
}

