package com.semi.DocuHub.global.security;

import com.semi.DocuHub.global.security.filter.JwtAuthorizationFilter;
import jakarta.servlet.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class ApiSecurityConfig {

    private final JwtAuthorizationFilter jwtAuthorizationFilter;

    @Bean
    SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {

        http.securityMatcher("/api/**")
                .authorizeHttpRequests(
                        authorizeHttpRequests ->
                                authorizeHttpRequests
                                        .requestMatchers(HttpMethod.GET,"/api/*/articles").permitAll()
                                        .requestMatchers(HttpMethod.GET,"/api/*/articles/*").permitAll()
                                        //회원가입
                                        .requestMatchers(HttpMethod.POST,"/api/*/members/signup").permitAll()
                                        //로그인
                                        .requestMatchers(HttpMethod.POST,"/api/*/members/login").permitAll()
                                        //로그아웃
                                        .requestMatchers(HttpMethod.POST,"/api/*/members/logout").permitAll()
                                        //아이디 찾기
                                        .requestMatchers(HttpMethod.POST,"/api/*/members/findId").permitAll()
                                        //비밀번호 찾기
                                        .requestMatchers(HttpMethod.POST,"/api/*/members/findPassword").permitAll()
                                        // 로그인 되어있는지
                                        .requestMatchers(HttpMethod.POST,"/api/*/members/me").permitAll()
                                        .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable())
                .httpBasic(
                        httpBasic -> httpBasic.disable()
                ) // httpBasic 로그인 방식 끄기
                .formLogin(
                        formLogin -> formLogin.disable()
                ) // 폼 로그인 방식 끄기
                .sessionManagement(
                        sessionManagement -> sessionManagement.disable()
                ) // filter 추가
                .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


}
