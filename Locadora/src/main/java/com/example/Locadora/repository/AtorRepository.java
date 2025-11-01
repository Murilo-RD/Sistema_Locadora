package com.example.Locadora.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Locadora.domain.Ator;

public interface AtorRepository extends JpaRepository<Ator ,Long> {
    List<Ator> findByNomeContainingIgnoreCase(String nome);
} 