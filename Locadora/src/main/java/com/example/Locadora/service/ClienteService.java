package com.example.Locadora.service;


import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Locadora.domain.Cliente;
import com.example.Locadora.domain.Dependente;
import com.example.Locadora.domain.Socio;
import com.example.Locadora.repository.ClienteRepository;
import com.example.Locadora.repository.DependenteRepository;
import com.example.Locadora.repository.SocioRepository;

import java.util.List;

@Service
@RequiredArgsConstructor // Injeta os repositórios via construtor (melhor prática)
@Transactional // Garante que as operações com o banco sejam consistentes
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final SocioRepository socioRepository;
    private final DependenteRepository dependenteRepository;

    // --- Métodos Gerais de Cliente ---

    public List<Cliente> buscarTodosClientes() {
        return clienteRepository.findAll();
    }

    public Cliente buscarClientePorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com ID: " + id));
    }

    public void deletarCliente(Long id) {
        // O JPA cuidará de deletar da tabela cliente e da tabela filha (socio/dependente)
        if (!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente não encontrado");
        }
        clienteRepository.deleteById(id);
    }

    // --- Métodos Específicos de Sócio ---

    public Socio criarSocio(Socio socio) {
        // Podemos adicionar validações aqui (ex: verificar CPF)
        return socioRepository.save(socio);
    }

    public Socio atualizarSocio(Long id, Socio socioAtualizado) {
        Socio socioExistente = socioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sócio não encontrado"));
        
        // Atualiza campos comuns
        socioExistente.setNome(socioAtualizado.getNome());
        socioExistente.setDtNascimento(socioAtualizado.getDtNascimento());
        socioExistente.setSexo(socioAtualizado.getSexo());
        socioExistente.setEstaAtivo(socioAtualizado.getEstaAtivo());
        
        // Atualiza campos específicos de Sócio
        socioExistente.setCpf(socioAtualizado.getCpf());
        socioExistente.setEndereco(socioAtualizado.getEndereco());
        socioExistente.setTelefone(socioAtualizado.getTelefone());
        
        return socioRepository.save(socioExistente);
    }


    public Dependente criarDependente(Long socioId, Dependente dependente) {

        Socio socio = socioRepository.findById(socioId)
                .orElseThrow(() -> new RuntimeException("Sócio não encontrado para vincular dependente"));

        dependente.setSocio(socio);
        
        return dependenteRepository.save(dependente);
    }
    
    public List<Dependente> buscarDependentesPorSocio(Long socioId) {
        return dependenteRepository.findBySocioNumInscricao(socioId);
    }

    @Transactional
    public Dependente atualizarDependente(Long id, Dependente dependenteAtualizado) {
        Dependente dependenteExistente = dependenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dependente não encontrado com ID: " + id));
        dependenteExistente.setNome(dependenteAtualizado.getNome());
        dependenteExistente.setDtNascimento(dependenteAtualizado.getDtNascimento());
        dependenteExistente.setSexo(dependenteAtualizado.getSexo());
        return dependenteRepository.save(dependenteExistente);
    }
}