'use client';

import { Shield, Eye, Mail, Cookie } from 'lucide-react';
import { useLocale } from 'next-intl';


export default function PrivacyPolicyPage() {
  const locale = useLocale();
  const isChina = locale === 'zh';

  const lastUpdated = isChina ? '2025年1月30日' : 'January 30, 2025';

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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600/20 mb-6">
              <Shield className="h-10 w-10 text-blue-400" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              {isChina ? '隐私政策' : 'Privacy Policy'}
            </h1>
            <p className="text-lg leading-relaxed text-slate-400">
              {isChina
                ? '我们重视您的隐私。本政策说明我们如何收集、使用和保护您的信息。'
                : 'We value your privacy. This policy explains how we collect, use, and protect your information.'}
            </p>
            <p className="text-sm text-slate-500 mt-4">
              {isChina ? '最后更新：' : 'Last Updated:'} {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="prose prose-lg max-w-none space-y-12">

            {/* Introduction */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Eye className="h-8 w-8 text-blue-600" />
                {isChina ? '1. 信息收集' : '1. Information We Collect'}
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    {isChina ? '1.1 您主动提供的信息' : '1.1 Information You Provide'}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700">
                    <li>{isChina ? '联系表单：姓名、邮箱地址、主题和消息内容' : 'Contact form: Name, email address, subject, and message content'}</li>
                    <li>{isChina ? '反馈和建议：您通过任何渠道提交的反馈、意见或建议' : 'Feedback and suggestions: Feedback, opinions, or suggestions you submit through any channel'}</li>
                    <li>{isChina ? '社区参与：如果您参与我们的论坛、讨论组或其他社区功能' : 'Community participation: If you participate in our forums, discussion groups, or other community features'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    {isChina ? '1.2 自动收集的信息' : '1.2 Information Automatically Collected'}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700">
                    <li>{isChina ? '使用数据：页面访问记录、点击流数据、浏览器类型和版本、操作系统、设备标识符' : 'Usage data: Page access records, clickstream data, browser type and version, operating system, device identifiers'}</li>
                    <li>{isChina ? '日志数据：服务器日志记录的IP地址、浏览器类型、互联网服务提供商、引用/退出页面和时间戳' : 'Log data: IP address, browser type, internet service provider, referring/exit pages, and timestamps recorded in server logs'}</li>
                    <li>{isChina ? 'Cookie和类似技术：用于记住您的偏好设置、分析网站使用情况' : 'Cookies and similar technologies: Used to remember your preferences and analyze website usage'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Mail className="h-8 w-8 text-blue-600" />
                {isChina ? '2. 信息使用' : '2. How We Use Your Information'}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>{isChina ? '提供、维护和改进我们的服务，包括开发新功能和功能' : 'To provide, maintain, and improve our services, including developing new features and functions'}</li>
                <li>{isChina ? '处理您的请求、交易和咨询' : 'To process your requests, transactions, and inquiries'}</li>
                <li>{isChina ? '发送与您相关的技术通知、更新、安全警报和支持消息' : 'To send technical notices, updates, security alerts, and support messages relevant to you'}</li>
                <li>{isChina ? '响应您的评论、问题、客户服务请求和提供客户支持' : 'To respond to your comments, questions, customer service requests, and provide customer support'}</li>
                <li>{isChina ? '监控和分析使用趋势、优化和改进我们的服务' : 'To monitor and analyze usage trends, optimize and improve our services'}</li>
                <li>{isChina ? '检测、预防和解决技术问题和安全问题' : 'To detect, prevent, and address technical issues and security problems'}</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                {isChina ? '3. 信息共享' : '3. Information Sharing'}
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina ? '我们不会出售、交易或出租您的个人身份信息。我们可能会在以下情况下共享您的信息：' : 'We do not sell, trade, or rent your personal identification information. We may share your information in the following situations:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>{isChina ? '与服务提供商：我们需要第三方公司协助我们运营服务，这些公司只能访问执行任务所需的个人信息' : 'With service providers: We need third-party companies to help us operate our services; these companies can only access personal information necessary to perform tasks'}</li>
                <li>{isChina ? '法律要求：如果我们认为披露信息是合理的，以遵守法律、法规、法院命令或法律程序' : 'Legal requirements: If we believe disclosure is reasonable to comply with laws, regulations, court orders, or legal processes'}</li>
                <li>{isChina ? '网站转让：如果我们参与合并、收购或出售资产，您的信息可能被转让' : 'Website transfer: If we participate in a merger, acquisition, or sale of assets, your information may be transferred'}</li>
                <li>{isChina ? '经您同意：除上述情况外，我们只在获得您同意的情况下共享您的信息' : 'With your consent: Except as described above, we only share your information with your consent'}</li>
              </ul>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                {isChina ? '4. 数据安全' : '4. Data Security'}
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina ? '我们采取合理的技术和组织措施来保护您的个人信息免遭未经授权的访问、使用或披露。但是，没有任何通过互联网传输或存储的方法是100%安全的。' : 'We take reasonable technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission or storage over the Internet is 100% secure.'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>{isChina ? '使用HTTPS加密传输' : 'HTTPS encryption for data transmission'}</li>
                <li>{isChina ? '定期安全审计和漏洞扫描' : 'Regular security audits and vulnerability scanning'}</li>
                <li>{isChina ? '访问控制和身份验证' : 'Access control and identity verification'}</li>
                <li>{isChina ? '数据备份和灾难恢复计划' : 'Data backup and disaster recovery planning'}</li>
              </ul>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Cookie className="h-8 w-8 text-blue-600" />
                {isChina ? '5. Cookie政策' : '5. Cookie Policy'}
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina ? '我们使用Cookie和类似技术来收集信息、记住您的偏好并改善您的体验。您可以配置浏览器以拒绝所有Cookie，但这可能会影响网站的某些功能。' : 'We use cookies and similar technologies to collect information, remember your preferences, and improve your experience. You can configure your browser to refuse all cookies, but this may affect certain functions of the website.'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>{isChina ? '必要Cookie：网站正常运行所必需的Cookie' : 'Essential cookies: Cookies necessary for the proper functioning of the website'}</li>
                <li>{isChina ? '分析Cookie：帮助我们了解网站如何被使用' : 'Analytics cookies: Help us understand how the website is being used'}</li>
                <li>{isChina ? '偏好Cookie：记住您的设置和偏好' : 'Preference cookies: Remember your settings and preferences'}</li>
              </ul>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                {isChina ? '6. 您的权利' : '6. Your Rights'}
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina ? '您对自己的个人信息享有以下权利：' : 'You have the following rights regarding your personal information:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>{isChina ? '访问权：您可以要求查看我们持有的您的个人信息的副本' : 'Right to access: You may request a copy of the personal information we hold about you'}</li>
                <li>{isChina ? '更正权：您可以要求更正不准确或不完整的信息' : 'Right to rectification: You may request correction of inaccurate or incomplete information'}</li>
                <li>{isChina ? '删除权：您可以要求删除您的个人信息' : 'Right to erasure: You may request deletion of your personal information'}</li>
                <li>{isChina ? '反对处理权：您可以反对我们处理您的个人信息' : 'Right to object: You may object to our processing of your personal information'}</li>
                <li>{isChina ? '数据可携权：您可以要求以结构化、机器可读的格式接收您的信息' : 'Right to data portability: You may request to receive your information in a structured, machine-readable format'}</li>
              </ul>
              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-2">
                  <strong>{isChina ? '如何行使这些权利：' : 'How to exercise these rights:'} </strong>
                </p>
                <p className="text-slate-700">
                  {isChina ? '请通过以下方式联系我们：' : 'Please contact us at:'}{' '}
                  <a href="mailto:xuyuyao@tsinghua-zj.edu.cn" className="text-blue-600 hover:text-blue-700 font-medium">
                    xuyuyao@tsinghua-zj.edu.cn
                  </a>
                </p>
              </div>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                {isChina ? '7. 儿童隐私' : '7. Children\'s Privacy'}
              </h2>
              <p className="text-slate-700">
                {isChina ? '我们的服务不面向16岁以下的儿童。我们不会故意收集16岁以下儿童的个人信息。如果您是父母或监护人，并且您知道您的孩子向我们提供了个人信息，请联系我们。' : 'Our services are not intended for children under 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.'}
              </p>
            </div>

            {/* Changes to This Policy */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                {isChina ? '8. 政策变更' : '8. Changes to This Policy'}
              </h2>
              <p className="text-slate-700">
                {isChina ? '我们可能会不时更新本隐私政策。变更后，我们会在本页面上发布新的政策，并更新"最后更新"日期。重大变更将通过电子邮件或其他方式通知您。继续使用我们的服务即表示您接受更新后的政策。' : 'We may update this privacy policy from time to time. After changes, we will post the new policy on this page and update the "Last Updated" date. We will notify you of significant changes by email or other means. Continued use of our services indicates acceptance of the updated policy.'}
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                {isChina ? '9. 联系我们' : '9. Contact Us'}
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina ? '如果您对本隐私政策有任何疑问、意见或建议，或希望行使您的权利，请通过以下方式联系我们：' : 'If you have any questions, comments, or suggestions about this privacy policy, or wish to exercise your rights, please contact us at:'}
              </p>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <p className="text-slate-700 mb-2">
                  <strong>{isChina ? '电子邮件：' : 'Email:'} </strong>
                  <a href="mailto:xuyuyao@tsinghua-zj.edu.cn" className="text-blue-600 hover:text-blue-700 font-medium ml-2">
                    xuyuyao@tsinghua-zj.edu.cn
                  </a>
                </p>
                <p className="text-slate-700 mb-2">
                  <strong>{isChina ? '项目名称：' : 'Project:'} </strong>
                  <span className="ml-2">RWAI Arena (Real-World AI Arena)</span>
                </p>
                <p className="text-slate-700 mb-2">
                  <strong>{isChina ? '运营方：' : 'Operator:'} </strong>
                  <span className="ml-2">{isChina ? '浙江清华长三角研究院人工智能创新研究中心（THU-ZJAI）' : 'Yangtze Delta Region Institute of Tsinghua University, Artificial Intelligence Innovation Research Center (THU-ZJAI)'}</span>
                </p>
                <p className="text-slate-700">
                  <strong>{isChina ? '地址：' : 'Address:'} </strong>
                  <span className="ml-2">{isChina ? '浙江省嘉兴市南湖区亚太路705号' : '705 Yatai Road, Nanhu District, Jiaxing City, Zhejiang Province, China'}</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-600">
            {isChina
              ? '本隐私政策适用于 RWAI Arena 项目及其所有相关服务。使用我们的服务即表示您同意本政策的条款。'
              : 'This privacy policy applies to the RWAI Arena project and all related services. By using our services, you agree to the terms of this policy.'}
          </p>
        </div>
      </section>
    </div>
  );
}
