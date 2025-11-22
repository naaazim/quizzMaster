package com.example.demo.repond;


import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.piece.Piece;
import com.example.demo.piece.PieceRepository;

import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.List;




@RestController
@RequestMapping("api/v1/repond")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class RepondController {
    
    private final RepondRepository repondRepository;
    private final RepondService repondService;
    private final PieceRepository pieceRepository;

    @GetMapping
    public ResponseEntity<List<Repond>> getAllRepond(){
        return new ResponseEntity<>(repondRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Repond> createRepond(@RequestBody RepondRequest request) {
        return ResponseEntity.ok(repondService.createRepond(request));
    }

    @PostMapping("/create-piece")
    public ResponseEntity<Repond> createRepondPiece(@RequestPart("request") RepondRequest request, @RequestPart("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(repondService.createRepondPiece(request, file));
    }

    @GetMapping("/getReponsesACorriger/{userId}/{examenId}")
    public List<Repond> getReponsesACorriger(@PathVariable long userId,@PathVariable long examenId ){
        return repondService.getReponsesACorrigger(userId, examenId);
    }

    @GetMapping("/get-piece/{pieceId}")
    public ResponseEntity<byte[]> getPieceById(@PathVariable("pieceId") long pieceId) {
        Piece piece = pieceRepository.findById(pieceId).orElseThrow();
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(piece.getPieceType()))
                .body(piece.getPieceContenu());
    }

    @GetMapping("/get-by-exam-user/{examenId}/{userId}")
    public List<Repond> getByExamenAndUserId(@PathVariable long examenId, @PathVariable long userId){
        return repondService.getUserReponses(userId, examenId);
    }

    @GetMapping("/get-by-id/{repondId}")
    public Repond getById(@PathVariable long repondId){
        return repondRepository.findById(repondId).orElseThrow();
    }

    @PutMapping("corriger")
    public void corrigerRepond(@RequestBody UpdateRepondRequest repondRequest) {
        repondService.noterReponse(repondRequest);
    }
}

