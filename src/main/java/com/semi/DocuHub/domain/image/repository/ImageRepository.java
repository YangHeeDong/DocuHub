package com.semi.DocuHub.domain.image.repository;

import com.semi.DocuHub.domain.image.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image,Long> {
    Optional<Image>  findByRelationEntityAndRelationId(String relationEntity, Long relationId);
}
