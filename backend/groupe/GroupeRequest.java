package com.example.demo.groupe;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GroupeRequest {
    private String intitule;
    private long createurId;

}
