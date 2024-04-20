package com.semi.DocuHub.domain.image.service;

import com.semi.DocuHub.domain.image.entity.Image;
import com.semi.DocuHub.domain.image.repository.ImageRepository;
import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.team.entity.Team;
import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;

    @Value("${custom.fileDirPath}")
    private String fileDirPath;


    @Transactional
    public Image getImage(String relationEntity, Long relationId)  {
        return imageRepository.findByRelationEntityAndRelationId(relationEntity, relationId).orElseGet(null);
    }

    @Transactional
    public void saveMemberProfile(Member member,@Nullable MultipartFile profileImg) throws IOException {

        String filePath = "";
        String originalFileName = "";

        if (profileImg == null) {
            filePath = "/member/default.jpg";
            originalFileName = "defaultImage";
        } else if (!profileImg.isEmpty()) {

            createFolder("user");

            originalFileName = profileImg.getOriginalFilename();
            filePath = "/member/" + UUID.randomUUID().toString() + "." + originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
            File profileImgFile = new File(fileDirPath + "/" + filePath);
            profileImg.transferTo(profileImgFile);
        }

        Image userProfile = Image.builder().path(filePath).originalFileName(originalFileName).relationId(member.getId()).relationEntity("member").build();

        this.imageRepository.save(userProfile);
    }

    @Transactional
    public void createFolder(String folderName) {

        File folder = new File(fileDirPath + "\\" + folderName + "\\");

        // 해당 디렉토리가 없다면 디렉토리를 생성.
        if (!folder.exists()) {
            try {
                folder.mkdirs();
            } catch (Exception e) {
                e.getStackTrace();
            }
        }
    }

    @Transactional
    public void saveTeamImg(Team team, MultipartFile teamImg) throws IOException {

        String filePath = "";
        String originalFileName = "";

        if (teamImg == null) {
            filePath = "/team/default.jpg";
            originalFileName = "defaultImage";
        } else if (!teamImg.isEmpty()) {

            createFolder("team");

            originalFileName = teamImg.getOriginalFilename();
            filePath = "/team/" + UUID.randomUUID().toString() + "." + originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
            File profileImgFile = new File(fileDirPath + "/" + filePath);
            teamImg.transferTo(profileImgFile);
        }

        Image userProfile = Image.builder().path(filePath).originalFileName(originalFileName).relationId(team.getId()).relationEntity("team").build();

        this.imageRepository.save(userProfile);

    }

    @SneakyThrows
    public void updateTeamImg(Team editTeam, MultipartFile teamImg) {

        createFolder("team");

        String originalFileName = teamImg.getOriginalFilename();
        String filePath = "/team/" + UUID.randomUUID().toString() + "." + originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
        File profileImgFile = new File(fileDirPath + "/" + filePath);
        teamImg.transferTo(profileImgFile);

        Image update = imageRepository.findByRelationEntityAndRelationId("team",editTeam.getId()).get();

        update = update.toBuilder().originalFileName(originalFileName).path(filePath).build();

        imageRepository.save(update);

    }

    public void deleteImg(String team, Long id) {

        Image image = imageRepository.findByRelationEntityAndRelationId(team,id).get();
        imageRepository.delete(image);

    }


    @SneakyThrows
    @Transactional
    public void updateMemberImg(Member member, MultipartFile profileImg) {

        createFolder("member");

        String originalFileName = profileImg.getOriginalFilename();
        String filePath = "/member/" + UUID.randomUUID().toString() + "." + originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
        File profileImgFile = new File(fileDirPath + "/" + filePath);
        profileImg.transferTo(profileImgFile);

        Image update = imageRepository.findByRelationEntityAndRelationId("member",member.getId()).get();

        update = update.toBuilder().originalFileName(originalFileName).path(filePath).build();

        imageRepository.save(update);
    }
}
