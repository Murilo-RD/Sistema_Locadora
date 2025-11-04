package com.example.Locadora.domain;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "socio")
@Getter
@Setter
@NoArgsConstructor
public class Socio extends Cliente {

    @Column(unique = true)
    private String cpf;
    
    private String endereco;
    
    @Column(name = "tel") // "tel" como no diagrama
    private String telefone;

    // Um Sócio pode ter muitos Dependentes
    @OneToMany(mappedBy = "socio", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Evita loops infinitos no JSON (Este é o "pai" da relação)
    private List<Dependente> dependentes = new ArrayList<>();

    // Construtor completo
    public Socio(String nome, LocalDate dtNascimento, String sexo, Boolean estaAtivo, String cpf, String endereco, String telefone) {
        super(nome, dtNascimento, sexo, estaAtivo);
        this.cpf = cpf;
        this.endereco = endereco;
        this.telefone = telefone;
    }
}