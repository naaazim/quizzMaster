package com.example.demo.groupe;

import com.example.demo.appuser.AppUser;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Groupe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String titre;


    @ManyToOne
    @JoinColumn(name = "createur_id")
    private AppUser createur;

    public Groupe(String titre, AppUser createur) {
        this.titre = titre;
        this.createur=createur;
    }

    
}
