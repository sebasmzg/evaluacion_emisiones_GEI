import type { FactorCombustible } from "../models/interfaces";

export const FACTORES_COMBUSTIBLES: Record<string, FactorCombustible> = {
  GasNatural: {
    tipo: 'GasNatural',
    pci: 36.65,
    fe: 55539.09,
  },
  GLP: {
    tipo: 'GLP',
    pci: 45.4145,
    fe: 67185.12,
  },
  Carbon: {
    tipo: 'Carbon',
    pci: 24.405,
    fe: 93317.31,
  },
};
