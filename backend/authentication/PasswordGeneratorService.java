package com.example.demo.authentication;

import java.security.SecureRandom;

import org.springframework.stereotype.Service;

@Service
public class PasswordGeneratorService {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
    private static final int PASSWORD_LENGTH = 12; // Longueur du mot de passe

    // Méthode pour générer un mot de passe
    public String generateRandomPassword() {
        SecureRandom random = new SecureRandom(); // Création d'un générateur de nombres aléatoires sécurisé
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length()); // Générer un index aléatoire pour le jeu de caractères
            password.append(CHARACTERS.charAt(randomIndex)); // Ajouter le caractère choisi au mot de passe
        }

        return password.toString();
    }
}