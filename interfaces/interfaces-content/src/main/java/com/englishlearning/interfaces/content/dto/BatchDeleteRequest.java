package com.englishlearning.interfaces.content.dto;

import lombok.Data;

import java.util.List;

/**
 * 批量删除请求DTO
 */
@Data
public class BatchDeleteRequest {
    
    /**
     * 要删除的ID列表
     */
    private List<Long> ids;
}