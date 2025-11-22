package com.example.demo.repond;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.question.QuestionType;

import jakarta.transaction.Transactional;


@Repository
public interface RepondRepository extends JpaRepository<Repond, Long>{
    Optional<Repond> getRepondById(long id);
    List<Repond> getRepondByUserId(long id);
    Repond getRepondByReponseId(long id);

    @Query("SELECT re FROM Repond re " +
    "JOIN re.reponse r " +
    "JOIN r.question q " +
    "WHERE re.user.id = :userId " +
    "AND q.examen.id = :examenId")
    List<Repond> findByUserIdAndExamenId(long userId, long examenId);

    @Query("SELECT re FROM Repond re " +
    "JOIN re.reponse r " +
    "JOIN r.question q " +
    "WHERE re.user.id = :userId " +
    "AND q.id = :questionId")
    List<Repond> findByUserIdAndQuestionId(long userId, long questionId);

    @Query("SELECT re FROM Repond re " +
    "JOIN re.reponse r " +
    "JOIN r.question q " +
    "WHERE re.user.id = :userId " +
    "AND q.examen.id = :examenId " +
    "AND re.corrige = :etat " +
    "AND (q.type = :type1 OR q.type = :type2)")
    List<Repond> findNonCorrigeByUserIdAndExamenId(long userId, long examenId, boolean etat, QuestionType type1,QuestionType type2);

    @Transactional
    @Modifying
    @Query("UPDATE Repond r SET r.note = :note, r.corrige= :etat WHERE r.id = :id")
    void updateValeurById(double note,boolean etat, long id);

    @Transactional
    @Modifying
    @Query("DELETE Repond r WHERE r.user.id= :userId AND r.reponse.question.examen.id= :examenId")
    void deleteByUserAndExamen(long userId, long examenId);

}