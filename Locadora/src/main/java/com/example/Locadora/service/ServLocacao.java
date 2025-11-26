package com.example.Locadora.service;

import org.springframework.stereotype.Service;

import com.example.Locadora.domain.Cliente;
import com.example.Locadora.domain.Item;
import com.example.Locadora.domain.Locacao;
import com.example.Locadora.repository.ClienteRepository;
import com.example.Locadora.repository.ItemRepository;
import com.example.Locadora.repository.LocacaoRepository;

import java.time.LocalDate;


@Service
public class ServLocacao {

    private final LocacaoRepository locacaoRepo;
    private final ItemRepository itemRepo;
    private final ClienteRepository clienteRepo;

    public ServLocacao(LocacaoRepository locacaoRepo,
                       ItemRepository itemRepo,
                       ClienteRepository clienteRepo) {

        this.locacaoRepo = locacaoRepo;
        this.itemRepo = itemRepo;
        this.clienteRepo = clienteRepo;
    }

    public Locacao efetuarLocacao(Long idCliente, String idItem) throws Exception {

        Cliente cliente = clienteRepo.findById(idCliente)
                .orElseThrow(() -> new Exception("Cliente não encontrado"));

       Item item = itemRepo.findByNumSerieContainingIgnoreCase(idItem).get(0);
       

        if (!item.isDisponivel()) {
            throw new Exception("Item não está disponível");
        }

        // verifica débito
        boolean debito = locacaoRepo.findAll().stream()
                .anyMatch(l -> l.getCliente().equals(cliente)
                        && !l.getPaga()
                        && l.estaEmAtraso(LocalDate.now()));

        if (debito) {
            throw new Exception("Cliente possui locações em atraso");
        }

        double valor = item.getTitulo().getClasse().getValor();
        int dias = item.getTitulo().getClasse().getPrazoDevolucao();

        LocalDate hoje = LocalDate.now();
        LocalDate prevista = hoje.plusDays(dias);

        Locacao loc = new Locacao(cliente, item, hoje, prevista, valor);

        item.setDisponivel(false);
        itemRepo.save(item);

        return locacaoRepo.save(loc);
    }
}
