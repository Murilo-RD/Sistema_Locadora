package com.example.Locadora.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Locadora.domain.Socio;

import java.util.Optional;

@Repository
public interface SocioRepository extends JpaRepository<Socio, Long> {
    // Query customizada para buscar um sócio pelo CPF
    Optional<Socio> findByCpf(String cpf);
}