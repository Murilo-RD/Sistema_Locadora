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
public class Ator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @ManyToMany(mappedBy = "atores", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Titulo> titulos = new ArrayList<>();

    public Ator() {
    }

    // getters e setters
}

