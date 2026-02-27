**P2-SQL语言智能生成(NL2SQL)的通用实践 副本**

1\. **业务亮点**

|                                         |
|:----------------------------------------|
| 快速搭建一个大模型，通过对话生成SQL脚本 |

|                     |
|:--------------------|
| 编号：Case251031X02 |

2\. **基本信息**

<table style="width:89%;">
<colgroup>
<col style="width: 29%" />
<col style="width: 29%" />
<col style="width: 29%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: left;"><p><strong>概况</strong></p>
<p>将用户以自然语言描述的查询需求转换为SQL查询语句。</p>
<p><strong>分类标签</strong></p>
<p>行业类别：信息技术</p>
<p>应用类别：服务</p>
<p>技术类别：大语言模型（LLM），自然语言处理，数据治理，基座大模型，模型评测，NL2SQL，数据库，运维</p>
<p><strong>实施周期</strong></p>
<p>Demo研发：2-4日</p>
<p><strong>团队构成</strong></p>
<p>Demo阶段：业务专家1名、算法专家1名</p></td>
<td style="text-align: left;"><p><strong>业务痛点</strong></p>
<p>传统数据库操作需要专门的运维人员或数据库管理员，对此类人员的SQL语言能力要求较高；而需要特定数据的算法人员，也存在学习SQL语言的成本</p>
<p>传统操作人工审批流程繁琐，效率低</p>
<p>数据流动高、数据量大，为任务带来额外挑战</p>
<p><strong>核心功能</strong></p>
<p>用户指令理解：精准理解用户自然语言表达的SQL语言生成需求</p>
<p>最佳SQL脚本生成：根据用户需求筛选并获取多个候选SQL指令模式、从中整合、检查、排序，返回最优结果</p></td>
<td style="text-align: left;"><p><strong>核心业务指标</strong></p>
<p>生成单次SQL脚本的时间不超过1秒</p>
<p>生成SQL脚本的平均准确率达95%</p>
<p>降低50%人力成本</p>
<p><strong>核心技术指标</strong></p>
<p>与业务指标一致</p></td>
</tr>
</tbody>
</table>

3\. **最佳实践版本**

3.1 **私部署-服务器部署版**

<table style="width:88%;">
<colgroup>
<col style="width: 88%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: left;"><p><strong>入选最佳实践理由</strong></p>
<p>本方案使用NL2SQL任务目前开源SOTA的XiYanSQL-QwenCoder模型系列。该系列最新的32B参数量级模型XiYanSQL-QwenCoder-32B-2504，在与包括但不限于MCS-SQL+GPT-4o的10+现有NL2SQL任务头部方法的对比中，在经典评测集BIRD上取得执行准确率(Execution Accuracy，EX-score) 75.63%的SOTA结果、在经典测评集Spider Test上取得EX值89.65%的SOTA结果。本方案给出快速基于该模型搭建的步骤，并给出了基于评测集BIRD进行复现与跑测的过程，确保方案完整可复现。</p>
<p>——实践者</p></td>
</tr>
</tbody>
</table>

<table style="width:88%;">
<colgroup>
<col style="width: 88%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: left;"><p><strong>版本基本信息</strong></p>
<p>实践者信息</p>
<p>称呼：Real-World AI转载及验证</p>
<p>原作者信息</p>
<p>中文名称：阿里云团队</p>
<p>英文名称：Alibaba Cloud XGenerationLab</p>
<p>作者网站：https://cn.aliyun.com/product/bailian/xiyan</p>
<p>关联引用</p>
<p>XiYan-SQL(by 阿里) Github：https://github.com/XGenerationLab/XiYan-SQL</p>
<p>XiYanSQL-QwenCoder(by 阿里) GitHub：https://github.com/XGenerationLab/XiYanSQL-QwenCoder</p>
<p>版本状态</p>
<p>首发日期：2025-03-xx</p>
<p>最近更新：2025-10-31</p>
<p>最近审阅：2025-11-09</p></td>
</tr>
</tbody>
</table>

<table style="width:88%;">
<colgroup>
<col style="width: 88%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: left;"><p><strong>实施详情</strong></p>
<p><a href="https://gvxnc4ekbvn.feishu.cn/wiki/MwQwwdPv6iLNX0kRgS9c2eW0ndf?from=from_copylink">实践详情</a></p></td>
</tr>
</tbody>
</table>
