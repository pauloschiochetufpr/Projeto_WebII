package com.manutencao.trabalhoweb2.service;


import com.manutencao.trabalhoweb2.model.Categoria;
import com.manutencao.trabalhoweb2.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> listarTodos() {
        return categoriaRepository.findAll();
    }

    public Optional<Categoria> buscarPorId(Integer id) {
        return categoriaRepository.findById(id);
    }

    public Categoria inserir(Categoria categoria) {
        categoria.setAtivo(true);
        return categoriaRepository.save(categoria);
    }

    public Categoria atualizar(Integer id, Categoria categoriaAtualizada) {
        return categoriaRepository.findById(id).map(categoria -> {
            categoria.setNome(categoriaAtualizada.getNome());
            categoria.setAtivo(categoriaAtualizada.getAtivo());
            return categoriaRepository.save(categoria);
        }).orElseThrow(() -> new RuntimeException("Categoria não encontrada: id = " + id));
    }

    public void remover(Integer id) {
        categoriaRepository.deleteById(id);
    }
}

