package com.example.Locadora.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Locadora.domain.Locacao;

import java.util.Optional;

public interface LocacaoRepository extends JpaRepository<Locacao, Long> {

    Optional<Locacao> findByItem_NumSerieAndPagaFalse(String numeroSerie);

}