"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Copy, Link2, Database, Search, ShieldCheck, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LegalBackButton } from "@/components/legal/legal-card";

const languages = ["English", "Bahasa Indonesia", "Arabic", "Japanese", "Korean", "Chinese (Simplified)"];

const translations = {
  English: {
    subtitle: "How SANTET collects, organizes, and utilizes public information for research and analytics.",
    lastUpdated: "Last Updated",
    readingTime: "Reading Time",
    language: "Language",
    toc: "On this page",
    copy: "Copy link",
    copied: "Section link copied",
    principles: [
      { title: "Public Sources", description: "Data is collected from publicly available information sources.", icon: Database },
      { title: "Research First", description: "Analytics are intended for education, research, and learning.", icon: Lightbulb },
      { title: "Clear Attribution", description: "Original ownership remains with the source publisher.", icon: ShieldCheck },
      { title: "Transparent Monitoring", description: "Data helps monitor technology trends and public information.", icon: Search },
    ],
    sections: [
      { id: "purpose", title: "Purpose", list: ["Education", "Research", "Data Analysis", "Community Learning"] },
      { id: "data-sources", title: "Data Sources", list: ["RSS Feeds", "News Websites", "GNews API", "YouTube Data API"] },
      { id: "attribution", title: "Attribution", paragraphs: ["Original ownership remains with the source publisher.", "SANTET acts as an aggregation and analytics platform."] },
      { id: "educational-usage", title: "Educational Usage", list: ["Academic Research", "Student Projects", "Trend Analysis", "Technology Monitoring"] },
      { id: "data-accuracy", title: "Data Accuracy", paragraphs: ["Information originates from third-party providers.", "Accuracy depends on the original publisher."] },
      { id: "future-research-features", title: "Future Research Features", list: ["Sentiment Analysis", "Topic Modeling", "Trend Prediction", "AI Insights"] },
      { id: "responsible-use", title: "Responsible Use", paragraphs: ["Data intelligence tools are designed to support learning, discussion, and research.", "Users should verify important information through original sources before relying on it for decisions."] },
    ],
  },
  "Bahasa Indonesia": {
    subtitle: "Bagaimana SANTET mengumpulkan, mengatur, dan memanfaatkan informasi publik untuk riset dan analitik.",
    lastUpdated: "Terakhir Diperbarui",
    readingTime: "Waktu Baca",
    language: "Bahasa",
    toc: "Di halaman ini",
    copy: "Salin tautan",
    copied: "Tautan bagian disalin",
    principles: [
      { title: "Sumber Publik", description: "Data dikumpulkan dari sumber informasi yang tersedia secara publik.", icon: Database },
      { title: "Riset Utama", description: "Analitik ditujukan untuk pendidikan, riset, dan pembelajaran.", icon: Lightbulb },
      { title: "Atribusi Jelas", description: "Kepemilikan asli tetap berada pada penerbit sumber.", icon: ShieldCheck },
      { title: "Monitoring Transparan", description: "Data membantu memantau tren teknologi dan informasi publik.", icon: Search },
    ],
    sections: [
      { id: "purpose", title: "Tujuan", list: ["Pendidikan", "Riset", "Analisis Data", "Pembelajaran Komunitas"] },
      { id: "data-sources", title: "Sumber Data", list: ["RSS Feeds", "Situs Berita", "GNews API", "YouTube Data API"] },
      { id: "attribution", title: "Atribusi", paragraphs: ["Kepemilikan asli tetap berada pada penerbit sumber.", "SANTET bertindak sebagai platform agregasi dan analitik."] },
      { id: "educational-usage", title: "Penggunaan Edukatif", list: ["Riset Akademik", "Proyek Mahasiswa", "Analisis Tren", "Monitoring Teknologi"] },
      { id: "data-accuracy", title: "Akurasi Data", paragraphs: ["Informasi berasal dari penyedia pihak ketiga.", "Akurasi bergantung pada penerbit asli."] },
      { id: "future-research-features", title: "Fitur Riset Masa Depan", list: ["Analisis Sentimen", "Pemodelan Topik", "Prediksi Tren", "Wawasan AI"] },
      { id: "responsible-use", title: "Penggunaan yang Bertanggung Jawab", paragraphs: ["Alat data intelligence dirancang untuk mendukung pembelajaran, diskusi, dan riset.", "Pengguna sebaiknya memverifikasi informasi penting melalui sumber asli sebelum menjadikannya dasar keputusan."] },
    ],
  },
  Arabic: {
    subtitle: "كيف تجمع SANTET المعلومات العامة وتنظمها وتستخدمها للبحث والتحليلات.",
    lastUpdated: "آخر تحديث",
    readingTime: "وقت القراءة",
    language: "اللغة",
    toc: "في هذه الصفحة",
    copy: "نسخ الرابط",
    copied: "تم نسخ رابط القسم",
    principles: [
      { title: "مصادر عامة", description: "تُجمع البيانات من مصادر معلومات متاحة للعامة.", icon: Database },
      { title: "البحث أولاً", description: "التحليلات مخصصة للتعليم والبحث والتعلم.", icon: Lightbulb },
      { title: "إسناد واضح", description: "تبقى الملكية الأصلية لناشر المصدر.", icon: ShieldCheck },
      { title: "مراقبة شفافة", description: "تساعد البيانات على مراقبة اتجاهات التكنولوجيا والمعلومات العامة.", icon: Search },
    ],
    sections: [
      { id: "purpose", title: "الغرض", list: ["التعليم", "البحث", "تحليل البيانات", "تعلم المجتمع"] },
      { id: "data-sources", title: "مصادر البيانات", list: ["خلاصات RSS", "مواقع الأخبار", "GNews API", "YouTube Data API"] },
      { id: "attribution", title: "الإسناد", paragraphs: ["تبقى الملكية الأصلية لناشر المصدر.", "تعمل SANTET كمنصة تجميع وتحليلات."] },
      { id: "educational-usage", title: "الاستخدام التعليمي", list: ["البحث الأكاديمي", "مشاريع الطلاب", "تحليل الاتجاهات", "مراقبة التكنولوجيا"] },
      { id: "data-accuracy", title: "دقة البيانات", paragraphs: ["تأتي المعلومات من مزودين من جهات خارجية.", "تعتمد الدقة على الناشر الأصلي."] },
      { id: "future-research-features", title: "ميزات البحث المستقبلية", list: ["تحليل المشاعر", "نمذجة الموضوعات", "توقع الاتجاهات", "رؤى الذكاء الاصطناعي"] },
      { id: "responsible-use", title: "الاستخدام المسؤول", paragraphs: ["صُممت أدوات ذكاء البيانات لدعم التعلم والنقاش والبحث.", "ينبغي على المستخدمين التحقق من المعلومات المهمة عبر المصادر الأصلية قبل الاعتماد عليها في القرارات."] },
    ],
  },
  Japanese: {
    subtitle: "SANTET が公開情報を研究と分析のために収集、整理、活用する方法。",
    lastUpdated: "最終更新",
    readingTime: "読了時間",
    language: "言語",
    toc: "このページ",
    copy: "リンクをコピー",
    copied: "セクションリンクをコピーしました",
    principles: [
      { title: "公開ソース", description: "データは公開されている情報源から収集されます。", icon: Database },
      { title: "リサーチ重視", description: "分析は教育、研究、学習を目的としています。", icon: Lightbulb },
      { title: "明確な帰属", description: "元の所有権はソースの出版社に残ります。", icon: ShieldCheck },
      { title: "透明なモニタリング", description: "データは技術トレンドと公開情報のモニタリングに役立ちます。", icon: Search },
    ],
    sections: [
      { id: "purpose", title: "目的", list: ["教育", "研究", "データ分析", "コミュニティ学習"] },
      { id: "data-sources", title: "データソース", list: ["RSS フィード", "ニュースサイト", "GNews API", "YouTube Data API"] },
      { id: "attribution", title: "帰属", paragraphs: ["元の所有権はソースの出版社に残ります。", "SANTET は集約および分析プラットフォームとして機能します。"] },
      { id: "educational-usage", title: "教育利用", list: ["学術研究", "学生プロジェクト", "トレンド分析", "技術モニタリング"] },
      { id: "data-accuracy", title: "データの正確性", paragraphs: ["情報は第三者プロバイダーから提供されます。", "正確性は元の出版社に依存します。"] },
      { id: "future-research-features", title: "将来の研究機能", list: ["感情分析", "トピックモデリング", "トレンド予測", "AI インサイト"] },
      { id: "responsible-use", title: "責任ある利用", paragraphs: ["データインテリジェンスツールは、学習、議論、研究をサポートするために設計されています。", "ユーザーは重要な情報を判断の根拠にする前に、元の情報源で確認すべきです。"] },
    ],
  },
  Korean: {
    subtitle: "SANTET 이 공개 정보를 수집하고 정리하여 연구 및 분석에 활용하는 방식입니다.",
    lastUpdated: "최종 업데이트",
    readingTime: "읽는 시간",
    language: "언어",
    toc: "이 페이지",
    copy: "링크 복사",
    copied: "섹션 링크가 복사되었습니다",
    principles: [
      { title: "공개 출처", description: "데이터는 공개적으로 이용 가능한 정보 출처에서 수집됩니다.", icon: Database },
      { title: "연구 우선", description: "분석은 교육, 연구, 학습을 위해 사용됩니다.", icon: Lightbulb },
      { title: "명확한 출처 표기", description: "원본 소유권은 출처 게시자에게 남아 있습니다.", icon: ShieldCheck },
      { title: "투명한 모니터링", description: "데이터는 기술 트렌드와 공개 정보 모니터링에 활용됩니다.", icon: Search },
    ],
    sections: [
      { id: "purpose", title: "목적", list: ["교육", "연구", "데이터 분석", "커뮤니티 학습"] },
      { id: "data-sources", title: "데이터 출처", list: ["RSS 피드", "뉴스 웹사이트", "GNews API", "YouTube Data API"] },
      { id: "attribution", title: "출처 표기", paragraphs: ["원본 소유권은 출처 게시자에게 남아 있습니다.", "SANTET 은 집계 및 분석 플랫폼으로 작동합니다."] },
      { id: "educational-usage", title: "교육적 활용", list: ["학술 연구", "학생 프로젝트", "트렌드 분석", "기술 모니터링"] },
      { id: "data-accuracy", title: "데이터 정확성", paragraphs: ["정보는 제3자 제공업체에서 제공됩니다.", "정확성은 원본 게시자에 따라 달라집니다."] },
      { id: "future-research-features", title: "미래 연구 기능", list: ["감정 분석", "토픽 모델링", "트렌드 예측", "AI 인사이트"] },
      { id: "responsible-use", title: "책임 있는 사용", paragraphs: ["데이터 인텔리전스 도구는 학습, 토론, 연구를 지원하기 위해 설계되었습니다.", "사용자는 중요한 정보를 결정에 활용하기 전에 원본 출처에서 확인해야 합니다."] },
    ],
  },
  "Chinese (Simplified)": {
    subtitle: "SANTET 如何收集、整理并利用公开信息进行研究与分析。",
    lastUpdated: "最后更新",
    readingTime: "阅读时间",
    language: "语言",
    toc: "在本页",
    copy: "复制链接",
    copied: "章节链接已复制",
    principles: [
      { title: "公开来源", description: "数据来自公开可用的信息来源。", icon: Database },
      { title: "研究优先", description: "分析用于教育、研究和学习。", icon: Lightbulb },
      { title: "清晰归属", description: "原始所有权仍归来源发布者所有。", icon: ShieldCheck },
      { title: "透明监测", description: "数据用于监测技术趋势和公开信息。", icon: Search },
    ],
    sections: [
      { id: "purpose", title: "目的", list: ["教育", "研究", "数据分析", "社区学习"] },
      { id: "data-sources", title: "数据来源", list: ["RSS 订阅", "新闻网站", "GNews API", "YouTube Data API"] },
      { id: "attribution", title: "归属", paragraphs: ["原始所有权仍归来源发布者所有。", "SANTET 作为聚合和分析平台运行。"] },
      { id: "educational-usage", title: "教育用途", list: ["学术研究", "学生项目", "趋势分析", "技术监测"] },
      { id: "data-accuracy", title: "数据准确性", paragraphs: ["信息来自第三方提供商。", "准确性取决于原始发布者。"] },
      { id: "future-research-features", title: "未来研究功能", list: ["情感分析", "主题建模", "趋势预测", "AI 洞察"] },
      { id: "responsible-use", title: "负责任使用", paragraphs: ["数据智能工具旨在支持学习、讨论和研究。", "用户在依赖重要信息做决策前，应通过原始来源进行核实。"] },
    ],
  },
};

type LanguageKey = keyof typeof translations;

export default function DataPolicyPage() {
  const [language, setLanguage] = useState<LanguageKey>("English");
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("purpose");
  const [progress, setProgress] = useState(0);
  const content = translations[language];

  useEffect(() => {
    const stored = localStorage.getItem("santet:data-language") as LanguageKey | null;
    if (stored && translations[stored]) setLanguage(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("santet:data-language", language);
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
      const article = document.getElementById("data-content");
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
    await navigator.clipboard.writeText(`${window.location.origin}/legal/data#${id}`);
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
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">Data Policy</p>
              <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-text md:text-6xl">Data Policy</h1>
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

          <article id="data-content" className="min-w-0 space-y-6">
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
                  {section.paragraphs?.map((paragraph, index) => (
                    <p key={`${section.id}-${index}`}>{paragraph}</p>
                  ))}
                  {section.list && (
                    <div className="grid gap-3 md:grid-cols-2">
                      {section.list.map((item) => (
                        <span key={item} className="rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm text-text">
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
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}
