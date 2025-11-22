package com.example.demo.authentication;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Builder
@Getter
@AllArgsConstructor
public class LoginRequest {
    private final String email;
    private final String password;
}
