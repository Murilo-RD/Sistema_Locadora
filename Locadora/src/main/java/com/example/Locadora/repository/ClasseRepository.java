package com.example.Locadora.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Locadora.domain.Classe;

public interface ClasseRepository extends JpaRepository<Classe,Long>{
    List<Classe> findByNomeContainingIgnoreCase(String nome);
}
