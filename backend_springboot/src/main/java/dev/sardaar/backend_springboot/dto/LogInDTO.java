package dev.sardaar.backend_springboot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LogInDTO {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
