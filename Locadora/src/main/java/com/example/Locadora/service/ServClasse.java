package com.example.Locadora.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Locadora.domain.Classe;
import com.example.Locadora.repository.ClasseRepository;

@Service
public class ServClasse {
    @Autowired
    private ClasseRepository repository;

    public List<Classe> getAll() {
        return repository.findAll();
    }

    public Classe save(Classe diretor) {
        return repository.save(diretor);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Classe> get(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }
}
