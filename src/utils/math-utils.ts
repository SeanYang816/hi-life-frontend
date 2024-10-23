export function maxBigInt(arr: bigint[]): bigint {
  if (arr.length === 0) {
    return
  }

  return arr.reduce(
    (max, current) => (current > max ? current : max),
    arr[0]
  )
}

export function formatBigIntWithDecimals(
  value: bigint,
  decimals: number
): string {
  const strValue = value.toString()
  const integerPart = strValue.slice(0, strValue.length - decimals) || '0'
  const decimalPart = strValue
    .slice(strValue.length - decimals)
    .padStart(decimals, '0')

  return `${integerPart}.${decimalPart}`
}
