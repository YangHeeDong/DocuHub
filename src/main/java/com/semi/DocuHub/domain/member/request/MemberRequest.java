package com.semi.DocuHub.domain.member.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
public class MemberRequest {

    @Getter
    @Builder
    public static class SignupReq {

        @NotBlank
        public String username;

        @NotBlank
        public String password;

        @NotBlank
        public String passwordConfirm;

        @NotBlank
        public String email;
    }

    @Getter
    public static class LoginReq {

        @NotBlank
        public String username;

        @NotBlank
        public String password;
    }

    @Getter
    public static class FindIdReq {

        @NotBlank
        public String email;

    }

    @Getter
    public static class FindPasswordReq {

        @NotBlank
        public String username;

        @NotBlank
        public String email;

    }

    @Getter
    public static class SearchMember {

        @NotBlank
        public String param;

    }

    @Getter
    public static class EditReq {

        public String password;

        public String passwordConfirm;

    }

}
