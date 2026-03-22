import AppLayout from '@/components/layout/AppLayout';
import { Shield, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const LAST_UPDATED = '2026 年 3 月 22 日';
const COMPANY = 'HowWork 道所';
const PLATFORM = 'nSchool Finance';
const CONTACT = 'louis@howwork.org';

const sections = [
  {
    id: '1',
    title: '我們收集哪些資料',
    content: [
      {
        subtitle: '帳號資訊（Google 登入）',
        text: '當您使用 Google 帳號登入時，我們會取得 Google OAuth 授權後提供的基本資料，包括您的電子郵件地址、顯示名稱及大頭貼照片。我們不會取得您的 Google 帳號密碼。',
      },
      {
        subtitle: '使用行為資料',
        text: '為了提供個人化學習體驗，我們會記錄您在平台上的學習進度、模擬交易紀錄、記帳資料及功能使用情形。此類資料僅儲存於您的帳號中，用於還原您的個人設定與進度。',
      },
      {
        subtitle: '裝置與日誌資料',
        text: '我們可能自動收集您的 IP 位址、瀏覽器類型、作業系統版本及存取時間等技術資訊，用於維護平台穩定性與安全性。',
      },
    ],
  },
  {
    id: '2',
    title: '資料的使用目的',
    content: [
      {
        subtitle: '帳號識別與驗證',
        text: '使用您的電子郵件地址作為帳號唯一識別，確保您的資料安全存取。',
      },
      {
        subtitle: '個人化學習體驗',
        text: '根據您的學習進度、風險偏好設定及使用習慣，提供適合您的課程推薦與投資知識內容。',
      },
      {
        subtitle: '功能運作',
        text: '記帳資料、模擬投資組合、學習進度等功能需要儲存您的資料才能正常運作。',
      },
      {
        subtitle: '服務改進',
        text: '透過匿名化的統計分析了解功能使用狀況，持續優化平台體驗。我們不會將個人可識別資料用於廣告投放。',
      },
    ],
  },
  {
    id: '3',
    title: '資料的儲存與保護',
    content: [
      {
        subtitle: '儲存位置',
        text: `您的資料儲存於 Supabase 提供的雲端資料庫服務（位於安全的資料中心）。${COMPANY} 採用業界標準的加密傳輸協定（HTTPS/TLS）保護資料傳輸安全。`,
      },
      {
        subtitle: '存取控制',
        text: '僅授權的系統服務可存取您的個人資料。我們不會出售、租借或以其他商業目的將您的個人資料提供給第三方。',
      },
      {
        subtitle: '資料保留',
        text: '您的帳號資料在帳號有效期間內保留。若您申請刪除帳號，我們將在 30 天內刪除您的個人資料（法律要求保留的資料除外）。',
      },
    ],
  },
  {
    id: '4',
    title: '第三方服務',
    content: [
      {
        subtitle: 'Google OAuth',
        text: '我們使用 Google 身份驗證服務處理登入流程。Google 的隱私權政策適用於您與 Google 的互動，請參閱 Google 隱私權政策（policies.google.com）。',
      },
      {
        subtitle: 'Anthropic Claude AI',
        text: `${PLATFORM} 使用 Anthropic 的 Claude AI 提供財務分析功能。您送出的分析請求內容可能由 AI 服務處理，但不包含您的帳號個人識別資料。`,
      },
    ],
  },
  {
    id: '5',
    title: 'Cookie 與本地儲存',
    content: [
      {
        subtitle: '必要性 Cookie',
        text: '我們使用 Cookie 儲存登入狀態（Session Token），讓您在不同頁面間維持登入狀態。這些 Cookie 是平台正常運作的必要元件。',
      },
      {
        subtitle: '本地儲存（LocalStorage）',
        text: '部分偏好設定（如介面設定）可能儲存於您的裝置本地。您可透過瀏覽器設定清除這些資料。',
      },
    ],
  },
  {
    id: '6',
    title: '您的權利',
    content: [
      {
        subtitle: '查閱與更正',
        text: '您有權查閱我們持有的您的個人資料，並要求更正不正確的資訊。',
      },
      {
        subtitle: '資料刪除',
        text: '您可以隨時要求刪除您的帳號及相關資料。請寄送電子郵件至下方聯絡信箱提出申請。',
      },
      {
        subtitle: '撤回同意',
        text: '您可以隨時撤回對特定資料處理的同意，但此舉可能影響部分服務功能的正常使用。',
      },
    ],
  },
  {
    id: '7',
    title: '未成年人保護',
    content: [
      {
        subtitle: '',
        text: `${PLATFORM} 的服務對象為 13 歲以上用戶。若我們得知已收集 13 歲以下兒童的個人資料，將立即予以刪除。若您認為我們誤收了未成年人的資料，請聯絡我們。`,
      },
    ],
  },
  {
    id: '8',
    title: '政策變更',
    content: [
      {
        subtitle: '',
        text: '我們可能不定期更新本隱私權政策。政策有重大變更時，我們將透過平台通知或電子郵件告知您。繼續使用服務即表示您同意更新後的政策。',
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[var(--radius-card)] p-6 text-white mb-6 shadow-lg shadow-primary-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">隱私權政策</h1>
              <p className="text-primary-200 text-sm mt-1">{PLATFORM} · {COMPANY}</p>
              <p className="text-primary-300 text-xs mt-2">最後更新：{LAST_UPDATED}</p>
            </div>
          </div>
          <p className="mt-4 text-primary-100 text-sm leading-relaxed">
            {COMPANY}（以下簡稱「我們」）重視您的隱私。本政策說明我們在您使用 {PLATFORM} 時如何收集、使用及保護您的個人資料。
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-[var(--radius-card)] p-5">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center shrink-0">
                  {section.id}
                </span>
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.map((item, i) => (
                  <div key={i}>
                    {item.subtitle && (
                      <h3 className="text-sm font-semibold text-gray-700 mb-1.5">
                        {item.subtitle}
                      </h3>
                    )}
                    <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-primary-50 border border-primary-100 rounded-[var(--radius-card)] p-5 mt-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">聯絡我們</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                如有任何關於隱私權的疑問或請求，請寄送電子郵件至：
              </p>
              <a
                href={`mailto:${CONTACT}`}
                className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                {CONTACT}
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
              <p className="text-xs text-gray-400 mt-2">
                {COMPANY} · 本政策受中華民國法律管轄
              </p>
            </div>
          </div>
        </div>

        {/* Link to Terms */}
        <div className="mt-4 pb-4 text-center">
          <Link
            href="/terms"
            className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
          >
            查看服務條款 →
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
