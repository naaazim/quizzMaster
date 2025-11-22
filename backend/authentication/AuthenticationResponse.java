package com.example.demo.authentication;

import com.example.demo.appuser.AppUser;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private AppUser appUser;
}
