package com.example.demo.appartientgroupe;

import java.util.List;
import java.util.Vector;

import org.springframework.stereotype.Service;

import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserRepository;
import com.example.demo.appuser.AppUserRole;
import com.example.demo.groupe.Groupe;
import com.example.demo.groupe.GroupeRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AppartientGroupeService {
    private final AppartientGroupeRepository appartientGroupeRepository;
    private final AppUserRepository appUserRepository;
    private final GroupeRepository groupeRepository;

    //Ajoute appartient groupe avec user et groupe ID
    public AppartientGroupe ajouterAppartientGroupe(long userId,long groupeId){
        if(appartientGroupeRepository.findByGroupeIdAndUserId(groupeId,userId).isPresent()){
        throw new IllegalStateException();
        }
        AppUser user = appUserRepository.findById(userId);
        Groupe groupe = groupeRepository.findById(groupeId).orElseThrow();
        return appartientGroupeRepository.save(new AppartientGroupe(groupe,user));

    }

    //supprime appartient groupe avec user et groupe ID
    public void supprimerAppartientGroupe(long userId,long groupeId){
        AppartientGroupe appartient = appartientGroupeRepository.findByGroupeIdAndUserId(groupeId, userId).orElseThrow();
        appartientGroupeRepository.delete(appartient);
    }
   
    //affiche la liste des utilisateurs appartenant au groupe
    public List<AppartientGroupe> getUsersInGroupe(long groupeId){
        return appartientGroupeRepository.findUsersByGroupeId(groupeId);
    }

    //affiche la liste des utilisateurs n'appartenant pas au groupe
    public List<AppUser> getUsersNotInGroupe( long groupeId){
        List<AppUser> users = new Vector<AppUser>();
        List<AppUser> allUsers = appUserRepository.findByAppUserRole(AppUserRole.EXAMINE);
        List<AppartientGroupe> usersInGroupe = getUsersInGroupe(groupeId);
        for(int i=0;i<allUsers.size();i++){
            boolean userIn=false;
            for(int y=0;y<usersInGroupe.size();y++){
                if(allUsers.get(i).getId()==usersInGroupe.get(y).getUser().getId()){
                    userIn=true;
                }
            }
            if(!userIn && allUsers.get(i).getAppUserRole()==AppUserRole.EXAMINE){
                users.add(allUsers.get(i));
            }
        }
        return users;
    }
}
