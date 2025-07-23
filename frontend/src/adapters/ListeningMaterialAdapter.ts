import { ListeningMaterial } from '../types/listeningMaterial';
import { appConfig } from '../config';

/**
 * 听力资料适配器
 * 用于将后端返回的数据转换为前端需要的格式
 */
export class ListeningMaterialAdapter {
  /**
   * 将后端返回的数据转换为前端需要的格式
   * 主要是将audioPath转换为audioUrl
   * @param data 后端返回的数据
   * @returns 转换后的数据
   */
  static adapt(data: any): ListeningMaterial {
    if (!data) return {} as ListeningMaterial;

    // 构建音频URL
    let audioUrl = '';
    if (data.audioPath) {
      // 使用配置的API基础URL和文件访问路径构建完整URL
      audioUrl = `${appConfig.apiBaseUrl}/files/${data.audioPath}`;
    }

    return {
      id: data.id,
      title: data.title,
      transcript: data.originContent || '', // 保持前端字段名称不变，但实际对应后端的originContent
      originContent: data.originContent || '',
      difficulty: data.difficulty,
      audioUrl: audioUrl,
      originFileName: data.originFileName,
      fileSize: data.fileSize || 0,
      duration: data.durationInSeconds || 0,
      createdAt: data.createTime ? new Date(data.createTime).getTime() : undefined,
      updatedAt: data.updateTime ? new Date(data.updateTime).getTime() : undefined
      // clearAudio属性不在ListeningMaterial接口中，仅在请求参数中使用
    };
  }

  /**
   * 将后端返回的数据列表转换为前端需要的格式
   * @param dataList 后端返回的数据列表
   * @returns 转换后的数据列表
   */
  static adaptList(dataList: any[]): ListeningMaterial[] {
    if (!dataList || !Array.isArray(dataList)) return [];
    return dataList.map(item => this.adapt(item));
  }
}