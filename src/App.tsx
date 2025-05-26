import { useState } from 'react';
import './App.css'

function App() {
  interface Endereco {
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
  }

  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState<Endereco | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]: any = useState(null)

  const buscarCep = async () => {
    if (!cep || cep.length !== 8) {
      setError('Por favor, insira um CEP válido com 8 dígitos')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setError('CEP não encontrado.')
        setEndereco(null)
      } else {
        setEndereco(data)
      }
    } catch (err) {
      setError('Erro ao buscar CEP. Tente novamente.')
      setEndereco(null)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      buscarCep()
    }
  }

  return (
    <div className="App">

      <h1>Buscador de CEP</h1>
      <div className="search-container">
        <input type="text" value={cep} onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))} onKeyPress={handleKeyPress} placeholder='Digite o CEP (apenas números)' maxLength={8} />
        <button onClick={buscarCep} disabled={loading}>
          {loading ? 'Buscando... ' : 'Buscar'}
        </button>
      </div>

      {error && <p className='error'>{error}</p>}

      {endereco && (
        <div className="result">
          <h2>Resultado:</h2>
          <p><strong>CEP:</strong> {endereco.cep}</p>
          <p><strong>Logradouro:</strong> {endereco.logradouro}</p>

          <p><strong>Bairro:</strong> {endereco.bairro}</p>
          <p><strong>Cidade:</strong> {endereco.localidade}</p>
          <p><strong>Estado:</strong> {endereco.uf}</p>
        </div>
      )}
    </div>
  )
}

export default App;