package com.example.Locadora.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Locadora.domain.Item;
import com.example.Locadora.repository.ItemRepository;


@Service
public class ServItem {
    @Autowired
    private ItemRepository repository;

    public List<Item> getAll() {
        return repository.findAll();
    }

    public Item save(Item diretor) {
        return repository.save(diretor);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Item> get(String num) {
        return repository.findByNumSerieContainingIgnoreCase(num);
    }
}
