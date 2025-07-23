package com.englishlearning.application.content.service;

import com.englishlearning.application.content.dto.ListeningMaterialDTO;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 听力资料应用服务接口
 */
public interface ListeningMaterialApplicationService {
    
    /**
     * 创建听力资料
     *
     * @param dto        听力资料DTO
     * @param audioFile  音频文件
     * @param userId     用户ID
     * @param username   用户名
     * @return 创建后的听力资料DTO
     */
    ListeningMaterialDTO create(ListeningMaterialDTO dto, MultipartFile audioFile, String userId, String username);
    
    /**
     * 更新听力资料
     *
     * @param dto        听力资料DTO
     * @param audioFile  音频文件（可选）
     * @param userId     用户ID
     * @param username   用户名
     * @return 更新后的听力资料DTO
     */
    ListeningMaterialDTO update(ListeningMaterialDTO dto, MultipartFile audioFile, String userId, String username);
    
    /**
     * 根据ID查询听力资料
     *
     * @param id 听力资料ID
     * @return 听力资料DTO
     */
    ListeningMaterialDTO findById(Long id);
    
    /**
     * 根据难度级别查询听力资料列表
     *
     * @param difficulty 难度级别
     * @return 听力资料DTO列表
     */
    List<ListeningMaterialDTO> findByDifficulty(DifficultyLevel difficulty);
    
    /**
     * 分页查询听力资料列表
     *
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @return 听力资料DTO列表
     */
    List<ListeningMaterialDTO> findByPage(int pageNum, int pageSize);
    
    /**
     * 根据ID删除听力资料
     *
     * @param id       听力资料ID
     * @param userId   用户ID
     * @param username 用户名
     */
    void deleteById(Long id, String userId, String username);
    
    /**
     * 批量删除听力资料
     *
     * @param ids      听力资料ID列表
     * @param userId   用户ID
     * @param username 用户名
     */
    void deleteByIds(List<Long> ids, String userId, String username);
    
    /**
     * 根据标题模糊查询听力资料列表
     *
     * @param title 标题关键字
     * @return 听力资料DTO列表
     */
    List<ListeningMaterialDTO> findByTitleContaining(String title);
}