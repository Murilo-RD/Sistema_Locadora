package com.example.Locadora.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Locadora.domain.Ator;
import com.example.Locadora.repository.AtorRepository;

@Service
public class ServAtor {

    @Autowired
    private  AtorRepository repository;

    public List<Ator> getAll(){
        return repository.findAll();
    }

    public Ator save(Ator ator){
        return repository.save(ator);
    }
    
    public void delete(Long id){
        repository.deleteById(id);
    }

    public List<Ator> get(String nome){
        return repository.findByNomeContainingIgnoreCase(nome);
    }
}