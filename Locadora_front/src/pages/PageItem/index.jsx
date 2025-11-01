import './style.css'; 
import Delete from '../../assets/delete.png';
import Edit from '../../assets/edit.png';
import api from '../../services/api';
import { useEffect, useState, useRef } from 'react';

function PageItem() {
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  // Não precisamos mais de 'currentItemId', 'isEditing' é o suficiente
  
  const [titulos, setTitulos] = useState([]);
  
  const [formData, setFormData] = useState({
    numSerie: '',
    dtAquisicao: '',
    tipoItem: '',
    idTitulo: ''
  });

  const inputSearchNumSerie = useRef();

  async function getItems() {
    try {
      const itemsFromApi = await api.get('Item/getAll');
      let data = itemsFromApi.data;
      
      // Proteção para caso a API retorne string (devido a loops)
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { data = []; }
      }
      
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      setItems([]); 
    }
  }

  async function getTitulos() {
    try {
      const titulosRes = await api.get('Titulo/getAll');
      let data = titulosRes.data;

      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { data = []; }
      }

      if (Array.isArray(data)) {
        setTitulos(data);
      } else {
        console.error("API /Titulo/getAll não retornou um array:", data);
        setTitulos([]);
      }
    } catch (error) {
      console.error("Erro ao buscar títulos:", error);
      setTitulos([]);
    }
  }

  useEffect(() => {
    getItems();
    getTitulos();
  }, []);

  function limparForm() {
    setFormData({
      numSerie: '', dtAquisicao: '', tipoItem: '', idTitulo: ''
    });
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function validarCampos() {
    const { numSerie, dtAquisicao, tipoItem, idTitulo } = formData;
    if (!numSerie.trim() || !dtAquisicao || !tipoItem || !idTitulo) {
      alert("Por favor, preencha todos os campos.");
      return false;
    }
    return true;
  }

  // A função de cadastrar e atualizar pode usar a mesma lógica
  // O 'Save' do backend deve fazer um "UPSERT" (Update ou Insert)
  // baseado na existência do numSerie.
  async function salvarItem() {
    if (!validarCampos()) return;

    const payload = {
      numSerie: parseInt(formData.numSerie),
      dtAquisicao: formData.dtAquisicao,
      tipoItem: formData.tipoItem,
      titulo: { id: parseInt(formData.idTitulo) }
    };

    // A mesma rota 'Save' deve lidar com insert e update
    await api.post('Item/Save', payload);
    
    // Se estava editando, sai do modo de edição
    if (isEditing) {
      cancelarEdicao();
    } else {
      limparForm();
    }
    
    getItems();
  }

  // --- RECONFIGURADO ---
  function handleEdit(item) {
    setIsEditing(true); // Ativa o modo de edição
    
    // Preenche o formulário com os dados do item
    // O 'numSerie' agora faz parte do formData
    setFormData({
      numSerie: item.numSerie,
      dtAquisicao: new Date(item.dtAquisicao).toISOString().split('T')[0],
      tipoItem: item.tipoItem,
      idTitulo: item.titulo?.id ?? ''
    });
  }

  function cancelarEdicao() {
    setIsEditing(false);
    limparForm();
  }

  // --- RECONFIGURADO ---
  // Agora recebe 'numSerie' em vez de 'id'
  async function deletar(numSerie) {
    try {
      // Passa o numSerie na URL
      await api.post(`Item/Delete/${numSerie}`);
      getItems();
    } catch (error) {
      alert("Não é permitida a exclusão de um item que possua locações ativas.");
    }
  }

  async function pesquisarItems() {
    const numSerie = inputSearchNumSerie.current.value;
    if (!numSerie.trim()) {
      getItems();
    } else {
      try {
        const itemsApi = await api.get(`Item/get/${numSerie}`);
        // Se a API retornar um objeto único, coloca-o num array
        const data = Array.isArray(itemsApi.data) ? itemsApi.data : [itemsApi.data];
        setItems(data.filter(item => item)); // Filtra nulos se a API retornar 404
      } catch (error) {
        console.error("Erro ao pesquisar item:", error);
        setItems([]);
      }
    }
  }

  return (
    <div className='container'>
      <form>
        <h1>Item</h1>
        <input 
          placeholder='Pesquisar por N° de Série' 
          type="number" 
          ref={inputSearchNumSerie} 
        />
        <button type='button' onClick={pesquisarItems}>Pesquisar</button>
        
        <hr />

        {/* --- RECONFIGURADO --- */}
        {/* Campo numSerie é 'readOnly' (apenas leitura) se estiver editando */}
        <input 
          placeholder='N° de Série' 
          type="number" 
          name='numSerie' 
          value={formData.numSerie} 
          onChange={handleFormChange} 
          readOnly={isEditing} 
        />
        
        <label>Data de Aquisição:</label>
        <input type="date" name='dtAquisicao' value={formData.dtAquisicao} onChange={handleFormChange} />
        
        <select name='tipoItem' value={formData.tipoItem} onChange={handleFormChange}>
          <option value="">Selecione o Tipo</option>
          <option value="Fita">Fita</option>
          <option value="DVD">DVD</option>
          <option value="BlueRay">BlueRay</option>
        </select>
        
        <select name='idTitulo' value={formData.idTitulo} onChange={handleFormChange}>
          <option value="">Selecione um Título</option>
          {titulos?.map(titulo => (
            <option key={titulo.id} value={titulo.id}>{titulo.nome} ({titulo.ano})</option>
          ))}
        </select>
        
        {isEditing ? (
          <>
            {/* O botão agora chama 'salvarItem' */}
            <button type='button' onClick={salvarItem}>Atualizar</button>
            <button type='button' className='cancel-btn' onClick={cancelarEdicao}>Cancelar</button>
          </>
        ) : (
          <button type='button' onClick={salvarItem}>Cadastrar</button>
        )}
      </form>

      {/* --- RECONFIGURADO --- */}
      {/* Usa item.numSerie para a 'key' e para o 'deletar' */}
      {items.map((item) => (
        <div className='conAtor' key={item.numSerie}> 
          <div className='info'>
            {/* Removemos o 'ID' e usamos 'N° Série' como identificador principal */}
            <p>N° Série: <span>{item.numSerie}</span></p>
            <p>Título: <span>{item.titulo?.nome}</span></p>
            <p>Tipo: <span>{item.tipoItem}</span></p>
            <p>Status: <span>{item.status?.nome || item.status}</span></p> 
          </div>
          <div className='action'>
            {/* Passa 'item.numSerie' para a função deletar */}
            <button onClick={() => deletar(item.numSerie)}>
              <img src={Delete} alt="Deletar" />
            </button>
            <button onClick={() => handleEdit(item)}>
              <img src={Edit} alt="Editar" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PageItem;