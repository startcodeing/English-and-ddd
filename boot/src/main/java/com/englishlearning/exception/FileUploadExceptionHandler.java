package com.englishlearning.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 文件上传异常处理器
 * 用于处理文件上传过程中可能出现的异常
 */
@ControllerAdvice
public class FileUploadExceptionHandler {

    /**
     * 处理文件上传大小超出限制异常
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> handleMaxSizeException(MaxUploadSizeExceededException e) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "文件大小超出限制");
        response.put("error", e.getMessage());
        return new ResponseEntity<>(response, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    /**
     * 处理文件上传IO异常
     */
    @ExceptionHandler(IOException.class)
    public ResponseEntity<Map<String, String>> handleIOException(IOException e) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "文件上传失败");
        response.put("error", e.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * 处理文件上传未检查IO异常
     */
    @ExceptionHandler(UncheckedIOException.class)
    public ResponseEntity<Map<String, String>> handleUncheckedIOException(UncheckedIOException e) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "文件上传处理失败");
        response.put("error", e.getMessage());
        
        // 记录详细错误信息
        System.err.println("文件上传处理失败: " + e.getMessage());
        e.printStackTrace();
        
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * 处理通用的文件上传异常
     */
    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<Map<String, String>> handleMultipartException(MultipartException e) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "文件上传请求处理失败");
        response.put("error", e.getMessage());
        
        // 记录详细错误信息
        System.err.println("文件上传请求处理失败: " + e.getMessage());
        e.printStackTrace();
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}