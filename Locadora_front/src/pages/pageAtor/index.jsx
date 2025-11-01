import './style.css'
import Delete from '../../assets/delete.png'
import Edit from '../../assets/edit.png'
import api from '../../services/api'
import { useEffect, useState, useRef } from 'react'

function PageAtor() {
  const [atores, setAtores] = useState([])
  const inputName = useRef()

  // --- NOVOS ESTADOS PARA GERENCIAR A EDIÇÃO ---
  const [isEditing, setIsEditing] = useState(false); // Controla se está no modo de edição
  const [currentAtorId, setCurrentAtorId] = useState(null); // Guarda o ID do ator sendo editado

  async function getAtores() {
    const atoresFromApi = await api.get('Ator/getAll')
    let dados = atoresFromApi.data;
    setAtores(dados);
  }

  async function pesquisarAtores() {
    const nomeAtor = inputName.current.value;

    if (!nomeAtor.trim()) {
      getAtores()
    } else {
      const atoresApi = await api.get(`Ator/get/${inputName.current.value}`)
      let dados = atoresApi.data;
      setAtores(dados);
      console.log(atoresApi)
    }
  }

  async function cadastrar() {
    const nomeAtor = inputName.current.value;

    if (!nomeAtor.trim()) {
      alert("Por favor, preencha o campo de nome antes de cadastrar.");
      return;
    }

    await api.post('Ator/Save', {
      nome: nomeAtor
    })

    inputName.current.value = '';
    getAtores()
  }

  // --- NOVA FUNÇÃO PARA ATUALIZAR UM ATOR ---
  async function atualizarAtor() {
    const nomeAtualizado = inputName.current.value;

    if (!nomeAtualizado.trim()) {
      alert("O nome não pode ficar em branco.");
      return;
    }
    
    // Supondo que sua API aceita o ID no corpo para atualizar
    await api.post('Ator/Save', {
      id: currentAtorId,
      nome: nomeAtualizado
    })
    
    // Reseta o formulário para o modo de cadastro
    cancelarEdicao();
    getAtores();
  }

  // --- NOVA FUNÇÃO PARA INICIAR A EDIÇÃO ---
  function handleEdit(ator) {
    setIsEditing(true); // Ativa o modo de edição
    setCurrentAtorId(ator.id); // Define o ID do ator atual
    inputName.current.value = ator.nome; // Preenche o input com o nome atual
    inputName.current.focus(); // Coloca o foco no input
  }

  // --- NOVA FUNÇÃO PARA CANCELAR A EDIÇÃO ---
  function cancelarEdicao() {
    setIsEditing(false);
    setCurrentAtorId(null);
    inputName.current.value = '';
  }

  async function deletar(id) {
    await api.post(`Ator/Delete/${id}`)
    getAtores()
  }

  useEffect(() => { getAtores() }, [])

  return (
    <div className='container'>
      <form>
        <h1>Ator</h1>
        <input placeholder='Nome' type="text" name='nome' ref={inputName} />
        
        {/* --- BOTÕES CONDICIONAIS --- */}
        {isEditing ? (
          // Botões que aparecem QUANDO está editando
          <>
            <button type='button' onClick={atualizarAtor}>Atualizar</button>
            <button type='button' className='cancel-btn' onClick={cancelarEdicao}>Cancelar</button>
          </>
        ) : (
          // Botões que aparecem QUANDO NÃO está editando
          <>
            <button type='button' onClick={pesquisarAtores}>Pesquisar</button>
            <button type='button' onClick={cadastrar}>Cadastrar</button>
          </>
        )}
      </form>

      {atores.map((ator) => (
        <div className='conAtor' key={ator.id}>
          <div className='info'>
            <p>ID: <span>{ator.id}</span> </p>
            <p>Nome: <span>{ator.nome}</span></p>
          </div>
          <div className='action'>
            <button onClick={() => deletar(ator.id)}>
              <img src={Delete} alt="Deletar" />
            </button>
            {/* --- ATIVANDO O BOTÃO DE EDITAR --- */}
            <button onClick={() => handleEdit(ator)}>
              <img src={Edit} alt="Editar" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PageAtor