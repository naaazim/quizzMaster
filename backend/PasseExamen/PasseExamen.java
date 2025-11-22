package com.example.demo.PasseExamen;


import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.example.demo.appuser.AppUser;
import com.example.demo.examen.Examen;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class PasseExamen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne    //utilisé pour réferencer une clé étrangère
    @JoinColumn(name = "app_user_id")  // défini la colonne de la BD qui stockera l'id de AppUser
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AppUser appUser;

    @ManyToOne
    @JoinColumn(name = "examen_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Examen examen;
    private PasseExamenEtat etat = PasseExamenEtat.ATTENTE;

    public PasseExamen(AppUser appUser, Examen examen) {
        this.appUser=appUser;
        this.examen=examen;
    }
}
