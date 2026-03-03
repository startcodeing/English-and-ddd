package com.englishlearning.infrastructure.auth.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security配置
 *
 * 渐进式启用认证说明：
 * - 阶段1-2：所有API开放（permitAll），仅配置基础设施
 * - 阶段3-4：逐步启用用户相关API认证
 * - 阶段5-6：启用管理API授权
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
    securedEnabled = true,
    jsr250Enabled = true,
    prePostEnabled = true
)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationEntryPoint unauthorizedHandler;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService,
                         JwtAuthenticationEntryPoint unauthorizedHandler) {
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider(), userDetailsService);
    }

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder
            .userDetailsService(userDetailsService)
            .passwordEncoder(passwordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtTokenProvider jwtTokenProvider() {
        return new JwtTokenProvider();
    }

    /**
     * HTTP安全配置
     *
     * 阶段1-2配置（当前）：所有API开放，仅认证API需要认证
     * 阶段3-4配置：逐步启用 /api/practice/**, /api/activity/** 认证
     * 阶段5-6配置：启用管理API角色授权
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors()
            .and()
            .csrf()
            .disable()
            .exceptionHandling()
            .authenticationEntryPoint(unauthorizedHandler)
            .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
            // 认证相关API（公开）
            .antMatchers("/api/auth/**").permitAll()

            // H2控制台（开发环境）
            .antMatchers("/h2-console/**").permitAll()

            // ====== 阶段1-2：所有其他API开放 ======
            .anyRequest().permitAll();

            // ====== 阶段3-4：启用用户API认证 ======
            // 取消下面的注释以启用
            // .antMatchers("/api/practice/**").authenticated()
            // .antMatchers("/api/activity/**").authenticated()
            // .antMatchers("/api/user/**").authenticated()
            // .anyRequest().permitAll();

            // ====== 阶段5-6：启用管理API授权 ======
            // 取消下面的注释以启用
            // .antMatchers(HttpMethod.GET, "/api/vocabulary/**").authenticated()
            // .antMatchers(HttpMethod.POST, "/api/vocabulary/**").hasAnyRole("ADMIN", "CONTENT_MANAGER")
            // .antMatchers(HttpMethod.PUT, "/api/vocabulary/**").hasAnyRole("ADMIN", "CONTENT_MANAGER")
            // .antMatchers(HttpMethod.DELETE, "/api/vocabulary/**").hasRole("ADMIN")
            // .antMatchers(HttpMethod.POST, "/api/content/**").hasAnyRole("ADMIN", "CONTENT_MANAGER")
            // .antMatchers("/api/admin/**").hasRole("ADMIN")
            // .anyRequest().authenticated();

        // 添加JWT过滤器
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        // 允许H2控制台的iframe
        http.headers().frameOptions().disable();
    }
}
