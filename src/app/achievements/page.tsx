'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Award, Globe, Moon, Search, Sun, Trophy } from 'lucide-react';

import { achievementsData, IS_DEMO_DATA, type StudentAchievement } from '@/lib/achievements';
import StudentProfileModal from '@/components/StudentProfileModal';

type Language = 'MY' | 'EN';

export default function AchievementsPage() {
  const reduceMotion = useReducedMotion();
  const [lang, setLang] = useState<Language>('MY');
  const [isNightMode, setIsNightMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedDistinctions, setSelectedDistinctions] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedStudent, setSelectedStudent] = useState<StudentAchievement | null>(null);

  useEffect(() => {
    setIsNightMode(document.documentElement.classList.contains('theme-dark'));
  }, []);

  useEffect(() => {
    setVisibleCount(8);
  }, [searchQuery, selectedYear, selectedDistinctions]);

  const years = Array.from(new Set(achievementsData.map((student) => student.year))).sort().reverse();
  const distinctions = Array.from(new Set(achievementsData.map((student) => student.distinctions))).sort((a, b) => b - a);
  const title = <T extends ReactNode,>(my: T, en: T): T => lang === 'MY' ? my : en;
  const filteredAchievements = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return achievementsData.filter((student) => {
      const matchesYear = selectedYear === 'All' || student.year === selectedYear;
      const matchesDistinctions = selectedDistinctions === 'All' || student.distinctions === Number(selectedDistinctions);
      const matchesSearch = !query ||
        student.nameMY.toLocaleLowerCase().includes(query) ||
        student.nameEN.toLocaleLowerCase().includes(query);
      return matchesYear && matchesDistinctions && matchesSearch;
    });
  }, [searchQuery, selectedYear, selectedDistinctions]);

  const toggleTheme = () => {
    const nextIsNightMode = !isNightMode;
    setIsNightMode(nextIsNightMode);
    document.documentElement.classList.toggle('theme-dark', nextIsNightMode);
    window.localStorage.setItem('san-private-high-school-theme', nextIsNightMode ? 'night' : 'day');
  };

  return (
    <main className="achievers-page">
      <header className="achievers-header">
        <div className="site-container achievers-header-inner">
          <Link className="achievers-brand" href="/">
            <span className="brand-mark">စံ</span>
            <span className="brand-copy"><strong>{title('နေပြည်တော် စံ ကိုယ်ပိုင်အထက်တန်းကျောင်း', 'San Private High School')}</strong><small>{title('ထူးချွန်ကျောင်းသားများ', 'Student achievements')}</small></span>
          </Link>
          <div className="achievers-actions">
            <button type="button" className="utility-icon" onClick={toggleTheme} aria-label={isNightMode ? 'Switch to day mode' : 'Switch to night mode'} aria-pressed={isNightMode}>{isNightMode ? <Sun size={16} /> : <Moon size={16} />}</button>
            <button type="button" className="language-toggle" onClick={() => setLang(lang === 'MY' ? 'EN' : 'MY')} aria-label="Change language"><Globe size={14} />{lang === 'MY' ? 'EN' : 'မြန်မာ'}</button>
          </div>
        </div>
      </header>

      <section className="achievers-hero">
        <div className="site-container">
          <Link href="/#achievements" className="achievers-back"><ArrowLeft size={15} />{title('ပင်မစာမျက်နှာသို့', 'Back to homepage')}</Link>
          <div className="achievers-title-row">
            <div><span className="eyebrow eyebrow-light"><span className="eyebrow-line" />{title('ဂုဏ်ယူဖွယ် အောင်မြင်မှုများ', 'A tradition of achievement')}</span><h1>{title(<>ထူးချွန်ကျောင်းသား<br /><em>များ၏ ဂုဏ်ပြုမှတ်တမ်း</em></>, <>Celebrating our<br /><em>outstanding students.</em></>)}</h1></div>
            <div className="achievers-total"><Trophy size={22} /><strong>{achievementsData.length}</strong><span>{title('မှတ်တမ်းများ', 'student records')}</span></div>
          </div>
          <p className="achievers-intro">{title('ကြိုးစားအားထုတ်မှုနှင့် ပညာရေးအောင်မြင်မှုများကို ဂုဏ်ယူစွာ မှတ်တမ်းတင်ထားပါသည်။', 'Explore the students and academic achievements recorded by our school.')}</p>
        </div>
      </section>

      <section className="achievers-content">
        <div className="site-container">
          <div className="achievement-tools achievers-tools">
            <label className="search-field"><Search size={17} /><input type="search" placeholder={title('ကျောင်းသားအမည် ရှာရန်', 'Search student name')} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></label>
            <div className="filter-fields">
              <select aria-label={title('ပညာသင်နှစ် ရွေးချယ်ရန်', 'Filter by academic year')} value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)}>
                <option value="All">{title('ပညာသင်နှစ် အားလုံး', 'All academic years')}</option>
                {years.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
              <select aria-label={title('ဂုဏ်ထူး အရေအတွက် ရွေးချယ်ရန်', 'Filter by distinctions')} value={selectedDistinctions} onChange={(event) => setSelectedDistinctions(event.target.value)}>
                <option value="All">{title('ဂုဏ်ထူး အားလုံး', 'All distinctions')}</option>
                {distinctions.map((count) => <option key={count} value={count}>{count} {title('ဘာသာ ဂုဏ်ထူး', 'distinctions')}</option>)}
              </select>
            </div>
          </div>

          <p className="achievers-result-count" aria-live="polite">{title(`တွေ့ရှိသော မှတ်တမ်း ${filteredAchievements.length} ခု`, `${filteredAchievements.length} student records`)}</p>
          <div className="achievement-grid achievers-grid">
            {filteredAchievements.slice(0, visibleCount).map((student, index) => <motion.button key={student.id} type="button" className={`achievement-card achievement-card-${(index % 4) + 1}`} initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : (index % 8) * 0.045 }} whileHover={reduceMotion ? undefined : { y: -7 }} onClick={() => setSelectedStudent(student)} aria-haspopup="dialog" aria-label={`${title('ကျောင်းသား ပရိုဖိုင် ကြည့်ရန်', 'View student profile')}: ${title(student.nameMY, student.nameEN)}`}>
              <span className="achievement-card-ornament" aria-hidden="true"><Award size={18} /></span>
              <img src={student.photo} alt={title(student.nameMY, student.nameEN)} loading="lazy" />
              <span className="result-badge">{title(student.resultCategoryMY, student.resultCategoryEN)}</span>
              <h2>{title(student.nameMY, student.nameEN)}</h2>
              <span className="result-year">{student.year}</span>
              <span className="achievement-card-count">{student.distinctions} {title('ဘာသာ ဂုဏ်ထူး', 'distinctions')}</span>
              <span className="achievement-card-open">{title('ပရိုဖိုင် ကြည့်ရန်', 'View profile')}<ArrowRight size={11} /></span>
            </motion.button>)}
            {filteredAchievements.length === 0 && <p className="no-results">{title('ကိုက်ညီသော ရလဒ် မတွေ့ပါ။', 'No students match those filters.')}</p>}
          </div>
          {visibleCount < filteredAchievements.length && <div className="achievers-load-more"><button type="button" className="button button-gold" onClick={() => setVisibleCount((count) => Math.min(count + 8, filteredAchievements.length))}>{title('နောက်ထပ် ကြည့်ရန်', 'Load More Students')}<ArrowRight size={16} /></button></div>}
          <div className="achievers-footer"><Link href="/"><ArrowLeft size={15} />{title('ပင်မစာမျက်နှာသို့ ပြန်ရန်', 'Return to homepage')}</Link></div>
        </div>
      </section>
      <StudentProfileModal student={selectedStudent} lang={lang} onClose={() => setSelectedStudent(null)} />
    </main>
  );
}
