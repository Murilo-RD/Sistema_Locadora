import './style.css'
import Delete from '../../assets/delete.png'
import Edit from '../../assets/edit.png'
import api from '../../services/api'
import { useEffect, useState, useRef } from 'react'

function PageClasse() {
  const [classes, setClasses] = useState([])
  const inputName = useRef()
  const inputValor = useRef()
  const inputPrazo = useRef()

  const [isEditing, setIsEditing] = useState(false);
  const [currentClasseId, setCurrentClasseId] = useState(null);

  async function getClasses() {
    const classesFromApi = await api.get('Classe/getAll')
    let dados = classesFromApi.data;
    setClasses(dados);
  }

  async function pesquisarClasses() {
    const nomeClasse = inputName.current.value;

    if (!nomeClasse.trim()) {
      getClasses()
    } else {
      const classesApi = await api.get(`Classe/get/${nomeClasse}`)
      let dados = classesApi.data;
      setClasses(dados);
    }
  }

  function limparInputs() {
    inputName.current.value = '';
    inputValor.current.value = '';
    inputPrazo.current.value = '';
  }

  async function cadastrar() {
    const nome = inputName.current.value;
    const valor = inputValor.current.value;
    const prazo = inputPrazo.current.value;

    if (!nome.trim() || !valor.trim() || !prazo.trim()) {
      alert("Por favor, preencha todos os campos antes de cadastrar.");
      return;
    }

    await api.post('Classe/Save', {
      nome: nome,
      valor: parseFloat(valor), // Converte para número
      prazoDevolucao: parseInt(prazo) // Converte para número
    })

    limparInputs();
    getClasses();
  }

  async function atualizarClasse() {
    const nome = inputName.current.value;
    const valor = inputValor.current.value;
    const prazo = inputPrazo.current.value;

    if (!nome.trim() || !valor.trim() || !prazo.trim()) {
      alert("Todos os campos devem ser preenchidos.");
      return;
    }
    
    await api.post('Classe/Save', {
      id: currentClasseId,
      nome: nome,
      valor: parseFloat(valor),
      prazoDevolucao: parseInt(prazo)
    })
    
    cancelarEdicao();
    getClasses();
  }

  function handleEdit(classe) {
    setIsEditing(true);
    setCurrentClasseId(classe.id);
    inputName.current.value = classe.nome;
    inputValor.current.value = classe.valor;
    inputPrazo.current.value = classe.prazoDevolucao;
    inputName.current.focus();
  }

  function cancelarEdicao() {
    setIsEditing(false);
    setCurrentClasseId(null);
    limparInputs();
  }

  async function deletar(id) {
    await api.post(`Classe/Delete/${id}`)
    getClasses()
  }

  useEffect(() => { getClasses() }, [])

  return (
    <div className='container'>
      <form>
        <h1>Classe</h1>
        <input placeholder='Nome' type="text" name='nome' ref={inputName} />
        <input placeholder='Valor' type="number" name='valor' ref={inputValor} />
        <input placeholder='Prazo de Devolução (dias)' type="number" name='prazo' ref={inputPrazo} />
        
        {isEditing ? (
          <>
            <button type='button' onClick={atualizarClasse}>Atualizar</button>
            <button type='button' className='cancel-btn' onClick={cancelarEdicao}>Cancelar</button>
          </>
        ) : (
          <>
            <button type='button' onClick={pesquisarClasses}>Pesquisar</button>
            <button type='button' onClick={cadastrar}>Cadastrar</button>
          </>
        )}
      </form>

      {classes.map((classe) => (
        <div className='conAtor' key={classe.id}>
          <div className='info'>
            <p>ID: <span>{classe.id}</span></p>
            <p>Nome: <span>{classe.nome}</span></p>
            <p>Valor: <span>R$ {classe.valor.toFixed(2)}</span></p>
            <p>Prazo Devolução: <span>{classe.prazoDevolucao} dias</span></p>
          </div>
          <div className='action'>
            <button onClick={() => deletar(classe.id)}>
              <img src={Delete} alt="Deletar" />
            </button>
            <button onClick={() => handleEdit(classe)}>
              <img src={Edit} alt="Editar" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PageClasse;