package com.example.Locadora.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // libera todos os endpoints
                .allowedOrigins("http://localhost:5173") // origem do front React
                .allowedMethods("GET", "POST", "PUT", "DELETE") // métodos liberados
                .allowCredentials(true); // se precisar enviar cookies/session
    }
}