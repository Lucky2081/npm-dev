'use client';

import { FileText, AlertTriangle, Scale, Users, Gavel } from 'lucide-react';
import { useLocale } from 'next-intl';


export default function TermsOfServicePage() {
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
              <FileText className="h-10 w-10 text-blue-400" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              {isChina ? '服务条款' : 'Terms of Service'}
            </h1>
            <p className="text-lg leading-relaxed text-slate-400">
              {isChina
                ? '欢迎使用 RWAI Arena。使用我们的服务即表示您同意以下条款和条件。'
                : 'Welcome to RWAI Arena. By using our services, you agree to the following terms and conditions.'}
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
            <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-amber-900 font-medium">
                {isChina
                  ? '请仔细阅读以下条款和条件。使用 RWAI Arena 项目的任何服务即表示您同意这些条款。如果您不同意这些条款，请不要使用我们的服务。'
                  : 'Please read the following terms and conditions carefully. By using any services of the RWAI Arena project, you agree to these terms. If you do not agree to any part of these terms, please do not use our services.'}
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Gavel className="h-8 w-8 text-blue-600" />
                <span>{isChina ? '1. 条款接受' : '1. Acceptance of Terms'}</span>
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina
                  ? '通过访问或使用 RWAI Arena 项目，您同意受这些服务条款的约束。如果您不同意这些条款的任何部分，请不要访问或使用我们的服务。本项目是由浙江清华长三角研究院人工智能创新研究中心运营的开源项目，旨在分享真实场景AI落地的最佳实践案例。'
                  : 'By accessing or using the RWAI Arena project, you agree to be bound by these Terms of Service. If you do not agree to any part of these terms, please do not access or use our services. This project is an open-source project operated by Yangtze Delta Region Institute of Tsinghua University, Artificial Intelligence Innovation Research Center (THU-ZJAI), aimed at sharing best practice cases for AI implementation in real-world scenarios.'}
              </p>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                <span>{isChina ? '2. 条款变更' : '2. Changes to Terms'}</span>
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina
                  ? '我们保留随时修改这些条款的权利。修改后的条款将在本页面发布。重大变更将通过电子邮件或其他方式通知您。继续使用我们的服务即表示您接受修改后的条款。'
                  : 'We reserve the right to modify these terms at any time. Modified terms will be posted on this page. We will notify you of significant changes by email or other means. Continued use of our services after changes indicates acceptance of the modified terms.'}
              </p>
            </div>

            {/* Service Description */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                <span>{isChina ? '3. 服务描述' : '3. Service Description'}</span>
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina ? 'RWAI Arena 是一个开源项目，提供以下服务：' : 'RWAI Arena is an open-source project that provides the following services:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>{isChina ? 'AI最佳实践案例展示和分享' : 'Showcasing and sharing AI best practice cases'}</li>
                <li>{isChina ? '开源代码、文档和相关资源的索引' : 'Indexing open-source code, documentation, and related resources'}</li>
                <li>{isChina ? '技术方案和实施经验的交流平台' : 'Platform for exchanging technical solutions and implementation experiences'}</li>
                <li>{isChina ? '相关技术讨论和社区交流' : 'Related technical discussions and community exchanges'}</li>
              </ul>
              <p className="text-slate-700 mt-4">
                {isChina ? '我们保留随时修改、暂停或终止全部或部分服务的权利，恕不另行通知。' : 'We reserve the right to modify, suspend, or terminate all or any part of the services at any time without prior notice.'}
              </p>
            </div>

            {/* User Responsibilities */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <span>{isChina ? '4. 用户责任' : '4. User Responsibilities'}</span>
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina ? '作为本项目的用户，您同意：' : 'As a user of this project, you agree to:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>{isChina ? '仅将服务用于合法目的，不得用于任何非法或未经授权的目的' : 'Use the services only for lawful purposes and not for any illegal or unauthorized purposes'}</li>
                <li>{isChina ? '不干扰或破坏服务的运行或连接到服务的服务器或网络' : 'Not interfere with or disrupt the services or servers or networks connected to the services'}</li>
                <li>{isChina ? '不传播病毒、恶意代码或任何可能损害服务或他人计算机的破坏性代码' : 'Not transmit viruses, malicious code, or any destructive code that could harm the services or others computers'}</li>
                <li>{isChina ? '不尝试未经授权访问服务的任何部分、其他账户、计算机系统或网络' : 'Not attempt to gain unauthorized access to any part of the services, other accounts, computer systems, or networks connected to the services'}</li>
                <li>{isChina ? '遵守所有适用的法律法规' : 'Comply with all applicable laws and regulations'}</li>
              </ul>

              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-900">
                  <strong>{isChina ? '违反责任的用户：' : 'User Violating Responsibilities:'} </strong>
                  {isChina
                    ? '如果您违反这些责任，我们保留暂停或终止您访问服务的权利，并采取适当的法律行动。'
                    : 'If you violate these responsibilities, we reserve the right to suspend or terminate your access to the services and take appropriate legal action.'}
                </p>
              </div>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Scale className="h-8 w-8 text-blue-600" />
                <span>{isChina ? '5. 知识产权' : '5. Intellectual Property'}</span>
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina
                  ? '项目中的所有内容、功能和设计，包括但不限于文本、图形、徽标、图像、软件和代码，均受版权、商标和其他知识产权法律的保护。'
                  : 'All content, features, and design in the project are protected by copyright, trademark, and other intellectual property laws.'}
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    {isChina ? '5.1 开源许可' : '5.1 Open Source License'}
                  </h3>
                  <p className="text-slate-700">
                    {isChina ? '本项目遵循开源许可协议发布。您可以在许可协议允许的范围内使用、修改和分发代码。具体许可条款请参考：' : 'This project is released under an open-source license. You may use, modify, and distribute the code within the scope of the license. For specific license terms, please refer to:'}
                  </p>
                  <a
                    href="https://github.com/THU-ZJAI/Real-World-AI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    https://github.com/THU-ZJAI/Real-World-AI
                  </a>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    {isChina ? '5.2 使用限制' : '5.2 Usage Restrictions'}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700">
                    <li>{isChina ? '不得移除或更改任何版权、商标或其他专有权利声明' : 'Do not remove or alter any copyright, trademark, or other proprietary rights notices'}</li>
                    <li>{isChina ? '不得将内容用于商业目的（除非获得明确授权）' : 'Do not use content for commercial purposes (unless explicitly authorized)'}</li>
                    <li>{isChina ? '不得声称内容是您自己的或伪造与我们的任何关联' : 'Do not claim content as your own or fake any affiliation with us'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    {isChina ? '5.3 用户贡献' : '5.3 User Contributions'}
                  </h3>
                  <p className="text-slate-700">
                    {isChina ? '如果您向项目提交内容（如代码、文档、建议等），您确认：' : 'If you submit content to the project (such as code, documentation, suggestions, etc.), you confirm that:'}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700">
                    <li>{isChina ? '您拥有提交内容的所有权利，或有权授权我们使用' : 'You own all rights to the submitted content or have the right to authorize us to use it'}</li>
                    <li>{isChina ? '内容不侵犯任何第三方的知识产权' : 'The content does not infringe any third-party intellectual property rights'}</li>
                    <li>{isChina ? '您授予我们使用、修改、展示和分发内容的非独占、免版税许可' : 'You grant us a non-exclusive, royalty-free license to use, modify, display, and distribute the content'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Disclaimer of Warranties */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-blue-600" />
                <span>{isChina ? '6. 免责声明' : '6. Disclaimer of Warranties'}</span>
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina
                  ? '服务按"现状"和"可用"基础提供，不提供任何形式的明示或暗示保证。我们明确声明不承担以下保证：'
                  : 'The services are provided on an "as is" and "as available" basis, without any express or implied warranties. We explicitly disclaim the following warranties:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>{isChina ? '服务将不间断、及时、安全或无错误' : 'That the services will be uninterrupted, timely, secure, or error-free'}</li>
                <li>{isChina ? '服务或服务器无病毒或其他有害组件' : 'That the services or servers are free of viruses or other harmful components'}</li>
                <li>{isChina ? '使用结果将满足您的要求或期望' : 'That the results of using the services will meet your requirements or expectations'}</li>
                <li>{isChina ? '信息的准确性、可靠性或完整性' : 'The accuracy, reliability, or completeness of any information'}</li>
              </ul>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-700">
                  <strong>{isChina ? '重要提示：' : 'Important Notice:'} </strong>
                  {isChina
                    ? '本项目分享的AI最佳实践案例仅供参考和技术交流。生产环境使用前，您应该自行评估和测试。我们不对因使用或依赖这些案例而产生的任何损失或损害承担责任。'
                    : 'The AI best practice cases shared by this project are for reference and technical exchange only. You should evaluate and test them yourself before using in production. We are not liable for any loss or damage resulting from using or relying on these cases.'}
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                <span>{isChina ? '7. 责任限制' : '7. Limitation of Liability'}</span>
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina
                  ? '在法律允许的最大范围内，我们不对以下情况承担责任：直接、间接、附带、特殊、后果性或惩罚性损害；利润损失、数据丢失、商誉损失或其他无形损失；服务中断或错误导致的任何损害；用户行为或内容导致的任何损害。'
                  : 'To the maximum extent permitted by law, we are not liable for: direct, indirect, incidental, special, consequential, or punitive damages; loss of profit, data loss, loss of goodwill, or other intangible losses; any damages resulting from service interruptions or errors; any damages resulting from user actions or content.'}
              </p>
              <p className="text-slate-700">
                {isChina ? '无论是否被告知损害可能性，上述限制均适用。' : 'The above limitations apply even if we have been advised of the possibility of such damages.'}
              </p>
            </div>

            {/* Indemnification */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                <span>{isChina ? '8. 赔偿' : '8. Indemnification'}</span>
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina
                  ? '您同意赔偿并使我们要害方免受因以下原因产生的任何索赔、损失、责任、成本和费用（包括合理的律师费）：您的使用或滥用服务；您违反这些条款；您侵犯任何第三方的权利；您提交的任何内容导致的索赔。'
                  : 'You agree to indemnify and hold harmless us from any claims, losses, liabilities, costs, and expenses (including reasonable attorneys\' fees) arising from: your use or misuse of the services; your violation of these terms; your infringement of any third party rights; any claims resulting from any content you submit.'}
              </p>
            </div>

            {/* Termination */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                <span>{isChina ? '9. 终止' : '9. Termination'}</span>
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina
                  ? '我们保留因以下原因暂停或终止您访问服务的权利，恕不另行通知：违反这些条款的任何规定；从事欺诈或非法活动；对其他用户或我们造成损害或风险；其他我们认为适当的情况。终止后，您访问服务的权利将立即停止，我们不承担任何责任。'
                  : 'We reserve the right to suspend or terminate your access to the services at any time without prior notice for: violation of any provision of these terms; engaging in fraudulent or illegal activities; causing damage or risk to other users or us; other circumstances we deem appropriate. Upon termination, your right to access the services will cease immediately, and we have no obligation to you.'}
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                <span>{isChina ? '10. 适用法律和争议解决' : '10. Governing Law and Dispute Resolution'}</span>
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina
                  ? '这些条款受中华人民共和国法律管辖并按其解释。因这些条款引起的任何争议，双方应首先通过友好协商解决。如果协商不成，任何一方可向项目运营方所在地有管辖权的人民法院提起诉讼。'
                  : 'These terms are governed by and construed in accordance with the laws of the People\'s Republic of China. Any dispute arising from these terms should first be resolved through friendly consultation. If consultation fails, either party may file a lawsuit with a competent people\'s court at the location of the project operator.'}
              </p>
            </div>

            {/* Severability */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                <span>{isChina ? '11. 可分割性' : '11. Severability'}</span>
              </h2>
              <p className="text-slate-700">
                {isChina
                  ? '如果这些条款的任何规定被认定为不可执行或无效，该规定将被限制或删除到必要的最小程度，其余条款仍然完全有效。'
                  : 'If any provision of these terms is found to be unenforceable or invalid, that provision will be limited or deleted to the minimum extent necessary and the remaining terms will remain in full force and effect.'}
              </p>
            </div>

            {/* Entire Agreement */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                <span>{isChina ? '12. 完整协议' : '12. Entire Agreement'}</span>
              </h2>
              <p className="text-slate-700">
                {isChina
                  ? '这些条款构成您与我们之间关于使用服务的完整协议，取代任何先前的协议或理解。'
                  : 'These terms constitute the entire agreement between you and us regarding your use of the services, superseding any prior agreements or understandings.'}
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                <span>{isChina ? '13. 联系我们' : '13. Contact Us'}</span>
              </h2>
              <p className="text-slate-700 mb-4">
                {isChina ? '如果您对这些服务条款有任何疑问，请通过以下方式联系我们：' : 'If you have any questions about these Terms of Service, please contact us at:'}
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
          <p className="text-sm text-slate-600 mb-2">
            {isChina ? '感谢您使用 RWAI Arena。' : 'Thank you for using RWAI Arena.'}
          </p>
          <p className="text-sm text-slate-500">
            {isChina
              ? '本条款最后更新于 2025年1月30日，并可能会不时更新。'
              : 'These terms were last updated on January 30, 2025, and may be updated from time to time.'}
          </p>
        </div>
      </section>
    </div>
  );
}
