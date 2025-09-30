package com.manutencao.trabalhoweb2.service;

import com.manutencao.trabalhoweb2.dto.CepResponse;
import com.manutencao.trabalhoweb2.repository.CepRepository;
import com.manutencao.trabalhoweb2.model.CepModel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.util.Random;
import java.util.concurrent.*;

@Service
public class CepService {

    @Autowired
    private CepRepository cepRepository;

    private static final long INTERVALO_MINIMO_MS = 1500;
    private static final double RANDOM_FACTOR = 0.35;
    private static final Random RANDOM = new Random();

    private final BlockingQueue<PedidoCep> filaCep = new LinkedBlockingQueue<>();
    private volatile long ultimaRequisicao = 0;
    private RestTemplate restTemplate = new RestTemplate();

    private final ExecutorService worker = Executors.newSingleThreadExecutor();

    /**
     * Estrutura interna para transportar CEP + future associado.
     */
    private static class PedidoCep {
        String cep;
        CompletableFuture<CepResponse> future;

        PedidoCep(String cep, CompletableFuture<CepResponse> future) {
            this.cep = cep;
            this.future = future;
        }
    }

    @PostConstruct
    public void init() {
        worker.submit(() -> {
            while (true) {
                try {
                    PedidoCep pedido = filaCep.take();
                    CepModel dados = processarViaCep(pedido.cep);
                    if (dados != null) {
                        pedido.future.complete(buildCepResponse(dados));
                    } else {
                        pedido.future.complete(null);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                } catch (Exception e) {
                    e.printStackTrace(); // log simples
                }
            }
        });
    }

    /**
     * Valida ou agenda busca de CEP.
     */
    public CompletableFuture<CepResponse> validarCep(String cep) {
        final String normalizedCep = cep.replaceAll("\\D", ""); // nova variável final

        // se já estiver no banco, retorna direto
        if (cepRepository.existsByCep(normalizedCep)) {
            CepModel entity = cepRepository.findByCep(normalizedCep);
            return CompletableFuture.completedFuture(buildCepResponse(entity));
        }

        // CEP terminado com "000" é inválido
        if (normalizedCep.endsWith("000")) {
            return CompletableFuture.completedFuture(null);
        }

        // cria um future e coloca na fila
        CompletableFuture<CepResponse> future = new CompletableFuture<>();

        // evita duplicatas na fila
        boolean jaNaFila = filaCep.stream().anyMatch(p -> p.cep.equals(normalizedCep));
        if (!jaNaFila) {
            filaCep.offer(new PedidoCep(normalizedCep, future));
        } else {
            // se já estiver na fila, devolve um future que só espera pelo processamento
            future.complete(null);
        }

        return future;
    }


    /**
     * Processa consulta na API ViaCEP.
     */
    private synchronized CepModel processarViaCep(String cep) {
        try {
            // controle de intervalo global
            long agora = System.currentTimeMillis();
            long tempoDesdeUltima = agora - ultimaRequisicao;
            long intervaloRandom = INTERVALO_MINIMO_MS
                    + (long) (INTERVALO_MINIMO_MS * RANDOM_FACTOR * RANDOM.nextDouble());

            if (tempoDesdeUltima < intervaloRandom) {
                Thread.sleep(intervaloRandom - tempoDesdeUltima);
            }

            ultimaRequisicao = System.currentTimeMillis();

            // chamada ViaCEP
            String url = "https://viacep.com.br/ws/" + cep + "/json/";
            CepModel dados = restTemplate.getForObject(url, CepModel.class);

            if (dados != null && dados.getCep() != null && dados.getLogradouro() != null
                    && !dados.getLogradouro().isEmpty()) {

                dados.setCep(dados.getCep().replaceAll("-", ""));

                // salva no banco
                cepRepository.save(dados);
                return dados;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Constrói o DTO de resposta a partir do modelo salvo.
     */
    private CepResponse buildCepResponse(CepModel entity) {
        return new CepResponse(
                entity.getCep(),
                entity.getLogradouro(),
                entity.getBairro(),
                entity.getLocalidade(),
                entity.getUf()
        );
    }
}
