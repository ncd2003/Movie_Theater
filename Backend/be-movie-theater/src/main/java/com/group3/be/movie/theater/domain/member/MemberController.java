package com.group3.be.movie.theater.domain.member;

import com.group3.be.movie.theater.domain.employee.Employee;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("api/v1/member")
@AllArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @APIMessage("Fetch all members")
    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers(){
        List<Member> members = memberService.listAllMember();
        return ResponseEntity.ok().body(members);
    }


}
