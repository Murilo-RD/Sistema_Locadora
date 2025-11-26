package com.example.Locadora.service;


import org.springframework.stereotype.Service;

import com.example.Locadora.domain.Item;
import com.example.Locadora.domain.Locacao;
import com.example.Locadora.repository.ItemRepository;
import com.example.Locadora.repository.LocacaoRepository;

import java.time.LocalDate;

@Service
public class ServDevolucao {

    private final LocacaoRepository locacaoRepo;
    private final ItemRepository itemRepo;

    public ServDevolucao(LocacaoRepository locacaoRepo,
                         ItemRepository itemRepo) {
        this.locacaoRepo = locacaoRepo;
        this.itemRepo = itemRepo;
    }

    public Locacao devolver(String numeroSerie) throws Exception {

        Locacao loc = locacaoRepo
                .findByItem_NumSerieAndPagaFalse(numeroSerie)
                .orElseThrow(() -> new Exception("Item não possui locação vigente"));

        LocalDate hoje = LocalDate.now();

        double multa = 0;

        if (loc.estaEmAtraso(hoje)) {
            long diasAtraso =
                java.time.temporal.ChronoUnit.DAYS.between(
                        loc.getDtDevolucaoPrevista(), hoje);
            multa = diasAtraso * 2.0;  // regra de negócio → R$2 por dia
        }

        loc.setDtDevolucaoEfetiva(hoje);
        loc.setMultaCobrada(multa);
        loc.setPaga(true);
        Item item = loc.getItem();
        item.setDisponivel(true);
        itemRepo.save(item);

        return locacaoRepo.save(loc);
    }
}

