package com.semi.DocuHub.domain.teamInvite.request;

import lombok.Getter;

@Getter
public class TeamInviteReq {

    @Getter
    public static class inviteReq{
        private Long teamId;
        private Long memberId;
    }

}
