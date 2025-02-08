/**
 * Converts Octas to APT
 * @param octas - The amount in Octas (smallest unit of APT)
 * @returns The equivalent amount in APT as a string with 8 decimal places
 */
export function octasToApt(octas: number | string): string {
  const octasNum = typeof octas === 'string' ? parseInt(octas) : octas;

  const apt = octasNum / 100_000_000;

  return apt.toFixed(2);
}
