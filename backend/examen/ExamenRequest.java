package com.example.demo.examen;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class ExamenRequest {
    private long id;
    private String intitule;
    private double note_max;
    private long createurId;
}
