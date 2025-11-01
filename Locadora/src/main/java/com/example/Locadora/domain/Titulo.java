package com.example.Locadora.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@AllArgsConstructor
@Getter
@Setter
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Titulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private Integer ano;
    private String sinopse;
    private String categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classe_id")
    private Classe classe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diretor_id")
    private Diretor diretor;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "titulo_ator",
        joinColumns = @JoinColumn(name = "titulo_id"),
        inverseJoinColumns = @JoinColumn(name = "ator_id")
    )
    private Set<Ator> atores = new HashSet<>();

    @OneToMany(mappedBy = "titulo", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Item> itens = new ArrayList<>();

    public Titulo() {
    }

    
    // getters e setters
}