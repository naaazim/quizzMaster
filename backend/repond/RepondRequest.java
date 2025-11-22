package com.example.demo.repond;

import lombok.AllArgsConstructor;
import lombok.Getter;
@Getter
@AllArgsConstructor
public class RepondRequest {
    private String texte;
    private long userId;
    private long reponseId;

}
