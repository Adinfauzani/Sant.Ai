"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Copy, Link2, Heart, Lightbulb, Rocket, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getStorage, setStorage } from "@/lib/storage";
import { LegalBackButton } from "@/components/legal/legalCard";

const languages = ["English", "Bahasa Indonesia"];

const translations = {
  English: {
    subtitle: "Building a respectful, collaborative, and innovative technology community.",
    lastUpdated: "Last Updated",
    readingTime: "Reading Time",
    language: "Language",
    toc: "On this page",
    copy: "Copy link",
    copied: "Section link copied",
    principles: [
      { title: "Respect Everyone", description: "Build meaningful interactions through professionalism and kindness.", icon: Heart },
      { title: "Learn Together", description: "Knowledge grows when it is shared openly.", icon: Lightbulb },
      { title: "Create Impact", description: "Transform ideas into projects, research, and innovation.", icon: Rocket },
      { title: "Community First", description: "Protect the safety, integrity, and well-being of the ecosystem.", icon: ShieldCheck },
    ],
    sections: [
      { id: "hero-message", title: "Welcome to Sant.Ai", paragraphs: ["Sant.Ai is a place where students, educators, researchers, and technology enthusiasts collaborate, learn, share ideas, and build meaningful projects together.", "Our goal is to create a community that is welcoming, respectful, and focused on growth."] },
      { id: "our-values", title: "Our Values", cards: ["Respect", "Collaboration", "Integrity", "Responsibility"] },
      { id: "expected-behavior", title: "Expected Behavior", list: ["Help others learn", "Share knowledge openly", "Provide constructive feedback", "Participate respectfully", "Support collaboration", "Encourage innovation", "Maintain academic integrity", "Respect intellectual property"] },
      { id: "unacceptable-behavior", title: "Unacceptable Behavior", subsections: ["Harassment", "Hate Speech", "Spam", "Misinformation", "Impersonation", "Malicious Activity", "Academic Dishonesty"] },
      { id: "projects-and-contributions", title: "Projects and Contributions", paragraphs: ["Sant.Ai encourages members to build projects, share research, publish innovations, and collaborate with teams.", "Contributors retain ownership of their original work. Community members should respect licenses, attribution requirements, and intellectual property rights."] },
      { id: "community-discussions", title: "Community Discussions", list: ["Stay on topic", "Respect differing opinions", "Focus on ideas rather than individuals", "Provide evidence when making claims", "Engage professionally"] },
      { id: "reporting-concerns", title: "Reporting Concerns", list: ["Description of the issue", "Relevant links or references", "Additional context if available"] },
      { id: "enforcement", title: "Enforcement", list: ["Educational Reminder", "Content Removal", "Warning", "Temporary Restriction", "Temporary Suspension", "Permanent Ban"] },
      { id: "our-commitment", title: "Our Commitment", list: ["Students can learn", "Researchers can collaborate", "Communities can grow", "Ideas can become reality"] },
    ],
  },
  "Bahasa Indonesia": {
    subtitle: "Membangun komunitas teknologi yang saling menghargai, kolaboratif, dan inovatif.",
    lastUpdated: "Terakhir Diperbarui",
    readingTime: "Waktu Baca",
    language: "Bahasa",
    toc: "Di halaman ini",
    copy: "Salin tautan",
    copied: "Tautan bagian disalin",
    principles: [
      { title: "Saling Menghargai", description: "Bangun interaksi bermakna melalui profesionalitas dan kebaikan.", icon: Heart },
      { title: "Belajar Bersama", description: "Pengetahuan berkembang ketika dibagikan secara terbuka.", icon: Lightbulb },
      { title: "Menciptakan Dampak", description: "Ubah ide menjadi proyek, riset, dan inovasi.", icon: Rocket },
      { title: "Komunitas Utama", description: "Lindungi keamanan, integritas, dan kesejahteraan ekosistem.", icon: ShieldCheck },
    ],
    sections: [
      { id: "hero-message", title: "Selamat Datang di Sant.Ai", paragraphs: ["Sant.Ai adalah tempat mahasiswa, pendidik, peneliti, dan pencinta teknologi berkolaborasi, belajar, berbagi ide, dan membangun proyek yang bermakna bersama.", "Tujuan kami adalah menciptakan komunitas yang welcoming, saling menghargai, dan berfokus pada pertumbuhan."] },
      { id: "our-values", title: "Nilai Kami", cards: ["Respect", "Collaboration", "Integrity", "Responsibility"] },
      { id: "expected-behavior", title: "Perilaku yang Diharapkan", list: ["Membantu orang lain belajar", "Berbagi pengetahuan secara terbuka", "Memberikan umpan balik konstruktif", "Berpartisipasi dengan saling menghargai", "Mendukung kolaborasi", "Mendorong inovasi", "Menjaga integritas akademik", "Menghormati kekayaan intelektual"] },
      { id: "unacceptable-behavior", title: "Perilaku yang Tidak Dapat Diterima", subsections: ["Harassment", "Hate Speech", "Spam", "Misinformation", "Impersonation", "Malicious Activity", "Academic Dishonesty"] },
      { id: "projects-and-contributions", title: "Proyek dan Kontribusi", paragraphs: ["Sant.Ai mendorong anggota untuk membangun proyek, berbagi riset, memublikasikan inovasi, dan berkolaborasi dengan tim.", "Kontributor tetap memiliki karya asli mereka. Anggota komunitas harus menghormati lisensi, atribusi, dan hak kekayaan intelektual."] },
      { id: "community-discussions", title: "Diskusi Komunitas", list: ["Tetap sesuai topik", "Hormati perbedaan pendapat", "Fokus pada ide, bukan individu", "Sertakan bukti saat membuat klaim", "Berinteraksi secara profesional"] },
      { id: "reporting-concerns", title: "Melaporkan Masalah", list: ["Deskripsi masalah", "Tautan atau referensi terkait", "Konteks tambahan jika tersedia"] },
      { id: "enforcement", title: "Penegakan", list: ["Pengingat Edukatif", "Penghapusan Konten", "Peringatan", "Pembatasan Sementara", "Penangguhan Sementara", "Ban Permanen"] },
      { id: "our-commitment", title: "Komitmen Kami", list: ["Mahasiswa dapat belajar", "Peneliti dapat berkolaborasi", "Komunitas dapat tumbuh", "Ide dapat menjadi kenyataan"] },
    ],
  },
  Arabic: {
    subtitle: "بناء مجتمع تقني محترم وتعاوني ومبتكر.",
    lastUpdated: "آخر تحديث",
    readingTime: "وقت القراءة",
    language: "اللغة",
    toc: "في هذه الصفحة",
    copy: "نسخ الرابط",
    copied: "تم نسخ رابط القسم",
    principles: [
      { title: "احترم الجميع", description: "ابنِ تفاعلات ذات معنى من خلال الاحتراف واللطف.", icon: Heart },
      { title: "تعلم معًا", description: "تنمو المعرفة عندما تُشارك بصراحة.", icon: Lightbulb },
      { title: "اصنع أثرًا", description: "حوّل الأفكار إلى مشاريع وبحث وابتكار.", icon: Rocket },
      { title: "المجتمع أولًا", description: "احمِ سلامة ونزاهة ورفاهية النظام البيئي.", icon: ShieldCheck },
    ],
    sections: [
      { id: "hero-message", title: "مرحبًا بك في Sant.Ai", paragraphs: ["Sant.Ai مكان يتعاون فيه الطلاب والمعلمون والباحثون ومحبو التكنولوجيا ويتعلمون ويتبادلون الأفكار ويبنون مشاريع ذات معنى معًا.", "هدفنا هو إنشاء مجتمع مرحب ومحترم ويركز على النمو."] },
      { id: "our-values", title: "قيمنا", cards: ["Respect", "Collaboration", "Integrity", "Responsibility"] },
      { id: "expected-behavior", title: "السلوك المتوقع", list: ["مساعدة الآخرين على التعلم", "مشاركة المعرفة بصراحة", "تقديم ملاحظات بناءة", "المشاركة باحترام", "دعم التعاون", "تشجيع الابتكار", "الحفاظ على النزاهة الأكاديمية", "احترام الملكية الفكرية"] },
      { id: "unacceptable-behavior", title: "السلوك غير المقبول", subsections: ["Harassment", "Hate Speech", "Spam", "Misinformation", "Impersonation", "Malicious Activity", "Academic Dishonesty"] },
      { id: "projects-and-contributions", title: "المشاريع والمساهمات", paragraphs: ["تشجع Sant.Ai الأعضاء على بناء المشاريع ومشاركة البحث ونشر الابتكارات والتعاون مع الفرق.", "يحتفظ المساهمون بملكية أعمالهم الأصلية. يجب على أعضاء المجتمع احترام التراخيص ومتطلبات الإسناد وحقوق الملكية الفكرية."] },
      { id: "community-discussions", title: "مناقشات المجتمع", list: ["ابق على الموضوع", "احترم الآراء المختلفة", "ركز على الأفكار لا الأفراد", "قدم أدلة عند طرح الادعاءات", "تفاعل باحتراف"] },
      { id: "reporting-concerns", title: "الإبلاغ عن المخاوف", list: ["وصف المشكلة", "روابط أو مراجع ذات صلة", "سياق إضافي إذا توفر"] },
      { id: "enforcement", title: "التنفيذ", list: ["تذكير تعليمي", "إزالة المحتوى", "تحذير", "قيود مؤقتة", "تعليق مؤقت", "حظر دائم"] },
      { id: "our-commitment", title: "التزامنا", list: ["يمكن للطلاب التعلم", "يمكن للباحثين التعاون", "يمكن للمجتمعات النمو", "يمكن للأفكار أن تصبح حقيقة"] },
    ],
  },
  Japanese: {
    subtitle: "尊重、協力、革新のあるテクノロジーコミュニティを築く。",
    lastUpdated: "最終更新",
    readingTime: "読了時間",
    language: "言語",
    toc: "このページ",
    copy: "リンクをコピー",
    copied: "セクションリンクをコピーしました",
    principles: [
      { title: "すべての人を尊重", description: "プロフェッショナリズムと親切な姿勢で意味ある交流を築きます。", icon: Heart },
      { title: "共に学ぶ", description: "知識はオープンに共有されることで成長します。", icon: Lightbulb },
      { title: "インパクトを生む", description: "アイデアをプロジェクト、研究、イノベーションに変えます。", icon: Rocket },
      { title: "コミュニティ第一", description: "エコシステムの安全、誠実性、ウェルビーイングを守ります。", icon: ShieldCheck },
    ],
    sections: [
      { id: "hero-message", title: "Sant.Ai へようこそ", paragraphs: ["Sant.Ai は、学生、教育者、研究者、テクノロジー愛好家が協力し、学び、アイデアを共有し、有意義なプロジェクトを一緒に作る場所です。", "私たちの目標は、歓迎され、尊重され、成長に焦点を当てたコミュニティを作ることです。"] },
      { id: "our-values", title: "私たちの価値", cards: ["Respect", "Collaboration", "Integrity", "Responsibility"] },
      { id: "expected-behavior", title: "期待される行動", list: ["他者の学習を助ける", "知識をオープンに共有する", "建設的なフィードバックを提供する", "尊重して参加する", "コラボレーションを支援する", "イノベーションを奨励する", "学問的誠実性を保つ", "知的財産を尊重する"] },
      { id: "unacceptable-behavior", title: "容認されない行動", subsections: ["Harassment", "Hate Speech", "Spam", "Misinformation", "Impersonation", "Malicious Activity", "Academic Dishonesty"] },
      { id: "projects-and-contributions", title: "プロジェクトと貢献", paragraphs: ["Sant.Ai は、メンバーがプロジェクトを構築し、研究を共有し、イノベーションを発表し、チームと協力することを奨励します。", "貢献者はオリジナル作品の所有権を保持します。コミュニティメンバーはライセンス、帰属要件、知的財産権を尊重すべきです。"] },
      { id: "community-discussions", title: "コミュニティディスカッション", list: ["トピックに沿って話す", "異なる意見も尊重する", "個人ではなくアイデアに集中する", "主張する際は証拠を示す", "プロフェッショナルに関与する"] },
      { id: "reporting-concerns", title: "懸念の報告", list: ["問題の説明", "関連リンクまたは参照", "利用可能な追加コンテキスト"] },
      { id: "enforcement", title: "執行", list: ["教育的リマインダー", "コンテンツ削除", "警告", "一時的制限", "一時的停止", "永久BAN"] },
      { id: "our-commitment", title: "私たちのコミットメント", list: ["学生が学べる", "研究者が協力できる", "コミュニティが成長できる", "アイデアが現実になる"] },
    ],
  },
  Korean: {
    subtitle: "존중하고 협력하며 혁신하는 기술 커뮤니티를 만듭니다.",
    lastUpdated: "최종 업데이트",
    readingTime: "읽는 시간",
    language: "언어",
    toc: "이 페이지",
    copy: "링크 복사",
    copied: "섹션 링크가 복사되었습니다",
    principles: [
      { title: "모두를 존중", description: "전문성과 친절함으로 의미 있는 상호작용을 만듭니다.", icon: Heart },
      { title: "함께 배우기", description: "지식은 열린 공유를 통해 성장합니다.", icon: Lightbulb },
      { title: "영향 만들기", description: "아이디어를 프로젝트, 연구, 혁신으로 바꿉니다.", icon: Rocket },
      { title: "커뮤니티 우선", description: "에코시스템의 안전, 무결성, 웰빙을 보호합니다.", icon: ShieldCheck },
    ],
    sections: [
      { id: "hero-message", title: "Sant.Ai 에 오신 것을 환영합니다", paragraphs: ["Sant.Ai 은 학생, 교육자, 연구자, 기술 애호가가 함께 협력하고 배우며 아이디어를 공유하고 의미 있는 프로젝트를 만드는 공간입니다.", "우리의 목표는 환영받고 존중받으며 성장에 집중하는 커뮤니티를 만드는 것입니다."] },
      { id: "our-values", title: "우리의 가치", cards: ["Respect", "Collaboration", "Integrity", "Responsibility"] },
      { id: "expected-behavior", title: "기대되는 행동", list: ["다른 사람의 학습을 돕기", "지식을 열린 방식으로 공유하기", "건설적인 피드백 제공하기", "존중하는 태도로 참여하기", "협업 지원하기", "혁신 장려하기", "학문적 진실성 유지하기", "지적 재산 존중하기"] },
      { id: "unacceptable-behavior", title: "용납되지 않는 행동", subsections: ["Harassment", "Hate Speech", "Spam", "Misinformation", "Impersonation", "Malicious Activity", "Academic Dishonesty"] },
      { id: "projects-and-contributions", title: "프로젝트 및 기여", paragraphs: ["Sant.Ai 은 멤버들이 프로젝트를 만들고 연구를 공유하며 혁신을 발표하고 팀과 협력하도록 장려합니다.", "기여자는 자신이 만든 원작의 소유권을 유지합니다. 커뮤니티 멤버는 라이선스, 출처 표기 요구사항, 지적 재산권을 존중해야 합니다."] },
      { id: "community-discussions", title: "커뮤니티 토론", list: ["주제에 맞게 참여하기", "다른 의견 존중하기", "개인이 아닌 아이디어에 집중하기", "주장할 때 근거 제시하기", "전문적으로 소통하기"] },
      { id: "reporting-concerns", title: "문제 보고", list: ["문제 설명", "관련 링크 또는 참고 자료", "가능한 추가 맥락"] },
      { id: "enforcement", title: "시행", list: ["교육적 안내", "콘텐츠 삭제", "경고", "일시적 제한", "일시 정지", "영구 BAN"] },
      { id: "our-commitment", title: "우리의 약속", list: ["학생이 배울 수 있음", "연구자가 협력할 수 있음", "커뮤니티가 성장할 수 있음", "아이디어가 현실이 될 수 있음"] },
    ],
  },
  "Chinese (Simplified)": {
    subtitle: "建设一个尊重、协作且创新的科技社区。",
    lastUpdated: "最后更新",
    readingTime: "阅读时间",
    language: "语言",
    toc: "在本页",
    copy: "复制链接",
    copied: "章节链接已复制",
    principles: [
      { title: "尊重每个人", description: "通过专业与善意建立有意义的互动。", icon: Heart },
      { title: "共同学习", description: "知识会在开放分享中成长。", icon: Lightbulb },
      { title: "创造影响", description: "将想法转化为项目、研究和创新。", icon: Rocket },
      { title: "社区优先", description: "保护生态系统的安全、诚信与福祉。", icon: ShieldCheck },
    ],
    sections: [
      { id: "hero-message", title: "欢迎来到 Sant.Ai", paragraphs: ["Sant.Ai 是一个学生、教育者、研究者和技术爱好者共同协作、学习、分享想法并构建有意义项目的地方。", "我们的目标是创建一个受欢迎、彼此尊重并专注于成长的社区。"] },
      { id: "our-values", title: "我们的价值观", cards: ["Respect", "Collaboration", "Integrity", "Responsibility"] },
      { id: "expected-behavior", title: "期望行为", list: ["帮助他人学习", "开放分享知识", "提供建设性反馈", "尊重地参与", "支持协作", "鼓励创新", "保持学术诚信", "尊重知识产权"] },
      { id: "unacceptable-behavior", title: "不可接受的行为", subsections: ["Harassment", "Hate Speech", "Spam", "Misinformation", "Impersonation", "Malicious Activity", "Academic Dishonesty"] },
      { id: "projects-and-contributions", title: "项目与贡献", paragraphs: ["Sant.Ai 鼓励成员构建项目、分享研究、发布创新并与团队协作。", "贡献者保留其原创作品的 ownership。社区成员应尊重许可证、署名要求和知识产权。"] },
      { id: "community-discussions", title: "社区讨论", list: ["围绕主题交流", "尊重不同意见", "关注想法而非个人", "提出主张时提供依据", "专业地参与讨论"] },
      { id: "reporting-concerns", title: "报告问题", list: ["问题描述", "相关链接或参考", "如有额外上下文"] },
      { id: "enforcement", title: "执行", list: ["教育提醒", "删除内容", "警告", "临时限制", "临时封禁", "永久封禁"] },
      { id: "our-commitment", title: "我们的承诺", list: ["学生可以学习", "研究者可以协作", "社区可以成长", "想法可以成为现实"] },
    ],
  },
};

type LanguageKey = keyof typeof translations;

export default function GuidelinesPage() {
  const [language, setLanguage] = useState<LanguageKey>("English");
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero-message");
  const [progress, setProgress] = useState(0);
  const content = translations[language];

  useEffect(() => {
    const stored = getStorage("guidelines-language") as LanguageKey | null;
    if (stored && translations[stored]) setLanguage(stored);
  }, []);

  useEffect(() => {
    setStorage("guidelines-language", language);
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
      const article = document.getElementById("guidelines-content");
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
    await navigator.clipboard.writeText(`${window.location.origin}/legal/guidelines#${id}`);
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
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">Community Guidelines</p>
              <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-text md:text-6xl">Community Guidelines</h1>
              <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{content.subtitle}</p>
              <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-muted">
                <span className="rounded-full border border-border bg-surface/50 px-3 py-1.5">Last Updated: June 2026</span>
                <span className="rounded-full border border-border bg-surface/50 px-3 py-1.5">Reading Time: 4 min</span>
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
          {content.principles.map((card) => {
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

          <article id="guidelines-content" className="min-w-0 space-y-6">
            {content.sections.map((section) => {
              const isValues = section.cards;
              const isList = section.list;
              const isSubsections = section.subsections;

              return (
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
                    {section.paragraphs?.map((paragraph, index) => (
                      <p key={`${section.id}-${index}`}>{paragraph}</p>
                    ))}

                    {isValues && (
                      <div className="grid gap-3 md:grid-cols-2">
                        {isValues.map((value) => (
                          <div key={value} className="rounded-xl border border-border bg-surface/40 p-4 text-text">
                            <h3 className="font-semibold">{value}</h3>
                          </div>
                        ))}
                      </div>
                    )}

                    {isList && (
                      <ul className="ml-5 list-disc space-y-1">
                        {isList.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}

                    {isSubsections && (
                      <div className="grid gap-3 md:grid-cols-2">
                        {isSubsections.map((item) => (
                          <span key={item} className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link href={`#${section.id}`} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary opacity-0 transition-all group-hover:opacity-100">
                    <Link2 className="h-3.5 w-3.5" />
                    {content.copy}
                  </Link>
                </section>
              );
            })}
          </article>
        </div>
      </div>
    </div>
  );
}
