package com.semi.DocuHub.domain.team.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
public class TeamRequest {

    @Getter
    @Setter
    public static class TeamCreateReq {

        @NotBlank
        public String teamName;

        @NotBlank
        public String teamDescription;
    }

}
