package com.example.Locadora.domain;

import java.util.Date;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@AllArgsConstructor
@Getter
@Setter
@Entity
public class Item {
    @Id
    private String numSerie;

    @Temporal(TemporalType.DATE)
    private Date dtAquisicao;

    private String tipoItem;
    private boolean disponivel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "titulo_id")
    private Titulo titulo;

    public Item() {
        disponivel = true;
    }
    
    // getters e setters
}