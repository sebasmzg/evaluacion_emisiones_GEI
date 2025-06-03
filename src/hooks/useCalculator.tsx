import { FACTORES_COMBUSTIBLES } from "../data/factoresCombustibles";
import type {
  ConsumoEnergetico,
  ResultadoCalculo,
  ValorAgregado,
} from "../models/interfaces";

export const calcularResultados = (
  consumos: ConsumoEnergetico[],
  valoresAgregados: ValorAgregado[]
): ResultadoCalculo[] => {
  return consumos.map((c) => {
    const va = valoresAgregados.find((v) => v.anio === c.anio);
    const valorAgregadoTotal =
      (va?.primario_COP ?? 0) +
      (va?.secundario_COP ?? 0) +
      (va?.terciario_COP ?? 0);

    // === Cálculo de emisiones ===
    const emisionesElectricidad =
      (c.electricidad_kWh * c.fe_sin_kgCO2kWh) / 1000;

    const emisionesGN =
      FACTORES_COMBUSTIBLES.GasNatural.pci *
      c.gas_natural_m3 *
      FACTORES_COMBUSTIBLES.GasNatural.fe *
      1e-9;

    const emisionesGLP =
      FACTORES_COMBUSTIBLES.GLP.pci *
      c.glp_kg *
      FACTORES_COMBUSTIBLES.GLP.fe *
      1e-9;

    const emisionesCarbon =
      FACTORES_COMBUSTIBLES.Carbon.pci *
      c.carbon_kg *
      FACTORES_COMBUSTIBLES.Carbon.fe *
      1e-9;

    // === Totales ===
    const totalEmisiones =
      emisionesElectricidad + emisionesGN + emisionesGLP + emisionesCarbon;

    const energiaElectricidad = (c.electricidad_kWh * 3.6e-3) / 1000;
    const energiaGN = (c.gas_natural_m3 * FACTORES_COMBUSTIBLES.GasNatural.pci) / 1e6;
    const energiaGLP = (c.glp_kg * FACTORES_COMBUSTIBLES.GLP.pci) / 1e6;
    const energiaCarbon = (c.carbon_kg * FACTORES_COMBUSTIBLES.Carbon.pci) / 1e6;

    const energiaTotalTJ = energiaElectricidad + energiaGN + energiaGLP + energiaCarbon;

    const intensidadEnergetica =
      valorAgregadoTotal > 0 ? (energiaTotalTJ * 1e6) / valorAgregadoTotal : 0;

    return {
      anio: c.anio,
      emisionesElectricidad,
      emisionesGN,
      emisionesGLP,
      emisionesCarbon,
      totalEmisiones,
      energiaElectricidad,
      energiaGN,
      energiaGLP,
      energiaCarbon,
      energiaTotalTJ,
      valorAgregadoTotal,
      intensidadEnergetica,
    };
  });
};
