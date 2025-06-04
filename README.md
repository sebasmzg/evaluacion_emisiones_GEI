# Calculadora de Emisiones GEI

Aplicación web para calcular y visualizar las emisiones de Gases de Efecto Invernadero (GEI) basada en el consumo energético y el valor agregado por sectores económicos.

## 🌟 Características

- Cálculo de emisiones GEI por fuente energética:
  - Electricidad (kWh)
  - Gas Natural (m³)
  - GLP (kg)
  - Carbón (kg)
- Registro y seguimiento del valor agregado por sectores:
  - Primario
  - Secundario
  - Terciario
- Visualizaciones interactivas:
  - Emisiones totales por año
  - Emisiones por fuente energética
  - Composición del valor agregado
  - Curva ambiental de Kuznets
- Funcionalidades de gestión de datos:
  - Filtrado por año
  - Ordenamiento por columnas
  - Edición y eliminación de registros
  - Cálculos automáticos

## 🚀 Tecnologías

- React + TypeScript
- Recharts para visualizaciones
- CSS Modules para estilos

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm, bun o yarn

## 💻 Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd emisiones-web
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔧 Configuración

### Factores de Emisión

Los factores de emisión se encuentran en:
- `src/data/feSIN.ts`: Factor de emisión del Sistema Interconectado Nacional
- `src/data/factoresCombustibles.ts`: Factores de emisión para combustibles

### Datos Precargados

Los datos de ejemplo se encuentran en:
- `src/data/consumos.ts`: Consumos energéticos
- `src/data/valorAgregado.ts`: Valores agregados por sector

## 📊 Cálculos y Metodología

### Emisiones por Fuente

1. **Electricidad**:
   - Emisiones (tCO₂) = Consumo (kWh) × FE SIN (kgCO₂/kWh) ÷ 1000

2. **Gas Natural**:
   - Emisiones (tCO₂) = Consumo (m³) × PCI (TJ/m³) × FE (kgCO₂/TJ) × 10⁻⁹

3. **GLP**:
   - Emisiones (tCO₂) = Consumo (kg) × PCI (TJ/kg) × FE (kgCO₂/TJ) × 10⁻⁹

4. **Carbón**:
   - Emisiones (tCO₂) = Consumo (kg) × PCI (TJ/kg) × FE (kgCO₂/TJ) × 10⁻⁹

### Valor Agregado

- El valor agregado total se calcula como la suma de los sectores:
  VA Total = VA Primario + VA Secundario + VA Terciario

## 📈 Visualizaciones

1. **Emisiones Totales por Año**:
   - Gráfico de línea que muestra la tendencia temporal
   - Eje Y: tCO₂
   - Eje X: Años

2. **Emisiones por Fuente**:
   - Gráfico de barras apiladas
   - Muestra la contribución de cada fuente energética

3. **Composición del VA**:
   - Gráfico circular por año
   - Muestra la distribución porcentual por sector

4. **Curva de Kuznets**:
   - Gráfico de dispersión
   - Relaciona el consumo energético con el valor agregado
   - Ordenado cronológicamente

## 🤝 Contribución

1. Fork del repositorio
2. Crear una rama para tu feature:
```bash
git checkout -b feature/nueva-caracteristica
```
3. Commit de tus cambios:
```bash
git commit -m 'Agrega nueva característica'
```
4. Push a la rama:
```bash
git push origin feature/nueva-caracteristica
```
5. Crear un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## ✨ Agradecimientos

- [ITM](https://www.itm.edu.co) - Instituto Tecnológico Metropolitano
- Datos basados en investigación académica sobre emisiones GEI
