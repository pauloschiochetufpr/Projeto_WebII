package com.manutencao.trabalhoweb2.controller;

import com.manutencao.trabalhoweb2.dto.CategoriaDto;
import com.manutencao.trabalhoweb2.model.Categoria;
import com.manutencao.trabalhoweb2.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    // Conversor: Categoria -> CategoriaDto
    private CategoriaDto toDto(Categoria categoria) {
        CategoriaDto dto = new CategoriaDto();
        dto.setId(categoria.getIdCategoria());
        dto.setNome(categoria.getNome());
        dto.setAtivo(categoria.getAtivo());
        return dto;
    }

    // Listar todas
    @GetMapping
    public ResponseEntity<List<CategoriaDto>> listarTodas() {
        List<CategoriaDto> dtos = categoriaService.listarTodos()
                .stream()
                .map(this::toDto)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDto> buscarPorId(@PathVariable Integer id) {
        return categoriaService.buscarPorId(id)
                .map(cat -> ResponseEntity.ok(toDto(cat)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Inserir
    @PostMapping
    public ResponseEntity<CategoriaDto> inserir(@RequestBody Categoria categoria) {
        Categoria novaCategoria = categoriaService.inserir(categoria);
        return ResponseEntity.ok(toDto(novaCategoria));
    }

    // Atualizar
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDto> atualizar(@PathVariable Integer id, @RequestBody Categoria categoria) {
        try {
            Categoria categoriaAtualizada = categoriaService.atualizar(id, categoria);
            return ResponseEntity.ok(toDto(categoriaAtualizada));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Remover
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Integer id) {
        categoriaService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
