import Delete from '../../assets/delete.png';
import Edit from '../../assets/edit.png';
import api from '../../services/api';
import { useEffect, useState, useRef } from 'react';

function PageTitulo() {
  const [titulos, setTitulos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTituloId, setCurrentTituloId] = useState(null);

  const [atores, setAtores] = useState([]);
  const [diretores, setDiretores] = useState([]);
  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    nome: '',
    ano: '',
    sinopse: '',
    categoria: '',
    idDiretor: '',
    idClasse: ''
  });
  const [selectedAtores, setSelectedAtores] = useState([]);

  const inputSearchName = useRef(); 

  async function getTitulos() {
    const titulosFromApi = await api.get('Titulo/getAll');
    setTitulos(titulosFromApi.data);
  }

  async function getDropdownData() {
    try {
      const [atoresRes, diretoresRes, classesRes] = await Promise.all([
        api.get('Ator/getAll'),
        api.get('Diretor/getAll'),
        api.get('Classe/getAll')
      ]);
      setAtores(atoresRes.data);
      setDiretores(diretoresRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados para os formulários:", error);
    }
  }

  useEffect(() => {
    getTitulos();
    getDropdownData();
  }, []);

  function limparForm() {
    setFormData({
      nome: '', ano: '', sinopse: '', categoria: '', idDiretor: '', idClasse: ''
    });
    setSelectedAtores([]);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleAtorSelectChange(e) {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedAtores(selectedIds);
  }

  function validarCampos() {
    const { nome, ano, idDiretor, idClasse } = formData;
    if (!nome.trim() || !ano.trim() || !idDiretor || !idClasse || selectedAtores.length === 0) {
      alert("Preencha todos os campos obrigatórios: Nome, Ano, Diretor, Classe e pelo menos um Ator.");
      return false;
    }
    return true;
  }

  async function cadastrar() {
    if (!validarCampos()) return;

    const payload = {
      nome: formData.nome,
      ano: parseInt(formData.ano),
      sinopse: formData.sinopse,
      categoria: formData.categoria,
      classe: { id: parseInt(formData.idClasse) },
      diretor: { id: parseInt(formData.idDiretor) },
      atores: selectedAtores.map(id => ({ id: parseInt(id) }))
    };

    await api.post('Titulo/Save', payload);
    limparForm();
    getTitulos();
  }

  async function atualizarTitulo() {
    if (!validarCampos()) return;

    const payload = {
      id: currentTituloId, 
      nome: formData.nome,
      ano: parseInt(formData.ano),
      sinopse: formData.sinopse,
      categoria: formData.categoria,
      classe: { id: parseInt(formData.idClasse) },
      diretor: { id: parseInt(formData.idDiretor) },
      atores: selectedAtores.map(id => ({ id: parseInt(id) }))
    };

    await api.post('Titulo/Save', payload);
    cancelarEdicao();
    getTitulos();
  }

  // --- CORRIGIDO AQUI ---
  // Adiciona proteção contra valores nulos
  function handleEdit(titulo) {
    setIsEditing(true);
    setCurrentTituloId(titulo.id);
    setFormData({
      nome: titulo.nome,
      ano: titulo.ano,
      sinopse: titulo.sinopse || '', 
      categoria: titulo.categoria || '',
      idDiretor: titulo.diretor?.id ?? '', // Se for null, usa string vazia
      idClasse: titulo.classe?.id ?? ''   // Se for null, usa string vazia
    });
    // Se for null, usa array vazio
    setSelectedAtores((titulo.atores || []).map(ator => ator.id.toString())); 
  }

  function cancelarEdicao() {
    setIsEditing(false);
    setCurrentTituloId(null);
    limparForm();
  }

  async function deletar(id) {
    try {
      await api.post(`Titulo/Delete/${id}`);
      getTitulos();
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message); 
      } else {
        alert("Não é permitida a exclusão de um título que possua itens.");
      }
    }
  }

  async function pesquisarTitulos() {
    const nome = inputSearchName.current.value;
    if (!nome.trim()) {
      getTitulos();
    } else {
      const titulosApi = await api.get(`Titulo/get/${nome}`);
      setTitulos(titulosApi.data);
    }
  }

  return (
    <div className='container'>
      <form>
        <h1>Título</h1>
        <input 
          placeholder='Pesquisar por Nome' 
          type="text" 
          ref={inputSearchName} 
        />
        <button type='button' onClick={pesquisarTitulos}>Pesquisar</button>
        
        <hr />

        <input placeholder='Nome' type="text" name='nome' value={formData.nome} onChange={handleFormChange} />
        <input placeholder='Ano' type="number" name='ano' value={formData.ano} onChange={handleFormChange} />
        <input placeholder='Categoria' type="text" name='categoria' value={formData.categoria} onChange={handleFormChange} />
        <textarea placeholder='Sinopse' name='sinopse' value={formData.sinopse} onChange={handleFormChange}></textarea>
        
        <select name='idDiretor' value={formData.idDiretor} onChange={handleFormChange}>
          <option value="">Selecione um Diretor</option>
          {diretores.map(dir => (
            <option key={dir.id} value={dir.id}>{dir.nome}</option>
          ))}
        </select>
        
        <select name='idClasse' value={formData.idClasse} onChange={handleFormChange}>
          <option value="">Selecione uma Classe</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.nome} - R$ {cls.valor.toFixed(2)}</option>
          ))}
        </select>
        
        <label>Atores (Segure Ctrl/Cmd para selecionar vários):</label>
        <select name='idAtores' value={selectedAtores} onChange={handleAtorSelectChange} multiple size={5}>
          {atores.map(ator => (
            <option key={ator.id} value={ator.id}>{ator.nome}</option>
          ))}
        </select>
        
        {isEditing ? (
          <>
            <button type='button' onClick={atualizarTitulo}>Atualizar</button>
            <button type='button' className='cancel-btn' onClick={cancelarEdicao}>Cancelar</button>
          </>
        ) : (
          <button type='button' onClick={cadastrar}>Cadastrar</button>
        )}
      </form>

      {/* --- CORRIGIDO AQUI --- */}
      {/* Adiciona proteção contra valores nulos na renderização */}
      {titulos.map((titulo) => (
        <div className='conAtor' key={titulo.id}>
          <div className='info'>
            <p>ID: <span>{titulo.id}</span></p>
            <p>Nome: <span>{titulo.nome} ({titulo.ano})</span></p>
            <p>Diretor: <span>{titulo.diretor?.nome}</span></p>
            <p>Classe: <span>{titulo.classe?.nome}</span></p>
          </div>
          <div className='action'>
            <button onClick={() => deletar(titulo.id)}>
              <img src={Delete} alt="Deletar" />
            </button>
            <button onClick={() => handleEdit(titulo)}>
              <img src={Edit} alt="Editar" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PageTitulo;