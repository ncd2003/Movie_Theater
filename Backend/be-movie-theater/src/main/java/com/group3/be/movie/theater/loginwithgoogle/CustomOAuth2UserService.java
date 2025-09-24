package com.group3.be.movie.theater.loginwithgoogle;

import com.group3.be.movie.theater.domain.account.Account;
import com.group3.be.movie.theater.domain.account.AccountRepository;
import com.group3.be.movie.theater.domain.role.Role;
import com.group3.be.movie.theater.domain.role.RoleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;



    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oauth2User = super.loadUser(userRequest);


        String email = oauth2User.getAttribute("email");
        String fullName = oauth2User.getAttribute("name");
        String imageUrl = oauth2User.getAttribute("picture");




        Optional<Account> existingAccount = accountRepository.findByEmail(email);

        if (existingAccount.isEmpty()) {
            Account newAccount = new Account();
            newAccount.setEmail(email);
            newAccount.setPassword(new BCryptPasswordEncoder().encode("default_password"));
            newAccount.setFullName(fullName);
            newAccount.setPhoneNumber(null);
            newAccount.setIdentityCard(null);
            newAccount.setImage(imageUrl);
            newAccount.setActive(true);
            newAccount.setStatus(Account.Status.ACTIVE);
            newAccount.setGender(Account.Gender.OTHER);
            newAccount.setCreatedAt(Instant.now());
            if(newAccount.getAddress() == null || newAccount.getAddress().isBlank()) {
                newAccount.setAddress("not provied address");
            }

            // Tự gán role
            Role userRole = roleRepository.findByRoleName("Member")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setRoleName("Member");
                        return roleRepository.save(newRole);
                    });
            newAccount.setRole(userRole);

            accountRepository.save(newAccount);
        }
        return oauth2User;
    }
}
