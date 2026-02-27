// 应用类别
export type Category = 'service' | 'management' | 'marketing' | 'risk-control' | 'operations' | 'general';

// 行业类别
export type Industry = 'finance' | 'retail' | 'education' | 'healthcare' | 'energy' | 'manufacturing' | 'general';

// 验证状态
export type VerificationStatus = 'verified' | 'in-arena';

// 四维评估指标 - 使用文字值
export interface Metrics {
  speed: string;      // 速度：较快/很快/中等/较慢
  quality: string;    // 质量：较高/很高/中等/较低
  security: string;   // 安全：较高/很高/中等/较低
  cost: string;       // 成本：较优/中等/较低
}

// Arena数据
export interface Arena {
  id: string;
  folderId: string;     // 文件夹名称（用于链接到详情页）
  title: {
    zh: string;
    en: string;
  };
  category: string;      // 逗号分隔的应用类别列表 - 中文
  categoryEn: string;    // 英文
  industry: string;      // 逗号分隔的行业类别列表 - 中文
  industryEn: string;    // 英文
  verificationStatus: string;  // 验证状态：已验证/验证中
  champion: string;      // 本周擂主（技术栈）- 中文
  championEn: string;    // Champion - 英文
  challenger: string;    // 攻擂中（技术栈）- 中文
  challengerEn: string;  // Challenger - 英文
  highlights: string;    // 亮点 - 中文
  highlightsEn: string;  // Highlights - 英文
  metrics: Metrics;
  githubStars?: number; // GitHub stars count
  videoFile?: string;   // Video file name for featured arenas showcase
  hasContent?: boolean; // Whether the arena has full content files (overview, requirements, etc.)
}

// 翻译类型
export type Locale = 'en' | 'zh';
