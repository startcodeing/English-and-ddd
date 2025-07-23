package com.englishlearning.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

import javax.servlet.MultipartConfigElement;
import java.io.File;

/**
 * 文件上传配置类
 * 用于配置文件上传的临时目录和其他参数
 */
@Configuration
public class MultipartConfig {

    @Value("${spring.servlet.multipart.location:${java.io.tmpdir}/english-learning-uploads}")
    private String uploadTempDir;

    @Value("${spring.servlet.multipart.max-file-size:10MB}")
    private String maxFileSize;

    @Value("${spring.servlet.multipart.max-request-size:10MB}")
    private String maxRequestSize;

    @Value("${spring.servlet.multipart.file-size-threshold:2MB}")
    private String fileSizeThreshold;

    /**
     * 配置文件上传参数
     */
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        
        // 设置文件上传临时目录
        File tempDir = new File(uploadTempDir);
        if (!tempDir.exists()) {
            tempDir.mkdirs();
        }
        
        // 确保目录有写权限
        if (!tempDir.canWrite()) {
            System.err.println("警告: 文件上传临时目录没有写权限: " + uploadTempDir);
        }
        
        factory.setLocation(uploadTempDir);
        
        // 设置文件大小限制
        factory.setMaxFileSize(DataSize.parse(maxFileSize));
        factory.setMaxRequestSize(DataSize.parse(maxRequestSize));
        factory.setFileSizeThreshold(DataSize.parse(fileSizeThreshold));
        
        return factory.createMultipartConfig();
    }
}