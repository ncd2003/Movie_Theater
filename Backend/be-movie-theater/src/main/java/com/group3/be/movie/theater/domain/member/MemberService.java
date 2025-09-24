package com.group3.be.movie.theater.domain.member;

import com.group3.be.movie.theater.domain.account.Account;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;

    public List<Member> listAllMember() {
        return memberRepository.findAll();
    }

    public void createMember(Member member) {
        memberRepository.save(member);
    }

    public Member getMemberByAccountId(Long id) {
        return memberRepository.findByAccount_AccountId(id);
    }

    public void updateMember(Member member) {
        memberRepository.save(member);
    }

}
