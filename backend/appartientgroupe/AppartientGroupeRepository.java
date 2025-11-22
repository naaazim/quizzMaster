package com.example.demo.appartientgroupe;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface AppartientGroupeRepository extends JpaRepository<AppartientGroupe,Long>{
    // Recupere la liste des utilisateurs appartenant à un groupe
    @Query("SELECT ag FROM AppartientGroupe ag WHERE ag.groupe.id = :groupeId")
    List<AppartientGroupe> findUsersByGroupeId(long groupeId);


    Optional<AppartientGroupe> findByGroupeIdAndUserId(long groupeId, long userId);
}

