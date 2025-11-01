package com.example.Locadora.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@AllArgsConstructor
@Getter
@Setter
@Entity
public class Classe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private Double valor;
    private Integer prazoDevolucao;

    @OneToMany(mappedBy = "classe", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Titulo> titulos = new ArrayList<>();

    public Classe() {
    }
    
    // getters e setters
}