package com.example.demo.examen;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface ExamenRepository extends JpaRepository<Examen,Long> {
    Optional <Examen> findById (long id); 
    List <Examen> findByCreateurId (long id);
}
