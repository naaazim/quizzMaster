package com.example.demo.question;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.example.demo.examen.Examen;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Question {

    @Id
    @SequenceGenerator(name = "question_sequence", sequenceName = "question_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "question_sequence")
    private long id;
    private QuestionType type;
    private String texte;
    private int nbPoints;
    private int temps;

    @ManyToOne
    @JoinColumn(name = "examen_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Examen examen;

    public Question(QuestionType type, String texte, int nbPoints,int temps, Examen examen) {
        this.type = type;
        this.texte = texte;
        this.nbPoints = nbPoints;
        this.temps=temps;
        this.examen=examen;
    }
}
