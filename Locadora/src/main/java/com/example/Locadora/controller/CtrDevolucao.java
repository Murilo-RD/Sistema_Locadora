package com.example.Locadora.controller;


import org.springframework.web.bind.annotation.*;

import com.example.Locadora.domain.Locacao;
import com.example.Locadora.service.ServDevolucao;

@RestController
@RequestMapping("/devolucoes")
public class CtrDevolucao {

    private final ServDevolucao servDevolucao;

    public CtrDevolucao(ServDevolucao servDevolucao) {
        this.servDevolucao = servDevolucao;
    }

    @PostMapping("/efetuar")
    public Locacao devolver(@RequestParam String numeroSerie) throws Exception {
        return servDevolucao.devolver(numeroSerie);
    }
}
