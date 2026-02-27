'use client';

import { Mail } from 'lucide-react';
import Image from 'next/image';
import { useLocale } from 'next-intl';

export default function AboutPage() {
  const locale = useLocale();
  const isChina = locale === 'zh';
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const withBasePath = (path: string) => `${basePath}${path}`;

  const partners = [
    { name: 'Tsinghua University', nameZh: '清华大学', logo: withBasePath('/partners/logo1.png') },
    { name: 'Microsoft', nameZh: '微软', logo: withBasePath('/partners/logo2.png') },
    { name: 'Columbia University', nameZh: '哥伦比亚大学', logo: withBasePath('/partners/logo3.png') },
    { name: 'Oxford University', nameZh: '牛津大学', logo: withBasePath('/partners/logo4.png') },
    { name: 'CFA Institute', nameZh: 'CFA协会', logo: withBasePath('/partners/logo5.png') },
    { name: 'Yangtze Delta Region Institute', nameZh: '浙江清华长三角研究院', logo: withBasePath('/partners/logo6.png') },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-700/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              {isChina ? '关于 RWAI' : 'About RWAI'}
            </h1>
            <p className="text-lg leading-relaxed text-slate-400">
              {isChina
                ? 'Real-World AI （RWAI）是一个开源项目，专注真实场景的AI落地。目前主要通过开源代码、文档及其关联的其他资源链接，分享解决真实场景AI落地各种问题的最佳实践案例。'
                : 'Real-World AI (RWAI) is an open-source project focused on AI implementation in real-world scenarios. We primarily share best practice cases for solving various AI implementation problems through open-source code, documentation, and associated resource links.'}
            </p>
          </div>
        </div>
      </section>

      {/* Initiating Team */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {isChina ? '发起团队' : 'Initiating Team'}
            </h2>
            <p className="text-xl text-slate-600">
              {isChina
                ? '浙江清华长三角研究院人工智能创新研究中心（THU-ZJAI）'
                : 'Yangtze Delta Region Institute of Tsinghua University, Artificial Intelligence Innovation Research Center (THU-ZJAI)'}
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-8">
            {/* Team Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {isChina ? '团队概述' : 'Team Overview'}
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {isChina
                  ? '团队聚焦真实场景AI与人交互的"人在回路"（HITL）技术研究和应用，致力于推动人工智能前沿技术在金融、能源、社会治理等产业领域的技术创新和深度应用，曾为国内外数十家知名专业公司提供服务。团队成员来自牛津大学、清华大学、哥伦比亚大学等知名高校以及微软、平安、百度等企业的人工智能专家，承接多项国家、国际重大产业创新课题，并为海内外多家企业提供产业智能化技术方案。'
                  : 'The team focuses on research and application of "Human-in-the-Loop" (HITL) technology for AI-human interaction in real-world scenarios. We are committed to promoting technological innovation and deep application of cutting-edge AI technologies in industrial fields such as finance, energy, and social governance, and have served dozens of well-known professional companies at home and abroad. Team members come from AI experts from renowned universities such as Oxford University, Tsinghua University, and Columbia University, as well as companies like Microsoft, Ping An, and Baidu. We undertake multiple national and international major industrial innovation projects and provide intelligent technology solutions for many domestic and overseas enterprises.'}
              </p>
            </div>

            {/* Center Director */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {isChina ? '中心主任' : 'Center Director'}
              </h3>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-2xl font-bold">
                    {isChina ? '徐亮' : 'XL'}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-slate-900 mb-2">
                    {isChina ? '徐亮 博士' : 'Xu Liang, Ph.D.'}
                  </p>
                  <p className="text-slate-700 leading-relaxed text-sm mb-3">
                    {isChina
                      ? '《麻省理工科技评论》"全球35岁以下科技创新35人"'
                      : 'Named to the MIT Technology Review\'s "Global 35 Innovators Under 35"'}
                  </p>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {isChina
                      ? '徐亮博士本科毕业于清华大学，在牛津大学取得博士学位。承担从国家到地方的多个重大项目，为数十家企业提供人工智能解决方案。曾任平安集团混合增强智能部门负责人、总工程师，三次获"中国人工智能最高奖"吴文俊科学技术奖、央行金融科技发展奖，在ACL、《柳叶刀》子刊等发表多篇论文，与CFA等国际机构联合发表多篇专著，获100项以上授权专利。'
                      : 'Dr. Xu Liang received his bachelor\'s degree from Tsinghua University and his Ph.D. from Oxford University. He has led multiple major projects from national to local levels, provided AI solutions for dozens of enterprises, and previously served as the head and chief engineer of Ping An Group\'s Hybrid Augmented Intelligence Department. He has won the "Chinese AI Highest Award" Wu Wenjun Science and Technology Award three times, the PBOC Financial Technology Development Award, published multiple papers in ACL and The Lancet sub-journals, jointly published multiple monographs with international institutions such as CFA, and obtained over 100 authorized patents.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us - Email Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                {isChina ? '联系我们' : 'Contact Us'}
              </h2>
              <p className="text-lg text-slate-600">
                {isChina
                  ? '我们随时准备回答您的问题，听取您的建议，并与您探讨合作机会。'
                  : 'We are ready to answer your questions, hear your suggestions, and explore collaboration opportunities.'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {isChina ? '发送邮件' : 'Send Us an Email'}
                </h3>
                <p className="text-slate-600">
                  {isChina
                    ? '我们通常在 1-2 个工作日内回复邮件'
                    : 'We typically respond to emails within 1-2 business days'}
                </p>
              </div>

              <div className="text-center">
                <a
                  href="mailto:xuyuyao@tsinghua-zj.edu.cn"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  <Mail className="h-5 w-5" />
                  xuyuyao@tsinghua-zj.edu.cn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {isChina ? '合作伙伴' : 'Partners'}
            </h2>
            <p className="text-xl text-slate-600">
              {isChina
                ? '目前提供应用场景、技术支持和参与共创的合作单位如下，期待更多企业、高校和组织加入。'
                : 'The following organizations currently provide application scenarios, technical support, and participate in co-creation. We look forward to more enterprises, universities, and organizations joining us.'}
            </p>
          </div>

          <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-8">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center min-h-[140px]"
              >
                <Image
                  src={partner.logo}
                  alt={isChina ? partner.nameZh : partner.name}
                  width={200}
                  height={200}
                  unoptimized
                  className="object-contain w-full h-auto max-h-[100px]"
                />
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-3xl text-center mt-12">
            <p className="text-slate-600">
              {isChina
                ? '我们欢迎更多企业、高校和组织加入。欢迎联系我们进行合作。'
                : 'We welcome more enterprises, universities, and organizations to join us. Please contact us for cooperation.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
