'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown, ArrowRight, ArrowUp, Award, BookOpen, Bus, Check, CheckCircle2,
  ChevronLeft, ChevronRight, Globe, GraduationCap, ImageIcon, Mail, MapPin, Menu, Moon,
  Phone, ShieldCheck, Sparkles, Sun, Trophy, X, ZoomIn
} from 'lucide-react';

import siteData from '../../content/site.json';
import contactData from '../../content/contact.json';
import programsData from '../../content/programs.json';
import achievementsData from '../../content/achievements.json';
import eventsData from '../../content/events.json';
import transportData from '../../content/transport.json';
import facilitiesData from '../../content/facilities.json';
import sportsData from '../../content/sports.json';
import activitiesData from '../../content/activities.json';

type Language = 'MY' | 'EN';
type Activity = (typeof activitiesData)[number];

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [lang, setLang] = useState<Language>('MY');
  const [isNightMode, setIsNightMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt: string } | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);
  const photoTouchStart = useRef<number | null>(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('san-private-high-school-theme');
    const shouldUseNightMode = savedTheme ? savedTheme === 'night' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsNightMode(shouldUseNightMode);
    document.documentElement.classList.toggle('theme-dark', shouldUseNightMode);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
      setShowScrollTop(window.scrollY > 600);
      document.documentElement.style.setProperty('--hero-offset', `${Math.min(window.scrollY * 0.12, 72)}px`);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(`#${visible.target.id}`);
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0.01, 0.25, 0.5] });
    navigation.forEach((item) => {
      const section = document.querySelector(item.href);
      if (section) sectionObserver.observe(section);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!lightboxImg) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxImg(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [lightboxImg]);

  useEffect(() => {
    if (!selectedActivity) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activePhotoIndex !== null) setActivePhotoIndex(null);
        else setSelectedActivity(null);
      }
      if (activePhotoIndex === null) return;
      if (event.key === 'ArrowRight') setActivePhotoIndex((index) => index === null ? null : (index + 1) % selectedActivity.gallery.length);
      if (event.key === 'ArrowLeft') setActivePhotoIndex((index) => index === null ? null : (index - 1 + selectedActivity.gallery.length) % selectedActivity.gallery.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedActivity, activePhotoIndex]);

  const openActivity = (activity: Activity) => {
    setActivePhotoIndex(null);
    setIsPhotoZoomed(false);
    setSelectedActivity(activity);
  };

  const closeActivity = () => {
    setActivePhotoIndex(null);
    setIsPhotoZoomed(false);
    setSelectedActivity(null);
  };

  const changePhoto = (direction: -1 | 1) => {
    if (!selectedActivity || activePhotoIndex === null) return;
    setIsPhotoZoomed(false);
    setActivePhotoIndex((activePhotoIndex + direction + selectedActivity.gallery.length) % selectedActivity.gallery.length);
  };

  const toggleTheme = () => {
    const nextIsNightMode = !isNightMode;
    setIsNightMode(nextIsNightMode);
    document.documentElement.classList.toggle('theme-dark', nextIsNightMode);
    window.localStorage.setItem('san-private-high-school-theme', nextIsNightMode ? 'night' : 'day');
  };

  const navigation = [
    { href: '#home', my: 'ပင်မစာမျက်နှာ', en: 'Home' },
    { href: '#programs', my: 'ပညာရေး', en: 'Academics' },
    { href: '#achievements', my: 'အောင်မြင်မှု', en: 'Achievements' },
    { href: '#events', my: 'ကျောင်းဘဝ', en: 'Campus life' },
    { href: '#facilities', my: 'Facilities', en: 'Facilities' },
    { href: '#sports', my: 'အားကစား', en: 'Sports' },
    { href: '#transport', my: 'ကျောင်းကား', en: 'Transport' },
    { href: '#gallery', my: 'ဓာတ်ပုံများ', en: 'Gallery' },
    { href: '#news', my: 'သတင်းများ', en: 'News' },
    { href: '#contact', my: 'ဆက်သွယ်ရန်', en: 'Contact' },
  ];
  const title = <T extends React.ReactNode,>(my: T, en: T): T => lang === 'MY' ? my : en;

  return (
    <div className="site-shell">
      <div className="utility-bar">
        <div className="site-container utility-inner">
          <div className="utility-contact">
            <a href={`tel:${contactData.phones[0]}`}><Phone size={13} />{contactData.phones[0]}</a>
            <a className="utility-email" href={`mailto:${contactData.email}`}><Mail size={13} />{contactData.email}</a>
          </div>
          <div className="utility-actions">
            <span className="utility-location"><MapPin size={13} />{title(contactData.addressMY, contactData.addressEN)}</span>
            <button type="button" onClick={toggleTheme} aria-label={isNightMode ? 'Switch to day mode' : 'Switch to night mode'} aria-pressed={isNightMode} className="utility-icon">
              {isNightMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button type="button" onClick={() => setLang(lang === 'MY' ? 'EN' : 'MY')} className="language-toggle" aria-label="Change language">
              <Globe size={14} />{lang === 'MY' ? 'EN' : 'မြန်မာ'}
            </button>
          </div>
        </div>
      </div>

      <header className={`main-header ${isScrolled ? 'header-scrolled' : ''}`}>
        <nav className="site-container nav-inner" aria-label="Main navigation">
          <a className="brand" href="#home" aria-label={siteData.schoolNameEN}>
            <span className="brand-mark">စံ</span>
            <span className="brand-copy">
              <strong>{title(siteData.schoolNameMY, siteData.schoolNameEN)}</strong>
              <small>{title(siteData.locationMY, siteData.locationEN)} <i /> Est. {siteData.establishedYear}</small>
            </span>
          </a>
          <div className="desktop-nav">
            {navigation.map((item) => <a key={item.href} href={item.href} className={activeSection === item.href ? 'is-active' : undefined}>{title(item.my, item.en)}</a>)}
          </div>
          <a href="#contact" className="nav-cta">{title('ဝင်ခွင့်စုံစမ်းရန်', 'Enquire now')}<ArrowRight size={15} /></a>
          <button type="button" className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMobileMenuOpen}>
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
        <div className={`mobile-nav ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`} aria-hidden={!isMobileMenuOpen}>
          {navigation.map((item) => <a key={item.href} href={item.href} className={activeSection === item.href ? 'is-active' : undefined} tabIndex={isMobileMenuOpen ? 0 : -1} onClick={() => setIsMobileMenuOpen(false)}>{title(item.my, item.en)}<ChevronRight size={16} /></a>)}
          <a className="mobile-enquire" href="#contact" tabIndex={isMobileMenuOpen ? 0 : -1} onClick={() => setIsMobileMenuOpen(false)}>{title('ဝင်ခွင့်စုံစမ်းရန်', 'Enquire now')}<ArrowRight size={16} /></a>
        </div>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="hero-image" role="img" aria-label="Students learning together in a bright classroom" />
          <div className="hero-shade" />
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="site-container hero-content">
            <div className="hero-copy">
              <span className="eyebrow eyebrow-light"><span className="eyebrow-line" />{title('နေပြည်တော်ရှိ ကိုယ်ပိုင်အထက်တန်းကျောင်း', 'A leading private high school in Nay Pyi Taw')}</span>
              <h1 className="hero-title">{lang === 'MY' ? <>အနာဂတ်ကို<br /><em>ယုံကြည်မှုဖြင့်</em><br />တည်ဆောက်ပါ</> : <>A brighter future<br />begins with <em>belief.</em></>}</h1>
              <p className="hero-description">{title(siteData.taglineMY, siteData.taglineEN)}</p>
              <div className="hero-actions">
                <a href="#programs" className="button button-gold">{title('ကျောင်းအကြောင်း လေ့လာရန်', 'Discover our school')}<ArrowRight size={17} /></a>
                <a href="#contact" className="button button-outline">{title('ဆက်သွယ်မေးမြန်းရန်', 'Talk to our team')}</a>
              </div>
              <div className="hero-proof"><span className="proof-stars">★★★★★</span><span>{title('ပညာရေး၊ စာရိတ္တနှင့် အောင်မြင်မှုကို အလေးထားသည်', 'Learning, character and achievement since')} {siteData.establishedYear}</span></div>
            </div>
            <div className="hero-card">
              <span className="hero-card-icon"><GraduationCap size={21} /></span>
              <span className="hero-card-label">{title('ကျောင်းသားများ၏ တိုးတက်မှုကို', 'Growing confident learners')}</span>
              <strong>{title('အဓိကထားပါသည်', 'is at the heart of all we do')}</strong>
              <a href="#introduction">{title('ကျွန်ုပ်တို့၏ ရည်မှန်းချက်', 'Our approach')}<ArrowRight size={14} /></a>
            </div>
          </div>
          <a className="hero-scroll" href="#introduction"><span>{title('ဆက်လက်ကြည့်ရှုရန်', 'Scroll to explore')}</span><ArrowDown size={15} /></a>
          <div className="hero-index"><span>01</span><i />04</div>
        </section>

        <section id="introduction" className="intro-section section-pad">
          <div className="site-container intro-grid">
            <div className="intro-visual reveal">
              <img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1100&q=85" alt="Welcoming school campus" loading="lazy" />
              <div className="intro-image-caption"><span className="caption-emblem">စံ</span><span><strong>{title('နေပြည်တော်၊ မြန်မာ', 'Nay Pyi Taw, Myanmar')}</strong><small>{title('သင်ယူမှုအတွက် ရည်ရွယ်တည်ဆောက်ထားသည်', 'A place designed for learning')}</small></span></div>
              <div className="intro-year"><strong>{siteData.establishedYear}</strong><span>{title('စတင်တည်ထောင်ခဲ့သည်', 'Established')}</span></div>
            </div>
            <div className="intro-copy reveal">
              <span className="eyebrow"><span className="eyebrow-line" />{title('နေပြည်တော် " စံ " ကျောင်းအကြောင်း', 'Welcome to Nay Pyi Taw San')}</span>
              <h2 className="section-title">{title(<>ပညာရေးထက်ပိုသော<br /><em>အနာဂတ်အတွက်</em></>, <>More than education.<br /><em>A foundation for life.</em></>)}</h2>
              <p className="intro-lead">{title('အသိပညာ၊ အကျင့်စာရိတ္တနှင့် အောင်မြင်မှုတို့ကို အတူတကွ ပြုစုပျိုးထောင်ပေးသည့် နွေးထွေးပြီး စနစ်တကျရှိသော သင်ယူမှုပတ်ဝန်းကျင်။', 'At San Private High School, we nurture knowledge, character and success in a welcoming, focused learning environment.')}</p>
              <p className="body-copy">{title('Grade 5 မှ Grade 12 အထိ ကျောင်းသား၊ ကျောင်းသူများအား မိမိတို့၏ အရည်အချင်းများကို ယုံကြည်စွာ ဖော်ထုတ်နိုင်ရန်နှင့် နောင်တစ်ချိန်အတွက် အဆင်သင့်ဖြစ်စေရန် အားပေးလမ်းညွှန်ပါသည်။', 'From Grade 5 through Grade 12, students are encouraged to discover their strengths, grow in confidence and prepare for the opportunities ahead.')}</p>
              <a className="text-link" href="#programs">{title('ကျွန်ုပ်တို့၏ ပညာရေးအစီအစဉ်', 'Explore our academic approach')}<ArrowRight size={16} /></a>
              <div className="intro-values">
                <span><Check size={15} />{title('ကျောင်းသားဗဟိုပြု', 'Student-centred')}</span>
                <span><Check size={15} />{title('စနစ်တကျလမ်းညွှန်မှု', 'Supportive guidance')}</span>
                <span><Check size={15} />{title('အရည်အသွေးရှိသော သင်ကြားမှု', 'Quality teaching')}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="impact-strip">
          <div className="site-container impact-grid">
            <div className="impact-intro"><span className="eyebrow eyebrow-light">{title('စံကျောင်း၏ ထူးခြားချက်', 'The San difference')}</span><strong>{title('တိုးတက်မှုကို အတူဖန်တီးကြပါစို့', 'Every learner has room to thrive.')}</strong></div>
            <div className="impact-stat"><Award /><strong>100%</strong><span>{title('တက္ကသိုလ်ဝင်တန်း အောင်ချက်', 'Matriculation pass rate')}</span></div>
            <div className="impact-stat"><Trophy /><strong>350+</strong><span>{title('ဂုဏ်ထူးရ ကျောင်းသားများ', 'Distinction achievers')}</span></div>
            <div className="impact-stat"><BookOpen /><strong>5–12</strong><span>{title('သင်ကြားရေး အဆင့်များ', 'Grades served')}</span></div>
          </div>
        </section>

        <section id="programs" className="program-section section-pad">
          <div className="site-container">
            <div className="section-heading reveal">
              <div><span className="eyebrow"><span className="eyebrow-line" />{title('ပညာရေး အစီအစဉ်များ', 'Learning at every stage')}</span><h2 className="section-title">{title(<>တစ်ဆင့်ချင်းစီ<br /><em>တောက်ပသော အနာဂတ်ဆီ</em></>, <>A pathway to<br /><em>lasting achievement.</em></>)}</h2></div>
              <p>{title('Grade 5 မှ Grade 12 အထိ သင်ယူမှုအဆင့်တိုင်းတွင် ကျောင်းသားများ၏ အခြေခံကျွမ်းကျင်မှု၊ သိလိုစိတ်နှင့် ယုံကြည်မှုတို့ကို တည်ဆောက်ပေးပါသည်။', 'A thoughtfully structured journey from foundational learning to matriculation preparation, helping each student build skills and confidence along the way.')}</p>
            </div>
            <div className="program-grid">
              {programsData.map((program, index) => <motion.article key={program.grade} className={`program-card program-card-${index + 1} reveal delay-${index + 1}`} whileHover={reduceMotion ? undefined : { y: -7 }} transition={{ type: 'spring', stiffness: 310, damping: 24 }}>
                <div className="program-photo"><img src={program.image} alt={program.grade} loading="lazy" /><span className="program-number">0{index + 1}</span><span className="grade-pill">{program.grade}</span></div>
                <div className="program-content"><h3>{title(program.titleMY, program.titleEN)}</h3><p>{title(program.descriptionMY, program.descriptionEN)}</p><a href="#contact" aria-label={`${title('စုံစမ်းရန်', 'Enquire about')} ${program.grade}`}><ArrowRight size={18} /></a></div>
              </motion.article>)}
            </div>
          </div>
        </section>

        <section id="achievements" className="achievement-section section-pad">
          <div className="site-container">
            <div className="achievement-top reveal">
              <div><span className="eyebrow eyebrow-light"><span className="eyebrow-line" />{title('အောင်မြင်မှုများ', 'A tradition of achievement')}</span><h2 className="section-title section-title-light">{title(<>ကြိုးစားမှုတိုင်းကို<br /><em>ဂုဏ်ပြုပါသည်</em></>, <>Every effort deserves<br /><em>to be celebrated.</em></>)}</h2></div>
              <p>{title('ကျောင်းသား၊ ကျောင်းသူများ၏ ကြိုးစားအားထုတ်မှုနှင့် ပညာရေးအောင်မြင်မှုများကို ဂုဏ်ယူစွာ မျှဝေပါသည်။', 'We are proud to share the dedication and academic accomplishments of our students.')}</p>
            </div>
            <div className="achievement-grid">
              {achievementsData.slice(0, 4).map((student, index) => <motion.article key={student.id} className={`achievement-card achievement-card-${(index % 4) + 1}`} initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.08 }} whileHover={reduceMotion ? undefined : { y: -7 }}>
                <span className="achievement-card-ornament" aria-hidden="true"><Award size={18} /></span>
                <img src={student.photo} alt={student.nameEN} loading="lazy" />
                <span className="result-badge">{title(student.resultCategoryMY, student.resultCategoryEN)}</span>
                <h3>{title(student.nameMY, student.nameEN)}</h3><span className="result-year">{student.year}</span>
                <span className="achievement-card-count">{student.distinctions} {title('ဘာသာ ဂုဏ်ထူး', 'distinctions')}</span>
              </motion.article>)}
            </div>
            <div className="achievement-more"><span>{title(`ကျောင်းသားထူးချွန် ${achievementsData.length} ဦး`, `${achievementsData.length} outstanding students`)}</span><a className="button button-gold" href="/achievements">{title('ကျောင်းသားအားလုံး ကြည့်ရန်', 'View All Students')}<ArrowRight size={16} /></a></div>
          </div>
        </section>

        <section id="events" className="campus-section section-pad">
          <div className="site-container">
            <div className="section-heading reveal">
              <div><span className="eyebrow"><span className="eyebrow-line" />{title('ကျောင်းဘဝ', 'Life beyond the classroom')}</span><h2 className="section-title">{title(<>သင်ယူမှု၊ ပါဝင်မှုနှင့်<br /><em>တိုးတက်မှုတို့</em></>, <>Curiosity, connection<br /><em>and confidence.</em></>)}</h2></div>
              <p>{title('စာသင်ခန်းပြင်ပတွင်လည်း ကျောင်းသားများ၏ စူးစမ်းလိုစိတ်၊ ပူးပေါင်းဆောင်ရွက်မှုနှင့် ကိုယ်ရည်ကိုယ်သွေးတို့ကို ဖွံ့ဖြိုးစေမည့် အခွင့်အလမ်းများ။', 'A vibrant campus experience gives students space to connect, take part and develop their interests beyond lessons.')}</p>
            </div>
            <div className="event-grid">
              {activitiesData.map((activity, index) => <motion.button key={activity.id} type="button" className={`event-card event-card-${(index % 4) + 1} activity-card reveal delay-${(index % 4) + 1}`} whileHover={reduceMotion ? undefined : { y: -5 }} transition={{ type: 'spring', stiffness: 310, damping: 24 }} onClick={() => openActivity(activity)} aria-label={`${title('ဓာတ်ပုံများကြည့်ရန်', 'View gallery')}: ${title(activity.titleMY, activity.titleEN)}`}>
                <div className="event-photo"><img src={activity.cover} alt={title(activity.titleMY, activity.titleEN)} loading="lazy" /><span className="event-date">{activity.date}</span><span className="activity-gallery-count"><ImageIcon size={14} />{activity.gallery.length}</span></div>
                <div className="event-copy"><span className="card-kicker">{title('ဓာတ်ပုံစုစည်းမှု', 'Photo story')}</span><h3>{title(activity.titleMY, activity.titleEN)}</h3><p>{title(activity.descriptionMY, activity.descriptionEN)}</p><span className="activity-open">{title('ဓာတ်ပုံများ ကြည့်ရန်', 'Open gallery')}<ArrowRight size={15} /></span></div>
              </motion.button>)}
            </div>
          </div>
        </section>

        <section id="facilities" className="facility-section section-pad">
          <div className="site-container">
            <div className="section-heading reveal">
              <div><span className="eyebrow"><span className="eyebrow-line" />{title('သင်ယူမှု ပတ်ဝန်းကျင်', 'Made for learning')}</span><h2 className="section-title">{title(<>နေ့စဉ်သင်ယူမှုအတွက်<br /><em>သင့်လျော်သော နေရာများ</em></>, <>Spaces that inspire<br /><em>everyday discovery.</em></>)}</h2></div>
              <p>{title('စာဖတ်ခြင်းမှသည် အားကစားအထိ၊ သင်ယူမှုအတွေ့အကြုံကို ပံ့ပိုးပေးရန် ကျောင်းပတ်ဝန်းကျင်နှင့် နေရာများကို စီစဉ်ထားပါသည်။', 'From quiet study to active play, our facilities support a balanced and engaging school experience.')}</p>
            </div>
            <div className="facility-grid">
              {facilitiesData.map((facility, index) => <motion.article key={facility.titleEN} className={`facility-card facility-card-${index + 1} reveal delay-${(index % 4) + 1}`} whileHover={reduceMotion ? undefined : { y: -6 }} transition={{ type: 'spring', stiffness: 310, damping: 24 }}>
                <img src={facility.image} alt={title(facility.titleMY, facility.titleEN)} loading="lazy" />
                <div className="facility-caption"><div><span>{title('ကျောင်းပတ်ဝန်းကျင်', 'Our campus')}</span><h3>{title(facility.titleMY, facility.titleEN)}</h3></div><ArrowUp size={18} /></div>
                <p>{title(facility.descMY, facility.descEN)}</p>
              </motion.article>)}
            </div>
          </div>
        </section>

        <section id="sports" className="sports-section section-pad">
          <div className="site-container sports-layout">
            <div className="sports-heading reveal"><span className="eyebrow"><span className="eyebrow-line" />Move · Play · Grow</span><h2 className="section-title">{title(<>ကျန်းမာသော ကိုယ်ခန္ဓာ၊<br /><em>တက်ကြွသော စိတ်ဓာတ်</em></>, <>Healthy bodies.<br /><em>Confident minds.</em></>)}</h2><p>{title('အားကစားလှုပ်ရှားမှုများမှတစ်ဆင့် အဖွဲ့လိုက်လုပ်ဆောင်မှု၊ စည်းကမ်းနှင့် ကိုယ်လက်လှုပ်ရှားမှုတို့ကို အားပေးပါသည်။', 'Sport encourages teamwork, discipline and an active approach to wellbeing.')}</p></div>
            <div className="sports-grid">
              {sportsData.map((sport, index) => <article key={sport.titleEN} className={`sport-card reveal delay-${index + 1}`}><img src={sport.image} alt={title(sport.titleMY, sport.titleEN)} loading="lazy" /><div><h3>{title(sport.titleMY, sport.titleEN)}</h3><p>{title(sport.descMY, sport.descEN)}</p></div></article>)}
            </div>
          </div>
        </section>

        <section id="transport" className="transport-section">
          <div className="site-container transport-layout">
            <div className="transport-copy reveal"><span className="eyebrow eyebrow-light"><span className="eyebrow-line" />{title('ကျောင်းကြို/ပို့ ဝန်ဆောင်မှု', 'A smoother school day')}</span><h2 className="section-title section-title-light">{title(transportData.serviceTitleMY, transportData.serviceTitleEN)}</h2><p>{title(transportData.descriptionMY, transportData.descriptionEN)}</p><ul>{(lang === 'MY' ? transportData.featuresMY : transportData.featuresEN).map((feature) => <li key={feature}><CheckCircle2 size={17} />{feature}</li>)}</ul><a href="#contact" className="button button-gold">{title('လမ်းကြောင်းများ စုံစမ်းရန်', 'Ask about routes')}<ArrowRight size={16} /></a></div>
            <div className="route-card reveal"><div className="route-title"><Bus size={21} /><div><span>{title('ကျောင်းကား ဝန်ဆောင်မှု', 'School bus service')}</span><strong>{title('လမ်းကြောင်းများနှင့် အချိန်ဇယား', 'Routes & sample timings')}</strong></div></div>{transportData.routes.map((route) => <div className="route-row" key={route.townshipEN}><span><MapPin size={14} />{title(route.townshipMY, route.townshipEN)}</span><strong>{title(route.timeMY, route.timeEN)}</strong></div>)}</div>
          </div>
        </section>

        <section id="gallery" className="gallery-section section-pad">
          <div className="site-container">
            <div className="section-heading reveal"><div><span className="eyebrow"><span className="eyebrow-line" />{title('ပုံရိပ်များ', 'A glimpse of campus life')}</span><h2 className="section-title">{title(<>နေ့စဉ်ဘဝ၏<br /><em>အမှတ်တရများ</em></>, <>A closer look<br /><em>at life at San.</em></>)}</h2></div><p>{title('သင်ယူခြင်း၊ ပူးပေါင်းဆောင်ရွက်ခြင်းနှင့် အတူတကွ ကြီးပြင်းလာခြင်းတို့၏ အခိုက်အတန့်များ။', 'Moments of learning, teamwork and growing together.')}</p></div>
            <div className="gallery-grid">
              {[...facilitiesData.slice(0, 3), ...sportsData.slice(0, 2), ...eventsData.slice(0, 1)].map((item, index) => {
                const alt = 'titleMY' in item ? title(item.titleMY, item.titleEN) : 'San school campus';
                return <motion.button key={`${item.image}-${index}`} type="button" className={`gallery-tile gallery-tile-${index + 1} reveal delay-${(index % 4) + 1}`} whileHover={reduceMotion ? undefined : { scale: 1.015 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} onClick={() => setLightboxImg({ src: item.image, alt })} aria-label={`${title('ဓာတ်ပုံကို အကြီးချဲ့ကြည့်ရန်', 'View image')}: ${alt}`}><img src={item.image} alt={alt} loading="lazy" /><span className="gallery-expand"><Sparkles size={17} /></span></motion.button>;
              })}
            </div>
            <p className="gallery-note">{title('နမူနာဓာတ်ပုံများ — မထုတ်ဝေမီ ကျောင်း၏ ကိုယ်ပိုင်ဓာတ်ပုံများဖြင့် အစားထိုးပါ။', 'Sample photography — replace with original school photographs before publishing.')}</p>
          </div>
        </section>

        <section id="news" className="news-section section-pad">
          <div className="site-container">
            <div className="news-heading reveal"><div><span className="eyebrow"><span className="eyebrow-line" />{title('သတင်းနှင့် ကြေညာချက်များ', 'From our community')}</span><h2 className="section-title">{title(<>ကျောင်းမှ <em>နောက်ဆုံးရသတင်းများ</em></>, <>The latest from<br /><em>our school community.</em></>)}</h2></div><a href="#events" className="text-link">{title('လှုပ်ရှားမှုများအားလုံး', 'All campus activities')}<ArrowRight size={16} /></a></div>
            <div className="news-grid">
              {eventsData.slice(0, 3).map((event, index) => <article key={`news-${event.titleEN}`} className={`news-card news-card-${index + 1} reveal delay-${index + 1}`}><div className="news-thumb"><img src={event.image} alt="" loading="lazy" /><span>{title('ကျောင်းသတင်း', 'School news')}</span></div><div className="news-copy"><small>{event.date}</small><h3>{title(event.titleMY, event.titleEN)}</h3><p>{title(event.descMY, event.descEN)}</p><a href="#events">{title('ပိုမိုဖတ်ရှုရန်', 'Read more')}<ArrowRight size={14} /></a></div></article>)}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section section-pad">
          <div className="site-container">
            <div className="contact-banner reveal"><div><span className="eyebrow eyebrow-light"><span className="eyebrow-line" />{title('သင့်မိသားစုကို ကြိုဆိုပါသည်', 'Your next step starts here')}</span><h2>{title(<>နေပြည်တော်' စံ 'ကျောင်းအကြောင်း<br />ပိုမိုသိရှိလိုပါသလား။</>, <>Could San be the<br />right school for you?</>)}</h2><p>{title('ကျောင်းအကြောင်း၊ ပညာရေးအစီအစဉ်များနှင့် ဝင်ခွင့်ဆိုင်ရာ အသေးစိတ်အချက်အလက်များအတွက် ဆက်သွယ်မေးမြန်းနိုင်ပါသည်။', 'Get in touch to learn more about our school, academic programmes and admissions.')}</p><a className="button button-gold" href={`tel:${contactData.phones[0]}`}><Phone size={16} />{title('ယခုပင် ဆက်သွယ်ရန်', 'Speak with our team')}</a></div><div className="contact-art"><div className="contact-orbit orbit-a" /><div className="contact-orbit orbit-b" /><div className="contact-seal"><span>စံ</span><small>SAN PRIVATE HIGH SCHOOL</small><i>KNOWLEDGE · CHARACTER · SUCCESS</i></div></div></div>
            <div className="contact-grid">
              <div className="contact-details reveal"><span className="eyebrow"><span className="eyebrow-line" />{title('ဆက်သွယ်ရန်', 'Find us')}</span><h2>{title('ဆက်သွယ်ရန် အချက်အလက်များ', 'We would love to hear from you.')}</h2><div className="contact-detail"><span className="contact-icon"><MapPin size={18} /></span><div><small>{title('လိပ်စာ', 'Address')}</small><p>{title(contactData.addressMY, contactData.addressEN)}</p></div></div><div className="contact-detail"><span className="contact-icon"><Phone size={18} /></span><div><small>{title('ဖုန်း', 'Phone')}</small><p>{contactData.phones.map((phone, index) => <React.Fragment key={phone}><a href={`tel:${phone}`}>{phone}</a>{index < contactData.phones.length - 1 ? ' · ' : ''}</React.Fragment>)}</p></div></div><div className="contact-detail"><span className="contact-icon"><Mail size={18} /></span><div><small>{title('အီးမေးလ်', 'Email')}</small><p><a href={`mailto:${contactData.email}`}>{contactData.email}</a></p></div></div><a href={contactData.mapDirectLink} target="_blank" rel="noreferrer" className="text-link">{title('လမ်းညွှန်ရယူရန်', 'Get directions')}<ArrowRight size={16} /></a></div>
              <div className="map-frame reveal"><iframe title={title('နေပြည်တော်  " စံ "  ကိုယ်ပိုင်အထက်တန်းကျောင်း တည်နေရာမြေပုံ', 'Map showing San Private High School')} src={contactData.mapEmbedUrl} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" /><a href={contactData.mapDirectLink} target="_blank" rel="noreferrer" className="map-label"><MapPin size={15} />{title('မြေပုံတွင် ကြည့်ရန်', 'View on map')}<ArrowRight size={14} /></a></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-container footer-main"><div className="footer-brand"><a className="brand brand-footer" href="#home"><span className="brand-mark">စံ</span><span className="brand-copy"><strong>{siteData.schoolNameEN}</strong><small>{title(siteData.locationMY, siteData.locationEN)}</small></span></a><p>{title(siteData.taglineMY, siteData.taglineEN)}</p></div><div className="footer-links"><strong>{title('လေ့လာရန်', 'Explore')}</strong><a href="#programs">{title('ပညာရေး', 'Academics')}</a><a href="#achievements">{title('အောင်မြင်မှုများ', 'Achievements')}</a><a href="#events">{title('ကျောင်းဘဝ', 'Campus life')}</a><a href="#gallery">{title('ဓာတ်ပုံများ', 'Gallery')}</a></div><div className="footer-links"><strong>{title('ဆက်သွယ်ရန်', 'Contact')}</strong><a href={`tel:${contactData.phones[0]}`}>{contactData.phones[0]}</a><a href={`mailto:${contactData.email}`}>{contactData.email}</a><span>{title(contactData.addressMY, contactData.addressEN)}</span></div><div className="footer-motto"><ShieldCheck size={23} /><strong>{title('အသိပညာ · အကျင့်စာရိတ္တ · အောင်မြင်မှု', 'Knowledge · Character · Success')}</strong><span>{title('အနာဂတ်အတွက် ခိုင်မာသောအခြေခံ', 'A strong foundation for tomorrow')}</span></div></div>
        <div className="site-container footer-bottom"><span>© {new Date().getFullYear()} {siteData.schoolNameEN}. {title('မူပိုင်ခွင့်အားလုံးရယူထားသည်။', 'All rights reserved.')}</span><a href="#home">{title('အပေါ်သို့', 'Back to top')}<ArrowUp size={14} /></a></div>
      </footer>

      {showScrollTop && <button type="button" className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label={title('စာမျက်နှာထိပ်သို့ ပြန်သွားရန်', 'Back to top')}><ArrowUp size={19} /></button>}
      {lightboxImg && <div className="lightbox" role="dialog" aria-modal="true" aria-label={lightboxImg.alt} onClick={() => setLightboxImg(null)}><button type="button" className="lightbox-close" onClick={() => setLightboxImg(null)} aria-label="Close image"><X size={22} /></button><img src={lightboxImg.src} alt={lightboxImg.alt} onClick={(event) => event.stopPropagation()} /><p>{lightboxImg.alt}</p></div>}
      <AnimatePresence>
        {selectedActivity && <motion.div className="activity-gallery-modal" role="dialog" aria-modal="true" aria-label={title(selectedActivity.titleMY, selectedActivity.titleEN)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeActivity}>
          <motion.div className="activity-gallery-panel" initial={{ opacity: 0, y: reduceMotion ? 0 : 28, scale: reduceMotion ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 20 }} transition={{ duration: reduceMotion ? 0 : .3 }} onClick={(event) => event.stopPropagation()}>
            <div className="activity-gallery-head"><div><span className="eyebrow"><span className="eyebrow-line" />{title('ကျောင်းလှုပ်ရှားမှု ဓာတ်ပုံများ', 'Activity photo story')}</span><h2>{title(selectedActivity.titleMY, selectedActivity.titleEN)}</h2><p>{title(selectedActivity.descriptionMY, selectedActivity.descriptionEN)}</p></div><button type="button" className="gallery-close" onClick={closeActivity} aria-label={title('ပိတ်ရန်', 'Close gallery')}><X size={21} /></button></div>
            <div className="activity-masonry">{selectedActivity.gallery.map((photo, index) => <motion.button key={photo.src} type="button" className={`activity-photo activity-photo-${index + 1}`} initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : index * .07 }} onClick={() => { setIsPhotoZoomed(false); setActivePhotoIndex(index); }}><img src={photo.src} alt={title(photo.captionMY, photo.captionEN)} /><span><ZoomIn size={18} />{title(photo.captionMY, photo.captionEN)}</span></motion.button>)}</div>
            <p className="activity-gallery-note">{title('နမူနာဓာတ်ပုံများ — အမှန်တကယ် ကျောင်းဓာတ်ပုံများ ရရှိပါက သက်ဆိုင်ရာအမျိုးအစားအလိုက် အစားထိုးပါ။', 'Sample placeholders — replace each category with its matching original school photos when available.')}</p>
          </motion.div>
          <AnimatePresence>{activePhotoIndex !== null && <motion.div className="photo-viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onTouchStart={(event) => { photoTouchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const start = photoTouchStart.current; const end = event.changedTouches[0]?.clientX; if (start !== null && end !== undefined && Math.abs(end - start) > 48) changePhoto(end < start ? 1 : -1); photoTouchStart.current = null; }} onClick={() => setActivePhotoIndex(null)}>
            <button type="button" className="viewer-close" onClick={() => setActivePhotoIndex(null)} aria-label={title('ဓာတ်ပုံကြည့်ရှုမှု ပိတ်ရန်', 'Close photo viewer')}><X size={22} /></button><button type="button" className="viewer-nav viewer-prev" onClick={(event) => { event.stopPropagation(); changePhoto(-1); }} aria-label={title('ယခင်ဓာတ်ပုံ', 'Previous photo')}><ChevronLeft size={25} /></button><motion.figure className={isPhotoZoomed ? 'viewer-image is-zoomed' : 'viewer-image'} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} key={selectedActivity.gallery[activePhotoIndex].src} onClick={(event) => { event.stopPropagation(); setIsPhotoZoomed(!isPhotoZoomed); }}><img src={selectedActivity.gallery[activePhotoIndex].src} alt={title(selectedActivity.gallery[activePhotoIndex].captionMY, selectedActivity.gallery[activePhotoIndex].captionEN)} /><figcaption>{title(selectedActivity.gallery[activePhotoIndex].captionMY, selectedActivity.gallery[activePhotoIndex].captionEN)}<small>{activePhotoIndex + 1} / {selectedActivity.gallery.length}</small></figcaption></motion.figure><button type="button" className="viewer-nav viewer-next" onClick={(event) => { event.stopPropagation(); changePhoto(1); }} aria-label={title('နောက်ဓာတ်ပုံ', 'Next photo')}><ChevronRight size={25} /></button>
          </motion.div>}</AnimatePresence>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
