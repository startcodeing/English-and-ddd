package com.englishlearning.infrastructure.common.service.impl;

import com.englishlearning.infrastructure.common.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

/**
 * 本地文件存储服务实现
 */
@Service
public class LocalFileStorageServiceImpl implements FileStorageService {
    
    @Value("${file.upload.dir:uploads}")
    private String uploadDir;
    
    @Value("${file.access.url:http://localhost:8080/files}")
    private String fileAccessUrl;
    
    @Override
    public String storeFile(MultipartFile file, String directory) throws IOException {
        // 检查文件是否为空
        if (file.isEmpty()) {
            throw new IOException("无法存储空文件");
        }
        
        // 获取文件名
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        
        // 检查文件名是否包含无效字符
        if (originalFilename.contains("..")) {
            throw new IOException("文件名包含无效路径序列: " + originalFilename);
        }
        
        // 生成唯一文件名
        String fileExtension = getFileExtension(originalFilename);
        String newFilename = UUID.randomUUID() + (StringUtils.hasText(fileExtension) ? "." + fileExtension : "");
        
        // 创建目标目录
        String targetDir = uploadDir + File.separator + directory;
        Path targetLocation = Paths.get(targetDir).toAbsolutePath().normalize();
        Files.createDirectories(targetLocation);
        
        // 存储文件
        Path targetPath = targetLocation.resolve(newFilename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        
        // 返回相对路径
        return directory + "/" + newFilename;
    }
    
    @Override
    public boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(uploadDir + File.separator + filePath).toAbsolutePath().normalize();
            return Files.deleteIfExists(path);
        } catch (IOException e) {
            return false;
        }
    }
    
    @Override
    public long getFileSize(String filePath) {
        try {
            Path path = Paths.get(uploadDir + File.separator + filePath).toAbsolutePath().normalize();
            return Files.size(path);
        } catch (IOException e) {
            return 0;
        }
    }
    
    @Override
    public String getFileUrl(String filePath) {
        return fileAccessUrl + "/" + filePath;
    }
    
    /**
     * 获取文件扩展名
     *
     * @param filename 文件名
     * @return 文件扩展名
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}