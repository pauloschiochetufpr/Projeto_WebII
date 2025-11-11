package com.manutencao.trabalhoweb2.model;
import java.util.Arrays;

public enum StatusSolicitacao {
    ABERTA(1),
    ORCADA(2),
    REJEITADA(3),
    APROVADA(4),
    REDIRECIONADA(5),
    ARRUMADA(6),
    PAGA(7),
    FINALIZADA(8),
    CANCELADA(9);

    private final int id;

    StatusSolicitacao(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    // converte id em nome de sttus
    public static String nomePorId(int id) {
        return Arrays.stream(values())
                .filter(s -> s.id == id)
                .map(Enum::name)
                .findFirst()
                .orElse("DESCONHECIDO");
    }
}
