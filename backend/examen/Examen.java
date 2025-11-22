package com.example.demo.examen;
import com.example.demo.appuser.AppUser;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "examen")
public class Examen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "intitule")
    private String intitule;
    @Column(name = "note_max")
    private double note_max;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private AppUser createur;

    public Examen(String intitule, double note_max, AppUser user) {
        this.intitule = intitule;
        this.note_max = note_max;
        this.createur = user;
    }

}
