package com.example.Locadora.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Locadora.domain.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Pode buscar qualquer Cliente (Socio ou Dependente) pelo ID
}