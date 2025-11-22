package com.example.demo.question;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class QuestionRequest {
    private QuestionType type;
    private String texte;
    private int nbPoints;
    private int temps;
    private long examenId;
}
