package com.example.demo.security.oauth;

import com.example.demo.appuser.AppUser;
import com.example.demo.security.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final GoogleUserService googleUserService;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String firstName = oauthUser.getAttribute("given_name");
        String lastName = oauthUser.getAttribute("family_name");

        // 1️⃣ Créer ou récupérer l'utilisateur
        AppUser user = googleUserService.processGoogleUser(email, firstName, lastName);

        // 2️⃣ Générer JWT
        String jwt = jwtService.generateToken(user);

        // 3️⃣ Rediriger vers React
        String redirectUrl = "http://localhost:3000/oauth2/redirect?token=" + jwt;

        response.sendRedirect(redirectUrl);
    }
}
