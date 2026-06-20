"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Copy, Link2, ShieldCheck, Users, BarChart3, Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getStorage, setStorage } from "@/lib/storage";
import { LegalBackButton } from "@/components/legal/legal-card";

const languages = ["English", "Bahasa Indonesia"];

const translations = {
  English: {
    subtitle: "Guidelines and responsibilities for using the Sant.Ai ecosystem.",
    lastUpdated: "Last Updated",
    readingTime: "Reading Time",
    language: "Language",
    toc: "On this page",
    copy: "Copy link",
    copied: "Section link copied",
    trust: [
      { title: "Privacy Focused", description: "Your account information is protected using modern security practices.", icon: Lock },
      { title: "Community Driven", description: "Built to support collaboration and learning.", icon: Users },
      { title: "Responsible Data Usage", description: "Public information is aggregated for educational and research purposes.", icon: BarChart3 },
      { title: "Secure Authentication", description: "Protected through modern authentication providers and secure sessions.", icon: ShieldCheck },
    ],
    sections: [
      { id: "welcome", title: "Welcome", paragraphs: ["Welcome to Sant.Ai.", "Sant.Ai is a collaborative technology ecosystem developed by the Faculty of Computer Science at Universitas Saintek Muhammadiyah.", "By accessing or using the platform, you agree to follow these terms and contribute to a safe, respectful, and productive environment."] },
      { id: "using-the-platform", title: "Using the Platform", paragraphs: ["Sant.Ai is designed for learning, collaboration, innovation, research, and community activities.", "Users are expected to use the platform responsibly and in accordance with applicable laws and university regulations."] },
      { id: "your-account", title: "Your Account", paragraphs: ["You are responsible for maintaining account security, protecting login credentials, and keeping profile information accurate.", "If you believe your account has been compromised, notify the platform administrators immediately."] },
      { id: "community-standards", title: "Community Standards", paragraphs: ["We encourage respectful communication, constructive collaboration, knowledge sharing, and responsible technology usage.", "We do not allow harassment, hate speech, spam, malicious software, unauthorized access attempts, or fraudulent activities."] },
      { id: "projects-and-contributions", title: "Projects and Contributions", paragraphs: ["Users retain ownership of the content they create.", "By publishing content on Sant.Ai, you grant the platform permission to display, organize, and promote that content within the ecosystem.", "Ownership remains with the original creator."] },
      { id: "data-intelligence", title: "Data Intelligence", paragraphs: ["The Data Intelligence section aggregates information from publicly available sources.", "Content displayed through analytics tools is intended for educational, research, and informational purposes.", "Users should independently verify critical information before making decisions based on aggregated data."] },
      { id: "service-availability", title: "Service Availability", paragraphs: ["We continuously improve the platform and may introduce, modify, or remove features over time.", "While we aim for reliability, uninterrupted service cannot be guaranteed."] },
      { id: "enforcement", title: "Enforcement", paragraphs: ["Violations of these terms may result in content removal, temporary restrictions, account suspension, or permanent account removal.", "Actions will be taken based on the severity of the violation."] },
      { id: "contact", title: "Contact", paragraphs: ["Questions regarding these Terms of Service can be directed to the platform administrators through the official contact channels provided by Sant.Ai."] },
    ],
  },
  "Bahasa Indonesia": {
    subtitle: "Panduan dan tanggung jawab dalam menggunakan ekosistem Sant.Ai.",
    lastUpdated: "Terakhir Diperbarui",
    readingTime: "Waktu Baca",
    language: "Bahasa",
    toc: "Di halaman ini",
    copy: "Salin tautan",
    copied: "Tautan bagian disalin",
    trust: [
      { title: "Berfokus pada Privasi", description: "Informasi akun Anda dilindungi menggunakan praktik keamanan modern.", icon: Lock },
      { title: "Berbasis Komunitas", description: "Dibangun untuk mendukung kolaborasi dan pembelajaran.", icon: Users },
      { title: "Penggunaan Data yang Bertanggung Jawab", description: "Informasi publik diagregasi untuk tujuan edukasi dan riset.", icon: BarChart3 },
      { title: "Autentikasi Aman", description: "Dilindungi melalui penyedia autentikasi modern dan sesi yang aman.", icon: ShieldCheck },
    ],
    sections: [
      { id: "welcome", title: "Selamat Datang", paragraphs: ["Selamat datang di Sant.Ai.", "Sant.Ai adalah ekosistem teknologi kolaboratif yang dikembangkan oleh Fakultas Ilmu Komputer Universitas Saintek Muhammadiyah.", "Dengan mengakses atau menggunakan platform ini, Anda setuju untuk mengikuti ketentuan ini dan berkontribusi pada lingkungan yang aman, saling menghargai, dan produktif."] },
      { id: "using-the-platform", title: "Menggunakan Platform", paragraphs: ["Sant.Ai dirancang untuk pembelajaran, kolaborasi, inovasi, riset, dan kegiatan komunitas.", "Pengguna diharapkan menggunakan platform secara bertanggung jawab serta sesuai hukum dan regulasi universitas yang berlaku."] },
      { id: "your-account", title: "Akun Anda", paragraphs: ["Anda bertanggung jawab menjaga keamanan akun, melindungi kredensial login, dan memastikan informasi profil tetap akurat.", "Jika Anda merasa akun telah disalahgunakan, segera hubungi administrator platform."] },
      { id: "community-standards", title: "Standar Komunitas", paragraphs: ["Kami mendorong komunikasi yang sopan, kolaborasi yang konstruktif, berbagi pengetahuan, dan penggunaan teknologi yang bertanggung jawab.", "Kami tidak mengizinkan pelecehan, ujaran kebencian, spam, perangkat berbahaya, upaya akses tidak sah, atau aktivitas penipuan."] },
      { id: "projects-and-contributions", title: "Proyek dan Kontribusi", paragraphs: ["Pengguna tetap memiliki konten yang mereka buat.", "Dengan memublikasikan konten di Sant.Ai, Anda memberikan izin kepada platform untuk menampilkan, mengatur, dan mempromosikan konten tersebut dalam ekosistem.", "Kepemilikan tetap berada pada pembuat asli."] },
      { id: "data-intelligence", title: "Data Intelligence", paragraphs: ["Bagian Data Intelligence mengagregasi informasi dari sumber yang tersedia secara publik.", "Konten yang ditampilkan melalui alat analitik ditujukan untuk tujuan edukasi, riset, dan informasi.", "Pengguna sebaiknya memverifikasi ulang informasi penting sebelum mengambil keputusan berdasarkan data agregat."] },
      { id: "service-availability", title: "Ketersediaan Layanan", paragraphs: ["Kami terus meningkatkan platform dan dapat memperkenalkan, mengubah, atau menghapus fitur dari waktu ke waktu.", "Meskipun kami berupaya menjaga keandalan, layanan tanpa gangguan tidak dapat dijamin."] },
      { id: "enforcement", title: "Penegakan", paragraphs: ["Pelanggaran terhadap ketentuan ini dapat mengakibatkan penghapusan konten, pembatasan sementara, penangguhan akun, atau penghapusan akun permanen.", "Tindakan akan diambil berdasarkan tingkat pelanggaran."] },
      { id: "contact", title: "Kontak", paragraphs: ["Pertanyaan terkait Terms of Service ini dapat diarahkan kepada administrator platform melalui saluran kontak resmi yang disediakan Sant.Ai."] },
    ],
  },
  Arabic: {
    subtitle: "إرشادات ومسؤوليات استخدام نظام Sant.Ai.",
    lastUpdated: "آخر تحديث",
    readingTime: "وقت القراءة",
    language: "اللغة",
    toc: "في هذه الصفحة",
    copy: "نسخ الرابط",
    copied: "تم نسخ رابط القسم",
    trust: [
      { title: "التركيز على الخصوصية", description: "تتم حماية معلومات حسابك باستخدام ممارسات أمنية حديثة.", icon: Lock },
      { title: "مجتمعي", description: "مصمم لدعم التعاون والتعلم.", icon: Users },
      { title: "استخدام مسؤول للبيانات", description: "تُجمع المعلومات العامة لأغراض تعليمية وبحثية.", icon: BarChart3 },
      { title: "مصادقة آمنة", description: "محمي عبر مزودي مصادقة حديثة وجلسات آمنة.", icon: ShieldCheck },
    ],
    sections: [
      { id: "welcome", title: "مرحبًا", paragraphs: ["مرحبًا بك في Sant.Ai.", "Sant.Ai هو نظام تقني تعاوني طورته كلية علوم الحاسوب في Universitas Saintek Muhammadiyah.", "من خلال الوصول إلى المنصة أو استخدامها، فإنك توافق على اتباع هذه الشروط والمساهمة في بيئة آمنة ومحترمة ومنتجة."] },
      { id: "using-the-platform", title: "استخدام المنصة", paragraphs: ["صُممت Sant.Ai للتعلم والتعاون والابتكار والبحث والأنشطة المجتمعية.", "من المتوقع أن يستخدم المستخدمون المنصة بمسؤولية وفقًا للقوانين واللوائح الجامعية المعمول بها."] },
      { id: "your-account", title: "حسابك", paragraphs: ["أنت مسؤول عن الحفاظ على أمان الحساب وحماية بيانات الدخول وإبقاء معلومات الملف الشخصي دقيقة.", "إذا اعتقدت أن حسابك قد تعرض للاختراق، فأبلغ مسؤولي المنصة فورًا."] },
      { id: "community-standards", title: "معايير المجتمع", paragraphs: ["نشجع التواصل المحترم والتعاون البناء ومشاركة المعرفة والاستخدام المسؤول للتكنولوجيا.", "لا نسمح بالمضايقة أو خطاب الكراهية أو البريد المزعج أو البرامج الضارة أو محاولات الوصول غير المصرح بها أو الأنشطة الاحتيالية."] },
      { id: "projects-and-contributions", title: "المشاريع والمساهمات", paragraphs: ["يحتفظ المستخدمون بملكية المحتوى الذي ينشئونه.", "من خلال نشر المحتوى على Sant.Ai، فإنك تمنح المنصة إذنًا لعرضه وتنظيمه والترويج له داخل النظام.", "تبقى الملكية للمؤلف الأصلي."] },
      { id: "data-intelligence", title: "ذكاء البيانات", paragraphs: ["يجمع قسم ذكاء البيانات معلومات من مصادر متاحة للعامة.", "يُقصد بالمحتوى المعروض عبر أدوات التحليلات الأغراض التعليمية والبحثية والمعلوماتية.", "ينبغي على المستخدمين التحقق بشكل مستقل من المعلومات المهمة قبل اتخاذ قرارات بناءً على البيانات المجمعة."] },
      { id: "service-availability", title: "توفر الخدمة", paragraphs: ["نواصل تحسين المنصة وقد نقدم ميزات جديدة أو نعدلها أو نزيلها بمرور الوقت.", "رغم سعي我们 إلى الموثوقية، لا يمكن ضمان خدمة دون انقطاع."] },
      { id: "enforcement", title: "التنفيذ", paragraphs: ["قد تؤدي انتهاكات هذه الشروط إلى إزالة المحتوى أو قيود مؤقتة أو تعليق الحساب أو إزالة الحساب بشكل دائم.", "ستُتخذ الإجراءات بناءً على شدة الانتهاك."] },
      { id: "contact", title: "الاتصال", paragraphs: ["يمكن توجيه الأسئلة المتعلقة بشروط الخدمة هذه إلى مسؤولي المنصة عبر قنوات الاتصال الرسمية التي يوفرها Sant.Ai."] },
    ],
  },
  Japanese: {
    subtitle: "Sant.Ai エコシステムの利用に関するガイドラインと責任。",
    lastUpdated: "最終更新",
    readingTime: "読了時間",
    language: "言語",
    toc: "このページ",
    copy: "リンクをコピー",
    copied: "セクションリンクをコピーしました",
    trust: [
      { title: "プライバシー重視", description: "アカウント情報は最新のセキュリティ手法で保護されます。", icon: Lock },
      { title: "コミュニティ主導", description: "コラボレーションと学習をサポートするために設計されています。", icon: Users },
      { title: "責任あるデータ利用", description: "公開情報は教育・研究目的で集約されます。", icon: BarChart3 },
      { title: "安全な認証", description: "最新の認証プロバイダーと安全なセッションで保護されます。", icon: ShieldCheck },
    ],
    sections: [
      { id: "welcome", title: "ようこそ", paragraphs: ["Sant.Ai へようこそ。", "Sant.Ai は、Universitas Saintek Muhammadiyah の Faculty of Computer Science によって開発された協働型テクノロジーエコシステムです。", "プラットフォームにアクセスまたは利用することで、これらの規約に従い、安全で尊重され生産的な環境に貢献することに同意したことになります。"] },
      { id: "using-the-platform", title: "プラットフォームの利用", paragraphs: ["Sant.Ai は学習、コラボレーション、イノベーション、研究、コミュニティ活動のために設計されています。", "ユーザーは適用される法律および大学規程に従い、責任を持ってプラットフォームを利用することが期待されます。"] },
      { id: "your-account", title: "アカウント", paragraphs: ["アカウントのセキュリティ維持、ログイン情報の保護、プロフィール情報の正確な維持はユーザーの責任です。", "アカウントが侵害されたと思われる場合は、直ちにプラットフォーム管理者へ通知してください。"] },
      { id: "community-standards", title: "コミュニティ標準", paragraphs: ["私たちは、敬意あるコミュニケーション、建設的なコラボレーション、知識共有、責任ある技術利用を推奨します。", "ハラスメント、ヘイトスピーチ、スパム、悪意あるソフトウェア、不正アクセス試行、詐欺行為は許可されません。"] },
      { id: "projects-and-contributions", title: "プロジェクトと貢献", paragraphs: ["ユーザーは自身が作成したコンテンツの所有権を保持します。", "Sant.Ai 上でコンテンツを公開することで、エコシステム内での表示、整理、紹介をプラットフォームに許可することになります。", "所有権は元の作成者に残ります。"] },
      { id: "data-intelligence", title: "データインテリジェンス", paragraphs: ["データインテリジェンスセクションは、公開利用可能な情報源から情報を集約します。", "分析ツールを通じて表示されるコンテンツは、教育、研究、情報提供を目的としています。", "集約データに基づいて判断する前に、重要な情報はユーザー自身で確認してください。"] },
      { id: "service-availability", title: "サービスの可用性", paragraphs: ["私たちはプラットフォームを継続的に改善し、機能を追加、変更、または削除する場合があります。", "信頼性を目指していますが、中断のないサービスを保証することはできません。"] },
      { id: "enforcement", title: "執行", paragraphs: ["これらの規約に違反した場合、コンテンツ削除、一時的な制限、アカウント停止、または永久削除となる場合があります。", "措置は違反の重大度に基づいて行われます。"] },
      { id: "contact", title: "お問い合わせ", paragraphs: ["本利用規約に関する質問は、Sant.Ai が提供する公式連絡窓口を通じてプラットフォーム管理者へご連絡ください。"] },
    ],
  },
  Korean: {
    subtitle: "Sant.Ai 생태계 사용에 관한 가이드라인과 책임입니다.",
    lastUpdated: "최종 업데이트",
    readingTime: "읽는 시간",
    language: "언어",
    toc: "이 페이지",
    copy: "링크 복사",
    copied: "섹션 링크가 복사되었습니다",
    trust: [
      { title: "개인정보 중심", description: "계정 정보는 최신 보안 관행으로 보호됩니다.", icon: Lock },
      { title: "커뮤니티 중심", description: "협업과 학습을 지원하기 위해 설계되었습니다.", icon: Users },
      { title: "책임 있는 데이터 사용", description: "공개 정보는 교육 및 연구 목적으로 집계됩니다.", icon: BarChart3 },
      { title: "안전한 인증", description: "최신 인증 제공자와 안전한 세션으로 보호됩니다.", icon: ShieldCheck },
    ],
    sections: [
      { id: "welcome", title: "환영합니다", paragraphs: ["Sant.Ai 에 오신 것을 환영합니다.", "Sant.Ai 은 Universitas Saintek Muhammadiyah Faculty of Computer Science 에서 개발한 협업형 기술 생태계입니다.", "플랫폼에 접근하거나 사용함으로써 귀하는 본 약관을 따르고 안전하며 존중받고 생산적인 환경에 기여することに 동의합니다."] },
      { id: "using-the-platform", title: "플랫폼 사용", paragraphs: ["Sant.Ai 은 학습, 협업, 혁신, 연구, 커뮤니티 활동을 위해 설계되었습니다.", "사용자는 적용되는 법률과 대학 규정에 따라 책임감 있게 플랫폼을 사용해야 합니다."] },
      { id: "your-account", title: "귀하의 계정", paragraphs: ["귀하는 계정 보안 유지, 로그인 정보 보호, 프로필 정보 정확성 유지에 책임이 있습니다.", "계정이 침해되었다고 생각되면 즉시 플랫폼 관리자에게 알려주세요."] },
      { id: "community-standards", title: "커뮤니티 표준", paragraphs: ["우리는 존중 있는 소통, 건설적 협업, 지식 공유, 책임 있는 기술 사용을 장려합니다.", "괴롭힘, 혐오 발언, 스팸, 악성 소프트웨어, 무단 접근 시도, 사기 행위는 허용되지 않습니다."] },
      { id: "projects-and-contributions", title: "프로젝트 및 기여", paragraphs: ["사용자는 자신이 만든 콘텐츠의 소유권을 유지합니다.", "Sant.Ai 에 콘텐츠를 게시하면 생태계 내에서 해당 콘텐츠를 표시, 정리, 홍보할 권한을 플랫폼에 부여하는 것입니다.", "소유권은 원래 작성자에게 남습니다."] },
      { id: "data-intelligence", title: "데이터 인텔리전스", paragraphs: ["데이터 인텔리전스 섹션은 공개적으로 이용 가능한 출처의 정보를 집계합니다.", "분석 도구를 통해 표시되는 콘텐츠는 교육, 연구, 정보 제공을 목적으로 합니다.", "집계된 데이터를 기반으로 결정하기 전에 중요한 정보는 사용자가 직접 확인해야 합니다."] },
      { id: "service-availability", title: "서비스 가용성", paragraphs: ["우리는 플랫폼을 지속적으로 개선하며 시간이 지남에 따라 기능을 추가, 수정 또는 제거할 수 있습니다.", "안정성을 목표로 하지만 중단 없는 서비스를 보장할 수는 없습니다."] },
      { id: "enforcement", title: "시행", paragraphs: ["본 약관을 위반하면 콘텐츠 삭제, 임시 제한, 계정 정지 또는 영구 계정 삭제가 발생할 수 있습니다.", "조치는 위반의 심각도에 따라 이루어집니다."] },
      { id: "contact", title: "문의", paragraphs: ["본 이용약관에 대한 질문은 Sant.Ai 이 제공하는 공식 연락처를 통해 플랫폼 관리자에게 문의할 수 있습니다."] },
    ],
  },
  "Chinese (Simplified)": {
    subtitle: "使用 Sant.Ai 生态系统的指南和责任。",
    lastUpdated: "最后更新",
    readingTime: "阅读时间",
    language: "语言",
    toc: "在本页",
    copy: "复制链接",
    copied: "章节链接已复制",
    trust: [
      { title: "隐私优先", description: "您的账户信息通过现代安全实践进行保护。", icon: Lock },
      { title: "社区驱动", description: "旨在支持协作与学习。", icon: Users },
      { title: "负责任的数据使用", description: "公共信息将出于教育和研究目的进行汇总。", icon: BarChart3 },
      { title: "安全认证", description: "通过现代认证提供商和安全会话进行保护。", icon: ShieldCheck },
    ],
    sections: [
      { id: "welcome", title: "欢迎", paragraphs: ["欢迎使用 Sant.Ai。", "Sant.Ai 是由 Universitas Saintek Muhammadiyah 的 Faculty of Computer Science 开发的协作型技术生态系统。", "通过访问或使用本平台，您同意遵守这些条款，并为安全、尊重且富有成效的环境做出贡献。"] },
      { id: "using-the-platform", title: "使用平台", paragraphs: ["Sant.Ai 旨在服务于学习、协作、创新、研究和社区活动。", "用户应按照适用法律和大学规章负责任地使用平台。"] },
      { id: "your-account", title: "您的账户", paragraphs: ["您负责维护账户安全、保护登录凭据并保持个人资料信息准确。", "如果您认为账户已被泄露，请立即通知平台管理员。"] },
      { id: "community-standards", title: "社区标准", paragraphs: ["我们鼓励尊重沟通、建设性协作、知识分享和负责任的技术使用。", "我们不允许骚扰、仇恨言论、垃圾内容、恶意软件、未经授权访问尝试或欺诈活动。"] },
      { id: "projects-and-contributions", title: "项目与贡献", paragraphs: ["用户保留其创建内容的所有权。", "通过在 Sant.Ai 上发布内容，您授予平台在生态系统内展示、整理和推广该内容的权限。", "所有权仍归原始创作者所有。"] },
      { id: "data-intelligence", title: "数据智能", paragraphs: ["数据智能部分汇总来自公开可用来源的信息。", "通过分析工具显示的内容用于教育、研究和信息目的。", "用户在基于汇总数据做出决策之前，应独立核实关键信息。"] },
      { id: "service-availability", title: "服务可用性", paragraphs: ["我们持续改进平台，并可能随时间引入、修改或移除功能。", "虽然我们致力于可靠性，但无法保证服务永不中断。"] },
      { id: "enforcement", title: "执行", paragraphs: ["违反本条款可能导致内容删除、临时限制、账户暂停或永久移除账户。", "将根据违规严重程度采取措施。"] },
      { id: "contact", title: "联系", paragraphs: ["有关本服务条款的问题，可通过 Sant.Ai 提供的官方联系渠道联系平台管理员。"] },
    ],
  },
};

type LanguageKey = keyof typeof translations;

export default function TermsPage() {
  const [language, setLanguage] = useState<LanguageKey>("English");
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("welcome");
  const [progress, setProgress] = useState(0);
  const content = translations[language];

  useEffect(() => {
    const stored = getStorage("terms-language") as LanguageKey | null;
    if (stored && translations[stored]) setLanguage(stored);
  }, []);

  useEffect(() => {
    setStorage("terms-language", language);
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
      const article = document.getElementById("terms-content");
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
    await navigator.clipboard.writeText(`${window.location.origin}/legal/terms#${id}`);
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
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">Legal Center</p>
              <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-text md:text-6xl">Terms of Service</h1>
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

          <article id="terms-content" className="min-w-0 space-y-6">
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
