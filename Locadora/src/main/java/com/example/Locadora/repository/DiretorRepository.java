package com.example.Locadora.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Locadora.domain.Diretor;

public interface DiretorRepository extends JpaRepository<Diretor ,Long>{
    List<Diretor> findByNomeContainingIgnoreCase(String nome);
}
