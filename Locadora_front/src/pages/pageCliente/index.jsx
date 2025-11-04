import React, { useEffect, useState, useRef } from 'react';
import './style.css'; 
import Delete from '../../assets/delete.png';
import Edit from '../../assets/edit.png';
import { FaUserPlus } from 'react-icons/fa'; 
import api from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Componente DependenteForm ---
function DependenteForm({ socio, onCancel, onSave }) {
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [dtNascimento, setDtNascimento] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!nome || !sexo || !dtNascimento) {
      toast.warn("Preencha todos os campos do dependente.");
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


// --- Componente Principal ---
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

  async function fetchAllClientes() {
    try {
      const response = await api.get('/Cliente'); 
      const data = Array.isArray(response.data) ? response.data : [];
      setAllClientes(data);
      setFilteredClientes(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Erro ao buscar lista de clientes.");
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

  async function handleFormSubmit() {
    const isSocio = (isEditing && currentCliente?.cpf) || (!isEditing && formData.cpf);
    
    if (isSocio) {
      if (!formData.nome || !formData.endereco || !formData.telefone || !formData.sexo || !formData.cpf || !formData.dtNascimento) {
        toast.warn("Para Sócios, todos os campos são obrigatórios.");
        return;
      }
    } else if (isEditing && !currentCliente?.cpf) {
      if(!formData.nome || !formData.sexo || !formData.dtNascimento) {
        toast.warn("Para Dependentes, os campos Nome, Sexo e Data de Nascimento são obrigatórios.");
        return;
      }
    }
    
    try {
      if (isEditing) {
        if (isSocio) {
          await api.put(`/Cliente/socios/${currentCliente.numInscricao}`, {
            ...currentCliente, 
            ...formData,      
            numInscricao: currentCliente.numInscricao 
          });
          toast.success("Sócio atualizado com sucesso!");
        } else {
          await api.put(`/Cliente/dependentes/${currentCliente.numInscricao}`, {
            ...currentCliente,
            nome: formData.nome,
            sexo: formData.sexo,
            dtNascimento: formData.dtNascimento
          });
          toast.success("Dependente atualizado com sucesso!");
        }
      } else {
        await api.post('/Cliente/SaveSocio', { ...formData, estaAtivo: true });
        toast.success("Sócio cadastrado com sucesso!");
      }
      limparForm();
      fetchAllClientes();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      const backendMsg = error.response?.data?.mensagem || error.response?.data?.erro;
      toast.error(backendMsg || "Erro ao salvar cliente.");
    }
  }

  async function handleDelete(cliente) {
    if (window.confirm(`Tem certeza que deseja excluir ${cliente.nome}? Ação irreversível.`)) {
      try {
        await api.delete(`/Cliente/${cliente.numInscricao}`);
        toast.success("Cliente excluído com sucesso.");
        fetchAllClientes(); 
      } catch (error) {
        console.error("Erro ao deletar:", error);
        const backendMsg = error.response?.data?.mensagem || error.response?.data?.erro;
        toast.error(backendMsg || "Erro: Este cliente pode possuir locações ativas.");
      }
    }
  }

  function handleEdit(cliente) {
    setIsEditing(true);
    setCurrentCliente(cliente);
    setDependenteFormSocioId(null);
    
    setFormData({
      nome: cliente.nome,
      dtNascimento: new Date(cliente.dtNascimento).toISOString().split('T')[0],
      sexo: cliente.sexo,
      cpf: cliente.cpf || '',
      endereco: cliente.endereco || '',
      telefone: cliente.telefone || ''
    });
    
    window.scrollTo(0, 0);
  }

  function handleOpenDependenteForm(socio) {
    const dependentesAtivos = socio.dependentes?.filter(d => d.estaAtivo).length || 0;
    if (dependentesAtivos >= 3) {
      toast.warn("Este sócio já possui o limite de 3 dependentes ativos.");
      return;
    }
    setDependenteFormSocioId(prevId => (prevId === socio.numInscricao ? null : socio.numInscricao));
  }

  async function handleSaveDependente(socioId, dependenteData) {
    try {
      await api.post(`/Cliente/socios/${socioId}/dependentes`, dependenteData);
      toast.success("Dependente salvo com sucesso!");
      setDependenteFormSocioId(null); 
      fetchAllClientes(); 
    } catch (error) {
      console.error("Erro ao salvar dependente:", error);
      const backendMsg = error.response?.data?.mensagem || error.response?.data?.erro;
      toast.error(backendMsg || "Erro ao salvar dependente.");
    }
  }

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
      
      <form>
        <h1>{getFormTitle()}</h1>
        
        <input placeholder='Nome' type="text" name='nome' value={formData.nome} onChange={handleFormChange} />
        <input placeholder='Sexo (M/F)' type="text" name='sexo' maxLength={1} value={formData.sexo} onChange={handleFormChange} />
        <label>Data de Nascimento:</label>
        <input type="date" name='dtNascimento' value={formData.dtNascimento} onChange={handleFormChange} />

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

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
    </div>
  );
}

export default PageCliente;
