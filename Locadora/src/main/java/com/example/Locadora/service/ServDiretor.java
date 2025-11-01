package com.example.Locadora.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.Locadora.domain.Diretor;
import com.example.Locadora.repository.DiretorRepository;

@Service
public class ServDiretor {
    @Autowired
    private DiretorRepository repository;

    public List<Diretor> getAll() {
        return repository.findAll();
    }

    public Diretor save(Diretor diretor) {
        return repository.save(diretor);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Diretor> get(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }
}
