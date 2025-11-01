package com.example.Locadora.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Locadora.domain.Titulo;
import com.example.Locadora.service.ServTitulo;



@RestController
@RequestMapping("/Titulo")
public class CtrTitulo{

    @Autowired
    private ServTitulo servTitulo;

    @GetMapping("/getAll")
    public List<Titulo> getAll() {
        return servTitulo.getAll();
    }

    @PostMapping("/Save")
    public Titulo Save(@RequestBody Titulo Titulo) {
        return servTitulo.save(Titulo);
    }

    @PostMapping("/Delete/{id}")
    public void Delete(@PathVariable Long id) {
        servTitulo.delete(id);
    }

    @GetMapping("/get/{nome}")   
    public List<Titulo> get(@PathVariable String nome) {
        return servTitulo.get(nome);
    }
}
