package com.englishlearning.listener;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 临时目录检查监听器
 * 在应用启动时检查临时目录是否存在并可写
 */
@Component
public class TempDirectoryCheckListener implements ApplicationListener<ApplicationStartedEvent> {

    @Value("${server.tomcat.basedir:${java.io.tmpdir}/tomcat-english-learning}")
    private String tomcatTempDir;

    @Value("${spring.servlet.multipart.location:${java.io.tmpdir}/english-learning-uploads}")
    private String uploadTempDir;

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
        checkAndCreateDirectory(tomcatTempDir, "Tomcat临时目录");
        checkAndCreateDirectory(uploadTempDir, "文件上传临时目录");
    }

    /**
     * 检查并创建目录
     *
     * @param dirPath 目录路径
     * @param dirDesc 目录描述
     */
    private void checkAndCreateDirectory(String dirPath, String dirDesc) {
        try {
            Path path = Paths.get(dirPath);
            
            // 如果目录不存在，创建目录
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                System.out.println(dirDesc + "已创建: " + dirPath);
            }
            
            // 检查目录是否可写
            File dir = path.toFile();
            if (!dir.canWrite()) {
                System.err.println("警告: " + dirDesc + "没有写权限: " + dirPath);
            } else {
                System.out.println(dirDesc + "检查通过，可写: " + dirPath);
            }
            
            // 尝试创建测试文件并删除，确保目录真的可写
            Path testFile = path.resolve("test_write_permission.tmp");
            Files.createFile(testFile);
            Files.delete(testFile);
            System.out.println(dirDesc + "写入测试通过");
            
        } catch (IOException e) {
            System.err.println("错误: 无法创建或访问" + dirDesc + ": " + dirPath);
            System.err.println("错误详情: " + e.getMessage());
            e.printStackTrace();
        }
    }
}