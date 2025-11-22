package com.example.demo.authentication;

import org.springframework.web.bind.annotation.*;
import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserService;
import com.example.demo.authentication.AuthenticationService;
import com.example.demo.security.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final JwtService jwtService;
    private final AppUserService appUserService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegistrationRequest request){
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest request){
        return ResponseEntity.ok(service.login(request));
    }

    @PostMapping("/mdp-oublie/{email}")
    public ResponseEntity<String> MotDePasseOublie (@PathVariable String email){
        return ResponseEntity.ok(service.MotDePasseOublie(email));
    }

    @GetMapping("/confirm")
    public ResponseEntity<Void> confirm(@RequestParam("token") String token) {
        try {
            service.confirmToken(token);
            return ResponseEntity.ok().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/admin-add")
    public AppUser adminAjouteUser (@RequestBody RegistrationRequest request){
        return service.adminAjouteUser(request);
    }

    @GetMapping("/me")
    public AppUser getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token manquant");
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);

        return appUserService.getByEmail(email);
    }
}
