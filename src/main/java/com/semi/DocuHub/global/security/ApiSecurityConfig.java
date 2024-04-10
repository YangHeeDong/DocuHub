package com.semi.DocuHub.global.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class ApiSecurityConfig {

    @Bean
    SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher("/api/**")
                .authorizeHttpRequests(
                        authorizeHttpRequests ->
                                authorizeHttpRequests
                                        .requestMatchers(HttpMethod.GET,"/api/*/articles").permitAll()
                                        .requestMatchers(HttpMethod.GET,"/api/*/articles/*").permitAll()
                                        .requestMatchers(HttpMethod.POST,"/api/*/members/signup").permitAll()
                                        .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable());

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder () {
        return new BCryptPasswordEncoder();
    }
}
