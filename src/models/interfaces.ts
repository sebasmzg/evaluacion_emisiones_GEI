export interface ConsumoEnergetico {
  id: string;
  anio: number;
  electricidad_kWh: number;
  gas_natural_m3: number;
  glp_kg: number;
  carbon_kg: number;
  fe_sin_kgCO2kWh: number;
}

export interface ValorAgregado {
  id: string;
  anio: number;
  primario_COP: number;
  secundario_COP: number;
  terciario_COP: number;
}

export interface FactorCombustible {
    tipo: 'GasNatural' | 'GLP' | 'Carbon';
    pci: number;
    fe: number
}

export interface ResultadoCalculo {
    anio: number;
    emisionesElectricidad: number;
    emisionesGN: number;
    emisionesGLP: number;
    emisionesCarbon: number;
    totalEmisiones: number;
    energiaElectricidad: number;
    energiaGN: number;
    energiaGLP: number;
    energiaCarbon: number;
    energiaTotalTJ: number;
    valorAgregadoTotal: number;
    intensidadEnergetica: number;
}