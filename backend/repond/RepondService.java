package com.example.demo.repond;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.PasseExamen.PasseExamenService;
import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserRepository;
import com.example.demo.piece.Piece;
import com.example.demo.piece.PieceRepository;
import com.example.demo.question.QuestionRepository;
import com.example.demo.question.QuestionType;
import com.example.demo.reponse.Reponse;
import com.example.demo.reponse.ReponseRepository;


import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RepondService {

    private final PasseExamenService passeExamenService;
    private final PieceRepository pieceRepository;
    private final RepondRepository repondRepository;
    private final AppUserRepository appUserRepository;
    private final ReponseRepository reponseRepository;
    private final QuestionRepository questionRepository;


    @Transactional
    public Repond createRepond(RepondRequest request){
        AppUser user = appUserRepository.findById(request.getUserId());
        Reponse reponse = reponseRepository.findById(request.getReponseId());
        Repond repond = new Repond(request.getTexte(), user, reponse);
        return repondRepository.save(repond);
    }

    // Méthode pour creer une reponse avec pièce jointe
    @Transactional
    public Repond createRepondPiece(RepondRequest request, MultipartFile file) throws IOException {
        AppUser user = appUserRepository.findById(request.getUserId());
        Reponse reponse = reponseRepository.findById(request.getReponseId());
    
        // Créer la pièce jointe
        Piece piece = pieceRepository.save(new Piece(
            file.getOriginalFilename(), 
            file.getContentType(),
            file.getBytes()
        ));
    
        // Créer la réponse avec PJ
        Repond repond = new Repond(request.getTexte(), user, reponse);
        repond.setPiece(piece);
        repond.setCorrige(false); 
    
        return repondRepository.save(repond);
    }

    @Transactional
    public byte[] getPiece(long repondId){
        Repond repond = repondRepository.findById(repondId).orElseThrow();
        return repond.getPiece().getPieceContenu();
    }


    @Transactional
    public List<Repond> getUserReponses(long userId, long examenId){
        return repondRepository.findByUserIdAndExamenId(userId, examenId);
    }

    public List<Repond> getUserReponsesQuestion(long userId, long questionId){
        return repondRepository.findByUserIdAndQuestionId(userId, questionId);
    }

    @Transactional
    public void noterReponse(UpdateRepondRequest repondRequest){
        List<Repond> reponse = repondRepository.findByUserIdAndQuestionId(repondRequest.getUserId(), repondRequest.getQuestionId());
        long examId = questionRepository.findById(repondRequest.getQuestionId()).getExamen().getId();
        passeExamenService.setExamenACorriger(repondRequest.getUserId(),examId );
        repondRepository.updateValeurById(repondRequest.getNote(), true,reponse.get(0).getId());
        List<Repond> restantsACorriger = repondRepository.findNonCorrigeByUserIdAndExamenId(
            repondRequest.getUserId(),
            examId,
            false,
            QuestionType.LIBRE,
            QuestionType.PIECE
        );

        // S'il n'en reste plus, on passe l'examen à CORRIGE
        if (restantsACorriger.isEmpty()) {
            passeExamenService.setExamenACorriger(repondRequest.getUserId(), examId);
        }
            }
    

    @Transactional
    public List<Repond> getReponsesACorrigger(long userId, long examenId){
     return repondRepository.findNonCorrigeByUserIdAndExamenId(userId, examenId, false,QuestionType.LIBRE,QuestionType.PIECE);   
    }


}
