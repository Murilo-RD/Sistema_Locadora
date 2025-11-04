package com.example.Locadora.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Locadora.domain.Item;

public interface ItemRepository extends JpaRepository<Item ,String>{
    List<Item> findByNumSerieContainingIgnoreCase(String num);
}