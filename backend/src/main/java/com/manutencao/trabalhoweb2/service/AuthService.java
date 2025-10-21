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


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private ClienteEnderecoRepository clienteEnderecoRepository;

    @Autowired
    private CepRepository cepRepository;
    
    public AuthService() {}

    /**
     * Registra um cliente.
     * Implementar hashing de senha, persistência e vinculação de endereço.
     */
    @Transactional
    public BasicResponse registerCliente(RegisterRequest req) {
        // Validar, checar duplicidade, gerar salt/hash, salvar cliente, salvar endereco e relação
        try {
            // Verificação de existência por CPF e e-mail
            Optional<Cliente> existentePorCpf = clienteRepository.findByCpf(req.cpf);
            Optional<Cliente> existentePorEmail = clienteRepository.findByEmail(req.email);

            if (existentePorCpf.isPresent() || existentePorEmail.isPresent()) {
                return new BasicResponse(400, "Usuário com esse documento ou email já existe");
            }
            
            // Geração de senha aleatória
            String senhaGerada = gerarSenhaAleatoria(4);

            // Criação de salt e hash da senha
            String salt = BCrypt.gensalt();
            String hashSenha = BCrypt.hashpw(senhaGerada, salt);

            // Registro do endereço

            Optional<CepModel> cepOpt = cepRepository.findById(req.cep);
            if (cepOpt.isEmpty()) {
                return new BasicResponse(400, "O CEP informado não está cadastrado no sistema.");
            }

            
            CepModel cepModel = cepOpt.get();

            Endereco endereco = new Endereco();
            endereco.setCep(cepModel);;
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

            //. Registro da relação cliente-endereço
            ClienteEndereco clienteEndereco = new ClienteEndereco();
            clienteEndereco.setCliente(clienteSalvo);
            clienteEndereco.setEndereco(enderecoSalvo);

            clienteEnderecoRepository.save(clienteEndereco);

            //. Envio da senha gerada por e-mail
            enviarEmailSimples(req.email, "Cadastro realizado com sucesso","Sua senha temporária é: " + senhaGerada);

            // Retorno de sucesso
            return new BasicResponse(200, "Cadastro concluído com sucesso");

        } catch (Exception e) {
            e.printStackTrace();
            return new BasicResponse(500, "Erro no servidor: " + e.getMessage());
        }
    }

    /**
     * Faz login
     * Deve retornar AuthResponse com access/refresh tokens e definir cookies HTTP-only.
     */
    public AuthResponse login(LoginRequest req) {
        // buscar cliente ou funcionario por email, validar senha (hash + salt), emitir JWTs
        return new AuthResponse("access-token-placeholder", "refresh-token-placeholder");
    }


    // =====================================================
    // Funções auxiliares
    // =====================================================

    /** Gera uma senha aleatória segura */
    private String gerarSenhaAleatoria(int tamanho) {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        SecureRandom random = new SecureRandom();
        StringBuilder senha = new StringBuilder();

        for (int i = 0; i < tamanho; i++) {
            senha.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }

        return senha.toString();
    }

    /** Placeholder para envio de e-mail (será aprimorado depois) */
    private void enviarEmailSimples(String destinatario, String assunto, String conteudo) {
        System.out.println("=== EMAIL SIMULADO ===");
        System.out.println("Para: " + destinatario);
        System.out.println("Assunto: " + assunto);
        System.out.println("Conteúdo: " + conteudo);
        System.out.println("======================");
    }
}
