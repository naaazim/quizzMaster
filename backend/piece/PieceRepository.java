package com.example.demo.piece;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface PieceRepository extends JpaRepository<Piece,Long> {

}
