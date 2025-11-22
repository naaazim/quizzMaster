package com.example.demo.piece;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Piece {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String pieceNom; // Nom du fichier
    private String pieceType; // Type du fichier (par example, "pdf" ou "docx")
    @Lob
    @Basic(fetch = FetchType.EAGER)
    private byte[] pieceContenu; // Contenu du fichier sous forme de tableau d'octets
    public Piece(String pieceNom, String pieceType, byte[] pieceContenu) {
        this.pieceNom = pieceNom;
        this.pieceType = pieceType;
        this.pieceContenu = pieceContenu;
    }

    
}
