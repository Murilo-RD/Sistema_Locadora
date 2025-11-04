package com.example.Locadora.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "dependente")
@Getter
@Setter
@NoArgsConstructor
public class Dependente extends Cliente {

    // Um Dependente pertence a um Sócio
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "socio_id")
    @JsonBackReference // Evita loops infinitos no JSON (Este é o "filho" da relação)
    private Socio socio;

    // Construtor completo
    public Dependente(String nome, LocalDate dtNascimento, String sexo, Boolean estaAtivo, Socio socio) {
        super(nome, dtNascimento, sexo, estaAtivo);
        this.socio = socio;
    }
}