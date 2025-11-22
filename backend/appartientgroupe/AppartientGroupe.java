package com.example.demo.appartientgroupe;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.example.demo.appuser.AppUser;
import com.example.demo.groupe.Groupe;

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
public class AppartientGroupe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "groupe_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Groupe groupe;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AppUser user;

    public AppartientGroupe(Groupe groupe, AppUser user) {
        this.groupe = groupe;
        this.user = user;
    }

    
}
