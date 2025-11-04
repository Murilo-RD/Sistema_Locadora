import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importe os componentes e páginas necessários
import Header from '../components/Header/Header';
import PageAtor from '../pages/PageAtor';
import PageDiretor from '../pages/PageDiretor';
import PageClasse from '../pages/PageClasse';
import PageTitulo from '../pages/pageTitulo'; // NOVO
import PageItem from '../pages/pageItem';     // NOVO
import PageCliente from '../pages/pageCliente'; 
// Componente que gerencia todas as rotas da aplicação
export function AppRoutes() {
  return (
    <BrowserRouter>
      {/* O Header aparece em todas as páginas */}
      <Header />

      <main className="main-content">
        <Routes>
         <Route path="/" element={<Navigate to="/clientes" />} /> 

          <Route path="/clientes" element={<PageCliente />} />
          <Route path="/atores" element={<PageAtor />} />
          <Route path="/diretores" element={<PageDiretor />} />
          <Route path="/classes" element={<PageClasse />} />
          <Route path="/titulos" element={<PageTitulo />} /> {/* NOVO */}
          <Route path="/itens" element={<PageItem />} />     {/* NOVO */}

          {/* Rota para páginas não encontradas */}
          <Route path="*" element={
            <div className='container'>
              <h1>404 - Página Não Encontrada</h1>
            </div>
          } />
        </Routes>
      </main>
    </BrowserRouter>
  );
}