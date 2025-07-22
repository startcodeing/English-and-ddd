package com.englishlearning.infrastructure.common.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * 文件存储服务接口
 */
public interface FileStorageService {
    
    /**
     * 存储文件
     *
     * @param file 文件
     * @param directory 存储目录
     * @return 文件访问路径
     * @throws IOException 存储异常
     */
    String storeFile(MultipartFile file, String directory) throws IOException;
    
    /**
     * 删除文件
     *
     * @param filePath 文件路径
     * @return 是否删除成功
     */
    boolean deleteFile(String filePath);
    
    /**
     * 获取文件大小
     *
     * @param filePath 文件路径
     * @return 文件大小（字节）
     */
    long getFileSize(String filePath);
    
    /**
     * 获取文件访问URL
     *
     * @param filePath 文件路径
     * @return 文件访问URL
     */
    String getFileUrl(String filePath);
}