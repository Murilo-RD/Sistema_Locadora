import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/header/header';
import PageAtor from '../pages/pageAtor';
import PageDiretor from '../pages/pageDiretor';
import PageClasse from '../pages/pageClasse';



// Componente que gerencia todas as rotas da aplicação
export function AppRoutes() {
  return (
    <BrowserRouter>
      {/* O Header aparece em todas as páginas */}
      <Header />

      <main className="main-content">
        <Routes>
          {/* Rota padrão redireciona para /atores */}
          <Route path="/" element={<Navigate to="/atores" />} />

          {/* Rotas específicas para cada página */}
          <Route path="/atores" element={<PageAtor />} />
          <Route path="/diretores" element={<PageDiretor />} />
          <Route path="/classes" element={<PageClasse />} />

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