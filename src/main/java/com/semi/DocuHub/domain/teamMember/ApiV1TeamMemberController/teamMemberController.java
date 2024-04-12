package com.semi.DocuHub.domain.teamMember.ApiV1TeamMemberController;

import com.semi.DocuHub.domain.teamMember.service.TeamMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/teamMember")
@RequiredArgsConstructor
public class teamMemberController {

    private final TeamMemberService teamMemberService;

}
