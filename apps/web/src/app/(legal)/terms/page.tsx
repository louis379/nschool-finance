import AppLayout from '@/components/layout/AppLayout';
import { FileText, Mail, ChevronRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const LAST_UPDATED = '2026 年 3 月 22 日';
const COMPANY = 'HowWork 道所';
const PLATFORM = 'nSchool Finance';
const CONTACT = 'louis@howwork.org';

const sections = [
  {
    id: '1',
    title: '服務說明',
    content: [
      {
        subtitle: '',
        text: `${PLATFORM} 是由 ${COMPANY} 開發與營運的財經學習平台，提供以下功能：`,
      },
      {
        list: [
          '財經教育課程：結構化的投資理財知識學習路徑',
          '模擬交易：以虛擬資金練習台股、美股及加密貨幣交易',
          '記帳工具：記錄日常收支，支援 OCR 掃描辨識',
          'AI 財務分析：由 AI 提供個人化的財務健康評估',
          '市場資訊：即時財經新聞與市場動態',
        ],
      },
      {
        subtitle: '',
        text: '本平台所有模擬交易功能均使用虛擬資金，不涉及任何真實金錢交易。',
      },
    ],
  },
  {
    id: '2',
    title: '帳號申請與使用',
    content: [
      {
        subtitle: '申請資格',
        text: '您須年滿 13 歲方可申請帳號。若您未滿 18 歲，請確認已獲得法定代理人同意後再使用本服務。',
      },
      {
        subtitle: '帳號安全',
        text: '您有責任保管您的帳號安全，包括 Google 帳號的登入憑證。任何透過您帳號進行的操作，均由您負責。如發現帳號遭到未授權存取，請立即聯絡我們。',
      },
      {
        subtitle: '帳號停用',
        text: '我們保留在您違反本服務條款時暫停或終止您帳號的權利，不另行通知。您亦可隨時申請刪除帳號。',
      },
    ],
  },
  {
    id: '3',
    title: '使用規範',
    content: [
      {
        subtitle: '許可使用',
        text: `${COMPANY} 授予您個人、非商業性、不可轉讓的使用授權，用於存取和使用 ${PLATFORM} 的功能。`,
      },
      {
        subtitle: '禁止行為',
        text: '使用本服務時，您同意不得從事以下行為：',
      },
      {
        list: [
          '以自動化工具（爬蟲、機器人等）批量存取平台資料',
          '嘗試破解、繞過或干擾平台的安全機制',
          '散布虛假財務資訊或誤導性投資建議',
          '侵犯他人智慧財產權或隱私權',
          '將帳號出借、出租或轉讓給第三方',
          '以任何違反中華民國法律的方式使用本服務',
        ],
      },
    ],
  },
  {
    id: '4',
    title: '內容與智慧財產權',
    content: [
      {
        subtitle: '平台內容所有權',
        text: `${PLATFORM} 上的課程內容、介面設計、品牌標識及相關素材，均為 ${COMPANY} 的智慧財產，受著作權法保護。未經書面授權，不得複製、修改或散布。`,
      },
      {
        subtitle: '使用者資料',
        text: '您輸入的記帳資料、學習進度及模擬交易資料，其所有權屬於您。您授予我們在提供服務所需範圍內使用這些資料的權利。',
      },
    ],
  },
  {
    id: '5',
    title: '投資免責聲明',
    content: [
      {
        subtitle: '僅供教育目的',
        text: `${PLATFORM} 提供的所有財經資訊、課程內容及 AI 分析報告，均僅供教育學習與參考之用，不構成任何投資建議、推薦或勸誘。`,
      },
      {
        subtitle: '模擬交易聲明',
        text: '本平台的模擬交易功能使用虛擬資金，過去的模擬交易表現不代表未來真實投資的結果。真實市場投資具有虧損風險，請謹慎評估後再做決定。',
      },
      {
        subtitle: 'AI 分析限制',
        text: 'AI 財務分析功能基於您提供的資料產生參考意見，可能存在誤差。重大財務決策請諮詢合格的持牌財務顧問。',
      },
    ],
  },
  {
    id: '6',
    title: '服務可用性與變更',
    content: [
      {
        subtitle: '服務穩定性',
        text: '我們致力於提供穩定的服務，但不保證服務永遠無間斷、無錯誤。我們保留在不事先通知的情況下進行維護、暫停或終止服務的權利。',
      },
      {
        subtitle: '功能變更',
        text: '我們可能不定期新增、修改或移除功能。重大功能變更將透過平台公告通知。',
      },
      {
        subtitle: '條款修改',
        text: '我們保留修改本服務條款的權利。條款有重大變更時，將透過平台通知或電子郵件告知您。於通知後繼續使用服務，即表示您接受更新後的條款。',
      },
    ],
  },
  {
    id: '7',
    title: '責任限制',
    content: [
      {
        subtitle: '',
        text: `在法律允許的最大範圍內，${COMPANY} 對於因使用或無法使用本服務所造成的任何直接、間接、附帶或衍生性損害，不承擔賠償責任。此限制包括但不限於資料遺失、利潤損失或業務中斷。`,
      },
    ],
  },
  {
    id: '8',
    title: '準據法與爭議解決',
    content: [
      {
        subtitle: '',
        text: '本服務條款受中華民國法律管轄。如發生爭議，雙方應先以協商方式解決；協商不成時，同意以臺灣臺北地方法院為第一審管轄法院。',
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-[var(--radius-card)] p-6 text-white mb-6 shadow-lg shadow-gray-800/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">服務條款</h1>
              <p className="text-gray-300 text-sm mt-1">{PLATFORM} · {COMPANY}</p>
              <p className="text-gray-400 text-xs mt-2">最後更新：{LAST_UPDATED}</p>
            </div>
          </div>
          <p className="mt-4 text-gray-200 text-sm leading-relaxed">
            請在使用 {PLATFORM} 前仔細閱讀以下服務條款。使用本服務即表示您同意受本條款約束。
          </p>
        </div>

        {/* Investment Disclaimer Banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-[var(--radius-card)] p-4 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">投資風險警示</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              本平台所有內容僅供教育學習用途，不構成投資建議。投資有風險，進行真實交易前請審慎評估，並視需要諮詢持牌財務顧問。
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-[var(--radius-card)] p-5">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0">
                  {section.id}
                </span>
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.content.map((item, i) => (
                  <div key={i}>
                    {'list' in item ? (
                      <ul className="space-y-1.5 pl-1">
                        {item.list!.map((bullet, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0 mt-2" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        {item.subtitle && (
                          <h3 className="text-sm font-semibold text-gray-700 mb-1.5">
                            {item.subtitle}
                          </h3>
                        )}
                        <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-gray-50 border border-gray-100 rounded-[var(--radius-card)] p-5 mt-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">聯絡我們</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                如有任何關於服務條款的疑問，請聯絡：
              </p>
              <a
                href={`mailto:${CONTACT}`}
                className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                {CONTACT}
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
              <p className="text-xs text-gray-400 mt-2">
                {COMPANY} · 本條款受中華民國法律管轄
              </p>
            </div>
          </div>
        </div>

        {/* Link to Privacy */}
        <div className="mt-4 pb-4 text-center">
          <Link
            href="/privacy"
            className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
          >
            查看隱私權政策 →
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
