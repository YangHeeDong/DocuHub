package com.semi.DocuHub;

import jakarta.persistence.Entity;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DocuHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(DocuHubApplication.class, args);
	}

}
