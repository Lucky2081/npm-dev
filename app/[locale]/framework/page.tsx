'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Target,
  Users,
  GitFork,
  TrendingUp,
  CheckCircle2,
  Zap,
  Shield,
  DollarSign,
  Award,
  ArrowRight,
  BarChart3,
  Star,
} from 'lucide-react';


export default function FrameworkPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isChina = locale === 'zh';

  const philosophyItems = [
    {
      id: '01',
      title: isChina ? '任务驱动' : 'Task-Driven Approach',
      description: isChina
        ? '我们不测试通用模型能力。相反，我们评估特定业务场景任务，确保解决方案在真实环境中有效。'
        : 'We don\'t test general model capabilities. Instead, we evaluate specific business scenario tasks to ensure solutions work in real-world environments.',
      icon: Target,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: '02',
      title: isChina ? '人在回路中' : 'Human-in-the-Loop',
      description: isChina
        ? '通过HITL（人在回路中）机制，我们将人类专家知识融入AI系统，以提高准确性和可信度。'
        : 'Through HITL (Human-in-the-Loop) mechanisms, we incorporate human expert knowledge into AI systems to improve accuracy and trustworthiness.',
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      id: '03',
      title: isChina ? '开放生态系统' : 'Open Ecosystem',
      description: isChina
        ? '所有最佳实践都基于开源技术栈，避免平台锁定，使组织能够保持对AI能力的控制。'
        : 'All best practices are based on open-source technology stacks, avoiding platform lock-in and enabling organizations to maintain control over their AI capabilities.',
      icon: GitFork,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      id: '04',
      title: isChina ? '持续验证' : 'Continuous Validation',
      description: isChina
        ? '通过Arena机制，我们持续评估和更新最佳实践，确保组织能够获得最新的技术解决方案。'
        : 'Through the Arena mechanism, we continuously evaluate and update best practices to ensure organizations have access to the latest technological solutions.',
      icon: TrendingUp,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
  ];

  const pillars = [
    {
      letter: 'Q',
      name: isChina ? '质量' : 'Quality',
      description: isChina ? '输出的准确性和可靠性' : 'Accuracy and reliability of output',
      icon: Star,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      letter: 'E',
      name: isChina ? '效率' : 'Efficiency',
      description: isChina ? '处理速度和资源效率' : 'Processing speed and resource efficiency',
      icon: Zap,
      color: 'bg-violet-500',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200',
    },
    {
      letter: 'C',
      name: isChina ? '成本' : 'Cost',
      description: isChina ? '部署和运营的经济可行性' : 'Economic feasibility of deployment and operations',
      icon: DollarSign,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      letter: 'T',
      name: isChina ? '信任' : 'Trust',
      description: isChina ? '安全性和合规性' : 'Security and compliance',
      icon: Shield,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-20 sm:py-28">
        <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <Badge variant="in-arena" className="mb-6 bg-white border-gray-200">
            <Award className="mr-2 h-4 w-4" />
            {isChina ? '技术框架' : 'Technical Framework'}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            {isChina ? '技术框架' : 'Framework'}
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {isChina ? '了解RWAI的AI实施方法' : 'Understanding RWAI\'s approach to AI implementation'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16">
        {/* What is RWAI-S */}
        <section className="mb-16">
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              {isChina ? 'RWAI-S框架是什么？' : 'What is the RWAI-S Framework?'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isChina
                ? 'RWAI-S（Real-World AI Symbiosis，现实世界AI共生）是一个致力于弥合AI研究与实际应用之间"实施差距"的学术开源项目。我们解决学术基准上的高性能模型与动态、高风险环境中的运营价值之间的脱节问题，提出人机共生的新范式。'
                : 'RWAI-S (Real-World AI Symbiosis) is an academic open-source project dedicated to bridging the "implementation gap" between AI research and real-world applications. We address the disconnect between high model performance on academic benchmarks and operational value in dynamic, high-stakes environments, proposing a new paradigm of Human-AI Symbiosis.'}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {isChina
                ? '从"人在回路中"（HITL）到"人机共生"，我们重新定义了人类智能（HI）与人工智能（AI）之间的关系，从被动的错误纠正转向主动的价值对齐。通过形式化的任务集和上下文对齐机制，我们确保AI系统在真实场景中可操作且鲁棒。'
                : 'From "Human-in-the-Loop" (HITL) to "Human-AI Symbiosis," we redefine the relationship between Human Intelligence (HI) and Artificial Intelligence (AI), shifting from passive error correction to active value alignment. Through formalized Task Sets and Contextual Alignment mechanisms, we ensure AI systems are operable and robust in real-world scenarios.'}
            </p>
          </div>
        </section>

        {/* Theoretical Foundation */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {isChina ? '理论基础' : 'Theoretical Foundation'}
          </h2>
          <div className="space-y-6">
            {/* Task Set Formalization */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                {isChina ? '任务集形式化' : 'Task Set Formalization'}
              </h3>
              <p className="text-gray-700 mb-4">
                {isChina
                  ? '我们通过五元组 T = ⟨G, K, M, P, L⟩ 形式化真实世界任务，将静态的"数据集"概念扩展为动态的"任务集"，显式建模目标、知识、评估指标、交互协议和历史轨迹。'
                  : 'We formalize real-world tasks through a 5-tuple T = ⟨G, K, M, P, L⟩, extending the static "dataset" concept to a dynamic "Task Set" that explicitly models goals, knowledge, evaluation metrics, interaction protocols, and historical trajectories.'}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { code: 'G', name: isChina ? '目标本体' : 'Goal Ontology', desc: isChina ? '分层目标分解' : 'Hierarchical goal decomposition' },
                  { code: 'K', name: isChina ? '领域知识图谱' : 'Domain Knowledge Graph', desc: isChina ? '动态知识状态' : 'Dynamic knowledge state' },
                  { code: 'M', name: isChina ? '评估指标矩阵' : 'Evaluation Metric Matrix', desc: isChina ? '多维标准' : 'Multi-dimensional criteria' },
                  { code: 'P', name: isChina ? '交互协议集' : 'Interaction Protocol Set', desc: isChina ? '协作规则' : 'Collaboration rules' },
                ].map((item) => (
                  <div key={item.code} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                      {item.code}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contextual Alignment */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                {isChina ? '上下文对齐' : 'Contextual Alignment'}
              </h3>
              <p className="text-gray-700 mb-4">
                {isChina
                  ? '传统的对齐研究专注于"通用"的人类价值观，但真实世界的AI部署本质上是上下文相关的。我们将上下文对齐定义为优化向量距离以最小化关系失调和对齐债务。'
                  : 'Traditional alignment research focuses on "universal" human values, but real-world AI deployment is inherently contextual. We define Contextual Alignment as optimizing vector distance to minimize Relational Dissonance and Alignment Debt.'}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { name: isChina ? '运营' : 'Operational', desc: isChina ? '工作流遵循' : 'Workflow adherence' },
                  { name: isChina ? '文化' : 'Cultural', desc: isChina ? '沟通规范' : 'Communication norms' },
                  { name: isChina ? '时间' : 'Temporal', desc: isChina ? '状态感知' : 'State awareness' },
                ].map((item) => (
                  <div key={item.name} className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                    <div className="font-semibold text-gray-900 mb-1">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Human-AI Symbiosis */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                {isChina ? '人机共生' : 'Human-AI Symbiosis'}
              </h3>
              <p className="text-gray-700 mb-4">
                {isChina
                  ? '从"工具"到"队友"的范式转变需要重新思考AI智能体的本体地位。我们提出三个核心原则：双向认知对齐、上下文感知智能体和关系和谐，创造出超越任何单独实体的"半人马系统"。'
                  : 'The paradigm shift from "tool" to "teammate" requires rethinking the ontological status of AI agents. We propose three core principles: Bidirectional Cognitive Alignment, Context-Aware Agency, and Relational Consonance, creating "Centaurian Systems" that surpass either entity operating alone.'}
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  isChina ? '双向认知对齐' : 'Bidirectional Alignment',
                  isChina ? '上下文感知智能体' : 'Context-Aware Agency',
                  isChina ? '关系和谐' : 'Relational Consonance',
                  isChina ? '扩展自我' : 'Extended Self',
                  isChina ? '联合系统状态' : 'Joint System State',
                ].map((item) => (
                  <span key={item} className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold border border-blue-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core Philosophy */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {isChina ? '核心理念' : 'Core Philosophy'}
          </h2>
          <div className="grid gap-6">
            {philosophyItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                >
                  <div className="flex items-start gap-5">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${item.bgColor} ${item.color} transition-all group-hover:scale-110`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-400">{item.id}</span>
                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Four-Dimensional Evaluation */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {isChina ? '四维评估' : 'Four-Dimensional Evaluation'}
          </h2>
          <p className="text-gray-700 mb-8 text-lg">
            {isChina
              ? '每个AI实践从四个维度进行评估：质量、效率、成本和信任。'
              : 'Each AI practice is evaluated across four dimensions: Quality, Efficiency, Cost, and Trust.'}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.letter}
                  className={`group relative overflow-hidden rounded-2xl border-2 ${pillar.borderColor} ${pillar.bgColor} p-6 transition-all hover:shadow-md`}
                >
                  <div className="relative">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${pillar.color} text-white text-xl font-bold shadow-sm`}>
                        {pillar.letter}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`h-5 w-5 ${pillar.color.replace('bg-', 'text-')}`} />
                          <h3 className="text-lg font-bold text-gray-900">{pillar.name}</h3>
                        </div>
                        <p className="text-gray-700 text-sm">{pillar.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How to Participate */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {isChina ? '如何参与' : 'How to Participate'}
          </h2>
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                isChina ? '提交您的AI实践到擂台竞争' : 'Submit your AI practice to compete in the Arena',
                isChina ? '对现有方案提供反馈' : 'Provide feedback on existing solutions',
                isChina ? '在GitHub上贡献代码和改进' : 'Contribute code and improvements on GitHub',
                isChina ? '与社区分享您的经验' : 'Share your experience with the community',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-white p-10 text-center shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {isChina ? '准备开始了吗？' : 'Ready to Get Started?'}
          </h3>
          <p className="text-gray-700 mb-8 max-w-xl mx-auto">
            {isChina
              ? '探索AI最佳实践，或提交您自己的方案'
              : 'Explore AI best practices or submit your own solution'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/arena`}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 text-base font-medium transition-all duration-fast bg-blue-600 hover:bg-blue-700 text-white rounded-button"
            >
              {isChina ? '浏览最佳 AI 实践' : 'Browse Best AI Practices'}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://github.com/THU-ZJAI/Real-World-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 text-base font-medium transition-all duration-fast border-2 border-gray-200 bg-transparent text-gray-900 hover:bg-gray-50 hover:border-gray-300 rounded-button"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
