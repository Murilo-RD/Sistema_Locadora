package com.example.Locadora.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.Locadora.domain.Diretor;
import com.example.Locadora.service.ServDiretor;

@RestController
@RequestMapping("/Diretor")
public class CtrDiretor {

    @Autowired
    private ServDiretor servDiretor;

    @GetMapping("/getAll")
    public List<Diretor> getAll() {
        return servDiretor.getAll();
    }

    @PostMapping("/Save")
    public Diretor Save(@RequestBody Diretor diretor) {
        return servDiretor.save(diretor);
    }

    @PostMapping("/Delete/{id}")
    public void Delete(@PathVariable Long id) {
        servDiretor.delete(id);
    }

    @GetMapping("/get/{nome}")   
    public List<Diretor> get(@PathVariable String nome) {
        return servDiretor.get(nome);
    }
}
