package com.example.demo.question;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.examen.Examen;
import com.example.demo.examen.ExamenRepository;
import com.example.demo.reponse.Reponse;
import com.example.demo.reponse.ReponseRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final ExamenRepository examenRepository;
    private final ReponseRepository reponseRepository;

    //retourne toutes les questions
    public List<Question> getAllquestions(){
        return questionRepository.findAll();
    }

    //crée une question
    public Question createQuestion(  QuestionRequest question){
        Examen examen = examenRepository.findById(question.getExamenId()).orElseThrow();
        return questionRepository.save(new Question(question.getType(), question.getTexte(), question.getNbPoints(),question.getTemps(), examen));
    }

    //supprime une question
    public void deleteQuestion(long id){
        questionRepository.deleteById(id);
    }

    //Modifie une question
    public Question updateQuestion(long id, QuestionRequest request) {
        Question existing = questionRepository.findById(id);

        existing.setType(request.getType());
        existing.setTexte(request.getTexte());
        existing.setNbPoints(request.getNbPoints());
        existing.setTemps(request.getTemps());

        List<Reponse> anciennes = reponseRepository.findByQuestionId(id);
        reponseRepository.deleteAll(anciennes);

        return questionRepository.save(existing);
    }
}


