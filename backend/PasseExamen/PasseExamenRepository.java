package com.example.demo.PasseExamen;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Repository
public interface PasseExamenRepository extends JpaRepository<PasseExamen,Long> {
    Optional<PasseExamen> findPasseExamenByAppUserIdAndExamenId( long userId, long examenId);

    @Transactional
    @Modifying
    @Query("DELETE FROM PasseExamen p WHERE p.appUser.id = :userId AND p.examen.id = :examenId")
    void deletePasseExamenByAppUserIdAndExamenId(long userId, long examenId);

    List<PasseExamen> findByEtat(PasseExamenEtat etat);

    @Query("SELECT p FROM PasseExamen p " +
    "JOIN p.examen e " +
    "JOIN e.createur c " +
    "WHERE c.id = :examinateurId " +
    "AND p.etat = :etat")
    List<PasseExamen> findByEtatAndExamenCreateurId(long examinateurId, PasseExamenEtat etat);

    @Query("SELECT p FROM PasseExamen p " +
    "WHERE p.appUser.id = :userId " +
    "AND p.etat = :etat")
    List<PasseExamen> findByEtatAndAppUserId(long userId, PasseExamenEtat etat);

    @Query("SELECT p FROM PasseExamen p " +
    "WHERE p.examen.id = :examenId " +
    "AND p.etat = :etat")
    List<PasseExamen> findByEtatAndExamenId(long examenId, PasseExamenEtat etat);


    @Query("SELECT p FROM PasseExamen p " +
    "JOIN p.examen e " +
    "WHERE e.id = :examenId")
    List<PasseExamen> findByExamenId(long examenId);

    @Query("SELECT p FROM PasseExamen p " +
    "WHERE p.appUser.id = :userId ")
    List<PasseExamen> findByAppUserId(long userId);

    @Query("SELECT p FROM PasseExamen p " +
    "WHERE p.appUser.id = :userId AND p.examen.id = :examenId ")
    Optional<PasseExamen> findByAppUserIdAndExamenId(long userId,long examenId);
}
