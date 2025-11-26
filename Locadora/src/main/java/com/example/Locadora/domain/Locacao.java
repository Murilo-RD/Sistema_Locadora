package com.example.Locadora.domain;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "locacao")
public class Locacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    private LocalDate dtLocacao;
    private LocalDate dtDevolucaoPrevista;
    private LocalDate dtDevolucaoEfetiva;

    private Double valorCobrado;
    private Double multaCobrada;

    private Boolean paga = false;

    public Locacao() {}

    public Locacao(Cliente cliente, Item item,
                   LocalDate dtLocacao, LocalDate dtPrevista, Double valorCobrado) {
        this.cliente = cliente;
        this.item = item;
        this.dtLocacao = dtLocacao;
        this.dtDevolucaoPrevista = dtPrevista;
        this.valorCobrado = valorCobrado;
    }

    public boolean estaEmAtraso(LocalDate hoje) {
        if (dtDevolucaoPrevista == null) return false;
        return hoje.isAfter(dtDevolucaoPrevista);
    }

    // getters e setters    
}
