/**
 * Fuel Product Configuration — single source of truth.
 * Swap this file to change branding per customer deployment.
 *
 * Customer: Vivo Energy Indonesia (Revvo range + Primus Diesel Plus)
 * Colors sourced from official Vivo SPBU price board branding.
 */

export interface FuelProductConfig {
  /** Short code shown on nozzle tiles and used as lookup key */
  code: string;
  /** Full display name for receipts, history, detail views */
  name: string;
  /** Brand hex color — dots, strips, accents */
  color: string;
  /** Light background for badges / highlighted rows */
  bgColor: string;
}

export const FUEL_PRODUCTS: FuelProductConfig[] = [
  { code: 'R90',    name: 'Revvo 90',           color: '#C8930A', bgColor: '#FFF8E1' },
  { code: 'R92',    name: 'Revvo 92',           color: '#1A52A0', bgColor: '#EFF6FF' },
  { code: 'R95',    name: 'Revvo 95',           color: '#921A1A', bgColor: '#FFF0F0' },
  { code: 'Diesel', name: 'Primus Diesel Plus', color: '#0F1A2E', bgColor: '#F0F2F5' },
];

/**
 * Look up a product by its short code OR full display name.
 */
export function getFuelProduct(codeOrName: string): FuelProductConfig | undefined {
  return FUEL_PRODUCTS.find(
    (p) => p.code === codeOrName || p.name === codeOrName,
  );
}

/** Brand color hex, or neutral slate as fallback. */
export function getFuelColor(codeOrName: string): string {
  return getFuelProduct(codeOrName)?.color ?? '#64748B';
}

/** Full display name for a code, or the code itself as fallback. */
export function getFuelName(code: string): string {
  return getFuelProduct(code)?.name ?? code;
}
