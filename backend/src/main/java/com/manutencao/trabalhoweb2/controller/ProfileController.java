package com.manutencao.trabalhoweb2.controller;
// DTO's
import com.manutencao.trabalhoweb2.dto.*;

// Services
import com.manutencao.trabalhoweb2.service.ProfileAdminService;

// Spring framework
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prof")
public class ProfileController {

    private final ProfileAdminService profileService;

    public ProfileController(ProfileAdminService profileService) {
        this.profileService = profileService;
    }
    

    @PostMapping("/")
    public ResponseEntity<BasicResponse> ChangeCredentialsEndpoint(@RequestBody ChangeCredentialRequest data) {
        BasicResponse response = profileService.changeCredentials(data);
        return ResponseEntity.ok(response);
    }
}