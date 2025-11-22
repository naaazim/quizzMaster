package com.example.demo.appartientgroupe;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.appuser.AppUser;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;



@RestController
@RequestMapping("/api/v1/appartient-groupe")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AppartientGroupeController {

    private final AppartientGroupeService appartientGroupeService;

    @PostMapping("ajouter/{userId}/{groupeId}")
    public AppartientGroupe ajouterAppartientGroupe(@PathVariable long userId,@PathVariable long groupeId){
        return appartientGroupeService.ajouterAppartientGroupe(userId, groupeId);
    }

    @DeleteMapping("supprimer/{userId}/{groupeId}")
    public void supprimerAppartientGroupe(@PathVariable long userId,@PathVariable long groupeId){
         appartientGroupeService.supprimerAppartientGroupe(userId, groupeId);
    }
   
    @GetMapping("get-users-in/{groupeId}")
    public List<AppartientGroupe> getUsersInGroupe(@PathVariable long groupeId){
        return appartientGroupeService.getUsersInGroupe(groupeId);
    }

    @GetMapping("get-users-not-in/{groupeId}")
    public List<AppUser> getUsersNotInGroupe(@PathVariable long groupeId){
        return appartientGroupeService.getUsersNotInGroupe(groupeId);
    }
}
