package com.semi.DocuHub.global.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Component
public class JwtProvider {

    @Value("${custom.jwt.secret}")
    private String originSecretKey;

    private SecretKey cachedSecretkey;

    private SecretKey _getSecretKey(){

    }


}
