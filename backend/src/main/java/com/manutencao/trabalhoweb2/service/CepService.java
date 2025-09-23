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

    private final BlockingQueue<String> filaCep = new LinkedBlockingQueue<>();
    private volatile long ultimaRequisicao = 0;
    private RestTemplate restTemplate = new RestTemplate();

    private final ExecutorService worker = Executors.newSingleThreadExecutor();

    @PostConstruct
    public void init() {
        worker.submit(() -> {
            while (true) {
                try {
                    String cep = filaCep.take();
                    processarViaCep(cep);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        });
    }

    public CepResponse validarCep(String cep) {
        cep = cep.replaceAll("\\D", "");

        if (cepRepository.existsByCep(cep)) {
            CepModel entity = cepRepository.findByCep(cep);
            return new CepResponse(
                    entity.getCep(),
                    entity.getLogradouro(),
                    entity.getBairro(),
                    entity.getLocalidade(),
                    entity.getUf());
        }

        if (cep.endsWith("000")) { // qualquer CEP terminando com 000 é considerado desqualificado, por não definir logradouro
            return null;
        }

        // Coloca na fila para processar
        if (!filaCep.contains(cep)) {
        filaCep.offer(cep);
        }
        return null;
    }
    
    private synchronized CepModel processarViaCep(String cep) {
        try {
            // Timer global
            long agora = System.currentTimeMillis();
            long tempoDesdeUltima = agora - ultimaRequisicao;
            long intervaloRandom = INTERVALO_MINIMO_MS
                    + (long) (INTERVALO_MINIMO_MS * RANDOM_FACTOR * RANDOM.nextDouble());

            if (tempoDesdeUltima < intervaloRandom) {
                Thread.sleep(intervaloRandom - tempoDesdeUltima);
            }

            ultimaRequisicao = System.currentTimeMillis();

            // Chamada ViaCEP
            String url = "https://viacep.com.br/ws/" + cep + "/json/";
            CepModel dados = restTemplate.getForObject(url, CepModel.class);

            if (dados != null && dados.getCep() != null && dados.getLogradouro() != null
                    && !dados.getLogradouro().isEmpty()) {

                dados.setCep(dados.getCep().replaceAll("-", ""));

                // Salva no banco para próximas requisições
                cepRepository.save(dados);
                return dados;
            }

        } catch (Exception e) {
            e.printStackTrace(); // aqui vai para console/log padrão do Spring Boot
        }

        return null;
    }
}
