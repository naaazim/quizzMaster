package com.example.demo.examen;


import org.springframework.http.HttpStatus;import org.springframework.http.ResponseEntity;import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.PasseExamen.PasseExamen;
import com.example.demo.PasseExamen.PasseExamenEtat;
import com.example.demo.PasseExamen.PasseExamenRepository;
import com.example.demo.PasseExamen.PasseExamenService;
import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserRepository;
import com.example.demo.appuser.AppUserRole;
import com.example.demo.question.Question;

import lombok.AllArgsConstructor;

import java.util.List;



@RestController
@RequestMapping("api/v1/examens")
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
public class ExamenController {

    private final AppUserRepository appUserRepository;
    private final ExamenService examenService;
    private final PasseExamenRepository passeExamenRepository;
    private final PasseExamenService passeExamenService;
    //retourne la liste de tous les examens
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("get-all")
    public List<Examen> getAllExamens() {
        return examenService.getAllExamens();
    }
    //retourne l'examen avec son id
    @GetMapping("/{id}")
    public ResponseEntity<Examen> getExamenById(@PathVariable Long id) {
        Examen examen = examenService.getExamenById(id);
        long userId = appUserRepository.getByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).getId();
        if(appUserRepository.getByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).getAppUserRole()!=AppUserRole.ADMIN){
        if(userId!=examenService.getExamenById(id).getCreateur().getId()){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }
        return ResponseEntity.ok(examen);
    }

    //crée un examen
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @PostMapping(path = "/create/{userId}")
    public Examen createExamen(@PathVariable Long userId, @RequestBody ExamenRequest request) {
        return examenService.createExamen(userId,request);
    }

    //supprime un examen
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExamen(@PathVariable Long id) {
        examenService.deleteExamen(id);
        return ResponseEntity.noContent().build();
    }

    //retourne la liste des questions dans l'examen
    @GetMapping("/{examen_id}/questions")
    public ResponseEntity<List<Question>> questions_dans_examen(@PathVariable long examen_id){
        AppUser user = appUserRepository.getByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        if(user.getAppUserRole()==AppUserRole.EXAMINE){
            PasseExamen passage = passeExamenRepository.findByAppUserIdAndExamenId(user.getId(), examen_id).get();
            if(passage.getEtat()!=PasseExamenEtat.ATTENTE){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }else{
                passeExamenService.demarrerExamen(user.getId(), examen_id);
            }
        }

        
        return ResponseEntity.ok(examenService.questions_dans_examen(examen_id));
    }

    
    //retourne la liste des examens d'un examinateur
    @GetMapping("/by-createur")
    public List<Examen> getExamenByCreateur(@RequestParam("createurId") long createurId) {
        return examenService.getExamenByCreateurId(createurId);
    }

    //modifie les infos d'un examen
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @PostMapping("/modifier")
    public Examen modifierExamen(@RequestBody ExamenRequest examen) {
        return examenService.modifierExamen(examen);
    }
    

}

