// UpdateSolicitacaoRequest.java
package com.manutencao.trabalhoweb2.dto;

import java.math.BigDecimal;

public record UpdateSolicitacaoRequest(
    String nome,
    String descricao,
    Long clienteId,
    BigDecimal valor,
    Integer idStatus,
    Integer idCategoria,
    Boolean ativo
) {}
