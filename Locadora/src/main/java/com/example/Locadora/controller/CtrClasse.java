package com.example.Locadora.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.Locadora.domain.Classe;
import com.example.Locadora.service.ServClasse;




@RestController
@RequestMapping("/Classe")
public class CtrClasse {
    
    @Autowired
    private ServClasse servClasse;

    @GetMapping("/getAll")
    public List<Classe> getAll() {
        return servClasse.getAll();
    }

    @PostMapping("/Save")
    public Classe Save(@RequestBody Classe classe) {
        return servClasse.save(classe);
    }

    @PostMapping("/Delete/{id}")
    public void Delete(@PathVariable Long id) {
        servClasse.delete(id);
    }

   @GetMapping("/get/{nome}")    
    public List<Classe> get(@PathVariable String nome){
        return servClasse.get(nome);
    }
}
