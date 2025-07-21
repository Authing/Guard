import { Space, Tabs } from 'shim-antd'
import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'
import { useGuardView } from '../..'
import { GuardButton } from '../../GuardButton'
import { useGuardInitData } from '../../_utils/context'
import { i18n } from '../../_utils/locales'
import { EyGuardProtocolInitData } from '../interface'
const { useCallback, useRef, useState } = React
enum ProtocolType {
  POLICY = 'policy',
  PRIVACY = 'privacy',
  COOKIES = 'cookies'
}

export const EyGuardProtocolView = () => {
  useGuardView()

  const { t } = useTranslation()

  const [scene, setScene] = useState<ProtocolType>(ProtocolType.POLICY)

  const initData = useGuardInitData<EyGuardProtocolInitData>()

  const clientWidth = document.documentElement.clientWidth
  const clientHieght = document.documentElement.clientHeight

  const protocolRef = useRef<any>(null)

  const renderProtocol = useCallback(() => {
    const cnProtocol = {
      [ProtocolType.PRIVACY]: (
        <section className="protocol" ref={protocolRef}>
          <div className="sub_text">版本：1.1</div>
          <div className="sub_text">
            尊敬的用户：
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            为了更好地在您使用“安永中国客户中心”服务过程中保障您的个人信息权益，我们对《安永中国客户中心隐私政策》进行了调整，主要更新内容包括：
            <br />
            1、对安永中国客户中心所收集数据的存储期限进行补充说明
            <div className="sub_right">
              隐私政策更新日期：<span>2025/07/10</span>
            </div>
            <div className="sub_right">
              隐私政策生效日期：<span>2025/07/25</span>
            </div>
          </div>
          <h5>提示条款</h5>
          <div className="sub_text">
            必须阅读并同意此隐私声明，才能访问安永中国客户中心
          </div>

          <h5>隐私声明–安永中国客户中心</h5>
          <div className="sub_text">
            <em>安永华明会计师事务所（特殊普通合伙）</em> (以下简称
            <em>“安永”</em>
            ）非常重视用户的隐私和个人信息保护。您在使用我们的服务时，我们可能会收集和使用您的相关信息。
          </div>
          <div className="sub_text">
            本《隐私声明》旨在向您说明：我们会收集您的哪些个人信息，如何处理这些个人信息，以及我们为您提供的行使您的权利的方式。我们也希望本声明可以帮助您决定是否向我们提供您的个人信息。
          </div>
          <h5>我们收集哪些个人信息</h5>
          <div className="sub_text">
            为了完成安永中国客户中心（“系统”）授权用户注册，您向安永提供或允许安永收集必需的个人信息如下（敬请知悉，没有这些信息安永将无法为您完成用户注册流程）：
            <ul>
              <li>姓名</li>
              <li>电子邮箱</li>
              <li>手机号码（选填）</li>
            </ul>
            共计 3 类个人信息
          </div>
          <div className="sub_text">个人信息的处理目的、处理方式及保存期限</div>

          <h5>安永出于以下目的及方式处理您的个人信息：</h5>
          <div className="table">
            <div className="table-row_privacy table-header">
              <div className="table-cell">具体场景</div>
              <div className="table-cell">处理目的</div>
              <div className="table-cell">处理方式</div>
              <div className="table-cell">个人信息种类</div>
            </div>
            <div
              style={{
                height: 16
              }}
            ></div>
            <div className="table-container">
              <div className="table-row_privacy">
                <div className="table-cell">授权用户注册</div>
                <div className="table-cell">用户身份识别</div>
                <div className="table-cell">
                  通过您的电子邮箱或手机号码向您发送授权用户身份认证验证信息
                </div>
                <div className="table-cell">
                  姓名、电子邮箱、手机号码（选填）
                </div>
              </div>
            </div>
          </div>
          <h5>个人信息保存期限：</h5>
          <div className="sub_text">
            安永将按照所提供服务的性质需要保存您的个人信息。在保存期限结束时，您的个人信息将被删除。但是，在服务终止后，安永将根据适用的法律、专业标准以及内部档案要求保留与个人信息相关的必要文件。
          </div>
          <div className="sub_text">
            若您长期未登录，在满12个月时系统将会向您发送提醒；当未登录时长达到13个月，系统将对您的账号实行禁用的操作；当未登录时长达到14个月时，系统将会对您的账号实施物理删除操作。
          </div>
          {/* <div className="sub_text">
            <ul>
              <li>
                安永将通过您的电子邮箱或手机号码向您发送授权用户身份认证验证信息，以便您可以进一步完成授权用户注册并登录系统。
              </li>
              <li>
                个人信息将会保留 36
                个月，法律法规或依据行业性要求另行规定的除外。
              </li>
            </ul>
          </div>

          <div className="sub_text">
            安永将按照所提供服务的性质需要保存您的个人信息。在保存期限结束时，您的个人信息将被删除。但是，在服务终止后，安永将根据适用的法律、专业标准以及内部档案要求保留与个人信息相关的必要文件。
          </div> */}
          <h5>明确同意向其他数据处理者提供个人信息</h5>
          <div className="sub_text">
            安永将需要向中国境内云服务供应商（阿里云计算有限公司）提供您的个人信息邮箱或手机号码，用于通过系统向您发送身份认证验证信息。
          </div>
          <div className="sub_text">
            云服务供应商（阿里云计算有限公司）隐私政策请参加如下网址：
          </div>
          <div className="sub_text">
            <a
              href="https://terms.aliyun.com/legal-agreement/terms/suit_bu1_ali_cloud/suit_bu1_ali_cloud202107091605_49213.html"
              target="_blank"
              rel="noreferrer"
            >
              阿里云法律声明及隐私权政策 (aliyun.com)
            </a>
          </div>
          <div className="sub_text">
            您确认并同意安永按照本条所述向上述数据处理者提供个人信息。
          </div>
          <h5>您的权利</h5>
          <div className="sub_text">
            除法律法规规定的例外情况，您可以联系安永联系人
            EYChinaClientCenter@cn.ey.com
            向安永提出对您的个人信息行使查阅、复制、转移、更正、补充、删除及处理规则解释说明等权利。
          </div>
          <h5>信息安全</h5>
          <div className="sub_text">
            我们高度重视并承诺保护您的个人信息。我们会采取符合业界标准、合理可行的安全防护措施来保护您的个人信息以防止您的个人信息在未经授权的情况下被修改、被访问、被披露、被使用或被删除。
            <br />
            如果发生信息安全事件，我们会按照法律法规的要求，采取合适、必要的处置措施。
          </div>
        </section>
      ),
      [ProtocolType.POLICY]: (
        <section className="protocol" ref={protocolRef}>
          <div className="sub_text">
            日期：2023 年 10 月 9 日 <br />
            版本：1.0
          </div>
          <h5>1. 引言</h5>
          <div className="sub_text">
            1.1
            这些使用条款（下称“本使用条款”）适用于以下方面：安永中国客户中心网站（网址：login.ey.com.cn）及其子域（以下统称为“网站”）；通过网站使用、访问、验证或交付的、和/或构成本文页面顶端的在线服务的一部分或通过在线服务使用或访问的（通过网站、应用程序接口（API）或其他软件界面交付的）所有应用程序和功能，包括但不限于服务与托管软件；以及通过网站或该在线服务提供的所有内容（包括但不限于文本、数据、视频、录音、图像和照片）（本段中的所有内容统称为“应用程序”，包括通过其他应用程序提供的所有应用序）。
          </div>
          <div className="sub_text">
            1.2
            本使用条款仅适用于应用程序，不适用于可从安永成员所获取的任何专业服务或其他服务，包括但不限于任何报告、建议或其他可交付成果（统称为“其他服务”）。
          </div>
          <div className="sub_text">
            1.3
            如果您访问与任何其他服务相关的应用程序，或与安永成员所就提供应用程序或其他服务签订单独合同（下称“项目协议”），则：
            <div className="tertiary_text">
              a.
              与您签订项目协议或向您提供其他服务的安永成员所还向您提供应用程序，授予您对应用程序的访问权限，并全权负责与向您提供应用程序相关的事宜；
            </div>
            <div className="tertiary_text">
              b.
              您对与应用程序相关的任何事项的追索权应仅限于对上述安永成员所的索赔，您对任何其他安永成员所（包括安永）的应用程序没有追索权，并且不得对其提起索赔或诉讼；及
            </div>
            <div className="tertiary_text">
              c.
              如在条款上存在任何冲突，则您与安永成员所之间订立的项目协议的条款和条件，应优先于该安永成员所针对该应用程序制定的使用条款。；
            </div>
          </div>
          <div className="sub_text">
            1.4 如果您需访问与第 1.3
            节规定的项目协议或任何其他服务无关的应用程序，则：
            <div className="tertiary_text">
              a.
              安永华明会计师事务所（特殊普通合伙）（下称“安永”）（公司地址：北京市东城区东长安街
              1 号东方广场安 永大楼 17 层 01-12
              室）向您提供该应用程序，向您授予对该应用程序的访问权限，并全权负责与向您提供应用程序相关的事宜；及
            </div>
            <div className="tertiary_text">
              b.
              您对与该应用程序相关的任何事项的追索权应仅限于对安永的索赔，您对任何其他安永成员所的应用程序没有追索权，并且不得对其提起索赔或诉讼。
            </div>
          </div>
          <div className="sub_text">
            1.5
            针对应用程序专门提出的附加条款（如有）（下称“附加条款”），均应适用于应用程序。如在条款上出现任何冲突，则针对特定应用程序的额外条款应优先于针对该项目的通用条款。您提出的采购订单条款或其他标准条款均不适用于应用程序。
          </div>
          <div className="sub_text">
            1.6
            本使用条款构成您与安永之间具有法律约束力的合同。如果您以个人身份访问或使用本应用程序，您需要以个人身份签订这份具有法律约束力的协议。如果您代表公司、合伙企业或其他法律实体（以下统称“组织”）等组织访问或使用本应用程序，则您需要代表组织签订该具有法律约束力的协议，且您应表示您有权代表组织就本使用条款与安永达成一致。本使用条款中提到的“您”和“您的”均指此组织。
          </div>
          <div className="sub_text">
            1.7
            每个安永成员所在全球安永成员所网络中都是独立的法律实体。“安永成员所是指：（i）
            EY Global Services Limited 以及由 Ernst & Young Global Limited、EYGN
            Limited、EYGM Limited、EYGS LLP、EYGI B.V.、EY Global Finance, Inc
            及其成员机构组成的实体网络；（ii）
            由任何该等实体控制的、与任何该等实体处于共同控制下的或控制该等实体的任何实体，或作为该实体的成员所或子公司、或其直接或间接拥有多数股权或控制的子公司的任何公司、合伙企业或其他商业机构；（ii）与安永网络成员以及任何该等实体的合伙人、董事、员工或代理人在共同品牌协议下运营的任何实体。在本定义中，“控制”是指（a）直接或间接拥有权益性证券，使该实体有权行使其至少
            50%的投票权；或（b）指通过持股、合同或其他方式，直接或间接拥有指导或引导相关实体管理和政策的权力。
          </div>
          <div className="sub_text">
            1.8
            请仔细阅读本使用条款。如您访问应用程序，即表示您已经阅读、了解并同意本使用条款。如果您不同意本使用条款或其任何部分，您将无法使用应用程序。在本使用条款中，“包括”一词应理解为“包括但不限于”，任何提及单数的地方都包括复数，反之亦然。
          </div>
          <div className="sub_text">
            1.9
            适用的隐私声明对安永收集的关于应用程序用户的信息以及安永如何使用这些信息进行了解释。
          </div>
          <h5>2. 安全和登录凭证</h5>

          <div className="sub_text">
            2.1
            在适用于应用程序的安全保护流程中，安永可能会分配给您或邀请您创建用户名、密码、身份验证码、令牌或其他标识符（下称“登录凭证”）。您应做到以下方面：
            <div className="tertiary_text">
              a. 将您的登录凭证保密，不向任何其他人透露；
            </div>
            <div className="tertiary_text">
              b. 不让组织的任何其他人员或任何第三方使用登录凭证访问应用程序；
            </div>
            <div className="tertiary_text">
              c.
              使用适当的安全保护程序来确保您登录凭证的安全，防止对应用程序的未授权访问或未授权使用；以及
            </div>
            <div className="tertiary_text">
              d.
              如果您知悉或有合理理由怀疑您的登录凭证丢失、被盗或泄露给任何第三方，或存在对您登录凭证的未授权使用的情况，或任何其他与您账户或应用程序相关的违反安全保护程序的行为，请立即通知安永。
            </div>
          </div>

          <div className="sub_text">
            2.2
            您对任何人使用您的登录凭证对应用程序的任何和所有使用、未授权使用和/或误用承担全部责任。
          </div>
          <div className="sub_text">
            2.3
            您需承认，互联网环境是不安全的，信息在传输过程中可能会被第三方看到。您需了解，安永对互联网上或通过互联网传输的信息的安全性不承担任何责任。
          </div>
          <h5>3. 知识产权和应用程序的使用</h5>
          <div className="sub_text">
            3.1 您需承认，应用程序中的所有知识产权均归安永成员所及其许可方所有。
          </div>
          <div className="sub_text">
            3.2
            在您遵守本使用条款所有条款的前提下，您仅能出于以下目的使用应用程序：
            <div className="tertiary_text">
              a.
              用于仅限您个人和私人目的或内部商业目的（不包括向第三方提供服务的目的，除非安永成员所以书面形式明确授权），或根据本使用条款向您提供应用程序访问权限的人员的内部商业目的（如有）；和/或
            </div>
            <div className="tertiary_text">
              b.
              用于您或相关安永客户，根据项目协议从安永成员所获取服务的目的（下称“许可的商业目的”）。
            </div>
          </div>
          <div className="sub_text">
            3.3 除许可的商业目的外，您不得出于其他任何目的使用或利用应用程序。
          </div>
          <div className="sub_text">
            3.4 您不得：
            <div className="tertiary_text">
              a.
              出于任何欺诈或非法目的使用或访问应用程序或利用应用程序冒充任何人或实体，或编造或以其他方式不实告知您与任何人或实体的关系；
            </div>
            <div className="tertiary_text">
              b. 干扰或破坏应用程序的运行或对应用程序的访问；
            </div>
            <div className="tertiary_text">
              c.
              传输或以其他方式提供与应用程序相关或与对应用程序的访问相关的任何病毒、蠕虫、特洛伊木马、定时炸弹、间谍软件或有危害性或侵害性的或可能或旨在破坏或操纵任何硬件、软件或设备的运行或旨在监控任何硬件、软件或设备的使用的其他计算机代码、文件或程序；
            </div>
            <div className="tertiary_text">
              d. 限制或阻止任何其他用户访问或使用应用程序的能力；
            </div>
            <div className="tertiary_text">
              e.
              修改、改编、翻译或创作应用程序的任何部分的衍生作品，或使用应用程序设计或开发具有与应用程序类似的功能的任何服务；
            </div>
            <div className="tertiary_text">
              f. 删除、遮挡或修改应用程序的任何版权、商标或其他所有权声明；
            </div>
            <div className="tertiary_text">
              g.
              使用任何机器人、网络爬虫、搜索/检索应用程序或其他手动或自动设备来进行检索、编入索引、“抓取”、“数据挖掘”，或以任何方式从应用程序收集数据或复制应用程序信息或不通过应用程序的导航结构或呈现方式来获取网站信息，但如果出于创建公开可用且可搜索的索引（不包括缓存或存档资料）的目的，则可以使用免费提供的搜索引擎来复制应用程序上的资料。可随时撤销任何搜索引擎相关权利；
            </div>
            <div className="tertiary_text">
              h. 试图规避与应用程序相关的任何安全保护功能或访问控制功能；
            </div>
            <div className="tertiary_text">
              i. 使用应用程序发送未经请求的电子邮件或即时消息，或进行文件共享；
            </div>
            <div className="tertiary_text">
              j.
              对应用程序的任何部分进行反编译或反向工程或以其他方式试图获取源代码，以下情况除外：适用法律允许您在未经同意的情况下仅出于有限的目的进行如此操作；适用法律允许且您保证不向任何其他人披露或传播此类源代码；或
            </div>
            <div className="tertiary_text">
              k. 从任何其他网站架构、链接或深度链接网站或应用程序。
            </div>
          </div>
          <div className="sub_text">
            3.5
            您不得向任何其他人或实体提供对应用程序的访问权限，除非安永成员所以书面形式明确许可您可以如此操作。您应对您提供访问权限的任何其他人或实体的所有作为和疏忽（包括但不限于任何违反本使用条款的行为）负责，如同这些作为或疏忽是您自己造成的一般。您不得有组织地向任何其他人或实体提供通过应用程序获得的任何内容、信息或数据的访问权限。
          </div>
          <div className="sub_text">
            3.6
            您不得也不应让任何第三方直接或间接将应用程序出口、再出口或发布到中华人民共和国或其他法律、法规或条例禁止此类出口、再出口或发布的任何管辖区或国家或任何一方。如果安永有合理理由认为可能会违反任何适用的法律或法规，您可能会被拒绝访问应用程序。
          </div>
          <div className="sub_text">
            3.7
            您应向安永声明并保证，您在注册过程中以及通过应用程序提供的信息是真实、准确和完整的。
          </div>
          <div className="sub_text">3.8 任何第三方均不得依赖应用程序。</div>

          <h5>4. 您的内容</h5>
          <div className="sub_text">
            4.1
            应用程序可方便您在应用程序上或通过应用程序发布、上传或传输信息、内容和/或资料（下称“您的内容”」）。
          </div>
          <div className="sub_text">
            4.2
            安永成员所对“您的内容”的使用将取决于您是否访问与任何其他服务或项目协议相关的应用程序，具体如下：
            <div className="tertiary_text">
              a. 除非您访问与第 b
              节规定的项目协议或其他服务相关的应用程序，否则您在适用法律允许的最大范围内，授予安永成员所出于任何目的（包括但不限于出于安永成员所及其被许可人和受让人从中获得收入的目的）使用、复制、发布、分配、修改和利用“您的内容”的永久、不可撤销、非独家、全额支付、免特许权使用费、全球性、次级授权、可转让的权利，包括但不限于授权第三方行使任何或所有此类权利的权利。安永成员所不得：（i）未经您的许可，以可以识别您身份的方式发布“您的内容”；或（ii）在处理您的个人数据时违反适用的隐私声明。
            </div>
            <div className="tertiary_text">
              b.
              如果您访问与任何其他服务或项目协议相关的应用程序，则安永成员所可能会按照项目协议中规定使用
              “您的内容”，以及使用“您的内容”向您提供应用程序和相关服务、遵守监管要求并检查冲突、用于风险管理和会计，以及用于提供内部行政支持。
            </div>
            在任何情况下，安永成员所均可以收集和使用技术使用数据，包括有关您的系统、软件以及对任何应用程序的使用情况的信息，以监控、维护和改进应用程序。
          </div>
          <div className="sub_text">
            4.3
            您保证，您已获得所有必要权利、许可及权限，且您拥有授予第节中所规定许可的充分授权。
          </div>
          <div className="sub_text">
            4.4
            根据任何适用法律和在任何管辖区内，您不得通过应用程序上传、发布、以其他方式传播或提供对具有非法、损害、威胁、辱骂、骚扰、侵权、诽谤、粗俗、淫秽、侵犯他人隐私、仇恨性质的内容或发表种族、民族或其他方面的反对言论的访问。
          </div>
          <div className="sub_text">
            4.5
            如果安永成员所认为您的内容可能侵犯任何人的知识产权或其他权利，或不符合第节的规定，则可以在不通知您的情况下，删除、禁用或编辑您的内容。
          </div>
          <div className="sub_text">
            4.6 安永成员所可使用您提供的任何反馈来提升其服务。
          </div>
          <h5>5. 第三方网站和内容</h5>
          <div className="sub_text">
            5.1
            应用程序可能不时包含第三方网站或服务的链接或访问入口。包含此类链接和访问入口的目的仅是为您提供便利，并不意味着任何安永成员所对此类第三方网站或服务表示认可。安永成员所不会审查此类第三方网站或服务。因此，您承认并同意，在访问任何此类网站或服务时，您将完全自担风险。
          </div>
          <div className="sub_text">
            5.2
            如果应用程序允许用户提交问题、评论、建议等供应用程序其他用户使用的内容，安永成员所对提交的任何内容或内容准确性、其中可能表达的任何建议或意见，以及任何内容的适用性或适用程度不负有任何责任。
          </div>
          <div className="sub_text">
            5.3
            安永成员所对从第三方获得的和通过应用程序提供的任何数据的准确性或完整性不承担任何责任。
          </div>
          <div className="strong_text">
            <h5>6. 责任</h5>
            <div className="sub_text">
              6.1
              本使用条款中的任何内容均无意免除或限制适用法律规定的任何责任，或不可免除或限制适用的专业法规。
            </div>
            <div className="sub_text">
              6.2
              除任何附加条款另有规定外，任何免费提供的应用程序：（a）均以“现状”和“可用”为基础提供；（b）仅供参考使用；（c）不构成安永成员所的专业建议或服务；以及（d）您不应对此产生依赖。使用此类免费应用程序的风险完全由您自行承担。
            </div>
            <div className="sub_text">
              6.3 您有责任确保应用程序适合您的预期用途。
            </div>
            <div className="sub_text">
              6.4
              安永成员所不担保、保障或保证对应用程序的访问不会中断、不出错或与您的硬件或软件兼容，也不保证应用程序或提供应用程序的服务器没有病毒或其他有害成分。您有责任实施适当的流程、系统和程序，以保护您和您的组织免受此类问题的影响。
            </div>
            <div className="sub_text">
              6.5
              除本使用条款和任何附加条款中明确规定外，应在法律允许的最大范围内，免除所有法规、交易习惯或其他方面的明示或暗示的保证（包括但不限于对适销性和对特定目的或用途的适用性的隐含保证）、条款、条件和承诺。
            </div>
            <div className="sub_text">
              6.6
              对于任何安永成员所的任何成员、股东、董事、高级职员、合伙人、负责人或雇员（“安永人员”）的申请，
              您无追索权，也不得提起任何索赔或诉讼。
            </div>
            <div className="sub_text">
              6.7
              对于由应用程序或本使用条款引起的或与此之相关的，或因违反或不履行本使用条款而引起的以下损失，无论损失多么重大，无论是否考虑了此类损失或损害的可能性，安永成员所和安永人员均不根据合约法或侵权法
              （包括但不限于疏忽）、成文法或其他依据对您承担责任：
              <div className="tertiary_text">
                a. 任何间接的、后果性的、偶然的、惩罚性的或特殊的损失或损害；
              </div>
              <div className="tertiary_text">
                b. 任何收入或利润或利润账户的损失；
              </div>
              <div className="tertiary_text">
                c. 数据丢失，或数据、软件或系统无法使用；
              </div>
              <div className="tertiary_text">d. 管理时间的浪费；</div>
              <div className="tertiary_text">e. 商业机会的损失；</div>
              <div className="tertiary_text">f. 预期储蓄的损失；</div>
              <div className="tertiary_text">g. 商誉或声誉受损。</div>
            </div>
            <div className="sub_text">
              6.8
              在不影响本使用条款中的任何责任免除条款的情况下，所有安永成员所和安永人员根据合约法、侵权法（包括但不限于疏忽）、成文法或其他依据，就应用程序、对“您的内容”的处理和本使用条款而引起的或与之相关的
              （包括但不限于任何违反或不履行本使用条款）责任，无论多么重大，在任何日历年内的总责任不应超过以下两者的孰高者：(a)您在该日历年为相关应用程序支付的费用；或
              (b) 1000 人民币（或等值的当地货币）。
            </div>
            <div className="sub_text">
              6.9
              安永成员所不通过此应用程序提供法律服务，此应用程序亦不构成或包含法律意见；您不得将通过该应用程序向您提供的任何信息视为法律意见或替代法律意见。您对应用程序的使用不会在您和安永之间建立任何律师-客户关系，并且您全权负责决定是否向有资历的律师寻求法律建议。
            </div>
            <div className="sub_text">
              6.10
              安永成员所不保证与应用程序有关的流程足以维护您（无论您的角色是客户、专业人士、律师或其他）或任何第三方应当享有或有义务履行的任何会计师-客户关系、律师-客户关系、工作成果或任何其他适用的特权或保护，或者其他适用于您所提交的问题和信息特权或保护。对于确定您对应用程序的使用是否有可能以任何方式被认为对任何适用特权或保护的放弃或损害，您应当全权负责。
            </div>
          </div>
          <h5>7. 提供服务</h5>
          <div className="sub_text">
            7.1
            未经安永成员所事先书面同意，您不得自行决定使用应用程序向第三方提供服务。如果您使用应用程序向第三方提供服务，并且在任何时候都可以合理地预期应付给安永的与任何第三方事项相关的费用将超过
            100,000
            人民币，则您同意向安永提供书面通知。安永可能要求您确定适用的客户、事项以及评估安永、您和您客户之间适当关系所需的任何其他信息。在某些情况下，安永成员所可能会要求，除了您与客户的合同安排外，该客户与安永就此类服务建立直接合同关系。
          </div>
          <div className="sub_text">
            7.2
            如果您使用此应用程序来帮助您为客户制定建议，您将对向客户提供的任何和所有建议全权负责。您不得直接或间接将任何此类建议或此类建议的任何特定部分归因于任何安永成员所。此类客户不得被视为本使用条款的第三方受益人。
          </div>
          <div className="sub_text">
            7.3
            如果您对应用程序的使用与您向安永成员所的客户提供服务有关：（a）您保证并声明，您对应用程序的访问已得到该客户的授权，并且您将仅在该客户授权的情况下为其利益而使用该应用程序；以及（b）您同意仅将该应用程序用于向安永成员所传送为该客户提供服务所需的信息，而不是通过该应用程序直接向该客户提供服务。
          </div>
          <h5>8. 终止</h5>
          <div className="sub_text">
            8.1
            以下情况下，安永成员所可能会立即终止、暂停或限制您访问全部或部分应用程序：（a）您未能遵守本使用条款或任何附加条款；（b）安永成员所收到第三方关于您滥用应用程序的投诉；或（c）安永成员所根据适用法律或专业义务合理地确定不能继续向您提供应用程序。
          </div>
          <div className="sub_text">
            8.2
            如果与使用应用程序有关的任何项目协议到期或被终止，您访问或使用应用程序任何部分的权利将自动终止。
          </div>
          <div className="sub_text">
            8.3
            安永可在任何时候以任何理由立即终止或暂停您对全部或部分应用程序的访问权限，但您有效付费订阅的应用程序的任何部分除外。
          </div>
          <div className="sub_text">
            8.4 第 1、4、8、6、10、11
            节，以及本使用条款中性质为持续生效的任何其他条款，应在本使用条款终止或到期后继续有效。
          </div>
          <h5>9. 本使用条款和服务的变更</h5>
          <div className="sub_text">
            9.1
            安永可随时修订本使用条款。安永将通过应用程序公布本使用条款的修订，并通过应用程序通知您任何变更。这些修订将从应用程序上公布的变更生效日期起生效。如您继续访问或使用应用程序，则视您确认接受修订后的本使用条款。如果您不同意修订后的本使用条款，您必须立即停止使用应用程序。
          </div>
          <div className="sub_text">
            9.2
            在不影响任何项目协议或附加条款的情况下，安永成员所可随时以任何理由对在线服务进行变更，而无需事先向您发出通知。
          </div>
          <h5>10. 第三方权利</h5>
          <div className="sub_text">
            10.1 安永出于安永成员所的利益订立了本使用条款。本使用条款的第
            1、4、8、6、10、11
            节以及可能使安永成员所和/或安永人员受益的任何其他条款旨在使所有安永成员所和安永人员受益，安永成员所和安永人员应有权依赖和执行这些条款。除此以外，非本使用条款缔约方的人员不得依赖或执行本使用条款的任何条款，且不得根据本使用条款享有第三方权利。
          </div>
          <div className="sub_text">
            10.2
            撤销、变更、暂停、执行或终止本使用条款，或给予对本使用条款或与本使用条款相关的任何豁免权，无需获得非本使用条款缔约方的任何人员的同意。
          </div>
          <h5>11. 其他</h5>
          <div className="sub_text">
            11.1
            违法性/可分割性：如果任何有管辖权的法院或机构宣布，根据任何管辖区的法律，本使用条款的任何条款是非法、无效或不可执行的，或者如果通过的任何法令，使得任何条款根据任何管辖区的法律是非法、无效或不可执行的，在该管辖区要求的最低限度内，应将其视为与本使用条款分割，且不得影响或损害其余条款的合法性、有效性或可执行性。
          </div>
          <div className="sub_text">
            11.2
            豁免：如果安永成员所未能坚持要求您履行本使用条款下的义务，或未对您强制或延迟执行其权利，这并不意味着任何安永成员所已豁免对您行使权利，也不意味着您无需遵守这些义务。安永成员所只能以书面形式豁免您的违约行为，并且这并不意味着安永成员所将自动豁免您以后的违约行为。即使安永成员所延迟执行其在本使用条款下的权利，它仍可能在以后执行其权利。
          </div>
          <div className="sub_text">
            11.3
            完整协议：本使用条款和附加条款构成您和安永之间关于应用程序和本使用条款的所有其他主题内容的全部协议和谅解。
          </div>
          <div className="sub_text">
            11.4
            不依赖性：您承认并同意，您不依赖安永或任何其他人员作出的任何承诺、保证、声明、担保、许诺或陈述（无论是无意的还是疏忽的），并且对其没有任何补救措施，除非在这些本使用条款中明确规定，您对此的唯一补救措施是违反合同。本使用条款中的任何内容均不免除或限制任何人员对舞弊或虚假陈述的任何责任。
          </div>
          <div className="sub_text">
            11.5
            分配和转移：安永可在任何时候将其在本使用条款下或与本使用条款相关的所有或任何权利和/或义务分配或转移给任何其他人员，包括执行任何条款或提出任何索赔的权利，无需您或任何其他人员的批准。未经安永事先书面同意，您不得分配或转移本使用条款下的任何权利或义务。
          </div>
          <div className="sub_text">
            11.6
            适用法律和管辖权：本使用条款以及由此产生或与之相关的任何争议或索赔，或其解释、说明或有效性，
            包括非合同争议或索赔（“<strong>争议</strong>
            ”）适用中国法律。安永所在地中国法院对审理和解决由本使用条款引起的或与之有关的所有争议具有专属管辖权。
          </div>
        </section>
      ),
      [ProtocolType.COOKIES]: (
        <section className="protocol" ref={protocolRef}>
          <div className="sub_text">
            最后更新日期：2023 年 10 月 13 日 <br />
          </div>
          <div className="sub_text">
            本网站“安永中国客户中心” (后简称为"本网站"）使用
            cookies、像素标签、网络信标和其他网络技术（如
            CAPTCHA）来优化网站性能，提升您的浏览体验，并保护网站免受垃圾邮件机器人的侵害。网站的某些版块还使用
            cookies
            以了解您的更多信息，为您提供更加个性化的浏览体验。我们使用简单的计数器来计算接受或拒绝我们
            cookies 的访客数量，此过程不会在您设备上存储任何信息。
          </div>
          <div className="sub_text">
            您可以更改 cookie 设置，禁止网站使用部分或全部
            cookies。您还可以通过更改浏览器设置禁止在您的设备上保存 cookies。
          </div>
          <div className="sub_text">
            如果您对我们使用的 cookies 有任何疑问，请与我们联系。
          </div>
          <h5>什么是网络信标？</h5>
          <div className="sub_text">
            安永偶尔在第三方网站上投放广告。我们跟踪广告活动的效果时，有时会使用识别访客技术，如"网络信标"或"行为标签"，计算在第三方网站上看到安永广告后访问安永网站的访客数量。我们不会使用此技术获取您的个人信息，该技术仅用于收集网站访客的总体浏览数据，以评估我们广告的有效性。
          </div>
          <h5>什么是 cookie？</h5>
          <div className="sub_text">
            "cookie"是当您访问网站时，允许网站在您使用的浏览器中存储信息令牌（一种"标识符
            "）的一种技术。后续再访问该网站时，浏览器将 cookies
            发送回网站或可以识别 cookie 的另一个网页。Cookies
            用于确保网站正常运行或更有效地运行，以及向网站所有者提供信息。
          </div>
          <div className="sub_text">
            Cookies
            的用途有很多，比如让您在不同页面之间切换，记住您的偏好，以及从整体上改善用户体验。例如，cookies
            可以告诉我们，您是第一次访问该网站，还是之前访问过。它们还可以帮助确保您在网上看到的广告更加贴近您的需求，更能引起您的兴趣。
          </div>
          <div className="sub_text">
            登陆网站时，您可以选择接受在网站上使用 cookies，接受某些类别的
            cookies 而拒绝其 他类别，或拒绝所有
            cookies。如果您已接受我们使用部分或全部
            cookies，以下信息仅与网站上使用的 cookies 有关。请注意，接受或拒绝
            cookies
            仅限于“安永中国客户中心”门户网站，不适用于可以超链接至我们网站的任何其他网页。对于这些网站使用的
            cookies 的更多信息，请参见这些网站上的具体隐私声明或 cookie
            政策。如果您有任何疑问，与我们联系。
          </div>
          <div className="sub_text">cookies 一般分为两大种类：</div>
          <div className="sub_text">
            <ul>
              <li>第一方 cookies，由我们直接向您设备提供</li>
              <li>第三方 cookies，由第三方代表我们向您设备提供</li>
            </ul>
          </div>
          <div className="sub_text">
            Cookies 可以在您的计算机或移动设备上保留的时间不同。某些 cookies
            是"会话 cookies"，这意味着这类 cookie
            只在您打开浏览器时出现。一旦您关闭浏览器，这些 cookies
            就会自动删除。有些 cookies 是"持久
            cookies"，这意味着在您关闭浏览器后它们仍然存在。当您打开浏览器再次浏览互联网时，网站可以使用它们来识别您的计算机。
          </div>
          <div className="sub_text">
            请勿跟踪/全球隐私控制
            <br />
            如果我们发现您在浏览器启用了“请勿跟踪”或“全球隐私控制”，我们将自动禁用营销/定位
            cookies。
          </div>
          <h5>我们使用什么类型的 cookies？</h5>
          <div className="sub_text">
            按照 cookies 的具体功能，本网站使用的 cookies 分为如下四类：
          </div>
          <div className="sub_text">
            <ul>
              <li>必需/绝对必要性 cookies，网站正常运行必需使用。</li>
              <li>
                性能 cookies，可帮助我们评估网站的性能并改善您的体验。在使用性能
                cookies
                时，我们不会存储任何个人数据，只会使用以汇总和匿名形式通过这些
                cookies 收集的信息；
              </li>
              <li>
                功能性 cookies，用于提升您的体验（例如记住您已选择的任何设置）;
              </li>
              <li>
                和广告/定位 cookies，我们用此类 cookie
                跟踪用户活动和会话，以便提供更个性化的服务。广告 cookies
                由第三方设置，我们与其一起执行广告推广活动，从而为您提供相关广告信息。如果您让我们识别出您的身份信息（如填写表格/进行注册以接收最新资讯的电子邮件），安永会收集您对我们广告活动的回应以及您在网站上的活动的信息。此信息将添加至您的个人广告档案和得分中，用于评估活动有效性，以及向您提供与您需求相关的内容和服务。
              </li>
            </ul>
          </div>
          <div className="sub_text">
            另外，我们还在网站的某些页面上使用
            cookies，以与第三方数据供应商进行沟通，推断您的数字行为。这有助于我们加深对您的了解，并在未来提供更具针对性的相关广告。我们收到的信息都是汇总的匿名信息，但将包括诸如人口统计学数据、线上行为、产品兴趣和生活方式的统计。我们通过可信的第三方供应商对
            cookies 进行定位和跟踪。如果您需 要关于我们的供应商以及如何运作这些
            cookies 的更多信息，请与我们联系。
          </div>
          <h5>本网站部署了以下 cookies：</h5>
          <div className="table">
            <div className="table-row table-header">
              <div className="table-cell">Cookie 提供者</div>
              <div className="table-cell">Cookie 名称</div>
              <div className="table-cell">Cookie 的用途</div>
              <div className="table-cell">Cookie 的类型</div>
              <div className="table-cell">Cookie 的存续时间</div>
            </div>
            <div
              style={{
                height: 16
              }}
            ></div>
            <div className="table-container">
              <div className="table-row">
                <div className="table-cell">安永中国客户中心</div>
                <div className="table-cell">authing_session</div>
                <div className="table-cell">标识登录态</div>
                <div className="table-cell">第一方</div>
                <div className="table-cell">默认 30 分钟</div>
              </div>
              <div className="table-row">
                <div className="table-cell">安永中国客户中心</div>
                <div className="table-cell">_authing_lang</div>
                <div className="table-cell">记录当前显示语言</div>
                <div className="table-cell">第一方</div>
                <div className="table-cell">默认 30 分钟</div>
              </div>
              <div className="table-row">
                <div className="table-cell">安永中国客户中心</div>
                <div className="table-cell">interaction-oidc-idp</div>
                <div className="table-cell">记录登录过程中的会话信息</div>
                <div className="table-cell">第一方</div>
                <div className="table-cell">1 小时</div>
              </div>
              <div className="table-row">
                <div className="table-cell">阿里云</div>
                <div className="table-cell">acw_tc</div>
                <div className="table-cell">阿里云防火墙的会话信息</div>
                <div className="table-cell">第三方</div>
                <div className="table-cell">30 分钟</div>
              </div>
            </div>
          </div>
          <h5>如何控制或删除 cookies</h5>
          <div className="sub_text">
            您有权选择是否接受
            Cookie，我们会在下文解释您可以如何行使此项权利。但请注意，如果您选择拒绝
            Cookie，可能无法使用此网站上的完整功能。
          </div>
          <div className="sub_text">
            您也可以通过启动允许您拒绝全部或部分 Cookie 的浏览器设置来封锁所有
            Cookie。但是 如果您使用您的浏览器设置来封锁全部的 Cookie（包括必要
            Cookie），您可能就无法进 入我们网站的全部或部分范围。
          </div>
          <div className="sub_text">
            如果您接受此网站的全部或部分
            Cookie，您仍可选择将您的浏览器设置为在收到 Cookie
            时通知您，以便您能够決定是否接受它。
          </div>
          <h5>过去已经设置的 cookies</h5>
          <div className="sub_text">
            如果您已禁用一个或数个
            Cookie，我们可能仍会使用在您的禁用偏好设置之前从 cookie
            收集到的信息；但是，我们将会停止使用被禁用的 cookie
            来收集任何进一步的信息。
          </div>
          <h5>本 Cookie 政策的变动</h5>
          <div className="sub_text">
            我们偶尔会更新此 Cookie
            政策，以反映我们的实务和服务上的改变。当我们发布此 Cookie
            政策的变更时，我们将会在此 Cookie
            政策的顶端修改「最后更新日期」信息。如果我们在收集、使用和/或分享
            Cookie
            所收集的信息的方法上有任何重大变更，我们将会在网站上明显位置发布有关该变更的通知来通知您。我们建议您不定时查阅此页面，以了解本
            Cookie 政策或我们其它政策的任何变更。
          </div>
        </section>
      )
    }
    const enProtocol = {
      [ProtocolType.PRIVACY]: (
        <section className="protocol" ref={protocolRef}>
          <div className="sub_text">Version：1.1</div>
          <div className="sub_text">
            Dear User：
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp; To better protect your personal information
            rights while you use the EY China Client Center services, we have
            made adjustments to the EY China Client Center Privacy Notice. The
            main updates include:
            <br />
            1.Additional explanations regarding the storage period for data
            collected by the EY China Client Center.
            <div className="sub_right">
              Privacy Notice Update Date：<span>July 10，2025</span>
            </div>
            <div className="sub_right">
              Privacy Notice Effective Date：<span>July 25，2025</span>
            </div>
          </div>
          <div className="sub_text">
            You must read and consent the Privacy Notice in order to access the
            EY Client Center.
          </div>
          <h5>Privacy Policy - EY China Client Center</h5>
          <div className="sub_text">
            Ernst & Young Hua Ming Certified Public Accountants LLP (hereinafter
            referred to as "EY") places great importance on user privacy and the
            protection of personal information. When you use our services, we
            may collect and use your relevant information.
            <br /> This "Privacy Notice" is intended to explain to you: what
            personal information we collect from you, how we process this
            personal information, and how you can exercise your rights that we
            provide. We also hope that this policy can help you decide whether
            to provide your personal information to us.
          </div>
          <h5>What personal information we collect</h5>
          <div className="sub_text">
            In order to provide you with data transmission services, you provide
            EY with or allow EY to collect the following personal information
            that is necessary to provide the service (please note that without
            this information, EY will be unable to provide the service):
            <ul>
              <li>Name</li>
              <li>Email Address</li>
              <li>Mobile Phone Number (optional)</li>
            </ul>
            A total of 3 categories of personal information Purposes, methods,
            and retention periods for processing personal information
          </div>
          <h5>
            EY processes your personal information for the following purposes
            and in the following manners:
          </h5>

          <div className="table">
            <div className="table-row_privacy table-header">
              <div className="table-cell">Specific Scenario</div>
              <div className="table-cell">Processing Purpose</div>
              <div className="table-cell">Processing Method</div>
              <div className="table-cell">Types of Personal Information</div>
            </div>
            <div
              style={{
                height: 16
              }}
            ></div>
            <div className="table-container">
              <div className="table-row_privacy">
                <div className="table-cell">Authorized User Registration</div>
                <div className="table-cell">User Identity Verification</div>
                <div className="table-cell">
                  Sending authorization user identity verification information
                  to you via your email address or phone number
                </div>
                <div className="table-cell">
                  Name, Email Address, Phone Number (optional)
                </div>
              </div>
            </div>
          </div>
          <h5>Personal Information Retention Period:</h5>
          <div className="sub_text">
            EY will retain your personal information for as long as necessary
            based on the nature of the services provided. At the end of the
            retention period, your personal information will be deleted.
            However, after the service has terminated, EY will retain necessary
            documents related to your personal information in accordance with
            applicable laws, professional standards, and internal archiving
            requirements.
          </div>
          <div className="sub_text">
            If you do not log in for an extended period, the system will send
            you a reminder after 12 months. If you have not logged in for 13
            months, the system will disable your account. If you have not logged
            in for 14 months, the system will perform a physical deletion of
            your account.
          </div>

          {/* <div className="sub_text">
            <ul>
              <li>
                Account data of users in the system will be used to authorize
                users to log in to the EY China Client Center.
              </li>
              <li>
                Personal information will be retained for 36 months, except as
                otherwise provided by laws, regulations, or industry
                requirements.
              </li>
            </ul>
          </div>

          <div className="sub_text">
            Members of the EY China Client Center team may access this personal
            data. The processing of the above data is necessary for us to
            provide excellent services.
          </div>
          <div className="sub_text">
            EY will retain your personal information as required by the nature
            of the services provided. At the end of the retention period, your
            personal information will be deleted. However, after the termination
            of the service, EY will retain the necessary documents related to
            personal information in accordance with applicable laws,
            professional standards, and internal record requirements.
          </div> */}

          <h5>
            Explicit consent to provide personal information to other data
            processors
          </h5>
          <div className="sub_text">
            EY will need to provide your personal information, such as email or
            phone number, to the cloud service provider within China (Alibaba
            Cloud Computing Co., Ltd.) to send you identity authentication
            information through the system.
          </div>
          <div className="sub_text">
            For the privacy policy of the cloud service provider (Alibaba Cloud
            Computing Co., Ltd.), please refer to the following link:
          </div>
          <div className="sub_text">
            <a
              href="https://terms.aliyun.com/legal-agreement/terms/suit_bu1_ali_cloud/suit_bu1_ali_cloud202107091605_49213.html"
              target="_blank"
              rel="noreferrer"
            >
              Alibaba Cloud Legal Statement and Privacy Policy (aliyun.com)
            </a>
          </div>
          <div className="sub_text">
            You acknowledge and agree that EY provides personal information to
            the aforementioned data processor as described in this clause.
          </div>
          <h5>Your rights</h5>
          <div className="sub_text">
            Except as provided by laws and regulations, you may contact EY at
            EYChinaClientCenter@cn.ey.com to exercise your rights with respect
            to your personal information, including the right to access, copy,
            transfer, correct, supplement, delete, and request explanations of
            processing rules.
          </div>
          <h5>Information Security</h5>
          <div className="sub_text">
            We place a high value on and commit to protecting your personal
            information. We will take security measures that comply with
            industry standards and are reasonably practicable to protect your
            personal information from unauthorized modification, access,
            disclosure, use, or deletion.
            <br />
            In the event of an information security incident, we will take
            appropriate and necessary measures in accordance with legal
            requirements.
          </div>
        </section>
      ),
      [ProtocolType.POLICY]: (
        <section className="protocol" ref={protocolRef}>
          <div className="sub_text">
            Date: Oct 9, 2023 <br />
            Version: 1.0
          </div>
          <h5>1. Introduction</h5>
          <div className="sub_text">
            1.1 These terms of use <strong>“Terms of Use”</strong> apply to the
            website at login.ey.com.cn and its subdomains{' '}
            <strong>“Website”</strong> , and all applications and functionality
            that are made available, accessed, authenticated or delivered via
            the Website, and/or that form part of or are made available or
            accessed through the online service named at the top of this
            document, whether delivered through the Website or an API or other
            software interface, including but not limited to software as a
            service and hosted software, and all content including but not
            limited to text, data, video, sound recordings, graphics,
            photographs made available through the Website or such online
            service, together, everything in this paragraph is the{' '}
            <strong>"Application"</strong>, including all Applications made
            available through other Applications
          </div>
          <div className="sub_text">
            1.2 These Terms of Use apply to the Application only and do not
            apply to any professional or other services, including but not
            limited to any reports, advice or other deliverables, together,
            <strong>“Other Services”</strong> that you may receive from an EY
            China Firm
          </div>
          <div className="sub_text">
            1.3 If you access applications related to any other service, or sign
            a separate contract with an EY member firm for the provision of an
            application or other services (hereinafter referred to as "project
            agreement"), then:
            <div className="tertiary_text">
              a. The EY member firm that signs a project agreement with you or
              provides you with other services also provides you with the
              application, grants you limited access rights to the application,
              and is fully responsible for matters related to providing the
              application to you.
            </div>
            <div className="tertiary_text">
              b. Your right to recourse for any matters related to this
              application should be limited only to claims against the
              aforementioned EY member firm. You have no right of recourse
              against applications from any other EY member firms (including EY)
              and you may not make claims or initiate litigation against them.
            </div>
            <div className="tertiary_text">
              c. If there is any conflict in the terms, the terms and conditions
              of the project agreement you have entered into with the EY member
              firm shall take precedence over the terms of use set by that EY
              member firm for the application.
            </div>
          </div>
          <div className="sub_text">
            1.4 If you need to access applications unrelated to the project
            agreement stipulated in Section 1.3, then:
            <div className="tertiary_text">
              a. EY Hua Ming LLP (special general partnership) (hereinafter
              referred to as "EY") (Company address: 17th Floor, Rooms 01-12, EY
              Building, Oriental Plaza, No. 1 East Chang'an Street, Dongcheng
              District, Beijing) provides you with the application, grants you
              access to the application, and is fully responsible for matters
              related to providing the application to you; and
            </div>
            <div className="tertiary_text">
              b. Your right to recourse for any matters related to this
              application should only be claims against EY. You have no right of
              recourse against any other applications of EY member firms, and
              you may not make claims or initiate litigation against them.
            </div>
          </div>
          <div className="sub_text">
            1.5 Additional terms if any that apply specifically to the
            Application "Additional Terms", whether contained in an Engagement
            Agreement or otherwise presented by EY China Firm, shall apply to
            the Application To the extent of any conflict, the Additional Terms
            governing a particular Application shall take priority over these
            general Terms of Use in respect of such Application No purchase
            order terms or other standard terms presented by You shall apply in
            respect of the Application
          </div>
          <div className="sub_text">
            1.6 These Terms of Use form a legally binding contract between you
            and EY If you access or use the Application in your personal
            capacity, you are entering this legally binding agreement in your
            personal capacity If you access or use the Application on behalf of
            an organisation such as a company, partnership or other legal entity
            <strong>"Organisation"</strong>, you are entering this legally
            binding agreement on behalf of the Organisation, you represent that
            you have authority to agree this Terms of Use on behalf of the
            Organisation, and all references to "you" and "your" in this Terms
            of Use means such Organisation
          </div>
          <div className="sub_text">
            1.7 Each EY member firm within the global network of EY member firms
            is an independent legal entity. "EY member firm" refers to:
            <br />
            (i) EY Global Services Limited and the network of entities
            consisting of Ernst & Young Global Limited, EYGN Limited, EYGM
            Limited, EYGS LLP, EYGI B.V., EY Global Finance, Inc, and their
            member institutions;
            <br />
            (ii) any entity that is controlled by any such entity, is under
            common control with any such entity, controls any such entity, or
            serves as a member firm or subsidiary of that entity, or any
            company, partnership, or other business organization of which the
            majority equity or control is directly or indirectly owned by such
            entity; <br />
            (iii) any entity that operates under a common branding agreement
            with EY network members and any partner, director, employee, or
            agent of such entities.
            <br />
            In this definition, "control" means
            <div className="tertiary_text">
              (a) directly or indirectly owning equity securities, giving the
              entity the right to exercise at least 50% of its voting rights; or
            </div>
            <div className="tertiary_text">
              (b) having, directly or indirectly, the power to guide or direct
              the management and policies of the relevant entity through
              shareholding, contracts, or other means.
            </div>
          </div>
          <div className="sub_text">
            1.8 Please read these Terms of Use carefully By accessing
            Application, you are confirming that you have read, understood and
            agreed to these Terms of Use If you do not agree to these Terms of
            Use or any part of them, you must not use the Application In these
            Terms of Use, the word “including” shall be read to mean “including
            but not limited to”, and any reference to the singular includes the
            plural and vice versa
          </div>
          <div className="sub_text">
            1.9 The applicable privacy notices explain the information that EY
            collects about users of the Application, and how EY uses that
            information
          </div>
          <h5>2. Security and Login Credentials</h5>

          <div className="sub_text">
            2.1 EY may allocate to you, or you may be invited to create,
            usernames, passwords, identification codes, tokens or other
            identifiers as part of the security processes that apply to the
            Application <strong>"Login Credentials"</strong> You shall:
            <div className="tertiary_text">
              a. keep your Login Credentials confidential and not disclose your
              Login Credentials to any other person;
            </div>
            <div className="tertiary_text">
              b. not permit any other personnel of the Organisation or any third
              party to use the Login Credentials to access the Application;
            </div>
            <div className="tertiary_text">
              c. use adequate security procedures to ensure the security of your
              Login Credentials to prevent unauthorised access to or
              unauthorised use of the Application; and
            </div>
            <div className="tertiary_text">
              d. promptly notify EY if you become aware of, or have reasonable
              grounds to suspect, the loss, theft or disclosure to any third
              party or unauthorised use of your Login Credentials or any other
              breach of security in relation to your account or the Application
            </div>
          </div>

          <div className="sub_text">
            2.2 You assume full responsibility for any and all use, unauthorised
            use and/or misuse of the Application by any person using your Login
            Credentials
          </div>
          <div className="sub_text">
            2.3 You acknowledge that the Internet is not secure and that
            messages may be observed by a third party while in transit You
            understand that the EY Firms accept no responsibility for security
            of information on or transmitted via the Internet
          </div>
          <h5>3. Intellectual property and use of the Application</h5>
          <div className="sub_text">
            3.1 You acknowledge that all intellectual property rights in the
            Application belong to the EY China Firm
          </div>
          <div className="sub_text">
            3.2 Subject to your compliance with all terms of these Terms of Use
            you may use the Application, solely:
            <div className="tertiary_text">
              a. for your sole personal and private purposes or internal
              business purposes in each case excluding the purpose of providing
              services to third parties, unless expressly authorised by an EY
              Firm in writing, or if any the internal business purposes of the
              person who has provided you access to the Application in
              accordance with these Terms of Use; and/or
            </div>
            <div className="tertiary_text">
              b. for the purpose of your or the relevant EY Firm client’s
              receipt of services from an EY Firm under an Engagement Agreement,
            </div>
            <div className="tertiary_text">
              <strong>"Permitted Business Purposes"</strong>
            </div>
          </div>
          <div className="sub_text">
            3.3 You may not use or exploit the Application for any purpose
            except for Permitted Business Purposes
          </div>
          <div className="sub_text">
            3.4 You shall not:
            <div className="tertiary_text">
              a. use the Application or access to it for any fraudulent or
              unlawful purpose or to impersonate any person or entity, or to
              falsely state or otherwise misrepresent your affiliation with any
              person or entity;
            </div>
            <div className="tertiary_text">
              b. interfere with or disrupt the operation of the Application or
              access to it;
            </div>
            <div className="tertiary_text">
              c. transmit or otherwise make available in connection with the
              Application or access to it any virus, worm, Trojan horse, time
              bomb, spyware, or other computer code, file, or program that is
              harmful or invasive or that may or is intended to damage or hijack
              the operation of, or to monitor the use of, any hardware,
              software, or equipment;
            </div>
            <div className="tertiary_text">
              d. restrict or inhibit the ability of any other user to access or
              use the Application;
            </div>
            <div className="tertiary_text">
              e. modify, adapt, translate or create derivative works of any
              portion of the Application or use the Application to design or
              develop any service with similar functionality to the Application;
            </div>
            <div className="tertiary_text">
              f. remove, obscure or modify any copyright, trademark, or other
              proprietary rights notice from the Application;
            </div>
            <div className="tertiary_text">
              g. use any robot, spider, search/retrieval application or other
              manual or automatic device to retrieve, index, “scrape”, “data
              mine”, or in any way gather data from the Application or reproduce
              the Application or circumvent the navigational structure or
              presentation of the Application, except that freely available
              search engines may copy materials from the Application solely for
              the purpose of creating publicly available searchable indices but
              not caches or archives This right may be revoked in respect of any
              search engine at any time;
            </div>
            <div className="tertiary_text">
              h. attempt to circumvent any security features or access control
              features in relation to the Application;
            </div>
            <div className="tertiary_text">
              i. use the Application to send unsolicited emails or unsolicited
              instant messages or for file-sharing purposes;
            </div>
            <div className="tertiary_text">
              j. decompile or reverse engineer or otherwise attempt to derive
              source code for any part of the Application except to the extent
              that applicable law allows you to do so without consent, and then
              only for the limited purpose, and to the extent, allowed by
              applicable law and provided that you do not disclose or
              communicate such source code to any other person; or
            </div>
            <div className="tertiary_text">
              k. frame, link or deep-link the Website or Application from any
              other website
            </div>
          </div>
          <div className="sub_text">
            3.5 You may not provide access to the Application to any other
            person or entity, unless you are expressly permitted to do so by an
            EY Firm in writing You are responsible for all acts and omissions
            including but not limited to any breach of these Terms of Use of any
            other person or entity to whom you provide access as if they were
            your own acts or omissions You may not systematically provide access
            to any content, information or data obtained through the Application
            to any other person or entity
          </div>
          <div className="sub_text">
            3.6 You may not, and shall not permit any third parties to, directly
            or indirectly, export, reexport, or release the Application to any
            jurisdiction or country to which, or any party to whom, the export,
            reexport, or release is prohibited by People's Republic of China or
            other law, regulation, or rule You may be refused access to the
            Application if an EY Firm reasonably believes it could violate any
            applicable law or regulation
          </div>
          <div className="sub_text">
            3.7 You represent and warrant to EY that the information you provide
            during the registration process and otherwise through the
            Application is true, accurate and complete
          </div>
          <div className="sub_text">
            3.8 The Application may not be relied on by any third party
          </div>
          <h5>4. Your content</h5>
          <div className="sub_text">
            4.1 The Application may include functionality that allows you to
            post or upload or transmit information, content and/or materials
            onto or through the Application <strong>"Your Content"</strong>
          </div>
          <div className="sub_text">
            4.2 The EY Firms’ use of Your Content will depend on whether you
            access the Application in connection with any Other Services or an
            Engagement Agreement, as follows:
            <div className="tertiary_text">
              a. Except where you access an Application in connection with an
              Engagement Agreement or Other Services as set out in Section b,
              you grant to EY China Firm, to the maximum extent permissible
              under applicable law, a perpetual, irrevocable, non-exclusive,
              fully-paid up, royalty-free, worldwide, sub-licensable,
              transferable right to use, copy, publish, distribute, modify, and
              exploit Your Content for any purpose including without limitation
              for the purpose of EY China Firm and assigns deriving revenue
              therefrom and including without limitation the right to authorise
              third parties to exercise any or all of such rights EY China Firm
              shall not: i publish Your Content in a way that identifies you
              without your permission; or ii process your personal data in
              breach of the applicable privacy notice
            </div>
            <div className="tertiary_text">
              b. If you access the Application in connection with any Other
              Services or an Engagement Agreement, the EY may use Your Content
              as set forth in the applicable Engagement Agreement as well as to
              provide you the Application and related services, to comply with
              regulatory requirements, to check conflicts, for risk management
              and accounting purposes and for the provision of internal
              administrative support
            </div>
            In any event, the EY may collect and use technical usage data,
            including information about your systems, software, and usage of any
            Application, to monitor, maintain and improve the Application
          </div>
          <div className="sub_text">
            4.3 You warrant that you have obtained all necessary rights,
            licences, permissions and that you have full authority to grant the
            licence set out in Section
          </div>
          <div className="sub_text">
            4.4 You shall not upload, post, otherwise transmit or provide access
            through the Application to content that is unlawful, harmful,
            threatening, abusive, harassing, tortious, defamatory, vulgar,
            obscene, invasive of another’s privacy, hateful, or racially,
            ethnically or otherwise objectionable, under any applicable law and
            in any jurisdiction
          </div>
          <div className="sub_text">
            4.5 Your Content may be removed, disabled or edited without notice
            if EY believes that Your Content may infringe the intellectual
            property or other rights of any person or does not comply with
            Section
          </div>
          <div className="sub_text">
            4.6 EY may use any feedback you provide for the purpose of improving
            their services
          </div>
          <h5>5. Third party sites and content</h5>
          <div className="sub_text">
            5.1 From time to time, the Application may include links or access
            to third party websites or services Such links and access are
            provided for your convenience only and do not signify that any EY
            endorses such third-party websites or services EY do not review such
            third-party websites or services Accordingly, you acknowledge and
            agree that, if you access any such websites or services, you do so
            entirely at your own risk
          </div>
          <div className="sub_text">
            5.2 If the Application permit users to submit questions, comments,
            suggestions and the like for use by other users of the Application,
            EY assume no responsibility for the content or accuracy of any such
            submissions, nor for any recommendations or opinions that may be
            expressed therein, nor for the suitability or applicability to a
            particular user of any such submissions
          </div>
          <div className="sub_text">
            5.3 EY have no liability whatsoever for the accuracy or completeness
            of any data acquired from a third party and provided through the
            Application
          </div>
          <h5>6. Liability</h5>
          <div className="strong_text">
            <div className="sub_text">
              6.1 Nothing in these terms of use is intended to waive or limit
              any liability as set forth by applicable law or any non-waivable
              or non-limitable professional regulations.
            </div>
            <div className="sub_text">
              6.2 Unless otherwise stipulated in any supplementary terms, any
              applications provided free of charge: (a) are provided "as is" and
              "as available"; (b) are for reference use only; (c) do not
              constitute professional advice or services from any EY member
              firm; and (d) should not be relied upon. The risk of using such
              free applications is entirely yours.
            </div>
            <div className="sub_text">
              6.3 It is your responsibility to ensure the application fits your
              intended purpose.
            </div>
            <div className="sub_text">
              6.4 EY member firms do not warrant, ensure, or guarantee
              uninterrupted or error-free access to the application, its
              compatibility with your hardware or software, or that the
              application or its servers are free from viruses or other harmful
              components. You are responsible for implementing appropriate
              processes, systems, and protocols to protect yourself and your
              organization from such issues.
            </div>
            <div className="sub_text">
              6.5 Except as expressly stated in these terms of use and any
              supplementary terms, all warranties, terms, conditions, and
              commitments, whether explicit or implied by law, trade custom, or
              otherwise (including but not limited to implied warranties of
              merchantability and fitness for a particular purpose or use) are
              disclaimed to the fullest extent permissible by law.
            </div>
            <div className="sub_text">
              6.6 You have no right of recourse against, nor may you bring any
              claim or lawsuit against, any member, shareholder, director,
              senior officer, partner, manager, or employee ("EY Personnel") of
              any EY member firm.
            </div>
            <div className="sub_text">
              6.7 EY member firms and EY Personnel shall not be liable to you
              under contract law, tort law (including but not limited to
              negligence), statutory law, or any other basis for any losses or
              damages arising out of or related to the application or these
              terms of use, or for breach or non-performance of these terms of
              use, regardless of the magnitude of the loss, and even if such
              losses or damages were foreseeable:
              <div className="tertiary_text">
                a. Any indirect, consequential, incidental, punitive, or special
                loss or damage;
              </div>
              <div className="tertiary_text">b. Loss of income or profits;</div>
              <div className="tertiary_text">
                c. Loss of data, or inability to use data, software, or systems;
              </div>
              <div className="tertiary_text">d. Wasted management time;</div>
              <div className="tertiary_text">
                e. Loss of business opportunities;
              </div>
              <div className="tertiary_text">
                f. Loss of anticipated savings;
              </div>
              <div className="tertiary_text">
                g. Damage to goodwill or reputation.
              </div>
            </div>
            <div className="sub_text">
              6.8 Without prejudice to any provisions exempting liability in
              these terms of use, the total liability of all EY member firms and
              EY Personnel under contract law, tort law (including but not
              limited to negligence), statutory law, or any other basis arising
              out of or related to the application, the processing of "Your
              Content," and these terms of use (including but not limited to any
              breach or non-performance of these terms of use), regardless of
              its magnitude, in any calendar year, should not exceed the greater
              of: (a) the fees you paid for the relevant application in that
              calendar year; or (b) 1000 RMB (or its equivalent in local
              currency).
            </div>
            <div className="sub_text">
              6.9 EY member firms do not provide legal services through this
              application, and this application does not constitute or contain
              legal advice; you should not treat any information provided to you
              through the application as or in place of legal advice. Your use
              of the application does not establish any attorney-client
              relationship between you and EY, and you bear the sole
              responsibility for deciding whether to seek legal advice from a
              qualified attorney.
            </div>
            <div className="sub_text">
              6.10 EY member firms do not guarantee that the processes related
              to the application are sufficient to maintain any
              accountant-client, attorney-client, work product, or any other
              applicable privilege or protection that you (whether as a client,
              professional, attorney, or otherwise) or any third party might
              have or be obligated to perform. It is entirely your
              responsibility to determine whether your use of the application
              might be deemed a waiver or detriment to any applicable privilege
              or protection concerning the questions and information you submit.
            </div>
          </div>
          <h5>7. Providing services</h5>
          <div className="sub_text">
            7.1 You may not use the Application to provide services to third
            parties without an EY Firm’s prior written consent, in its sole
            discretion If you are using the Application to provide services to
            third parties and at any time it is reasonable to anticipate that
            the fees payable to an EY Firm associated with any third-party
            matter will exceed CNY 0,, you agree to provide written notice
            thereof to EY EY may request that you identify the applicable client
            or customer, the matter, and any other information as required to
            assess the appropriate relationship between the EY, you and your
            client or customer In certain circumstances, an EY Firm may request
            that, in addition to your contractual arrangement with such client
            or customer, such client or customer enters a direct contractual
            relationship with an EY Firm in connection with such services
          </div>
          <div className="sub_text">
            7.2 If you use the Application to assist you in formulating your own
            advice to your clients or customers, you are solely responsible for
            any and all advice you provide to your clients and customers You
            shall not do anything to attribute, directly or indirectly, any such
            advice or any specific portion of such advice to EY No such client
            or customer shall be or may be deemed a third-party beneficiary of
            these Terms of Use{' '}
          </div>
          <div className="sub_text">
            7.3 If your use of the Application is in connection with your
            provision of services to a client of EY China Firm:
            <br />a you warrant and represent that your access to the
            Application has been authorised by such client and that you will use
            the Application solely as authorised by, and for the benefit of,
            such client; and
            <br />b you agree to use the Application solely for the purpose of
            transmitting information to EY as required for them to perform
            services for such client, and not to provide services directly to
            such client via the Application
          </div>
          <h5>8. Termination</h5>
          <div className="sub_text">
            8.1 EY may immediately terminate, suspend or restrict your access to
            all or any part of the Application: (a) if you fail to comply with
            these Terms of Use or any Additional Terms; (b) if EY receives a
            complaint from a third-party concerning misuse by you of the
            Application; or © if EY reasonably determines that the Application
            can no longer be provided to you in accordance with applicable law
            or professional obligations
          </div>
          <div className="sub_text">
            8.2 If any Engagement Agreement in connection with the use of the
            Application expires or is terminated, your right to access or use of
            any part of the Application shall automatically be terminated
          </div>
          <div className="sub_text">
            8.3 EY may terminate or suspend your access to all or part of the
            Application immediately for any reason at any time, except in
            respect of any part of the Application for which you have an active
            paid-for subscription
          </div>
          <div className="sub_text">
            8.4 Sections 1, 4, 8, 6, 10and 11, and any other provisions of these
            Terms of Use that by their nature are intended to survive, shall
            survive termination or expiry of these Terms of Use
          </div>
          <h5>9. Changes to Terms of Use and Services</h5>
          <div className="sub_text">
            9.1 EY may amend these Terms of Use at any time EY will publish
            amendments to this Terms of Use through the Application and will
            inform you about any changes through the Application, and such
            amendments will take effect from the effective date of the change
            published on the Application By continuing to access or use the
            Application, you are confirming your acceptance of the amended Terms
            of Use If you do not agree to the amended Terms of Use, you must
            immediately stop using the Application
          </div>
          <div className="sub_text">
            9.2 Without prejudice to any Engagement Agreement or Additional
            Terms, EY may make changes to the Application for any reason at any
            time without providing notice to you
          </div>
          <h5>10. Third party rights</h5>
          <div className="sub_text">
            10.1 EY has entered these Terms of use for the benefit of the EY
            Firm Sections 1, 4, 8, 6, 10 and 11 of these Terms of Use and any
            other provisions that may benefit EY Firm and/or EY Persons are
            intended for the benefit of all EY Firm and EY Persons, who shall be
            entitled to rely upon and enforce those provisions Otherwise, a
            person who is not a party to these Terms of Use may not rely upon or
            enforce any terms of these Terms of Use and shall have no
            third-party rights under these Terms of Use, whether under the
            Contracts Rights of Third Parties Act or otherwise
          </div>
          <div className="sub_text">
            10.2 The consent of any person who is not a party to these Terms of
            Use is not required to rescind, vary, suspend, enforce or terminate
            these Terms of Use, or to grant any waiver under or in connection
            with these Terms of Use
          </div>

          <h5>11. Other</h5>
          <div className="sub_text">
            11.1 Illegality/Severability: If any provision of these Terms of Use
            is declared by any competent court or body to be illegal, invalid or
            unenforceable under the law of any jurisdiction, or if any enactment
            is passed that renders any provision illegal, invalid or
            unenforceable under the law of any jurisdiction, it shall be deemed
            severed from these Terms of Use to the minimum extent required by
            such jurisdiction and this shall not affect or impair the legality,
            validity or enforceability of the remaining provisions
          </div>
          <div className="sub_text">
            11.2 Waiver: If EY Firm fails to insist that you meet your
            obligations under these Terms of Use or does not enforce its rights
            against you or delays in doing so, that will not mean that EY Firm
            has waived its rights against you and it does not mean that you do
            not have to comply with those obligations If EY Firm does waive a
            default by you, the EY Firm may only do so in writing and that will
            not mean that the EY Firm will automatically waive any later default
            by you Even if EY Firm delays in enforcing its rights under these
            Terms of Use, it may still enforce its rights later
          </div>
          <div className="sub_text">
            11.3 Entire agreement: These Terms of Use and the Additional Terms
            constitute the entire agreement and understanding between you and EY
            relating to the Application and all other subject matter of these
            Terms of Use
          </div>
          <div className="sub_text">
            11.4 No reliance: You acknowledge and agree that you do not rely on,
            and shall have no remedy in respect of, any promise, assurance,
            statement, warranty, undertaking or representation made whether
            innocently or negligently by EY or any other person except as
            expressly set out in these Terms of Use, in respect of which your
            sole remedy shall be for breach of contract Nothing in these Terms
            of Use shall operate or be construed to exclude or limit any
            liability of any person for fraud, or fraudulent misrepresentation
          </div>
          <div className="sub_text">
            11.5 Assignment and subcontracting: EY may assign or subcontract all
            or any of its rights and/or obligations under or in connection with
            these Terms of Use, including the right to enforce any terms or
            bring any claim, to any other person at any time without needing
            your or any other person’s approval You may not assign or transfer
            any of your rights or obligations under these Terms of Use without
            EY's prior written consent
          </div>
          <div className="sub_text">
            11.6 Governing law and jurisdiction: These Terms of Use and any
            disputes or claims arising out of or in connection with them, or
            their construction, interpretation or validity, including
            non-contractual disputes or claims <strong>“Disputes”</strong> shall
            be governed by the laws of China The courts of China shall have
            exclusive jurisdiction to hear and resolve all Disputes arising out
            of or in connection with these Terms of Use
          </div>
        </section>
      ),
      [ProtocolType.COOKIES]: (
        <section className="protocol" ref={protocolRef}>
          <div className="sub_text">Last updated: 13 October 2023</div>
          <div className="sub_text">
            This website "EY China Client Center" (separately referred to as
            ‘the website’) use cookies, pixel tags, Web Beacons, and other web
            technologies such as CAPTCHA’s to improve the website’s performance,
            to enhance your browsing experience and to protect the website
            against spam robots. Certain areas of the website also use cookies
            to understand more about you, so we can offer you more personalized
            browsing experience. We use a simple counter, without storing any
            information on your device, to count the number of visitors who
            accept or decline our cookies.
          </div>
          <div className="sub_text">
            You can change your cookie settings and disable some or all cookies
            for the website at any time. You can also change your browser
            settings so that cookies cannot be placed on your device.
          </div>
          <div className="sub_text">
            If you have any questions in relation to the cookies we use please
            contact us.
          </div>
          <h5>What are Web Beacons?</h5>
          <div className="sub_text">
            EY occasionally advertises on third-party web sites. As part of our
            effort to track the success of our advertising campaigns, we may at
            times use a visitor identification technology such as “web beacons”,
            or “action tags”, which count visitors who have come to the website
            after being exposed to an EY banner ad on a third-party site. We do
            not use this technology to access your personal information and it
            is only used to compile aggregated statistics about visitors who
            come to the website to gauge the effectiveness of our ads.
          </div>
          <h5>What is a cookie?</h5>
          <div className="sub_text">
            A “cookie” is a technology that allows the website to store tokens
            of information (an “identifier”) in your browser used by the website
            while you are on the website. Cookies are then sent back to the
            website on each subsequent visit, or to another webpage that
            recognizes that cookie. Cookies are used in order to make the
            website work, or to work more efficiently, as well as to provide
            information to the owners of the website.
          </div>
          <div className="sub_text">
            Cookies do lots of different jobs, like letting you navigate between
            pages efficiently, remembering your preferences, and generally
            improving the user experience. Cookies may tell us, for example,
            whether you have visited the website before or whether you are a new
            visitor. They can also help to ensure that adverts you see online
            are more relevant to you and your interests.
          </div>
          <div className="sub_text">
            When landing on the website, you have been given the opportunity to
            accept cookies used on the website, to accept certain categories of
            cookies and decline others, or to decline all cookies. If you have
            accepted our use of some or all cookies, the following information
            relates to cookies used on the website only. Please note that any
            consent to accept or to decline cookies is limited to the ey.com
            website and the My EY portal only and not to other local EY sites or
            any other pages, which may be hyperlinked to our website or portal.
            For more information on cookies used by those websites, please refer
            to the specific privacy notice or cookie policy on those websites.
            If you have any questions please
          </div>
          <div className="sub_text">
            There are two broad categories of cookies:
          </div>
          <div className="sub_text">
            <ul>
              <li>
                First party cookies, served directly by us to your device.
              </li>
              <li>
                Third-party cookies, which are served by a third party on our
                behalf.
              </li>
            </ul>
          </div>
          <div className="sub_text">
            Cookies can remain on your computer or mobile device for different
            periods of time. Some cookies are “session cookies”, meaning that
            they exist only while your browser is open. These are deleted
            automatically once you close your browser. Other cookies are
            “permanent cookies”, meaning that they survive after your browser is
            closed. They can be used by the website to recognize your computer
            when you open your browser and browse the Internet again.
          </div>
          <div className="sub_text">
            Do Not Track/Global Privacy Control
            <br />
            If we detect that you have enabled the Do Not Track setting or
            Global Privacy Control signal in your browser, we will automatically
            disable Marketing/Targeting cookies.
          </div>
          <h5>What types of cookies do we use?</h5>
          <div className="sub_text">
            The website uses the cookies that perform four functions, as
            classified below:
          </div>
          <div className="sub_text">
            <ul>
              <li>
                Essential/strictly necessary cookies, which are essential to the
                functioning of the website.
              </li>
              <li>
                Performance cookies, which help us measure the website’s
                performance and improve your experience. In using performance
                cookies we do not store any personal data, and only use the
                information collected through these cookies in aggregated and
                anonymised form;
              </li>
              <li>
                Functionality cookies, which allow us to enhance your experience
                (for example by remembering any settings you may have selected);
              </li>
              <li>
                Marketing/targeting cookies, which we use to track user activity
                and sessions so that we can deliver a more personalized service.
                Marketing cookies are set by third parties with whom we execute
                marketing campaigns and allow us to provide marketing relevant
                to you. If you identify yourself to us (e.g. filling out a
                form/signing up to receive email updates), EY collects
                information about your response to our marketing communications
                and your activity on this website. This information is added to
                your personal marketing profile and score which is used to
                measure campaign effectiveness and to provide content and offer
                services that are relevant for you.
              </li>
            </ul>
          </div>
          <div className="sub_text">
            In addition, we also utilise cookies on certain pages of the website
            to communicate with third party data suppliers in order to
            extrapolate your digital behaviour. This help us to understand and
            target more relevant advertising in the future. The information we
            receive is all aggregate and anonymous, but will include statistics
            such as demographics, online behaviour, product interests and
            lifestyle. Targeting and tracking cookies are provided via trusted
            third party suppliers. Should you require more information regarding
            our suppliers and how these cookies operate please contact us.
          </div>
          <h5>This website deploys the following cookies:</h5>
          <div className="table">
            <div className="table-row table-header">
              <div className="table-cell">Cookie Provider</div>
              <div className="table-cell">Cookie Name</div>
              <div className="table-cell">Cookie Usage</div>
              <div className="table-cell">Cookie type</div>
              <div className="table-cell">Cookie expiration</div>
            </div>
            <div
              style={{
                height: 16
              }}
            ></div>
            <div className="table-container">
              <div className="table-row">
                <div className="table-cell">EY China Client Center</div>
                <div className="table-cell">authing_session</div>
                <div className="table-cell">Identify login status</div>
                <div className="table-cell">First party</div>
                <div className="table-cell">Default 30 mins</div>
              </div>
              <div className="table-row">
                <div className="table-cell">EY China Client Center</div>
                <div className="table-cell">_authing_lang</div>
                <div className="table-cell">Track language setting</div>
                <div className="table-cell">First party</div>
                <div className="table-cell">Default 30 mins</div>
              </div>
              <div className="table-row">
                <div className="table-cell">EY China Client Center</div>
                <div className="table-cell">interaction-oidc-idp</div>
                <div className="table-cell">Track login status</div>
                <div className="table-cell">First party</div>
                <div className="table-cell">1 hour</div>
              </div>
              <div className="table-row">
                <div className="table-cell">Ali Cloud</div>
                <div className="table-cell">acw_tc</div>
                <div className="table-cell">Ali WAF tracking</div>
                <div className="table-cell">
                  3<span className="rd"></span> party
                </div>
                <div className="table-cell">30 mins</div>
              </div>
            </div>
          </div>
          <h5>How to control or delete cookies</h5>
          <div className="sub_text">
            You have the right to choose whether or not to accept cookies and we
            explain how you can exercise this right below. However, please note
            that if you choose to refuse cookies you may not be able to use the
            full functionality of the website.
          </div>
          <div className="sub_text">
            As an alternative, you can block all cookies by activating the
            setting on your browser that allows you to refuse the setting of all
            or some cookies. However, if you use your browser settings to block
            all cookies (including essential cookies) you may not be able to
            access all or parts of our site.
          </div>
          <div className="sub_text">
            If you accept some or all cookies on the website you still have the
            option of setting your browser to notify you when you receive a
            cookie, so that you may determine whether to accept it or not.
          </div>
          <h5>Cookies that have been set in the past</h5>
          <div className="sub_text">
            If you have disabled one or more cookies, we may still use
            information collected from cookies prior to your disabled preference
            being set; however, we will stop using the disabled cookie to
            collect any further information.
          </div>
          <h5>Changes to this Cookie Policy</h5>
          <div className="sub_text">
            We will occasionally update this Cookie Policy to reflect changes in
            our practices and services. When we post changes to this Cookie
            Policy, we will revise the “Last updated” date at the top of this
            Cookie Policy. If we make any material changes in the way we
            collect, use, and/or share information held in cookies, we will
            notify you by prominently posting notice of the changes on the
            website. We recommend that you check this page from time to time to
            inform yourself of any changes in this Cookie Policy or any of our
            other policies.
          </div>
        </section>
      )
    }
    if (i18n.language.startsWith('zh')) {
      return cnProtocol
    } else {
      return enProtocol
    }
  }, [])

  return (
    <div
      className="g2-view-container ey-protocols"
      style={{
        width: clientWidth * 0.75,
        height: clientHieght * 0.75
      }}
    >
      <div className="g2-protocol-content">
        <header className="g2-protocol-header">
          <div className="brand-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="29"
              viewBox="0 0 28 29"
              fill="none"
            >
              <path
                d="M27.7074 0L0.292969 10.3115L27.7074 5.32591V0Z"
                fill="#FFE500"
              />
              <path
                d="M4.68871 23.226H9.69559V20.2312H4.68871V17.8831H10.2409L8.40677 14.582H0.541016V28.8583H11.6291V25.5742H4.68871V23.226ZM19.0156 14.582L16.6691 19.2443L14.3225 14.582H9.71211L14.5538 23.226V28.8583H18.7015V23.226L23.5432 14.582H19.0156Z"
                fill="white"
              />
            </svg>
          </div>
          <div style={{ fontSize: 18 }}>{t('common.ey.policyAndPrivacy')}</div>
        </header>

        <Tabs
          activeKey={scene}
          onChange={key => {
            setScene(key as ProtocolType)
            if (protocolRef?.current) {
              protocolRef.current!.scrollTop = '0px'
            }
          }}
          className={'policy_tabs'}
        >
          <Tabs.TabPane
            tab={t('common.ey.usePolicy')}
            key={ProtocolType.POLICY}
          ></Tabs.TabPane>
          <Tabs.TabPane
            tab={t('common.ey.userPrivacy')}
            key={ProtocolType.PRIVACY}
          ></Tabs.TabPane>
          <Tabs.TabPane
            tab={t('common.ey.cookies')}
            key={ProtocolType.COOKIES}
          ></Tabs.TabPane>
        </Tabs>
        {renderProtocol()[scene]}
      </div>
      <footer>
        <Space size={[16, 0]}>
          {initData.mode === 'Portal' ? (
            <GuardButton type="primary" onClick={initData.onAcceptHandle}>
              {t('common.sure')}
            </GuardButton>
          ) : (
            <>
              <GuardButton type="primary" onClick={initData.onAcceptHandle}>
                {t('common.ey.accept')}
              </GuardButton>
              <GuardButton type="ghost" onClick={initData.onRejectHandle}>
                {t('common.ey.reject')}
              </GuardButton>
            </>
          )}
        </Space>
      </footer>
    </div>
  )
}
