package com.example.demo.appuser;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class AppUser implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private AppUserRole appUserRole;
    private boolean active;
    private boolean valide;
    


    public AppUser(String firstname, String lastname, String email, String password) {
        this.firstName = firstname;
        this.lastName = lastname;
        this.email = email;
        this.password = password;
        this.appUserRole=AppUserRole.INDEFINI;
        this.active=false;
        this.valide=false;
        
    }

    public AppUser(String firstname, String lastname, String email, String password, boolean active, boolean valide) {
        this.firstName = firstname;
        this.lastName = lastname;
        this.email = email;
        this.password = password;
        this.appUserRole=AppUserRole.INDEFINI;
        this.active=active;
        this.valide=valide;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        SimpleGrantedAuthority authority= new SimpleGrantedAuthority(appUserRole.name());
        return List.of(authority);
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isEnabled() {
        return valide;
    }


    public String getFirstName(){
        return firstName;
    }

    public String getLastName(){
        return lastName;
    }

    public boolean getActive(){
        return active;
    }

    public boolean getValide(){
        return valide;
    }


    public void setActive(boolean v){
        this.active = v;
    }
}
