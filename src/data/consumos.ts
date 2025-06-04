import type { ConsumoEnergetico } from '../models/interfaces';
import { FE_SIN_ANUAL } from './feSIN';

export const CONSUMOS_PRECARGADOS: ConsumoEnergetico[] = [
  {
    id: "2015",
    anio: 2015,
    electricidad_kWh: 3423130000,
    gas_natural_m3: 126000000,
    glp_kg: 22000000,
    carbon_kg: 20736000,
    fe_sin_kgCO2kWh: FE_SIN_ANUAL[2015],
  },
  {
    id: "2022",
    anio: 2022,
    electricidad_kWh: 2592150000,
    gas_natural_m3: 152100000,
    glp_kg: 13240000,
    carbon_kg: 18000000,
    fe_sin_kgCO2kWh: FE_SIN_ANUAL[2022],
  },
];