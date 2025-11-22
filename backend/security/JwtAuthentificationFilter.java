package com.example.demo.security;

import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthentificationFilter extends OncePerRequestFilter {

    private final com.example.demo.security.JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request, 
        @NonNull HttpServletResponse response, 
        @NonNull FilterChain filterChain)
            throws ServletException, IOException {
                final String authHeader= request.getHeader("Authorization");
                final String jwt;
                final String email;
                if(authHeader==null || !authHeader.startsWith("Bearer")){
                    filterChain.doFilter(request, response);
                    return;
                }
                jwt= authHeader.substring(7);
                email= jwtService.extractEmail(jwt);
                if(email!=null && SecurityContextHolder.getContext().getAuthentication()==null){
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);
                    if(jwtService.isTokenValid(jwt, userDetails) && userDetails.isEnabled()){
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);

                    }else {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.getWriter().write("Token invalide");
                        return;
                    }
                    filterChain.doFilter(request, response);
                }
    }

}
