package com.englishlearning.common.utils;

import com.englishlearning.common.types.Result;

/**
 * 返回结果工具类
 */
public class ResultUtils {

    /**
     * 成功结果
     */
    public static <T> Result<T> success() {
        return new Result<>(true, "操作成功", null);
    }

    /**
     * 成功结果（带数据）
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(true, "操作成功", data);
    }

    /**
     * 失败结果
     */
    public static <T> Result<T> error(String message) {
        return new Result<>(false, message, null);
    }

    /**
     * 失败结果（带错误码）
     */
    public static <T> Result<T> error(String errorCode, String message) {
        return new Result<>(false, message, null, errorCode);
    }
} 