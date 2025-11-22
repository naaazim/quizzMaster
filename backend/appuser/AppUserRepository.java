package com.example.demo.appuser;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;



@Repository
@Transactional(readOnly = true)
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);

    AppUser getByEmail(String email);

    AppUser findById(long id);

    @Transactional
    @Modifying
    @Query("UPDATE AppUser a " +
            "SET a.active = TRUE WHERE a.email = :email")
    int activeAppUser(String email);

    
    @Transactional
    @Modifying
    @Query("UPDATE AppUser a SET a.appUserRole = :role WHERE a.email = :email")
    int updateAppUserRole(@Param("email") String email, @Param("role") AppUserRole role);

        
    @Transactional
    @Modifying
    @Query("UPDATE AppUser a SET a.valide= TRUE WHERE a.email = :email")
    int ValidateAppUser(@Param("email") String email);


    List<AppUser> findByAppUserRole(AppUserRole appUserRole);

    @Query("SELECT a FROM AppUser a WHERE a.active = TRUE AND a.appUserRole <> :role AND a.valide = TRUE")
    List<AppUser> getUsersToUpdate(@Param("role") AppUserRole role);

    @Query("SELECT a FROM AppUser a WHERE a.active = TRUE AND a.appUserRole = :role AND a.valide = FALSE")
    List<AppUser> getUsersToValidate(@Param("role") AppUserRole role);
    

}