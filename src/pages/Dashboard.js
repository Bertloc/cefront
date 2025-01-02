import React from "react";

// Importar las imágenes
import cumplimientoDePedidos from "../assets/images/cumplimiento_de_pedidos.png";
import cumplimientoEntregado from "../assets/images/cumplimiento_entregado.png";
import programacionDePedido from "../assets/images/programación_de_pedido.png";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tarjeta 1 */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <img
            src={cumplimientoDePedidos}
            alt="Cumplimiento de Pedidos"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Cumplimiento de Pedidos</h2>
            <p className="text-gray-700">Detalles sobre el cumplimiento de pedidos.</p>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <img
            src={cumplimientoEntregado}
            alt="Cumplimiento Entregado"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Cumplimiento Entregado</h2>
            <p className="text-gray-700">Detalles sobre el cumplimiento entregado.</p>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <img
            src={programacionDePedido}
            alt="Programación de Pedido"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Programación de Pedido</h2>
            <p className="text-gray-700">Detalles sobre la programación de pedidos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
