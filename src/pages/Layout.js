// components/Layout.js
import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Encabezado */}
            <header className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">Sistema de Reportes</h1>
                <nav>
                    <Link className="mr-4 hover:underline" to="/">Inicio</Link>
                    <Link className="mr-4 hover:underline" to="/upload">Subir Archivo</Link>
                    <Link className="hover:underline" to="/login">Cerrar Sesión</Link>
                </nav>
            </header>

            {/* Contenido dinámico */}
            <main className="flex-grow p-8">{children}</main>

            {/* Footer */}
            <footer className="bg-blue-600 text-white py-4 text-center">
                &copy; {new Date().getFullYear()} Sistema de Reportes. Todos los derechos reservados.
            </footer>
        </div>
    );
};

export default Layout;
