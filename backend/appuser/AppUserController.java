package com.example.demo.appuser;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;






@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AppUserController {

    private final AppUserService appUserService;

    //retoune la liste de tous les utilisateurs
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("get-all")
    public ResponseEntity<List<AppUser>> getAll() {
        return ResponseEntity.ok(appUserService.getAll());
    }

    //modifie le role d'un utilisateur
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("role")
    public void updateUserRole(@RequestBody UpdateRequest request) {
        
        appUserService.updateRole(request);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("valider/{email}")
    public void ValidateUser(@PathVariable String email) {
        appUserService.ValidateUser(email);
    }

    //retoune la liste de tous les utilisateurs sauf Admin
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("get-to-update")
    public List<AppUser> getToUpdate() {
        return appUserService.getUsersToUpdate();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("get-examine-validate")
    public List<AppUser> getExaminesToValidate() {
        return appUserService.getExamineAValider();
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("get-examinateur-validate")
    public List<AppUser> getExaminateurToValidate() {
        return appUserService.getExaminateurAValider();
    }
    
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("delete/{email}")
    public void deleteUser(@PathVariable String email) {
        appUserService.deleteUser(email);
    }
    
}
