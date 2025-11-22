package com.example.demo.appuser;

import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;




@Service
@AllArgsConstructor
public class AppUserService implements UserDetailsService {

    private final static String USER_NOT_FOUND_MSG =
            "user with email %s not found";

    private final AppUserRepository appUserRepository;

    @Override

    //renvoie l'utilisateur à partir de son email s'il existe
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        return appUserRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                String.format(USER_NOT_FOUND_MSG, email)));
    }

    //renvoie la liste des utilisateurs ayant un role special
    public List<AppUser> getAppUserByRole(AppUserRole role){
        return appUserRepository.findByAppUserRole(role);
    }

    //renvoie la liste de tous les utilisateurs
    public List<AppUser> getAll(){
        return appUserRepository.findAll();
    }

    //modifie le role d'un utilisateur
    public void updateRole(UpdateRequest request){
        appUserRepository.updateAppUserRole(request.getEmail(), request.getRole());
    }

    public void ValidateUser(String email){
        appUserRepository.ValidateAppUser(email);
    }
    
    //renvoie la liste des utilisateurs sans role
    public List<AppUser> getUsersToUpdate(){
        return appUserRepository.getUsersToUpdate(AppUserRole.ADMIN);
    }

    public void deleteUser(String email){
        AppUser user = appUserRepository.getByEmail(email);
        appUserRepository.delete(user);
    }

    public List<AppUser> getExamineAValider(){
        return appUserRepository.getUsersToValidate(AppUserRole.EXAMINE);
    }

    public List<AppUser> getExaminateurAValider(){
        return appUserRepository.getUsersToValidate(AppUserRole.EXAMINATEUR);
    }
    public AppUser getByEmail(String email) {
        return appUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

}
