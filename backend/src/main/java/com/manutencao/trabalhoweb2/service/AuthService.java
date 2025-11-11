package com.manutencao.trabalhoweb2.service;

import com.manutencao.trabalhoweb2.dto.RegisterRequest;
import com.manutencao.trabalhoweb2.dto.LoginRequest;
import com.manutencao.trabalhoweb2.dto.BasicResponse;
import com.manutencao.trabalhoweb2.dto.AuthResponse;
import com.manutencao.trabalhoweb2.model.CepModel;
import com.manutencao.trabalhoweb2.model.Cliente;
import com.manutencao.trabalhoweb2.model.Endereco;
import com.manutencao.trabalhoweb2.model.ClienteEndereco;
import com.manutencao.trabalhoweb2.repository.ClienteRepository;
import com.manutencao.trabalhoweb2.repository.EnderecoRepository;
import com.manutencao.trabalhoweb2.repository.ClienteEnderecoRepository;
import com.manutencao.trabalhoweb2.repository.CepRepository;
// Falso erro abaixo
import com.manutencao.trabalhoweb2.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import com.manutencao.trabalhoweb2.utils.JwtUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.time.Instant;
import java.util.Map;

@Service
public class AuthService {

    @Autowired

    private EmailService emailService;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private ClienteEnderecoRepository clienteEnderecoRepository;

    @Autowired
    private CepRepository cepRepository;

    @Autowired
    private JwtUtil jwtUtil;

    
    public AuthService() {}

    // Registra um cliente.
    // Implementar hashing de senha, persistência e vinculação de endereço.
     
    @Transactional
    public BasicResponse registerCliente(RegisterRequest req) {
        // Validar, checar duplicidade, gerar salt/hash, salvar cliente, salvar endereco e relação
        try {
            // Verificação de existência por CPF e e-mail
            Optional<Cliente> existentePorCpf = clienteRepository.findByCpf(req.cpf);
            Optional<Cliente> existentePorEmail = clienteRepository.findByEmail(req.email);

            if (existentePorCpf.isPresent() || existentePorEmail.isPresent()) {

                return new BasicResponse(400, "Usuário com esse documento e/ou email já existe");
            }
            
            // Geração de senha aleatória
            String senhaGerada = gerarSenhaAleatoria(4);

            // Criação de salt e hash da senha
            String salt = BCrypt.gensalt();
            String hashSenha = BCrypt.hashpw(senhaGerada, salt);

            // Registro do endereço

            Optional<CepModel> cepOpt = cepRepository.findById(req.cep);
            if (cepOpt.isEmpty()) {

                return new BasicResponse(400, "O CEP informado não está cadastrado no sistema. Erro de ordenação e integridade da operação");
            }

            
            CepModel cepModel = cepOpt.get();

            Endereco endereco = new Endereco();
            endereco.setCep(cepModel);
            endereco.setUf(req.uf);
            endereco.setLocalidade(req.localidade);
            endereco.setLogradouro(req.logradouro);
            endereco.setBairro(req.bairro);
            endereco.setComplemento(req.complemento);
            endereco.setNumero(req.numero);

            Endereco enderecoSalvo = enderecoRepository.save(endereco);

            // Registro do cliente
            Cliente cliente = new Cliente();
            cliente.setCpf(req.cpf);
            cliente.setNome(req.nome);
            cliente.setEmail(req.email);
            cliente.setTelefone(req.telefone);
            cliente.setSenhaHash(hashSenha);
            cliente.setAtivo(true);
            cliente.setCadastro(LocalDateTime.now());
            cliente.setUltimaAlteracao(LocalDateTime.now());

            Cliente clienteSalvo = clienteRepository.save(cliente);

            // Registro da relação cliente-endereço
            ClienteEndereco clienteEndereco = new ClienteEndereco(clienteSalvo, enderecoSalvo);
            clienteEnderecoRepository.save(clienteEndereco);


            // Envio da senha gerada por e-mail

            Map<String, Object> vars = Map.of(
                "nome", clienteSalvo.getNome(),
                "senha", senhaGerada,
                "loginUrl", "https://localhost:4200/login"
            );
            emailService.sendHtmlTemplate(req.email, "Bem-vindo a equipe! Aqui está a sua senha :)", "email-registration", vars);


            // Retorno de sucesso
            return new BasicResponse(200, "Cadastro concluído com sucesso! Verifique a caixa de entrada de seu email para receber sua senha");

        } catch (Exception e) {
            e.printStackTrace();
            return new BasicResponse(500, "Erro no servidor: " + e.getMessage());
        }
    }

    /**
     * Faz login
     * Deve retornar AuthResponse com access/refresh tokens e definir cookies HTTP-only.
     */
    @Transactional
    public Object login(LoginRequest req) {
        Optional<Cliente> clienteOpt = clienteRepository.findByEmail(req.getEmail());

        if (clienteOpt.isEmpty()) {
            return new BasicResponse(404, "Usuário não encontrado");
        }

        Cliente cliente = clienteOpt.get();

        // valida senha com BCrypt
        boolean senhaValida = BCrypt.checkpw(req.getSenha(), cliente.getSenhaHash());
        if (!senhaValida) {
            return new BasicResponse(401, "Credenciais inválidas");
        }

        // Montar claims
        Map<String, Object> claims = Map.of(
            "idCliente", cliente.getIdCliente(),
            "tipoUsuario", "cliente",
            "expiraEm", Instant.now().plusSeconds(15 * 60).getEpochSecond()
        );

        // Gerar tokens
        String accessToken = jwtUtil.generateAccessToken(String.valueOf(cliente.getIdCliente()), claims);
        String refreshToken = jwtUtil.generateRefreshToken(String.valueOf(cliente.getIdCliente()));

        // Retornar resposta AuthResponse
        return new AuthResponse(accessToken, refreshToken);
    }

    // =====================================================
    // Funções auxiliares
    // =====================================================

    /* Gera uma senha aleatória segura */
    private String gerarSenhaAleatoria(int tamanho) {
        String caracteres = "0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder senha = new StringBuilder();

        for (int i = 0; i < tamanho; i++) {
            senha.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }

        return senha.toString();
    }
}
