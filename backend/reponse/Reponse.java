package com.example.demo.reponse;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.example.demo.question.Question;
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
public class Reponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  long id;
    private String texte;
    private Boolean valeur;
    @ManyToOne
    @JoinColumn(name = "question_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Question question;

    

    public Reponse(String texte, Boolean valeur, Question question) {
        this.texte = texte;
        this.valeur = valeur;
        this.question=question;
    }

    
    @Override
    public String toString() {
        return "Reponses{" + "numero=" + id + ", texte='" + texte + '\'' + ", valeur='" + valeur + '\'' + '}';
    }

    public static boolean compareByIds(List<Reponse> list1, List<Reponse> list2) {
        Set<Long> ids1 = list1.stream().map(Reponse::getId).collect(Collectors.toSet());
        Set<Long> ids2 = list2.stream().map(Reponse::getId).collect(Collectors.toSet());
        return ids1.equals(ids2); // Retourne true si les IDs sont les mêmes
    }
}
