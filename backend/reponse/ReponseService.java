package com.example.demo.reponse;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;


import org.springframework.stereotype.Service;

import com.example.demo.question.Question;
import com.example.demo.question.QuestionRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class ReponseService {
    private final ReponseRepository reponsesRepository;
    private final QuestionRepository questionRepository;


    public List<Reponse> getReponses(long questionId){
        Question question = questionRepository.findById(questionId);
        return reponsesRepository.findByQuestion(question);
    }

    public void addNewReponses(Reponse reponses) {
        reponsesRepository.save(reponses);
    }

    public void deleteReponse(int reponsesNumero) {
        reponsesRepository.deleteById(reponsesNumero);
    }

    @Transactional
    public void updateReponse(Integer reponsesId, String texte, Boolean valeur) {
        Reponse reponse = reponsesRepository.findById(reponsesId).orElseThrow(() -> new IllegalArgumentException("Reponse not found"));
        reponse.setTexte(texte);
        reponse.setValeur(valeur);
    }

    public Reponse createReponse(ReponseRequest reponseRequest){
        Question question = questionRepository.findById(reponseRequest.getQuestionId());
        return reponsesRepository.save(new Reponse(reponseRequest.getTexte(), reponseRequest.getValeur(),question));
    }

    
}
