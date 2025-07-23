package com.englishlearning.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

/**
 * 文件存储配置类
 */
@Setter
@Getter
@Configuration
@ConfigurationProperties(prefix = "file")
public class FileStorageConfig implements WebMvcConfigurer {
    
    /**
     * 上传目录
     * -- GETTER --
     *  获取上传目录
     * -- SETTER --
     *  设置上传目录


     */
    private String uploadDir = "uploads";
    
    /**
     * 访问URL前缀
     * -- GETTER --
     *  获取访问URL前缀
     * -- SETTER --
     *  设置访问URL前缀


     */
    private String accessUrl = "/files";
    
    /**
     * 最大文件大小（字节）
     * -- GETTER --
     *  获取最大文件大小
     * -- SETTER --
     *  设置最大文件大小


     */
    private long maxFileSize = 10 * 1024 * 1024; // 10MB

    /**
     * 配置静态资源映射
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 创建上传目录
        File uploadDirectory = new File(uploadDir);
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }
        
        // 配置静态资源映射，使上传的文件可以通过URL访问
        registry.addResourceHandler(accessUrl + "/**")
                .addResourceLocations("file:" + uploadDirectory.getAbsolutePath() + File.separator);
    }
    
    /**
     * 配置MultipartResolver
     */
    @Bean
    public MultipartResolver multipartResolver() {
        // 确保使用StandardServletMultipartResolver，它会使用application.yml中配置的临时目录
        return new StandardServletMultipartResolver();
    }
    
    /**
     * 确保临时目录存在
     */
    @Bean
    public void ensureMultipartTempDirExists() {
        // 创建Tomcat临时目录
        String tomcatTempDir = System.getProperty("java.io.tmpdir") + "/tomcat-english-learning";
        File tomcatDir = new File(tomcatTempDir);
        if (!tomcatDir.exists()) {
            tomcatDir.mkdirs();
        }
        
        // 创建上传临时目录
        String uploadTempDir = System.getProperty("java.io.tmpdir") + "/english-learning-uploads";
        File uploadDir = new File(uploadTempDir);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
    }
}