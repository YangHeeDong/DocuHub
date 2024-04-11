package com.semi.DocuHub.domain.image.repository;

import com.semi.DocuHub.domain.image.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image,Long> {
}
