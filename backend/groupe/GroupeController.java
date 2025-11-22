package com.example.demo.groupe;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;




@RestController
@RequestMapping("api/v1/groupe")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class GroupeController {

    private final GroupeRepository groupeRepository;
    private final AppUserRepository appUserRepository;

    //cree un groupe
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @PostMapping("create")
    public Groupe createGroupe(@RequestBody GroupeRequest request) {
        AppUser user = appUserRepository.findById(request.getCreateurId());
        return groupeRepository.save(new Groupe(request.getIntitule(), user));
    }
    
    //supprime un groupe
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @DeleteMapping("supprimer/{groupeId}")
    public void deleteGroupe(@PathVariable long groupeId) {
        Groupe groupe = groupeRepository.findById(groupeId).orElseThrow();
        groupeRepository.delete(groupe);
    }

    //retourne la liste des groupes d'un examinateur
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @GetMapping("get-by-user/{userId}")
    public List<Groupe> getGroupeByUser(@PathVariable long userId) {
        return groupeRepository.findByCreateurId(userId);
    }
    
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("get-all")
    public List<Groupe> getAll() {
        return groupeRepository.findAll();
    }
    

}
