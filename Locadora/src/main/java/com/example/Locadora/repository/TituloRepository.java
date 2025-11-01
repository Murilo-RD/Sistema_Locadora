
 package com.example.Locadora.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Locadora.domain.Titulo;

public interface TituloRepository extends JpaRepository<Titulo, Long> {
    List<Titulo> findByNomeContainingIgnoreCase(String nome);
}