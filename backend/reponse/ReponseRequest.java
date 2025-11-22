package com.example.demo.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ReponseRequest {
    private String texte;
    private Boolean valeur;
    private long questionId;

}
