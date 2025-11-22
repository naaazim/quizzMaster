package com.example.demo.groupe;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupeRepository extends JpaRepository<Groupe,Long>{

    List<Groupe> findByCreateurId (long createurId);

}
