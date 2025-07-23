package com.englishlearning.config;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;

/**
 * Tomcat服务器配置类
 * 用于配置Tomcat服务器的临时目录和其他参数
 */
@Configuration
public class TomcatConfig {

    /**
     * 自定义Tomcat配置
     * 确保临时目录存在并可写
     */
    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatCustomizer() {
        return factory -> {
            // 设置Tomcat临时目录
            String tempDir = System.getProperty("java.io.tmpdir") + "/tomcat-english-learning";
            File tomcatTempDir = new File(tempDir);
            if (!tomcatTempDir.exists()) {
                tomcatTempDir.mkdirs();
            }
            
            // 确保目录有写权限
            if (!tomcatTempDir.canWrite()) {
                System.err.println("警告: Tomcat临时目录没有写权限: " + tempDir);
            }
            
            factory.setBaseDirectory(tomcatTempDir);
            
            // 配置连接超时时间
            factory.addConnectorCustomizers(connector -> {
                connector.setProperty("connectionTimeout", "20000");
            });
        };
    }
}