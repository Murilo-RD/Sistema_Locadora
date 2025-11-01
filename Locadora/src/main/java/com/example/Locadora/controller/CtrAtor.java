package com.example.Locadora.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.Locadora.domain.Ator;
import com.example.Locadora.service.ServAtor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/Ator")
public class CtrAtor{

    @Autowired
    private ServAtor servAtor;

    @GetMapping("/getAll")
    public List<Ator> getAll(){
        return servAtor.getAll();
    }

    @PostMapping("/Save")
    public Ator Save(@RequestBody Ator ator) {
        return servAtor.save(ator);
    }
    
    @PostMapping("/Delete/{id}")
    public void Delete(@PathVariable Long id) {
        servAtor.delete(id);
    }
    
    @GetMapping("/get/{nome}")    
    public List<Ator> get(@PathVariable String nome){
        return servAtor.get(nome);
    }
}






