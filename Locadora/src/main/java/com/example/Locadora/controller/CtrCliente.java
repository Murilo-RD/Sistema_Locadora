package com.example.Locadora.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Locadora.domain.Cliente;
import com.example.Locadora.domain.Dependente;
import com.example.Locadora.domain.Socio;
import com.example.Locadora.service.ServCliente;

import java.util.List;

@RestController
@RequestMapping("/Cliente") // Endpoint base para clientes
@RequiredArgsConstructor
public class CtrCliente {

    private final ServCliente clienteService;

    // --- Endpoints Gerais ---

    @GetMapping
    public ResponseEntity<List<Cliente>> buscarTodosClientes() {
        return ResponseEntity.ok(clienteService.buscarTodosClientes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarClientePorId(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.buscarClientePorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(@PathVariable Long id) {
        clienteService.deletarCliente(id);
        return ResponseEntity.noContent().build();
    }

    // --- Endpoints de Sócio ---

    @PostMapping("/SaveSocio")
    public ResponseEntity<Socio> criarSocio(@RequestBody Socio socio) {
        Socio novoSocio = clienteService.criarSocio(socio);
        return new ResponseEntity<>(novoSocio, HttpStatus.CREATED);
    }

    @PutMapping("/socios/{id}")
    public ResponseEntity<Socio> atualizarSocio(@PathVariable Long id, @RequestBody Socio socio) {
        return ResponseEntity.ok(clienteService.atualizarSocio(id, socio));
    }

    // --- Endpoints de Dependente ---

    @PostMapping("/socios/{socioId}/dependentes")
    public ResponseEntity<Dependente> criarDependente(@PathVariable Long socioId, @RequestBody Dependente dependente) {
        Dependente novoDependente = clienteService.criarDependente(socioId, dependente);
        return new ResponseEntity<>(novoDependente, HttpStatus.CREATED);
    }

    @GetMapping("/socios/{socioId}/dependentes")
    public ResponseEntity<List<Dependente>> buscarDependentesPorSocio(@PathVariable Long socioId) {
        return ResponseEntity.ok(clienteService.buscarDependentesPorSocio(socioId));
    }

    @PutMapping("/dependentes/{id}")
    public ResponseEntity<Dependente> atualizarDependente(@PathVariable Long id, @RequestBody Dependente dependente) {
        Dependente dependenteAtualizado = clienteService.atualizarDependente(id, dependente);
        return ResponseEntity.ok(dependenteAtualizado);
    }
}