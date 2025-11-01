package com.example.Locadora.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Locadora.domain.Titulo;
import com.example.Locadora.repository.TituloRepository;

@Service
public class ServTitulo {
    @Autowired
    private TituloRepository repository;

    public List<Titulo> getAll() {
        return repository.findAll();
    }

    public Titulo save(Titulo diretor) {
        return repository.save(diretor);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Titulo> get(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }
}
