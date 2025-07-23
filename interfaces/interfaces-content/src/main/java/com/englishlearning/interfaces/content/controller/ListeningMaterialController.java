package com.englishlearning.interfaces.content.controller;

import com.englishlearning.application.content.dto.ListeningMaterialDTO;
import com.englishlearning.application.content.service.ListeningMaterialApplicationService;
import com.englishlearning.common.utils.UserContext;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import com.englishlearning.infrastructure.common.types.Result;
import com.englishlearning.infrastructure.common.utils.ResultUtils;
import com.englishlearning.interfaces.content.dto.BatchDeleteRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 听力资料控制器
 */
@RestController
@RequestMapping("/api/v1/listening-materials")
@RequiredArgsConstructor
public class ListeningMaterialController {
    
    private final ListeningMaterialApplicationService listeningMaterialApplicationService;
    
    /**
     * 创建听力资料
     *
     * @param title             资料标题
     * @param originContent     听力原文
     * @param difficulty        难度级别
     * @param durationInSeconds 音频时长（秒）
     * @param audioFile         音频文件
     * @return 创建结果
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Object createListeningMaterial(
            @RequestParam("title") String title,
            @RequestParam(value = "originContent", required = false) String originContent,
            @RequestParam("difficulty") String difficulty,
            @RequestParam(value = "durationInSeconds", required = false) Long durationInSeconds,
            @RequestParam("audioFile") MultipartFile audioFile) {
        
        try {
            ListeningMaterialDTO dto = new ListeningMaterialDTO();
            dto.setTitle(title);
            dto.setOriginContent(originContent);
            dto.setDifficulty(difficulty);
            dto.setDurationInSeconds(durationInSeconds);
            
            // 获取当前用户信息
            String userId = String.valueOf(UserContext.getCurrentUserId());
            String username = UserContext.getCurrentUsername();
            
            ListeningMaterialDTO result = listeningMaterialApplicationService.create(dto, audioFile, userId, username);
            return ResultUtils.success(result);
        } catch (Exception e) {
            return ResultUtils.error(e.getMessage());
        }
    }
    
    /**
     * 更新听力资料
     *
     * @param id                听力资料ID
     * @param title             资料标题
     * @param originContent     听力原文
     * @param difficulty        难度级别
     * @param durationInSeconds 音频时长（秒）
     * @param audioFile         音频文件（可选）
     * @param clearAudio        是否清除音频文件（可选）
     * @return 更新结果
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Object updateListeningMaterial(
            @PathVariable("id") Long id,
            @RequestParam("title") String title,
            @RequestParam(value = "originContent", required = false) String originContent,
            @RequestParam("difficulty") String difficulty,
            @RequestParam(value = "durationInSeconds", required = false) Long durationInSeconds,
            @RequestParam(value = "audioFile", required = false) MultipartFile audioFile,
            @RequestParam(value = "clearAudio", required = false) Boolean clearAudio) {
        
        try {
            ListeningMaterialDTO dto = new ListeningMaterialDTO();
            dto.setId(id);
            dto.setTitle(title);
            dto.setOriginContent(originContent);
            dto.setDifficulty(difficulty);
            dto.setDurationInSeconds(durationInSeconds);
            dto.setClearAudio(clearAudio != null && clearAudio);
            
            // 获取当前用户信息
            String userId = String.valueOf(UserContext.getCurrentUserId());
            String username = UserContext.getCurrentUsername();
            
            ListeningMaterialDTO result = listeningMaterialApplicationService.update(dto, audioFile, userId, username);
            return ResultUtils.success(result);
        } catch (Exception e) {
            return ResultUtils.error(e.getMessage());
        }
    }
    
    /**
     * 根据ID查询听力资料
     *
     * @param id 听力资料ID
     * @return 查询结果
     */
    @GetMapping("/{id}")
    public Object getListeningMaterialById(@PathVariable("id") Long id) {
        try {
            ListeningMaterialDTO result = listeningMaterialApplicationService.findById(id);
            return ResultUtils.success(result);
        } catch (Exception e) {
            return ResultUtils.error(e.getMessage());
        }
    }
    
    /**
     * 根据难度级别查询听力资料列表
     *
     * @param difficulty 难度级别
     * @return 查询结果
     */
    @GetMapping("/difficulty/{difficulty}")
    public Object getListeningMaterialsByDifficulty(@PathVariable("difficulty") DifficultyLevel difficulty) {
        try {
            List<ListeningMaterialDTO> result = listeningMaterialApplicationService.findByDifficulty(difficulty);
            return ResultUtils.success(result);
        } catch (Exception e) {
            return ResultUtils.error(e.getMessage());
        }
    }
    
    /**
     * 分页查询听力资料列表
     *
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @return 查询结果
     */
    @GetMapping("/page")
    public Object getListeningMaterialsByPage(
            @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        
        try {
            List<ListeningMaterialDTO> result = listeningMaterialApplicationService.findByPage(pageNum, pageSize);
            return ResultUtils.success(result);
        } catch (Exception e) {
            return ResultUtils.error(e.getMessage());
        }
    }
    
    /**
     * 根据ID删除听力资料
     *
     * @param id 听力资料ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    public Object deleteListeningMaterial(@PathVariable("id") Long id) {
        try {
            // 获取当前用户信息
            String userId = String.valueOf(UserContext.getCurrentUserId());
            String username = UserContext.getCurrentUsername();
            
            listeningMaterialApplicationService.deleteById(id, userId, username);
            return ResultUtils.success();
        } catch (Exception e) {
            return ResultUtils.error(e.getMessage());
        }
    }
    
    /**
     * 批量删除听力资料
     *
     * @param request 批量删除请求
     * @return 操作结果
     */
    @DeleteMapping("/batch")
    public Result<Void> batchDeleteListeningMaterials(@RequestBody BatchDeleteRequest request) {
        // 获取当前用户信息
        String userId = String.valueOf(UserContext.getCurrentUserId());
        String username = UserContext.getCurrentUsername();
        
        listeningMaterialApplicationService.deleteByIds(request.getIds(), userId, username);
        return ResultUtils.success();
    }

    
    /**
     * 根据标题模糊查询听力资料列表
     *
     * @param title 标题关键字
     * @return 查询结果
     */
    @GetMapping("/search")
    public Object searchListeningMaterialsByTitle(@RequestParam("title") String title) {
        try {
            List<ListeningMaterialDTO> result = listeningMaterialApplicationService.findByTitleContaining(title);
            return ResultUtils.success(result);
        } catch (Exception e) {
            return ResultUtils.error(e.getMessage());
        }
    }
}