import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFilm } from 'react-icons/fa'; // 1. Importamos o ícone de filme
import './Header.css';

function Header() {
  return (
    <header className="header-container">
      {/* 2. Criamos uma div para o logo (ícone + texto) */}
      <div className="header-logo">
        <FaFilm size={28} /> {/* O ícone em si, com tamanho definido */}
        <h1>Locadora</h1>
      </div>

      {/* Navegação continua a mesma */}
      <nav className="main-nav">
        <ul>
          <li>
            <NavLink to="/atores">Atores</NavLink>
          </li>
          <li>
            <NavLink to="/diretores">Diretores</NavLink>
          </li>
          <li>
            <NavLink to="/classes">Classes</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;