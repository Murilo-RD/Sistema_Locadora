package com.example.Locadora.controller;


import org.springframework.web.bind.annotation.*;

import com.example.Locadora.domain.Locacao;
import com.example.Locadora.service.ServLocacao;

@RestController
@RequestMapping("/locacoes")
public class CtrLocacao {

    private final ServLocacao servLocacao;

    public CtrLocacao(ServLocacao servLocacao) {
        this.servLocacao = servLocacao;
    }

    @PostMapping("/efetuar")
    public Locacao efetuarLocacao(@RequestParam Long cliente,
                                  @RequestParam String item) throws Exception {
        return servLocacao.efetuarLocacao(cliente, item);
    }
}
