import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFilm } from 'react-icons/fa';
import './Header.css';

function Header() {
  return (
    <header className="header-container">
      <div className="header-logo">
        <FaFilm size={28} />
        <h1>Locadora</h1>
      </div>

      <nav className="main-nav">
        <ul>
          {/* Links adicionados */}
          <li>
            <NavLink to="/titulos">Títulos</NavLink>
          </li>
          <li>
            <NavLink to="/itens">Itens</NavLink>
          </li>
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