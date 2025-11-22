package com.example.demo.reponse;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.question.Question;

@Repository
public interface ReponseRepository extends JpaRepository<Reponse, Integer> {
List<Reponse>findByQuestion(Question question);
Reponse findById(long reponseId);
List<Reponse>findByValeurAndQuestion(boolean valeur,Question question);

List<Reponse>findByQuestionId(long questionId);

}
