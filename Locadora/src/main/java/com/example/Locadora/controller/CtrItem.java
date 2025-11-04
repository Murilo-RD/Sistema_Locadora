package com.example.Locadora.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.Locadora.domain.Item;
import com.example.Locadora.service.ServItem;

@RestController
@RequestMapping("/Item")
public class CtrItem {

    @Autowired
    private ServItem servItem;

    @GetMapping("/getAll")
    public List<Item> getAll() {
        return servItem.getAll();
    }

    @PostMapping("/Save")
    public Item Save(@RequestBody Item Item) {
        return servItem.save(Item);
    }

    @PostMapping("/Delete/{id}")
    public void Delete(@PathVariable String id) {
        servItem.delete(id);
    }

    @GetMapping("/get/{num}")   
    public List<Item> get(@PathVariable String num) {
        return servItem.get(num);
    }
}
