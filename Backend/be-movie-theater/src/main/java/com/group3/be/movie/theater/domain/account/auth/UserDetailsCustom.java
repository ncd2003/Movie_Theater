package com.group3.be.movie.theater.domain.account.auth;

import com.group3.be.movie.theater.domain.account.Account;
import com.group3.be.movie.theater.domain.account.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component( "userDetailService")
@AllArgsConstructor
public class UserDetailsCustom implements UserDetailsService {
    private final AccountService accountService;
    // 3. Ghi đè lại method loadUserByUsername trong class UserDetailsService để check account ở trong database chứ không phải mặc định là check trong memory
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Kiểm tra xem usernam có tồn tại trong db không?
        if(accountService.handleGetAccountByEmail(email) == null){
            throw new UsernameNotFoundException("Email or password not correct");
        }
        Account account = accountService.handleGetAccountByEmail(email);
        return new User(account.getEmail(),
                account.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("Role_user")));
    }
}
