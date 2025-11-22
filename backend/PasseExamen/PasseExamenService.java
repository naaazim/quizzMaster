package com.example.demo.PasseExamen;

import com.example.demo.appartientgroupe.AppartientGroupe;
import com.example.demo.appartientgroupe.AppartientGroupeRepository;
import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserRepository;
import com.example.demo.appuser.AppUserRole;
import com.example.demo.examen.Examen;
import com.example.demo.examen.ExamenRepository;
import com.example.demo.question.Question;
import com.example.demo.question.QuestionRepository;
import com.example.demo.question.QuestionType;
import com.example.demo.repond.Repond;
import com.example.demo.repond.RepondRepository;
import com.example.demo.reponse.Reponse;
import com.example.demo.reponse.ReponseRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Vector;

@Service
@AllArgsConstructor
public class PasseExamenService {

    private final PasseExamenRepository passeExamenRepository;
    private final ReponseRepository reponseRepository;
    private final AppUserRepository appUserRepository;
    private final ExamenRepository examenRepository;
    private final RepondRepository repondRepository;
    private final QuestionRepository questionRepository;
    private final AppartientGroupeRepository appartientGroupeRepository;

    // ajoute un passage d'examen a un user a travers son id
    public PasseExamen ajouterPasseExamen(long appUserId, long examenId) {
        AppUser user = appUserRepository.findById(appUserId);
        Examen examen = examenRepository.findById(examenId).orElseThrow();
        PasseExamen passeExamen = new PasseExamen(user, examen);
        return passeExamenRepository.save(passeExamen);
    }

    // ajoute un passage d'examen a un groupe d'users
    public void ajouterPasseExamenGroupe(long groupeId, long examenId) {
        Examen examen = examenRepository.findById(examenId).orElseThrow();
        PasseExamen passeExamen;
        List<AppartientGroupe> listeAppartientGroupe = appartientGroupeRepository.findUsersByGroupeId(groupeId);
        for (AppartientGroupe appartientGroupe : listeAppartientGroupe) {
            if (!passeExamenRepository.findByAppUserIdAndExamenId(appartientGroupe.getUser().getId(), examenId)
                    .isPresent()) {
                passeExamen = new PasseExamen(appartientGroupe.getUser(), examen);
                passeExamenRepository.save(passeExamen);
            }
        }
    }

    // renvoie tous les passage d'examen
    public List<PasseExamen> getAllPasseExamens() {
        return passeExamenRepository.findAll();
    }

    // supprime un passage d'examen
    public void supprimerPasseExamen(Long appUserId, Long examenId) {
        passeExamenRepository.deletePasseExamenByAppUserIdAndExamenId(appUserId, examenId);
        repondRepository.deleteByUserAndExamen(appUserId, examenId);
    }

    // mets les reponses a correction automatique a l'etat corrige
    public void setAutomatiqueAtCorrige(Long appUserId, Long examenId) {
        List<Repond> reponsesExamen = repondRepository.findByUserIdAndExamenId(appUserId, examenId);
        for (Repond reponse : reponsesExamen) {
            if (reponse.getReponse().getQuestion().getType() == QuestionType.QCM
                    || reponse.getReponse().getQuestion().getType() == QuestionType.QCU) {
                reponse.setCorrige(true);
                repondRepository.save(reponse);
            }
        }
    }

    // determine si un examen est a corriger
    public boolean isExamenACorriger(long userId, long examenId) {
        boolean isAcorriger;
        setAutomatiqueAtCorrige(userId, examenId);
        List<Repond> reponsesACorriger = repondRepository.findNonCorrigeByUserIdAndExamenId(userId, examenId, false,
                QuestionType.LIBRE, QuestionType.PIECE);
        if (reponsesACorriger.isEmpty()) {
            isAcorriger = false;
        } else {
            isAcorriger = true;
        }
        return isAcorriger;
    }

    // determine si un examen est a corriger et le met a l'etat corrige
    public PasseExamen setExamenACorriger(long userId, long examenId) {
        PasseExamen examenACorriger = passeExamenRepository.findPasseExamenByAppUserIdAndExamenId(userId, examenId)
                .orElseThrow();
        if (isExamenACorriger(userId, examenId)) {
            examenACorriger.setEtat(PasseExamenEtat.CORRECTION);
        } else {
            examenACorriger.setEtat(PasseExamenEtat.CORRIGE);
        }
        return passeExamenRepository.save(examenACorriger);
    }

    // retourne la note d'une réponse
    @Transactional
    public double noteReponse(long questionId, long userId) {
        double note = 0;
        Question question = questionRepository.findById(questionId);
        List<Repond> repondQuestion = repondRepository.findByUserIdAndQuestionId(userId, questionId);
        List<Reponse> reponsesQuestion = new Vector<Reponse>();
        for (Repond reponse : repondQuestion) {
            reponsesQuestion.add(reponse.getReponse());
        }

        if (repondQuestion.size() == 0) {
            // No responses
        } else if (question.getType() == QuestionType.QCU) {
            if (reponsesQuestion.get(0).getValeur()) {
                note = question.getNbPoints();
            }

        } else if (question.getType() == QuestionType.QCM) {
            boolean correcte = Reponse.compareByIds(reponseRepository.findByValeurAndQuestion(true, question),
                    reponsesQuestion);
            if (correcte) {
                note = question.getNbPoints();
            } else {
                note = 0;
            }
            for (Repond repond : repondQuestion) {
                repond.setCorrige(true);
                repondRepository.save(repond);
            }
        } else {
            return repondQuestion.get(0).getNote();
        }

        return note;
    }

    // retourne la note d'un examen
    @Transactional
    public double calculNote(long userId, long examenId) {
        ;
        Examen examen = examenRepository.findById(examenId).orElseThrow();
        int sommePointsExamen = 0;
        int sommePoints = 0;
        List<Question> questions = questionRepository.findByExamenId(examenId);
        for (Question question : questions) {
            sommePoints += noteReponse(question.getId(), userId);
            sommePointsExamen += question.getNbPoints();
        }
        double note = (double) (sommePoints * examen.getNote_max()) / sommePointsExamen;
        return Math.round(note * 100.0) / 100.0;
    }

    // Retourne la liste des examens à corriger
    public List<PasseExamen> examensACorriger(long examinateurId) {
        return passeExamenRepository.findByEtatAndExamenCreateurId(examinateurId, PasseExamenEtat.CORRECTION);
    }

    // Retourne la liste des examens corrigés par examine
    public List<PasseExamen> examensCorriges(long userId) {
        return passeExamenRepository.findByEtatAndAppUserId(userId, PasseExamenEtat.CORRIGE);
    }

    // Retourne la liste des examens corrigés par examinateur
    public List<PasseExamen> examensCorrigesExaminateur(long userId) {
        return passeExamenRepository.findByEtatAndExamenCreateurId(userId, PasseExamenEtat.CORRIGE);
    }

    // Retourne la liste des examens à passer
    public List<PasseExamen> examensAPasser(long userId) {
        return passeExamenRepository.findByEtatAndAppUserId(userId, PasseExamenEtat.ATTENTE);
    }

    // Retourne passe examen a travers l examinateur id
    public List<PasseExamen> getPasseExamenByExamenId(long examenId) {
        return passeExamenRepository.findByExamenId(examenId);
    }

    // Retourne passe examen a travers l examine id
    public List<PasseExamen> getPasseExamenByAppUserId(long userId) {
        return passeExamenRepository.findByAppUserId(userId);
    }

    // REtourne la liste des examinateurs qui ne passe pas l'examen
    public List<AppUser> getUsersNotInExamen(long examenId) {
        List<AppUser> users = new Vector<AppUser>();
        List<AppUser> allUsers = appUserRepository.findAll();
        List<PasseExamen> usersInExamen = getPasseExamenByExamenId(examenId);
        for (int i = 0; i < allUsers.size(); i++) {
            boolean userIn = false;
            for (int y = 0; y < usersInExamen.size(); y++) {
                if (allUsers.get(i).getId() == usersInExamen.get(y).getAppUser().getId()) {
                    userIn = true;
                }
            }
            if (!userIn && allUsers.get(i).getAppUserRole() == AppUserRole.EXAMINE) {
                users.add(allUsers.get(i));
            }
        }
        return users;
    }

    @Transactional
    public PasseExamen finirExamen(long userId, long examenId) {
        setAutomatiqueAtCorrige(userId, examenId);
        return setExamenACorriger(userId, examenId);
    }

    @Transactional
    public PasseExamen demarrerExamen(long userId, long examenId) {
        PasseExamen passe = passeExamenRepository.findPasseExamenByAppUserIdAndExamenId(userId, examenId).orElseThrow();
        if (passe.getEtat() != PasseExamenEtat.ATTENTE
                || !passeExamenRepository.findPasseExamenByAppUserIdAndExamenId(userId, examenId).isPresent()) {
            throw new AccessDeniedException("");
        }
        passe.setEtat(PasseExamenEtat.DEMARRE);
        return passe;

    }

    // retourne la liste des reponses d'un examine a une question
    public List<Repond> reponseUserQuestion(long userId, long questionId) {
        return repondRepository.findByUserIdAndQuestionId(userId, questionId);
    }

    // retourne les examens corriges d'un examen
    public List<PasseExamen> examensCorrigeByExamenId(long examenId) {
        return passeExamenRepository.findByEtatAndExamenId(examenId, PasseExamenEtat.CORRIGE);
    }

    // retourne le taux de reussite d'un examen
    @Transactional
    public double tauxReussite(long examenId) {
        int nbPassages = 0;
        int nbReussis = 0;
        List<PasseExamen> passages = passeExamenRepository.findByEtatAndExamenId(examenId, PasseExamenEtat.CORRIGE);
        nbPassages = passages.size();
        for (PasseExamen passe : passages) {
            if (calculNote(passe.getAppUser().getId(), examenId) >= (passe.getExamen().getNote_max() / 2)) {
                nbReussis += 1;
            }
        }
        return (double) nbReussis / nbPassages;
    }

    // retourne la note moyenne d'un examen
    @Transactional
    public double noteMoy(long examenId) {
        int nbPassages = 0;
        double somme = 0;
        List<PasseExamen> passages = examensCorrigeByExamenId(examenId);
        nbPassages = passages.size();
        for (PasseExamen passe : passages) {
            if (calculNote(passe.getAppUser().getId(), examenId) >= (passe.getExamen().getNote_max() / 2)) {
                somme += calculNote(passe.getAppUser().getId(), examenId);
            }
        }
        return Math.round(((double) somme / nbPassages) * 100.0) / 100.0;
    }

    // retourne la note min d'un examen
    @Transactional
    public double noteMin(long examenId) {
        double min;
        List<PasseExamen> passages = getPasseExamenByExamenId(examenId);
        min = calculNote(passages.get(0).getAppUser().getId(), examenId);
        for (PasseExamen passe : passages) {
            if (calculNote(passe.getAppUser().getId(), examenId) < min) {
                min = calculNote(passe.getAppUser().getId(), examenId);
            }
        }
        return Math.round(min * 100.0) / 100.0;
    }

    // retourne la note max d'un examen
    @Transactional
    public double noteMax(long examenId) {
        double max;
        List<PasseExamen> passages = getPasseExamenByExamenId(examenId);
        max = calculNote(passages.get(0).getAppUser().getId(), examenId);
        for (PasseExamen passe : passages) {
            if (calculNote(passe.getAppUser().getId(), examenId) > max) {
                max = calculNote(passe.getAppUser().getId(), examenId);
            }
        }
        return Math.round(max * 100.0) / 100.0;
    }

    // retourne la note mediane d'un examen
    @Transactional
    public double noteMed(long examenId) {
        Vector<Double> notes = new Vector<Double>();
        List<PasseExamen> passages = getPasseExamenByExamenId(examenId);
        for (PasseExamen passe : passages) {
            notes.add(calculNote(passe.getAppUser().getId(), examenId));
        }

        Collections.sort(notes);

        return Math.round((notes.get(notes.size() / 2)) * 100.0) / 100.0;
    }

    @Transactional
    public double ecart(long examenId) {
        double max;
        Vector<Double> notes = new Vector<Double>();
        List<PasseExamen> passages = getPasseExamenByExamenId(examenId);
        max = calculNote(passages.get(0).getAppUser().getId(), examenId);
        for (PasseExamen passe : passages) {
            if (calculNote(passe.getAppUser().getId(), examenId) > max) {
                notes.add(calculNote(passe.getAppUser().getId(), examenId));
            }
        }

        Collections.sort(notes);
        int n = notes.size();
        if (n == 0)
            return 0;

        double somme = 0;
        for (double v : notes) {
            somme += v;
        }
        double moyenne = somme / n;

        double sommeDesCarres = 0;
        for (double v : notes) {
            sommeDesCarres += Math.pow(v - moyenne, 2);
        }

        return Math.sqrt(sommeDesCarres / n);
    }

    @Transactional
    public double nbPassages(long examenId) {
        int nbPassages = 0;
        List<PasseExamen> passages = passeExamenRepository.findByEtatAndExamenId(examenId, PasseExamenEtat.CORRIGE);
        nbPassages = passages.size();
        return nbPassages;
    }
}
