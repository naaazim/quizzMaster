package com.example.demo.question;

import org.springframework.web.bind.annotation.RestController;

import com.example.demo.PasseExamen.PasseExamen;
import com.example.demo.PasseExamen.PasseExamenEtat;
import com.example.demo.PasseExamen.PasseExamenRepository;
import com.example.demo.appuser.AppUserRepository;
import com.example.demo.reponse.Reponse;
import com.example.demo.reponse.ReponseRequest;
import com.example.demo.reponse.ReponseService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/question")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
    private final ReponseService reponseService;
    private final AppUserRepository appUserRepository;
    private final QuestionRepository questionRepository;
    private final PasseExamenRepository passeExamenRepository;

    //retourne la liste des options de réponses d'une question
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @GetMapping("/{questionId}/reponses")
    public List<Reponse> getReponses(@PathVariable long questionId){
        return reponseService.getReponses(questionId);
    }

    @GetMapping("/{questionId}/options")
    public ResponseEntity<List<Reponse>> getOptions(@PathVariable long questionId){
        Question question = questionRepository.findById(questionId);
        long userId = appUserRepository.getByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).getId();
        PasseExamen passage = passeExamenRepository.findByAppUserIdAndExamenId(userId, question.getExamen().getId()).orElseThrow();
        if(passage.getEtat()!=PasseExamenEtat.DEMARRE || !passeExamenRepository.findByAppUserIdAndExamenId(userId, question.getExamen().getId()).isPresent()){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        List<Reponse> reponses = reponseService.getReponses(questionId);
        for(Reponse reponse : reponses){
            reponse.setValeur(null);
        }
        return ResponseEntity.ok(reponses);
        }

    //crée une option de réponse
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @PostMapping("/create-reponse")
    public Reponse createReponse(@RequestBody ReponseRequest request){
        return reponseService.createReponse(request);
    }
    
    //retourne toutes les questions
    @GetMapping("/getAll")
    public List<Question> getAll(@RequestParam String param) {
        return questionService.getAllquestions();
    }
    
    //cree une question
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @PostMapping("/create")
    public Question createQuestion(@RequestBody QuestionRequest question){
        return questionService.createQuestion(question);
    }

    //supprime une question
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @DeleteMapping("/delete/{id}")
    public void supprimerQuestion(@PathVariable long id){
        questionService.deleteQuestion(id);
    }

    //modifie une question
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EXAMINATEUR')")
    @PutMapping("/update/{id}")
    public Question updateQuestion(@PathVariable long id, @RequestBody QuestionRequest question) {
        return questionService.updateQuestion(id, question);
    }

}
