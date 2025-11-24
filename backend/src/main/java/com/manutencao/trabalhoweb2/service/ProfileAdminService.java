package com.manutencao.trabalhoweb2.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import io.jsonwebtoken.Claims;
import com.manutencao.trabalhoweb2.utils.JwtUtil;

// Spring framwork tools
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

// DTO's
import com.manutencao.trabalhoweb2.dto.*;
import com.manutencao.trabalhoweb2.model.Funcionario;
import com.manutencao.trabalhoweb2.model.Cliente;
import com.manutencao.trabalhoweb2.repository.FuncionarioRepository;
import com.manutencao.trabalhoweb2.repository.ClienteRepository;

// Services secundários
import com.manutencao.trabalhoweb2.service.TokenAdminService;


@Service
public class ProfileAdminService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final TokenAdminService tokenAdminService;

    public ProfileAdminService(TokenAdminService tokenAdminService) {
        this.tokenAdminService = tokenAdminService;
    }

    
    // Arrumar codigos de retorno
    @Transactional
    public BasicResponse changeCredentials(ChangeCredentialRequest data) {

        String token = data.getToken();

        if (token == null) {
            return new BasicResponse(403, "Token ausente.");
        }

        Boolean auth_func = tokenAdminService.authCargo("funcionario", token);
        Boolean auth_cli = tokenAdminService.authCargo("cliente", token);

        if (!auth_cli && !auth_func){
            return new BasicResponse(403, "Usuário não autenticado");
        }

        Claims claims = jwtUtil.getAllClaims(token);
        String tipoUsuario = claims.get("tipoUsuario", String.class);

        Object rawId = claims.get("id");
        Long id = null;

        if (rawId == null) {
            return new BasicResponse(400, "ID ausente no token.");
        }

        if (rawId instanceof Number) {
            id = ((Number) rawId).longValue();
        } else if (rawId instanceof String) {
            String idStr = ((String) rawId).trim();
            if (idStr.isEmpty()) {
                return new BasicResponse(400, "ID inválido no token.");
            }
            try {
                id = Long.parseLong(idStr);
            } catch (NumberFormatException ex) {
                return new BasicResponse(400, "ID do token não é numérico.");
            }
        } else {
            return new BasicResponse(400, "Tipo de ID no token não suportado.");
        }
        
        Object profile;

        if ("funcionario".equals(tipoUsuario)) {
            Optional<Funcionario> opt = funcionarioRepository.findById(id);
            if (opt.isEmpty()) {
                return new BasicResponse(404, "Funcionário não encontrado.");
            }
            profile = opt.get();

        } else if ("cliente".equals(tipoUsuario)) {
            Optional<Cliente> opt = clienteRepository.findById(id);
            if (opt.isEmpty()) {
                return new BasicResponse(404, "Cliente não encontrado.");
            }
            profile = opt.get();

        } else {
            return new BasicResponse(400, "Tipo de usuário inválido.");
        }

        try {

            String novoEmail = sanitize(data.getEmail());
            String novaSenha = sanitize(data.getSenha());

            if (novoEmail == null && novaSenha == null) {
                return new BasicResponse(400, "Nenhum dado válido enviado.");
            }
             
            boolean alterado = false;

            // Email
            if (novoEmail != null) {
                // Validar de formato do email (garantia)
                if (!novoEmail.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
                    return new BasicResponse(400, "Formato de e-mail inválido.");
                }
                
                if (profile instanceof Funcionario f) {
                    f.setEmail(novoEmail);
                } else if (profile instanceof Cliente c) {
                    c.setEmail(novoEmail);
                }
                
                alterado = true;
            }

            // Senha
            if (novaSenha != null) {

                if (novaSenha.length() != 4) {
                    return new BasicResponse(400, "A senha deve conter no máximo 4 caracteres.");
                }

                // Hash seguro (BCrypt)
                String salt = BCrypt.gensalt();
                String hashSenha = BCrypt.hashpw(novaSenha, salt);

                if (profile instanceof Funcionario f) {
                    f.setSenhaHash(hashSenha);
                } else if (profile instanceof Cliente c) {
                    c.setSenhaHash(hashSenha); 
                }

                alterado = true;
            }
            
            if (!alterado) {
                return new BasicResponse(400, "Nenhum campo alterado.");
            }

            
             if (profile instanceof Funcionario f) {
                funcionarioRepository.save(f);
            } else if (profile instanceof Cliente c) {
                clienteRepository.save(c);
            }

            return new BasicResponse(200, "Dados alterados.");

        } catch (Exception e) {

            return new BasicResponse(500, "Erro de operação, nada foi alterado");

        }
    }
    
    private String sanitize(String value) {
        if (value == null) return null;
        value = value.trim();
        return value.isEmpty() ? null : value;
    }
}
