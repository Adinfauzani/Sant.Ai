"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Copy, Link2, ShieldCheck, BarChart3, Handshake } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getStorage, setStorage } from "@/lib/storage";
import { LegalBackButton } from "@/components/legal/legalCard";

const languages = ["English", "Bahasa Indonesia"];

const translations = {
  English: {
    subtitle: "How Sant.Ai collects, uses, and protects your information.",
    lastUpdated: "Last Updated",
    readingTime: "Reading Time",
    language: "Language",
    toc: "On this page",
    copy: "Copy link",
    copied: "Section link copied",
    trust: [
      { title: "Privacy First", description: "We prioritize responsible handling of personal information.", icon: ShieldCheck },
      { title: "Secure Authentication", description: "Protected through modern authentication providers and secure sessions.", icon: ShieldCheck },
      { title: "Responsible Analytics", description: "Usage data helps improve security and platform performance.", icon: BarChart3 },
      { title: "Transparency", description: "We clearly explain how information is collected and used.", icon: Handshake },
    ],
    sections: [
      { id: "introduction", title: "Introduction", paragraphs: ["Your privacy matters to us.", "Sant.Ai is committed to protecting personal information and maintaining transparency about how data is collected and used throughout the platform.", "This Privacy Policy explains what information we collect, why we collect it, and how we protect it."] },
      { id: "information-we-collect", title: "Information We Collect", paragraphs: ["When creating an account, we may collect your name, email address, study program, optional profile photo, and optional biography.", "We only collect information necessary to provide platform services and improve user experience."] },
      { id: "authentication", title: "Authentication", paragraphs: ["Sant.Ai supports authentication through Google, GitHub, and email with password.", "Passwords are securely hashed and never stored in plain text.", "Authentication providers may process data according to their own privacy policies."] },
      { id: "how-we-use-information", title: "How We Use Information", paragraphs: ["Information may be used to create and manage accounts, personalize user experiences, improve platform functionality, protect platform security, support community activities, and provide analytics and research tools.", "We do not sell personal information to third parties."] },
      { id: "analytics-and-usage-data", title: "Analytics and Usage Data", paragraphs: ["To improve platform performance and security, we may collect login activity, session information, device information, usage statistics, and error reports.", "This information helps us understand how the platform is used and identify areas for improvement."] },
      { id: "data-intelligence-sources", title: "Data Intelligence Sources", paragraphs: ["The Data Intelligence section aggregates information from publicly available sources such as RSS Feeds, News Websites, GNews API, and YouTube Data API.", "Sant.Ai does not claim ownership of third-party content displayed through these services."] },
      { id: "cookies-and-preferences", title: "Cookies and Preferences", paragraphs: ["Cookies may be used to maintain authentication sessions, remember preferences, improve usability, and enhance platform security.", "Users may manage cookie settings through their browser preferences."] },
      { id: "data-security", title: "Data Security", paragraphs: ["We implement industry-standard security practices including secure HTTPS connections, encrypted communication, session protection, database security controls, and access restrictions.", "While no system can guarantee absolute security, we continuously work to protect user information."] },
      { id: "data-retention", title: "Data Retention", paragraphs: ["Personal information is retained only as long as necessary to provide services, comply with legal obligations, and maintain platform functionality.", "Users may request account removal at any time."] },
      { id: "your-rights", title: "Your Rights", paragraphs: ["Users may access personal information, update profile details, request account deletion, or request personal data export.", "Requests may be submitted through official Sant.Ai support channels."] },
      { id: "third-party-services", title: "Third-Party Services", paragraphs: ["Sant.Ai integrates with Google Authentication, GitHub Authentication, YouTube Data API, and GNews API.", "These services maintain independent privacy policies and data practices. Users are encouraged to review those policies separately."] },
      { id: "policy-updates", title: "Policy Updates", paragraphs: ["This Privacy Policy may be updated periodically to reflect platform improvements, legal requirements, or operational changes.", "Significant updates will be communicated through the platform whenever appropriate."] },
      { id: "contact", title: "Contact", paragraphs: ["Questions regarding this Privacy Policy may be directed to the Sant.Ai administration team through official communication channels."] },
    ],
  },
  "Bahasa Indonesia": {
    subtitle: "Bagaimana Sant.Ai mengumpulkan, menggunakan, dan melindungi informasi Anda.",
    lastUpdated: "Terakhir Diperbarui",
    readingTime: "Waktu Baca",
    language: "Bahasa",
    toc: "Di halaman ini",
    copy: "Salin tautan",
    copied: "Tautan bagian disalin",
    trust: [
      { title: "Privasi Utama", description: "Kami mengutamakan penanganan informasi pribadi secara bertanggung jawab.", icon: ShieldCheck },
      { title: "Autentikasi Aman", description: "Dilindungi melalui penyedia autentikasi modern dan sesi yang aman.", icon: ShieldCheck },
      { title: "Analitik yang Bertanggung Jawab", description: "Data penggunaan membantu meningkatkan keamanan dan performa platform.", icon: BarChart3 },
      { title: "Transparansi", description: "Kami menjelaskan secara jelas bagaimana informasi dikumpulkan dan digunakan.", icon: Handshake },
    ],
    sections: [
      { id: "introduction", title: "Pendahuluan", paragraphs: ["Privasi Anda penting bagi kami.", "Sant.Ai berkomitmen melindungi informasi pribadi dan menjaga transparansi tentang bagaimana data dikumpulkan dan digunakan di seluruh platform.", "Kebijakan Privasi ini menjelaskan informasi yang kami kumpulkan, alasan pengumpulannya, dan cara kami melindunginya."] },
      { id: "information-we-collect", title: "Informasi yang Kami Kumpulkan", paragraphs: ["Saat membuat akun, kami dapat mengumpulkan nama, alamat email, program studi, foto profil opsional, dan biografi opsional.", "Kami hanya mengumpulkan informasi yang diperlukan untuk menyediakan layanan platform dan meningkatkan pengalaman pengguna."] },
      { id: "authentication", title: "Autentikasi", paragraphs: ["Sant.Ai mendukung autentikasi melalui Google, GitHub, dan email dengan kata sandi.", "Kata sandi di-hash secara aman dan tidak pernah disimpan dalam bentuk teks biasa.", "Penyedia autentikasi dapat memproses data sesuai kebijakan privasi mereka masing-masing."] },
      { id: "how-we-use-information", title: "Cara Kami Menggunakan Informasi", paragraphs: ["Informasi dapat digunakan untuk membuat dan mengelola akun, mempersonalisasi pengalaman pengguna, meningkatkan fungsionalitas platform, melindungi keamanan platform, mendukung aktivitas komunitas, dan menyediakan alat analitik serta riset.", "Kami tidak menjual informasi pribadi kepada pihak ketiga."] },
      { id: "analytics-and-usage-data", title: "Analitik dan Data Penggunaan", paragraphs: ["Untuk meningkatkan performa dan keamanan platform, kami dapat mengumpulkan aktivitas login, informasi sesi, informasi perangkat, statistik penggunaan, dan laporan error.", "Informasi ini membantu kami memahami penggunaan platform dan menemukan area yang perlu ditingkatkan."] },
      { id: "data-intelligence-sources", title: "Sumber Data Intelligence", paragraphs: ["Bagian Data Intelligence mengagregasi informasi dari sumber publik seperti RSS Feeds, situs berita, GNews API, dan YouTube Data API.", "Sant.Ai tidak mengklaim kepemilikan atas konten pihak ketiga yang ditampilkan melalui layanan ini."] },
      { id: "cookies-and-preferences", title: "Cookie dan Preferensi", paragraphs: ["Cookie dapat digunakan untuk menjaga sesi autentikasi, mengingat preferensi, meningkatkan kemudahan penggunaan, dan meningkatkan keamanan platform.", "Pengguna dapat mengelola pengaturan cookie melalui preferensi browser."] },
      { id: "data-security", title: "Keamanan Data", paragraphs: ["Kami menerapkan praktik keamanan standar industri seperti koneksi HTTPS aman, komunikasi terenkripsi, perlindungan sesi, kontrol keamanan database, dan pembatasan akses.", "Meskipun tidak ada sistem yang dapat menjamin keamanan mutlak, kami terus berupaya melindungi informasi pengguna."] },
      { id: "data-retention", title: "Retensi Data", paragraphs: ["Informasi pribadi disimpan hanya selama diperlukan untuk menyediakan layanan, mematuhi kewajiban hukum, dan menjaga fungsionalitas platform.", "Pengguna dapat meminta penghapusan akun kapan saja."] },
      { id: "your-rights", title: "Hak Anda", paragraphs: ["Pengguna dapat mengakses informasi pribadi, memperbarui detail profil, meminta penghapusan akun, atau meminta ekspor data pribadi.", "Permintaan dapat dikirimkan melalui saluran dukungan resmi Sant.Ai."] },
      { id: "third-party-services", title: "Layanan Pihak Ketiga", paragraphs: ["Sant.Ai terintegrasi dengan Google Authentication, GitHub Authentication, YouTube Data API, dan GNews API.", "Layanan ini memiliki kebijakan privasi dan praktik data independen. Pengguna disarankan meninjau kebijakan tersebut secara terpisah."] },
      { id: "policy-updates", title: "Pembaruan Kebijakan", paragraphs: ["Kebijakan Privasi ini dapat diperbarui secara berkala untuk mencerminkan peningkatan platform, kebutuhan hukum, atau perubahan operasional.", "Pembaruan penting akan dikomunikasikan melalui platform apabila sesuai."] },
      { id: "contact", title: "Kontak", paragraphs: ["Pertanyaan terkait Kebijakan Privasi ini dapat diarahkan kepada tim administrasi Sant.Ai melalui saluran komunikasi resmi."] },
    ],
  },
  Arabic: {
    subtitle: "كيف تجمع Sant.Ai معلوماتك وتستخدمها وتحميها.",
    lastUpdated: "آخر تحديث",
    readingTime: "وقت القراءة",
    language: "اللغة",
    toc: "في هذه الصفحة",
    copy: "نسخ الرابط",
    copied: "تم نسخ رابط القسم",
    trust: [
      { title: "الخصوصية أولاً", description: "نولي أولوية للتعامل المسؤول مع المعلومات الشخصية.", icon: ShieldCheck },
      { title: "مصادقة آمنة", description: "محمية عبر مزودي مصادقة حديثة وجلسات آمنة.", icon: ShieldCheck },
      { title: "تحليلات مسؤولة", description: "تساعد بيانات الاستخدام على تحسين الأمان وأداء المنصة.", icon: BarChart3 },
      { title: "الشفافية", description: "نوضح بوضوح كيفية جمع المعلومات واستخدامها.", icon: Handshake },
    ],
    sections: [
      { id: "introduction", title: "المقدمة", paragraphs: ["خصوصيتك مهمة بالنسبة لنا.", "تلتزم Sant.Ai بحماية المعلومات الشخصية والحفاظ على الشفافية حول كيفية جمع البيانات واستخدامها عبر المنصة.", "توضح سياسة الخصوصية هذه المعلومات التي نجمعها وسبب جمعها وكيفية حمايتها."] },
      { id: "information-we-collect", title: "المعلومات التي نجمعها", paragraphs: ["عند إنشاء حساب، قد نجمع الاسم وعنوان البريد الإلكتروني والبرنامج الدراسي وصورة الملف الشخصي الاختيارية والسيرة الاختيارية.", "نجمع فقط المعلومات اللازمة لتقديم خدمات المنصة وتحسين تجربة المستخدم."] },
      { id: "authentication", title: "المصادقة", paragraphs: ["تدعم Sant.Ai المصادقة عبر Google وGitHub والبريد الإلكتروني وكلمة المرور.", "يتم تجزئة كلمات المرور بشكل آمن ولا تُخزن كنص عادي.", "قد تعالج مزودو المصادقة البيانات وفقًا لسياسات الخصوصية الخاصة بهم."] },
      { id: "how-we-use-information", title: "كيف نستخدم المعلومات", paragraphs: ["قد تُستخدم المعلومات لإنشاء الحسابات وإدارتها وتخصيص تجارب المستخدم وتحسين وظائف المنصة وحماية أمان المنصة ودعم أنشطة المجتمع وتوفير أدوات التحليلات والبحث.", "لا نبيع المعلومات الشخصية لأطراف ثالثة."] },
      { id: "analytics-and-usage-data", title: "التحليلات وبيانات الاستخدام", paragraphs: ["لتحسين أداء المنصة وأمانها، قد نجمع نشاط تسجيل الدخول ومعلومات الجلسة ومعلومات الجهاز وإحصائيات الاستخدام وتقارير الأخطاء.", "تساعد هذه المعلومات على فهم كيفية استخدام المنصة وتحديد مجالات التحسين."] },
      { id: "data-intelligence-sources", title: "مصادر ذكاء البيانات", paragraphs: ["يجمع قسم ذكاء البيانات معلومات من مصادر متاحة للعامة مثل خلاصات RSS ومواقع الأخبار وGNews API وYouTube Data API.", "لا تدعي Sant.Ai ملكية محتوى الجهات الخارجية المعروض عبر هذه الخدمات."] },
      { id: "cookies-and-preferences", title: "ملفات تعريف الارتباط والتفضيلات", paragraphs: ["قد تُستخدم ملفات تعريف الارتباط للحفاظ على جلسات المصادقة وتذكر التفضيلات وتحسين سهولة الاستخدام وتعزيز أمان المنصة.", "يمكن للمستخدمين إدارة إعدادات ملفات تعريف الارتباط عبر تفضيلات المتصفح."] },
      { id: "data-security", title: "أمان البيانات", paragraphs: ["نطبق ممارسات أمان معيارية تشمل اتصالات HTTPS آمنة واتصالاً مشفرًا وحماية الجلسات وضوابط أمان قاعدة البيانات وقيود الوصول.", "رغم أنه لا يمكن لأي نظام ضمان الأمان المطلق، فإننا نعمل باستمرار على حماية معلومات المستخدم."] },
      { id: "data-retention", title: "الاحتفاظ بالبيانات", paragraphs: ["تُحتفظ بالمعلومات الشخصية فقط طالما كان ذلك ضروريًا لتقديم الخدمات والامتثال للالتزامات القانونية والحفاظ على وظائف المنصة.", "يمكن للمستخدمين طلب إزالة الحساب في أي وقت."] },
      { id: "your-rights", title: "حقوقك", paragraphs: ["يمكن للمستخدمين الوصول إلى المعلومات الشخصية وتحديث تفاصيل الملف الشخصي وطلب حذف الحساب أو طلب تصدير البيانات الشخصية.", "يمكن إرسال الطلبات عبر قنوات دعم Sant.Ai الرسمية."] },
      { id: "third-party-services", title: "خدمات الجهات الخارجية", paragraphs: ["تتكامل Sant.Ai مع مصادقة Google ومصادقة GitHub وYouTube Data API وGNews API.", "تحتفظ هذه الخدمات بسياسات خصوصية وممارسات بيانات مستقلة. يُنصح المستخدمون بمراجعة تلك السياسات بشكل منفصل."] },
      { id: "policy-updates", title: "تحديثات السياسة", paragraphs: ["قد يتم تحديث سياسة الخصوصية هذه دوريًا لتعكس تحسينات المنصة أو المتطلبات القانونية أو التغييرات التشغيلية.", "سيتم إبلاغ التحديثات المهمة عبر المنصة عند الاقتضاء."] },
      { id: "contact", title: "الاتصال", paragraphs: ["يمكن توجيه الأسئلة المتعلقة بسياسة الخصوصية هذه إلى فريق إدارة Sant.Ai عبر قنوات الاتصال الرسمية."] },
    ],
  },
  Japanese: {
    subtitle: "Sant.Ai が情報を収集、利用、保護する方法。",
    lastUpdated: "最終更新",
    readingTime: "読了時間",
    language: "言語",
    toc: "このページ",
    copy: "リンクをコピー",
    copied: "セクションリンクをコピーしました",
    trust: [
      { title: "プライバシー優先", description: "個人情報の責任ある取り扱いを優先します。", icon: ShieldCheck },
      { title: "安全な認証", description: "最新の認証プロバイダーと安全なセッションで保護されます。", icon: ShieldCheck },
      { title: "責任ある分析", description: "利用データはセキュリティとプラットフォーム性能の改善に役立ちます。", icon: BarChart3 },
      { title: "透明性", description: "情報の収集と利用方法を明確に説明します。", icon: Handshake },
    ],
    sections: [
      { id: "introduction", title: "はじめに", paragraphs: ["あなたのプライバシーは私たちにとって重要です。", "Sant.Ai は個人情報を保護し、プラットフォーム全体でデータがどのように収集・利用されるかについて透明性を保つことを約束します。", "このプライバシーポリシーは、収集する情報、収集理由、保護方法を説明します。"] },
      { id: "information-we-collect", title: "収集する情報", paragraphs: ["アカウント作成時に、名前、メールアドレス、所属プログラム、任意のプロフィール写真、任意の自己紹介を取得する場合があります。", "プラットフォームサービスの提供とユーザー体験の向上に必要な情報のみ収集します。"] },
      { id: "authentication", title: "認証", paragraphs: ["Sant.Ai は Google、GitHub、メールとパスワードによる認証をサポートします。", "パスワードは安全にハッシュ化され、平文で保存されることはありません。", "認証プロバイダーは、それぞれのプライバシーポリシーに従ってデータを処理する場合があります。"] },
      { id: "how-we-use-information", title: "情報の利用方法", paragraphs: ["情報はアカウントの作成・管理、ユーザー体験のパーソナライズ、プラットフォーム機能の改善、セキュリティ保護、コミュニティ活動の支援、分析・研究ツールの提供に利用される場合があります。", "個人情報を第三者に販売することはありません。"] },
      { id: "analytics-and-usage-data", title: "分析と利用データ", paragraphs: ["プラットフォームの性能とセキュリティを改善するため、ログイン活動、セッション情報、デバイス情報、利用統計、エラーレポートを収集する場合があります。", "この情報はプラットフォームの利用状況を理解し、改善点を特定するのに役立ちます。"] },
      { id: "data-intelligence-sources", title: "データインテリジェンスの情報源", paragraphs: ["データインテリジェンスセクションは、RSS フィード、ニュースサイト、GNews API、YouTube Data API などの公開情報源から情報を集約します。", "Sant.Ai はこれらのサービスを通じて表示される第三者コンテンツの所有権を主張しません。"] },
      { id: "cookies-and-preferences", title: "Cookie と設定", paragraphs: ["Cookie は認証セッションの維持、設定の記憶、使いやすさの向上、プラットフォームセキュリティの強化に使用される場合があります。", "ユーザーはブラウザ設定を通じて Cookie 設定を管理できます。"] },
      { id: "data-security", title: "データセキュリティ", paragraphs: ["安全な HTTPS 接続、暗号化通信、セッション保護、データベースセキュリティ制御、アクセス制限などの業界標準のセキュリティ対策を実施しています。", "完全なセキュリティを保証できるシステムはありませんが、ユーザー情報保護に継続的に取り組んでいます。"] },
      { id: "data-retention", title: "データ保持", paragraphs: ["個人情報は、サービス提供、法的義務履行、プラットフォーム機能維持に必要な期間のみ保持します。", "ユーザーはいつでもアカウント削除を請求できます。"] },
      { id: "your-rights", title: "あなたの権利", paragraphs: ["ユーザーは個人情報へのアクセス、プロフィール情報の更新、アカウント削除の請求、個人データのエクスポート請求を行えます。", "請求は Sant.Ai の公式サポートチャネルを通じて提出できます。"] },
      { id: "third-party-services", title: "第三者サービス", paragraphs: ["Sant.Ai は Google Authentication、GitHub Authentication、YouTube Data API、GNews API と連携します。", "これらのサービスは独自のプライバシーポリシーとデータ慣行を有しています。ユーザーはそれらのポリシーを個別に確認することをお勧めします。"] },
      { id: "policy-updates", title: "ポリシー更新", paragraphs: ["このプライバシーポリシーは、プラットフォーム改善、法的要件、運用変更を反映するため定期的に更新される場合があります。", "重要な更新は、適切な場合にプラットフォームを通じて通知されます。"] },
      { id: "contact", title: "お問い合わせ", paragraphs: ["このプライバシーポリシーに関する質問は、公式連絡チャネルを通じて Sant.Ai 管理チームに問い合わせることができます。"] },
    ],
  },
  Korean: {
    subtitle: "Sant.Ai 이 정보를 수집, 사용, 보호하는 방법입니다.",
    lastUpdated: "최종 업데이트",
    readingTime: "읽는 시간",
    language: "언어",
    toc: "이 페이지",
    copy: "링크 복사",
    copied: "섹션 링크가 복사되었습니다",
    trust: [
      { title: "개인정보 우선", description: "개인정보의 책임 있는 처리를 최우선으로 생각합니다.", icon: ShieldCheck },
      { title: "안전한 인증", description: "최신 인증 제공자와 안전한 세션으로 보호됩니다.", icon: ShieldCheck },
      { title: "책임 있는 분석", description: "사용 데이터는 보안과 플랫폼 성능 개선에 활용됩니다.", icon: BarChart3 },
      { title: "투명성", description: "정보 수집 및 사용 방식을 명확히 설명합니다.", icon: Handshake },
    ],
    sections: [
      { id: "introduction", title: "소개", paragraphs: ["귀하의 개인정보는 중요합니다.", "Sant.Ai 은 개인정보를 보호하고 플랫폼 전반에서 데이터가 어떻게 수집되고 사용되는지 투명하게 설명하는 데 전념합니다.", "본 개인정보 처리방침은 수집하는 정보, 수집 이유, 보호 방법을 설명합니다."] },
      { id: "information-we-collect", title: "수집하는 정보", paragraphs: ["계정을 만들 때 이름, 이메일 주소, 전공 프로그램, 선택 프로필 사진, 선택 자기소개를 수집할 수 있습니다.", "플랫폼 서비스 제공과 사용자 경험 개선을 위해 필요한 정보만 수집합니다."] },
      { id: "authentication", title: "인증", paragraphs: ["Sant.Ai 은 Google, GitHub, 이메일과 비밀번호 인증을 지원합니다.", "비밀번호는 안전하게 해시되며 평문으로 저장되지 않습니다.", "인증 제공자는 자체 개인정보 처리방침에 따라 데이터를 처리할 수 있습니다."] },
      { id: "how-we-use-information", title: "정보 사용 방법", paragraphs: ["정보는 계정 생성 및 관리, 사용자 경험 개인화, 플랫폼 기능 개선, 보안 보호, 커뮤니티 활동 지원, 분석 및 연구 도구 제공에 사용될 수 있습니다.", "우리는 개인정보를 제3자에게 판매하지 않습니다."] },
      { id: "analytics-and-usage-data", title: "분석 및 사용 데이터", paragraphs: ["플랫폼 성능과 보안을 개선하기 위해 로그인 활동, 세션 정보, 장치 정보, 사용 통계, 오류 보고서를 수집할 수 있습니다.", "이 정보는 플랫폼 사용 방식을 이해하고 개선 영역을 식별하는 데 도움이 됩니다."] },
      { id: "data-intelligence-sources", title: "데이터 인텔리전스 출처", paragraphs: ["데이터 인텔리전스 섹션은 RSS 피드, 뉴스 웹사이트, GNews API, YouTube Data API 와 같은 공개 출처의 정보를 집계합니다.", "Sant.Ai 은 이러한 서비스를 통해 표시되는 제3자 콘텐츠의 소유권을 주장하지 않습니다."] },
      { id: "cookies-and-preferences", title: "쿠키 및 설정", paragraphs: ["쿠키는 인증 세션 유지, 설정 기억, 사용성 개선, 플랫폼 보안 강화에 사용될 수 있습니다.", "사용자는 브라우저 설정을 통해 쿠키 설정을 관리할 수 있습니다."] },
      { id: "data-security", title: "데이터 보안", paragraphs: ["안전한 HTTPS 연결, 암호화 통신, 세션 보호, 데이터베이스 보안 제어, 접근 제한 등 업계 표준 보안 관행을 적용합니다.", "어떤 시스템도 절대 보안을 보장할 수는 없지만, 우리는 사용자 정보 보호를 위해 지속적으로 노력합니다."] },
      { id: "data-retention", title: "데이터 보관", paragraphs: ["개인정보는 서비스 제공, 법적 의무 준수, 플랫폼 기능 유지에 필요한 기간 동안만 보관됩니다.", "사용자는 언제든지 계정 삭제를 요청할 수 있습니다."] },
      { id: "your-rights", title: "귀하의 권리", paragraphs: ["사용자는 개인정보 접근, 프로필 세부정보 업데이트, 계정 삭제 요청, 개인 데이터 내보내기 요청을 할 수 있습니다.", "요청은 Sant.Ai 공식 지원 채널을 통해 제출할 수 있습니다."] },
      { id: "third-party-services", title: "제3자 서비스", paragraphs: ["Sant.Ai 은 Google Authentication, GitHub Authentication, YouTube Data API, GNews API 와 통합됩니다.", "이들 서비스는 독립적인 개인정보 처리방침과 데이터 관행을 유지합니다. 사용자는 해당 정책을 별도로 검토하는 것이 좋습니다."] },
      { id: "policy-updates", title: "정책 업데이트", paragraphs: ["본 개인정보 처리방침은 플랫폼 개선, 법적 요구사항 또는 운영 변경을 반영하기 위해 정기적으로 업데이트될 수 있습니다.", "중요한 업데이트는 적절한 경우 플랫폼을 통해 공지됩니다."] },
      { id: "contact", title: "문의", paragraphs: ["본 개인정보 처리방침에 대한 질문은 공식 통신 채널을 통해 Sant.Ai 관리 팀에 문의할 수 있습니다."] },
    ],
  },
  "Chinese (Simplified)": {
    subtitle: "Sant.Ai 如何收集、使用和保护您的信息。",
    lastUpdated: "最后更新",
    readingTime: "阅读时间",
    language: "语言",
    toc: "在本页",
    copy: "复制链接",
    copied: "章节链接已复制",
    trust: [
      { title: "隐私优先", description: "我们优先负责任地处理个人信息。", icon: ShieldCheck },
      { title: "安全认证", description: "通过现代认证提供商和安全会话进行保护。", icon: ShieldCheck },
      { title: "负责任的分析和研究", description: "使用数据有助于提升安全性和平台性能。", icon: BarChart3 },
      { title: "透明", description: "我们清楚说明信息的收集和使用方式。", icon: Handshake },
    ],
    sections: [
      { id: "introduction", title: "引言", paragraphs: ["您的隐私对我们很重要。", "Sant.Ai 致力于保护个人信息，并对整个平台中数据的收集和使用保持透明。", "本隐私政策说明我们收集哪些信息、为何收集以及如何保护这些信息。"] },
      { id: "information-we-collect", title: "我们收集的信息", paragraphs: ["创建账户时，我们可能会收集姓名、电子邮件地址、学习项目、可选头像和可选简介。", "我们只收集提供平台服务和改善用户体验所必需的信息。"] },
      { id: "authentication", title: "认证", paragraphs: ["Sant.Ai 支持通过 Google、GitHub 以及电子邮件和密码进行认证。", "密码会安全哈希存储，绝不会以明文保存。", "认证提供商可能会根据其自身的隐私政策处理数据。"] },
      { id: "how-we-use-information", title: "我们如何使用信息", paragraphs: ["信息可用于创建和管理账户、个性化用户体验、改进平台功能、保护平台安全、支持社区活动以及提供分析和研究工具。", "我们不会向第三方出售个人信息。"] },
      { id: "analytics-and-usage-data", title: "分析和使用数据", paragraphs: ["为了提升平台性能和安全性，我们可能会收集登录活动、会话信息、设备信息、使用统计和错误报告。", "这些信息帮助我们了解平台使用情况并识别改进空间。"] },
      { id: "data-intelligence-sources", title: "数据智能来源", paragraphs: ["数据智能部分会汇总来自公开来源的信息，例如 RSS 订阅、新闻网站、GNews API 和 YouTube Data API。", "Sant.Ai 不主张拥有通过这些服务展示的第三方内容。"] },
      { id: "cookies-and-preferences", title: "Cookie 和偏好设置", paragraphs: ["Cookie 可用于维持认证会话、记住偏好设置、改善易用性并增强平台安全。", "用户可以通过浏览器偏好设置管理 Cookie。"] },
      { id: "data-security", title: "数据安全", paragraphs: ["我们实施行业标准安全实践，包括安全 HTTPS 连接、加密通信、会话保护、数据库安全控制和访问限制。", "虽然没有任何系统能保证绝对安全，但我们会持续努力保护用户信息。"] },
      { id: "data-retention", title: "数据保留", paragraphs: ["个人信息仅在提供服务、履行法律义务和维持平台功能所需的时间内保留。", "用户可以随时请求删除账户。"] },
      { id: "your-rights", title: "您的权利", paragraphs: ["用户可以访问个人信息、更新个人资料、请求删除账户或请求导出个人数据。", "请求可通过 Sant.Ai 官方支持渠道提交。"] },
      { id: "third-party-services", title: "第三方服务", paragraphs: ["Sant.Ai 与 Google Authentication、GitHub Authentication、YouTube Data API 和 GNews API 集成。", "这些服务拥有独立的隐私政策和数据实践。建议用户分别查看这些政策。"] },
      { id: "policy-updates", title: "政策更新", paragraphs: ["本隐私政策可能会定期更新，以反映平台改进、法律要求或运营变化。", "重大更新将在适当时通过平台通知。"] },
      { id: "contact", title: "联系", paragraphs: ["有关本隐私政策的问题，可通过官方沟通渠道联系 Sant.Ai 管理团队。"] },
    ],
  },
};

type LanguageKey = keyof typeof translations;

export default function PrivacyPage() {
  const [language, setLanguage] = useState<LanguageKey>("English");
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("introduction");
  const [progress, setProgress] = useState(0);
  const content = translations[language];

  useEffect(() => {
    const stored = getStorage("privacy-language") as LanguageKey | null;
    if (stored && translations[stored]) setLanguage(stored);
  }, []);

  useEffect(() => {
    setStorage("privacy-language", language);
  }, [language]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: "-35% 0px -55% 0px" });

    content.sections.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [content.sections]);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.getElementById("privacy-content");
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const max = article.offsetHeight - window.innerHeight + rect.top;
      const current = max > 0 ? Math.min(100, Math.max(0, (-rect.top / max) * 100)) : 0;
      setProgress(current);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, [language]);

  const copySection = async (id: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/legal/privacy#${id}`);
    toast.success(content.copied);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 h-1 bg-border">
        <div className="h-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_30%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_32%)]" />
        <div className="container-main relative py-12 md:py-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">Privacy Policy</p>
              <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-text md:text-6xl">Privacy Policy</h1>
              <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{content.subtitle}</p>
              <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-muted">
                <span className="rounded-full border border-border bg-surface/50 px-3 py-1.5">Last Updated: June 2026</span>
                <span className="rounded-full border border-border bg-surface/50 px-3 py-1.5">Reading Time: 5 min</span>
                <span className="rounded-full border border-border bg-surface/50 px-3 py-1.5">Version 0.1.0</span>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex h-11 items-center gap-2 rounded-xl border border-border bg-surface/70 px-4 text-sm text-text shadow-sm backdrop-blur-xl transition-all hover:border-primary/30"
              >
                <span className="text-muted">{content.language}</span>
                <span className="font-semibold">{language}</span>
                <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", open && "rotate-180")} />
              </button>

              {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-surface/95 p-1 shadow-2xl shadow-black/40 backdrop-blur-xl">
                  {languages.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setLanguage(item as LanguageKey);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-xl px-3 py-2 text-left text-sm transition-all",
                        language === item ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface hover:text-text",
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {content.trust.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-2xl border border-border bg-surface/35 p-5 backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-bold text-text">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{card.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-surface/40 p-3 backdrop-blur-xl">
              <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{content.toc}</p>
              <nav className="space-y-0.5">
                {content.sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })}
                    className={cn(
                      "block w-full rounded-xl px-3 py-2 text-left text-sm transition-all",
                      activeSection === section.id ? "bg-primary/10 font-semibold text-primary" : "text-muted hover:bg-surface hover:text-text",
                    )}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
              <div className="pt-3">
                <LegalBackButton />
              </div>
            </div>
          </aside>

          <article id="privacy-content" className="min-w-0 space-y-6">
            {content.sections.map((section) => (
              <section id={section.id} key={section.id} className="group scroll-mt-28 rounded-2xl border border-border bg-surface/35 p-6 backdrop-blur-xl md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">{content.lastUpdated}: June 2026</p>
                    <h2 className="mt-3 font-heading text-2xl font-bold text-text md:text-3xl">{section.title}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => copySection(section.id)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted opacity-0 transition-all group-hover:opacity-100 hover:border-primary/30 hover:text-primary"
                    aria-label={content.copy}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.id}-${index}`}>{paragraph}</p>
                  ))}
                </div>

                <Link href={`#${section.id}`} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary opacity-0 transition-all group-hover:opacity-100">
                  <Link2 className="h-3.5 w-3.5" />
                  {content.copy}
                </Link>
              </section>
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}
