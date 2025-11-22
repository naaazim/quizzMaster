package com.example.demo.security.oauth;

import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserRepository;
import com.example.demo.appuser.AppUserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GoogleUserService {

    private final AppUserRepository userRepository;

    public AppUser processGoogleUser(String email, String firstName, String lastName) {

        AppUser user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            return user;
        }

        // 👉 L'utilisateur n'existe pas : on le crée par défaut comme EXAMINE
        AppUser newUser = new AppUser();
        newUser.setEmail(email);
        newUser.setFirstName(firstName);
        newUser.setLastName(lastName);
        newUser.setAppUserRole(AppUserRole.EXAMINE);
        newUser.setValide(true);   // Pas d’activation email pour Google
        newUser.setActive(true);

        return userRepository.save(newUser);
    }
}
