package com.semi.DocuHub.domain.team.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.teamMember.entity.TeamMember;
import com.semi.DocuHub.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Team extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnore
    private Member teamAdmin;

    private String teamName;

    private String teamDescription;

    @OneToMany(mappedBy = "team", cascade = CascadeType.REMOVE)
    private List<TeamMember> teamMemberList;
}
