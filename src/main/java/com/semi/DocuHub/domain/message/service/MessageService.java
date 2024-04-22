package com.semi.DocuHub.domain.message.service;

import com.semi.DocuHub.domain.image.service.ImageService;
import com.semi.DocuHub.domain.member.dto.MemberDto;
import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.message.dto.MessageDto;
import com.semi.DocuHub.domain.message.entity.Message;
import com.semi.DocuHub.domain.message.repository.MessageRepository;
import com.semi.DocuHub.global.rq.Rq;
import com.semi.DocuHub.global.rsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ImageService imageService;
    private final Rq rq;

    public RsData create(Member reciveMember, String content) {

        Message message = Message.builder()
                .sender(rq.getMember())
                .receiver(reciveMember)
                .content(content)
                .build();
        messageRepository.save(message);

        return RsData.of("S-1","메세지를 전송하였습니다.");
    }

    public RsData getMessagesByMember(Member member) {

        List<MessageDto> messageList = messageRepository.findBySenderOrReceiver(rq.getMember(),rq.getMember()).stream()
                .filter(message -> message.getSender().getId() == member.getId() || message.getReceiver().getId() == member.getId())
                .map(message -> {
                    return new MessageDto(
                            message.getId(),
                            new MemberDto(message.getSender(), imageService.getImage("member",message.getSender().getId())),
                            new MemberDto(message.getReceiver(), imageService.getImage("member",message.getReceiver().getId())),
                            message.getContent(),
                            message.getIsCheck()
                    ) ;
                })
                .toList();

        return RsData.of("S-1","조회성공", messageList);
    }

    public RsData getMessagesMember() {
        Set<Member> messageList =messageRepository.findBySenderOrReceiver(rq.getMember(), rq.getMember()).stream()
                .flatMap(message -> Stream.of(message.getSender(), message.getReceiver()))
                .filter(member -> !member.getId().equals(rq.getMember().getId())) // 현재 멤버와 중복되는 멤버 제외

                .collect(Collectors.toSet());

        List<MemberDto> result = messageList.stream().map(member -> {
            return new MemberDto(member, imageService.getImage("member",member.getId()));
        }).toList();

        return RsData.of("S-1","조회성공", result);
    }

    public RsData<Message> findById(Long id) {
        Optional<Message> message = messageRepository.findById(id);

        if(message.isEmpty()){
            return RsData.of("F-1","존재하지 않는 메세지 입니다.");
        }

        return RsData.of("S-1","조회성공",message.get());
    }

    public void update(Message data, String s) {
        data = data.toBuilder().content(s).build();
        messageRepository.save(data);

    }
}
