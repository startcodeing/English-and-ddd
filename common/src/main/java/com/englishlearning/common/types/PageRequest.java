package com.englishlearning.common.types;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;

/**
 * 分页请求参数
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageRequest {
    
    /**
     * 页码（从1开始）
     */
    @Min(value = 1, message = "页码最小为1")
    private int pageNum = 1;
    
    /**
     * 每页条数
     */
    @Min(value = 1, message = "每页条数最小为1")
    private int pageSize = 10;
    
    /**
     * 排序字段
     */
    private String sortField;
    
    /**
     * 排序方向（asc/desc）
     */
    private String sortDirection;
} 