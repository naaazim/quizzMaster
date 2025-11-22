package com.example.demo.reponse;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping(path = "api/v1/reponse")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ReponseController {
    private final ReponseService reponsesService;
    private final ReponseRepository reponsesRepository;
@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @PostMapping
    public void registerReponse(@RequestBody Reponse reponses) {
        reponsesService.addNewReponses(reponses);
    }
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @DeleteMapping(path = "{reponsesNumero}")
    public void deleteReponse(@PathVariable ("reponsesNumero") Integer numero) {
        reponsesRepository.deleteById(numero);
    }
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @PutMapping(path = "{reponsesNumero}")
    public void updateReponse(@PathVariable ("reponsesNumero") Integer numero, @RequestParam(required = false) String texte, @RequestParam(required = false) Boolean valeur) {
        reponsesService.updateReponse(numero, texte, valeur);
    }
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @GetMapping("/{questionId}")
    public List<Reponse> getMethodName(@PathVariable long questionId) {
        return reponsesRepository.findByQuestionId(questionId);
    }
    
}
