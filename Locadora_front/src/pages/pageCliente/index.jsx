import React, { useEffect, useState, useRef } from 'react';
import './style.css'; 
import Delete from '../../assets/delete.png';
import Edit from '../../assets/edit.png';
import { FaUserPlus } from 'react-icons/fa'; 
import api from '../../services/api';

// --- Componente DependenteForm (Sem alterações) ---
// (Formulário embutido para ADICIONAR dependente)
function DependenteForm({ socio, onCancel, onSave }) {
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [dtNascimento, setDtNascimento] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!nome || !sexo || !dtNascimento) {
      alert("Preencha todos os campos do dependente.");
      return;
    }
    await onSave(socio.numInscricao, {
      nome,
      sexo,
      dtNascimento,
      estaAtivo: true 
    });
  };

  return (
    <div className="dependente-form-container">
      <h2>Adicionar Dependente para {socio.nome}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          placeholder='Nome do Dependente' 
          type="text" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
        />
        <input 
          placeholder='Sexo (M/F)' 
          type="text" 
          maxLength={1}
          value={sexo} 
          onChange={(e) => setSexo(e.target.value)} 
        />
        <label>Data de Nascimento:</label>
        <input 
          type="date" 
          value={dtNascimento} 
          onChange={(e) => setDtNascimento(e.target.value)} 
        />
        <div className="form-button-group">
          <button type='submit'>Salvar Dependente</button>
          <button type='button' className='cancel-btn' onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}


// --- Componente Principal da Página ---
function PageCliente() {
  const [allClientes, setAllClientes] = useState([]); 
  const [filteredClientes, setFilteredClientes] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  
  const [dependenteFormSocioId, setDependenteFormSocioId] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    telefone: '',
    sexo: '',
    cpf: '',
    dtNascimento: ''
  });
  
  const inputSearchNomeRef = useRef(); 

  // --- FUNÇÕES DE DADOS (Listar e Pesquisar) ---
  async function fetchAllClientes() {
    try {
      const response = await api.get('/Cliente'); 
      const data = Array.isArray(response.data) ? response.data : [];
      setAllClientes(data);
      setFilteredClientes(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setAllClientes([]);
      setFilteredClientes([]);
    }
  }

  useEffect(() => {
    fetchAllClientes();
  }, []);

  function handleSearchByName() {
    const searchTerm = inputSearchNomeRef.current.value.toLowerCase();
    if (!searchTerm.trim()) {
      setFilteredClientes(allClientes); 
    } else {
      const results = allClientes.filter(cliente => 
        cliente.nome.toLowerCase().includes(searchTerm)
      );
      setFilteredClientes(results);
    }
  }

  function clearSearchAndListAll() {
    inputSearchNomeRef.current.value = ''; 
    setFilteredClientes(allClientes); 
  }

  function limparForm() {
    setFormData({
      nome: '', endereco: '', telefone: '', sexo: '', cpf: '', dtNascimento: ''
    });
    setIsEditing(false);
    setCurrentCliente(null);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // --- FUNÇÕES DE AÇÃO (CRUD) ---

  // --- ATUALIZADO ---
  // Agora inclui a lógica para ATUALIZAR DEPENDENTE
  async function handleFormSubmit() {
    const isSocio = (isEditing && currentCliente?.cpf) || (!isEditing && formData.cpf);
    
    // Validação
    if (isSocio) {
      if (!formData.nome || !formData.endereco || !formData.telefone || !formData.sexo || !formData.cpf || !formData.dtNascimento) {
        alert("Para Sócios, todos os campos são obrigatórios.");
        return;
      }
    } else if (isEditing && !currentCliente?.cpf) { // Editando um dependente
      if(!formData.nome || !formData.sexo || !formData.dtNascimento) {
        alert("Para Dependentes, os campos Nome, Sexo e Data de Nascimento são obrigatórios.");
        return;
      }
    }
    
    try {
      if (isEditing) {
        if (isSocio) {
          // --- ATUALIZAR SÓCIO ---
          await api.put(`/Cliente/socios/${currentCliente.numInscricao}`, {
            ...currentCliente, 
            ...formData,      
            numInscricao: currentCliente.numInscricao 
          });
          alert("Sócio atualizado com sucesso!");
        } else {
          // --- ATUALIZAR DEPENDENTE (NOVA LÓGICA) ---
          await api.put(`/Cliente/dependentes/${currentCliente.numInscricao}`, {
            ...currentCliente, // Envia dados antigos (como 'socio' e 'estaAtivo')
            // Envia apenas os dados que estão no formulário de dependente
            nome: formData.nome,
            sexo: formData.sexo,
            dtNascimento: formData.dtNascimento
          });
          alert("Dependente atualizado com sucesso!");
        }
      } else {
        // --- CRIAR SÓCIO ---
        await api.post('/Cliente/SaveSocio', { ...formData, estaAtivo: true });
        alert("Sócio cadastrado com sucesso!");
      }
      limparForm();
      fetchAllClientes();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert(error.response?.data?.message || "Erro ao salvar cliente.");
    }
  }

  async function handleDelete(cliente) {
    if (window.confirm(`Tem certeza que deseja excluir ${cliente.nome}? Ação irreversível.`)) {
      try {
        await api.delete(`/Cliente/${cliente.numInscricao}`);
        alert("Cliente excluído com sucesso.");
        fetchAllClientes(); 
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert(error.response?.data?.message || "Erro: Este cliente pode possuir locações ativas.");
      }
    }
  }

  // --- ATUALIZADO ---
  // Agora preenche o formulário para qualquer cliente
  function handleEdit(cliente) {
    setIsEditing(true);
    setCurrentCliente(cliente);
    setDependenteFormSocioId(null); // Fecha qualquer formulário de dependente
    
    setFormData({
      nome: cliente.nome,
      dtNascimento: new Date(cliente.dtNascimento).toISOString().split('T')[0],
      sexo: cliente.sexo,
      // Se for sócio, preenche. Se não, string vazia.
      cpf: cliente.cpf || '',
      endereco: cliente.endereco || '',
      telefone: cliente.telefone || ''
    });
    
    window.scrollTo(0, 0); // Rola para o topo
  }

  // --- LÓGICA DO FORMULÁRIO DE CRIAR DEPENDENTE (Sem alterações) ---
  function handleOpenDependenteForm(socio) {
    const dependentesAtivos = socio.dependentes?.filter(d => d.estaAtivo).length || 0;
    if (dependentesAtivos >= 3) {
      alert("Este sócio já possui o limite de 3 dependentes ativos.");
      return;
    }
    setDependenteFormSocioId(prevId => (prevId === socio.numInscricao ? null : socio.numInscricao));
  }

  async function handleSaveDependente(socioId, dependenteData) {
    try {
      await api.post(`/Cliente/socios/${socioId}/dependentes`, dependenteData);
      alert("Dependente salvo com sucesso!");
      setDependenteFormSocioId(null); 
      fetchAllClientes(); 
    } catch (error) {
      console.error("Erro ao salvar dependente:", error);
      alert(error.response?.data?.message || "Erro ao salvar dependente.");
    }
  }

  // --- ATUALIZADO ---
  // Função para determinar o título do formulário
  function getFormTitle() {
    if (isEditing) {
      return currentCliente?.cpf 
        ? `Editando Sócio: ${currentCliente.nome}` 
        : `Editando Dependente: ${currentCliente.nome}`;
    }
    return "Cadastrar Novo Sócio";
  }

  return (
    <div className='container'>
      
      {/* Formulário de Pesquisa (Estilo Título) */}
      <form>
        <h1>Cliente</h1>
        <input 
          placeholder='Pesquisar por Nome' 
          type="text" 
          ref={inputSearchNomeRef} 
        />
        <div className="form-button-group">
          <button type='button' onClick={handleSearchByName}>Pesquisar</button>
          <button type='button' onClick={clearSearchAndListAll}>Listar Todos</button>
        </div>
      </form>
      
      {/* Formulário Principal (Sócio/Dependente) */}
      <form>
        {/* --- TÍTULO ATUALIZADO --- */}
        <h1>{getFormTitle()}</h1>
        
        <input placeholder='Nome' type="text" name='nome' value={formData.nome} onChange={handleFormChange} />
        <input placeholder='Sexo (M/F)' type="text" name='sexo' maxLength={1} value={formData.sexo} onChange={handleFormChange} />
        <label>Data de Nascimento:</label>
        <input type="date" name='dtNascimento' value={formData.dtNascimento} onChange={handleFormChange} />

        {/* --- LÓGICA DE EXIBIÇÃO ATUALIZADA --- */}
        {/* Só mostra campos de Sócio se: 
            1. Não estiver editando (for cadastro de Sócio)
            2. Estiver editando E o cliente for um Sócio
        */}
        {(!isEditing || (isEditing && currentCliente?.cpf)) && (
          <>
            <hr />
            <input placeholder='CPF' type="text" name='cpf' value={formData.cpf} onChange={handleFormChange} readOnly={isEditing} />
            <input placeholder='Endereço' type="text" name='endereco' value={formData.endereco} onChange={handleFormChange} />
            <input placeholder='Telefone' type="text" name='telefone' value={formData.telefone} onChange={handleFormChange} />
          </>
        )}
        
        {isEditing ? (
          <div className="form-button-group">
            <button type='button' onClick={handleFormSubmit}>Atualizar Cliente</button>
            <button type='button' className='cancel-btn' onClick={limparForm}>Cancelar Edição</button>
          </div>
        ) : (
          <button type='button' onClick={handleFormSubmit}>Cadastrar Sócio</button>
        )}
      </form>

      {/* --- Lista de Clientes --- */}
      {filteredClientes.map((cliente) => {
        const isSocio = !!cliente.cpf; 
        const isFormOpen = dependenteFormSocioId === cliente.numInscricao;
        
        return (
          <React.Fragment key={cliente.numInscricao}>
            <div 
              className='conAtor' 
              style={isFormOpen ? { borderRadius: '10px 10px 0 0', marginBottom: '0' } : {}}
            >
              <div className='info'>
                <p>ID: <span>{cliente.numInscricao}</span></p>
                <p>Nome: <span>{cliente.nome}</span></p>
                <p>Tipo: <span>{isSocio ? "Sócio" : "Dependente"}</span></p>
                <p>Status: <span>{cliente.estaAtivo ? "Ativo" : "Inativo"}</span></p>
                {isSocio && (
                  <p>Dependentes: <span>{cliente.dependentes?.length || 0}</span></p>
                )}
              </div>
              
              <div className='action'>
                {isSocio && (
                  <button title="Adicionar Dependente" onClick={() => handleOpenDependenteForm(cliente)}>
                    <FaUserPlus size={25} color="white" />
                  </button>
                )}

                {/* --- BOTÃO DE EDITAR ATUALIZADO --- */}
                {/* Agora está sempre habilitado */}
                <button 
                  title="Editar"
                  onClick={() => handleEdit(cliente)}
                >
                  <img src={Edit} alt="Editar" style={{ opacity: 1 }} />
                </button>
                
                <button title="Excluir" onClick={() => handleDelete(cliente)}>
                  <img src={Delete} alt="Deletar" />
                </button>
              </div>
            </div>
            
            {/* Renderiza o formulário de adicionar dependente embaixo do card */}
            {isFormOpen && (
              <DependenteForm
                socio={cliente}
                onCancel={() => setDependenteFormSocioId(null)}
                onSave={handleSaveDependente}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default PageCliente;