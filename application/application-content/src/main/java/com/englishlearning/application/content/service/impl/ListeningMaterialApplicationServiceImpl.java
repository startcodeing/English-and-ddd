package com.englishlearning.application.content.service.impl;

import com.englishlearning.application.content.dto.ListeningMaterialDTO;
import com.englishlearning.application.content.service.ListeningMaterialApplicationService;
import com.englishlearning.domain.content.model.entity.ListeningMaterial;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import com.englishlearning.domain.content.repository.ListeningMaterialRepository;
import com.englishlearning.infrastructure.common.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 听力资料应用服务实现类
 */
@Service
@RequiredArgsConstructor
public class ListeningMaterialApplicationServiceImpl implements ListeningMaterialApplicationService {
    
    private final ListeningMaterialRepository listeningMaterialRepository;
    private final FileStorageService fileStorageService;
    
    private static final String AUDIO_UPLOAD_DIR = "listening-materials";
    
    @Override
    @Transactional
    public ListeningMaterialDTO create(ListeningMaterialDTO dto, MultipartFile audioFile) {
        // 检查文件是否为空
        if (audioFile == null || audioFile.isEmpty()) {
            throw new IllegalArgumentException("音频文件不能为空");
        }
        
        try {
            // 存储音频文件
            String audioPath = fileStorageService.storeFile(audioFile, AUDIO_UPLOAD_DIR);
            
            // 创建听力资料实体
            ListeningMaterial listeningMaterial = new ListeningMaterial();
            BeanUtils.copyProperties(dto, listeningMaterial);
            
            // 设置文件相关信息
            listeningMaterial.setAudioPath(audioPath);
            listeningMaterial.setFileSize(audioFile.getSize());
            
            // 设置创建和更新时间
            LocalDateTime now = LocalDateTime.now();
            listeningMaterial.setCreateTime(now);
            listeningMaterial.setUpdateTime(now);

            listeningMaterial.setDifficulty(DifficultyLevel.fromCode(dto.getDifficulty()));

            // 保存实体
            ListeningMaterial savedMaterial = listeningMaterialRepository.save(listeningMaterial);
            
            // 转换为DTO返回
            ListeningMaterialDTO resultDTO = new ListeningMaterialDTO();
            BeanUtils.copyProperties(savedMaterial, resultDTO);
            return resultDTO;
        } catch (IOException e) {
            throw new RuntimeException("存储音频文件失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    @Transactional
    public ListeningMaterialDTO update(ListeningMaterialDTO dto, MultipartFile audioFile) {
        // 查找实体
        ListeningMaterial listeningMaterial = listeningMaterialRepository.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("听力资料不存在: " + dto.getId()));
        
        // 更新基本信息
        listeningMaterial.setTitle(dto.getTitle());
        listeningMaterial.setOriginContent(dto.getOriginContent());
        listeningMaterial.setDifficulty(DifficultyLevel.fromCode(dto.getDifficulty()));
        listeningMaterial.setDurationInSeconds(dto.getDurationInSeconds());
        
        // 如果有新的音频文件，则更新
        if (audioFile != null && !audioFile.isEmpty()) {
            try {
                // 删除旧文件
                if (listeningMaterial.getAudioPath() != null) {
                    fileStorageService.deleteFile(listeningMaterial.getAudioPath());
                }
                
                // 存储新文件
                String audioPath = fileStorageService.storeFile(audioFile, AUDIO_UPLOAD_DIR);
                listeningMaterial.setAudioPath(audioPath);
                listeningMaterial.setFileSize(audioFile.getSize());
            } catch (IOException e) {
                throw new RuntimeException("更新音频文件失败: " + e.getMessage(), e);
            }
        }
        
        // 更新时间
        listeningMaterial.setUpdateTime(LocalDateTime.now());
        // 保存实体
        ListeningMaterial updatedMaterial = listeningMaterialRepository.save(listeningMaterial);
        // 转换为DTO返回
        ListeningMaterialDTO resultDTO = new ListeningMaterialDTO();
        BeanUtils.copyProperties(updatedMaterial, resultDTO);
        return resultDTO;
    }
    
    @Override
    public ListeningMaterialDTO findById(Long id) {
        ListeningMaterial listeningMaterial = listeningMaterialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("听力资料不存在: " + id));
        
        ListeningMaterialDTO dto = new ListeningMaterialDTO();
        BeanUtils.copyProperties(listeningMaterial, dto);
        return dto;
    }
    
    @Override
    public List<ListeningMaterialDTO> findByDifficulty(DifficultyLevel difficulty) {
        List<ListeningMaterial> materials = listeningMaterialRepository.findByDifficulty(difficulty);
        return materials.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ListeningMaterialDTO> findByPage(int pageNum, int pageSize) {
        List<ListeningMaterial> materials = listeningMaterialRepository.findByPage(pageNum, pageSize);
        return materials.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public void deleteById(Long id) {
        // 查找实体
        ListeningMaterial listeningMaterial = listeningMaterialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("听力资料不存在: " + id));
        
        // 删除关联的音频文件
        if (listeningMaterial.getAudioPath() != null) {
            fileStorageService.deleteFile(listeningMaterial.getAudioPath());
        }
        
        // 删除实体
        listeningMaterialRepository.deleteById(id);
    }
    
    @Override
    public List<ListeningMaterialDTO> findByTitleContaining(String title) {
        List<ListeningMaterial> materials = listeningMaterialRepository.findByTitleContaining(title);
        return materials.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 将实体转换为DTO
     *
     * @param material 听力资料实体
     * @return 听力资料DTO
     */
    private ListeningMaterialDTO convertToDTO(ListeningMaterial material) {
        ListeningMaterialDTO dto = new ListeningMaterialDTO();
        BeanUtils.copyProperties(material, dto);
        return dto;
    }
}