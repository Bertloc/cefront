import React from "react";
import { VictoryPie, VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from "victory";

const Charts = ({ data }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Gráficos Generados</h2>

      {/* Gráfico Circular */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold">Distribución por Estatus</h3>
        <VictoryPie
          data={data}
          x="Estatus Pedido"
          y="Cantida Pedido"
          colorScale={["#4caf50", "#ff9800", "#f44336", "#2196f3"]}
          labels={({ datum }) => `${datum["Estatus Pedido"]}: ${datum["Cantida Pedido"]}`}
          style={{
            labels: { fontSize: 12, fill: "#333" },
          }}
        />
      </div>

      {/* Gráfico de Barras */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold">Cantidad por Estatus</h3>
        <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
          <VictoryAxis
            style={{
              tickLabels: { fontSize: 12, angle: -45, padding: 15 },
            }}
          />
          <VictoryAxis dependentAxis />
          <VictoryBar
            data={data}
            x="Estatus Pedido"
            y="Cantida Pedido"
            style={{
              data: { fill: "#4caf50" },
            }}
            labels={({ datum }) => `${datum["Cantida Pedido"]}`}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default Charts;
