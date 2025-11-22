package com.example.demo.questiondans;

import com.example.demo.examen.Examen;
import com.example.demo.question.Question;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "question_dans")
public class QuestionDans {
    @Id
    @SequenceGenerator(name = "question_dans_sequence", sequenceName = "question_dans_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "question_dans_sequence")
    private long id;

    @ManyToOne
    @JoinColumn(name = "examen_id")
    private Examen examen;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    public QuestionDans(Examen examen, Question question) {
        this.examen = examen;
        this.question = question;
    }

    

}
