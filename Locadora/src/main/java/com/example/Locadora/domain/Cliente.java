package com.example.Locadora.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "cliente")
@Inheritance(strategy = InheritanceType.JOINED) // Estratégia de Herança
@Getter
@Setter
@NoArgsConstructor
// Ignora campos do Hibernate para evitar erros de serialização JSON
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public abstract class Cliente { // Abstrata, pois um cliente é ou Sócio ou Dependente

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "num_inscricao") // O diagrama usa "numInscricao"
    private Long numInscricao;

    @Column(nullable = false)
    private String nome;

    private LocalDate dtNascimento;
    
    private String sexo;
    
    private Boolean estaAtivo;

    // Construtor para campos comuns
    public Cliente(String nome, LocalDate dtNascimento, String sexo, Boolean estaAtivo) {
        this.nome = nome;
        this.dtNascimento = dtNascimento;
        this.sexo = sexo;
        this.estaAtivo = estaAtivo;
    }
}