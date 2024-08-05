export function getPercent(total: number, amount: number): string {
  const percent = Math.round((1000 / total) * amount) / 10
  return `${percent}%`
}
