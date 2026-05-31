/** ANVISA reference daily intake (%VD denominators). */
export const RDA_BY_NUTRIENT: Record<string, number> = {
  valor_energetico: 2000,
  carboidratos: 300,
  acucares_totais: 50,
  acucares_adicionados: 50,
  proteinas: 50,
  gorduras_totais: 65,
  gorduras_saturadas: 20,
  gorduras_trans: 0,
  fibras_alimentares: 25,
  sodio: 2000,
  ferro: 14,
  magnesio: 260,
  potassio: 3500,
  zinco: 11,
  calcio: 1000,
  vitamina_c: 45,
};

export function computeVdPercent(nutrientKey: string, porcaoAmount: number): number {
  const rda = RDA_BY_NUTRIENT[nutrientKey];
  if (!rda || rda <= 0) return 0;
  return Math.round((porcaoAmount / rda) * 100);
}
