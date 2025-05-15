package com.englishlearning.common.types;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 统一返回结果
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    
    /**
     * 是否成功
     */
    private boolean success;
    
    /**
     * 消息
     */
    private String message;
    
    /**
     * 数据
     */
    private T data;
    
    /**
     * 错误码
     */
    private String errorCode;
    
    public Result(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(true, "Success", data);
    }

    public static <T> Result<T> success() {
        return new Result<>(true, "Success", null);
    }

    public static <T> Result<T> failure(String message) {
        return new Result<>(false, message, null);
    }

    public static <T> Result<T> failure(String message, String errorCode) {
        return new Result<>(false, message, null, errorCode);
    }
} 