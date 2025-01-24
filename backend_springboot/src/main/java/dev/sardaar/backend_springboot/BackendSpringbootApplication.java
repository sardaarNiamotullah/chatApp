package dev.sardaar.backend_springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

// @SpringBootApplication
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class BackendSpringbootApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendSpringbootApplication.class, args);
	}

}
