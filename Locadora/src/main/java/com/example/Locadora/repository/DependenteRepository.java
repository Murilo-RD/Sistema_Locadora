package com.example.Locadora.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Locadora.domain.Dependente;

import java.util.List;

@Repository
public interface DependenteRepository extends JpaRepository<Dependente, Long> {
    // Query customizada para buscar todos os dependentes de um sócio
    List<Dependente> findBySocioNumInscricao(Long socioId);
}