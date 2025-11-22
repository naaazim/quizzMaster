package com.example.demo.questiondans;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.question.Question;

@Repository
public interface QuestionDansRepository extends JpaRepository<QuestionDans,Long>{
    @Query("SELECT q FROM QuestionDans n JOIN n.question q WHERE n.examen.id = :examenId")
    List<Question> findByExamenId(@Param("examenId") long examenId);

    @Query("SELECT q FROM Question q WHERE q.id NOT IN (SELECT qd.question.id FROM QuestionDans qd WHERE qd.examen.id = :examenId)")
    List<Question> findNotByExamenId (@Param("examenId") long examenId);
}
