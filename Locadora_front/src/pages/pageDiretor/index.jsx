import './style.css'
import Delete from '../../assets/delete.png'
import Edit from '../../assets/edit.png'
import api from '../../services/api'
import { useEffect, useState, useRef } from 'react'

function PageDiretor() {
  const [diretores, setDiretores] = useState([])
  const inputName = useRef()

  const [isEditing, setIsEditing] = useState(false);
  const [currentDiretorId, setCurrentDiretorId] = useState(null);

  async function getDiretores() {
    const diretoresFromApi = await api.get('Diretor/getAll')
    let dados = diretoresFromApi.data;
    setDiretores(dados);
  }

  async function pesquisarDiretores() {
    const nomeDiretor = inputName.current.value;

    if (!nomeDiretor.trim()) {
      getDiretores()
    } else {
      const diretoresApi = await api.get(`Diretor/get/${nomeDiretor}`)
      let dados = diretoresApi.data;
      setDiretores(dados);
    }
  }

  async function cadastrar() {
    const nomeDiretor = inputName.current.value;

    if (!nomeDiretor.trim()) {
      alert("Por favor, preencha o campo de nome antes de cadastrar.");
      return;
    }

    await api.post('Diretor/Save', {
      nome: nomeDiretor
    })

    inputName.current.value = '';
    getDiretores()
  }

  async function atualizarDiretor() {
    const nomeAtualizado = inputName.current.value;

    if (!nomeAtualizado.trim()) {
      alert("O nome não pode ficar em branco.");
      return;
    }
    
    await api.post('Diretor/Save', {
      id: currentDiretorId,
      nome: nomeAtualizado
    })
    
    cancelarEdicao();
    getDiretores();
  }

  function handleEdit(diretor) {
    setIsEditing(true);
    setCurrentDiretorId(diretor.id);
    inputName.current.value = diretor.nome;
    inputName.current.focus();
  }

  function cancelarEdicao() {
    setIsEditing(false);
    setCurrentDiretorId(null);
    inputName.current.value = '';
  }

  async function deletar(id) {
    await api.post(`Diretor/Delete/${id}`)
    getDiretores()
  }

  useEffect(() => { getDiretores() }, [])

  return (
    <div className='container'>
      <form>
        <h1>Diretor</h1>
        <input placeholder='Nome' type="text" name='nome' ref={inputName} />
        
        {isEditing ? (
          <>
            <button type='button' onClick={atualizarDiretor}>Atualizar</button>
            <button type='button' className='cancel-btn' onClick={cancelarEdicao}>Cancelar</button>
          </>
        ) : (
          <>
            <button type='button' onClick={pesquisarDiretores}>Pesquisar</button>
            <button type='button' onClick={cadastrar}>Cadastrar</button>
          </>
        )}
      </form>

      {diretores.map((diretor) => (
        <div className='conAtor' key={diretor.id}>
          <div className='info'>
            <p>ID: <span>{diretor.id}</span> </p>
            <p>Nome: <span>{diretor.nome}</span></p>
          </div>
          <div className='action'>
            <button onClick={() => deletar(diretor.id)}>
              <img src={Delete} alt="Deletar" />
            </button>
            <button onClick={() => handleEdit(diretor)}>
              <img src={Edit} alt="Editar" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PageDiretor;