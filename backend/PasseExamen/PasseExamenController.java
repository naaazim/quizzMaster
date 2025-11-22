package com.example.demo.PasseExamen;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserRepository;
import com.example.demo.repond.Repond;





@RestController
@RequestMapping("api/v1/passe-examen")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PasseExamenController {

    private final PasseExamenService passeExamenService;
    private final AppUserRepository appUserRepository;

    // Ajouter un passage d'examen a un user
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @PostMapping("/ajouter")
    public PasseExamen ajouterPasseExamen(@RequestParam long appUserId,
                                          @RequestParam long examenId) {


        return passeExamenService.ajouterPasseExamen(appUserId,examenId);
    }

    // Ajouter un passage d'examen a un groupe
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @PostMapping("/ajouter-groupe")
    public void ajouterPasseExamenGroupe(@RequestParam long groupeId,
                                          @RequestParam long examenId) {


         passeExamenService.ajouterPasseExamenGroupe(groupeId,examenId);
    }

    // Récupérer tous les passages d'examen

    @GetMapping("/liste")
    public List<PasseExamen> getAllPasseExamens() {

        return passeExamenService.getAllPasseExamens();
    }

    // Récupérer un passage d'examen par ID
    @GetMapping("/passe-examen-by-examen/{examenId}")
    public List<PasseExamen> getPasseExamenByExamen(@PathVariable long examenId) {
        return passeExamenService.getPasseExamenByExamenId(examenId);
    }

    // Récupérer tous les passages d'examen d'un examine
    @GetMapping("/passe-examen-by-user/{userId}")
    public List<PasseExamen> getPasseExamenByUser(@PathVariable long userId) {
        return passeExamenService.getPasseExamenByAppUserId(userId);
    }


    // Supprimer un passage d'examen
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @DeleteMapping("/supprimer/{utilisateurId}/{examenId}")
    public ResponseEntity<Void> deletePasseExamen(@PathVariable Long utilisateurId, @PathVariable Long examenId) {
        passeExamenService.supprimerPasseExamen(utilisateurId, examenId);
        return ResponseEntity.noContent().build();
    }

    // Récupérer tous les examnes a corriger d'un examinateur
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @GetMapping("examen-a-corriger/{examinateurId}")
    public List<PasseExamen> examensACorriger(@PathVariable long examinateurId){
        return passeExamenService.examensACorriger(examinateurId);
    }

    // Récupérer tous les examens corrigés d'un examinateur
    @GetMapping("/examen-corriges-examinateur/{examinateurId}")
    public List<PasseExamen> examensCorrigesByExaminateur(@PathVariable long examinateurId) {
        return passeExamenService.examensCorrigesExaminateur(examinateurId);
    }

    // Récupérer tous les examnes corriges d'un examine
    @GetMapping("examen-corriges/{userId}")
    public List<PasseExamen> examensCorrige(@PathVariable long userId){
        return passeExamenService.examensCorriges(userId);
    }

    // Récupérer tous les examnes a passer d'un examine
    @GetMapping("examen-a-passer/{userId}")
    public List<PasseExamen> examensAPasser(@PathVariable long userId){
        return passeExamenService.examensAPasser(userId);
    }

    // Récupérer tous les examines qui passent un examen
    @GetMapping("users-in-examen/{examenId}")
    public List<PasseExamen> usersInExamen(@PathVariable long examenId){
        return passeExamenService.getPasseExamenByExamenId(examenId);
    }
    // Récupérer tous les examines qui passent pas un examen
    @GetMapping("users-not-in-examen/{examenId}")
    public List<AppUser> usersNotInExamen(@PathVariable long examenId){
        return passeExamenService.getUsersNotInExamen(examenId);
    }

    //retourne la note d'un examen
    @GetMapping("get-note/{utilisateurId}/{examenId}")
    public  double getNote(@PathVariable Long utilisateurId, @PathVariable Long examenId) {
        return passeExamenService.calculNote(utilisateurId, examenId);
    }
    
    //retourne les reponses d'un examine à une question
    @GetMapping("get-reponses/{utilisateurId}/{questionId}")
    public  List<Repond> getReponses(@PathVariable Long utilisateurId, @PathVariable Long questionId) {
        return passeExamenService.reponseUserQuestion(utilisateurId, questionId);
    }

    //retourne la liste des examens a corriger par examen
    @GetMapping("/examens-corriges-by-examen-id/{examenId}")
        public List<PasseExamen> examensCorrigeByExamenId(@PathVariable long examenId){
        return passeExamenService.examensCorrigeByExamenId(examenId);
    }

    @PostMapping("/finir/{examenId}")
    public PasseExamen finirExamen( @PathVariable long examenId) {
        long userId = appUserRepository.getByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).getId();
        return passeExamenService.finirExamen(userId, examenId);
    }

    @PostMapping("/demarrer/{examenId}")
    public PasseExamen demarrerExamen( @PathVariable long examenId) {
            long userId = appUserRepository.getByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).getId();
            return passeExamenService.demarrerExamen(userId, examenId);

    }
    

    //retourne le taux de reussite d'un examen
    @GetMapping("/taux-reussite/{examenId}")
    public double tauxReussite(@PathVariable long examenId){
        return passeExamenService.tauxReussite(examenId);
    }
    //retourne la note moyenne d'un examen
    @GetMapping("/note-moy/{examenId}")
    public double noteMoy(@PathVariable long examenId){
        return passeExamenService.noteMoy(examenId);
    }
    //retourne la note min d'un examen
    @GetMapping("/note-min/{examenId}")
    public double noteMin(@PathVariable long examenId){
        return passeExamenService.noteMin(examenId);
    }
    //retourne la note max d'un examen
    @GetMapping("/note-max/{examenId}")
    public double noteMax(@PathVariable long examenId){
        return passeExamenService.noteMax(examenId);
    }

    @GetMapping("/note-med/{examenId}")
    public double noteMed(@PathVariable long examenId){
        return passeExamenService.noteMed(examenId);
    }

    @GetMapping("/ecart/{examenId}")
    public double ecart(@PathVariable long examenId){
        return passeExamenService.ecart(examenId);
    }

    @GetMapping("/nombre/{examenId}")
    public double nbPassages(@PathVariable long examenId){
        return passeExamenService.nbPassages(examenId);
    }
}
