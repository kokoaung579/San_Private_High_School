'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Award, CalendarDays, GraduationCap, Sparkles, X } from 'lucide-react';

import type { StudentAchievement } from '@/lib/achievements';

type Language = 'MY' | 'EN';

type StudentProfileModalProps = {
  student: StudentAchievement | null;
  lang: Language;
  onClose: () => void;
};

export default function StudentProfileModal({ student, lang, onClose }: StudentProfileModalProps) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!student) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 60);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [student]);

  const subjects = student ? (lang === 'MY' ? student.subjectsMY : student.subjectsEN) : [];
  const primaryName = student ? (lang === 'MY' ? student.nameMY : student.nameEN) : '';
  const secondaryName = student ? (lang === 'MY' ? student.nameEN : student.nameMY) : '';

  return (
    <AnimatePresence>
      {student && (
        <motion.div
          className="student-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.24 }}
          onClick={() => onCloseRef.current()}
        >
          <motion.div
            ref={panelRef}
            className="student-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-profile-name"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 34, scale: reduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 22, scale: reduceMotion ? 1 : 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="student-modal-close"
              onClick={() => onCloseRef.current()}
              aria-label={lang === 'MY' ? 'ပروفိုင်းပိတ်ရန်' : 'Close student profile'}
            >
              <X size={20} />
            </button>

            <div className="student-modal-media">
              <span className="student-modal-halo" aria-hidden="true" />
              <img src={student.photo} alt={primaryName} />
            </div>

            <div className="student-modal-body">
              <span className="eyebrow"><span className="eyebrow-line" />{lang === 'MY' ? 'ကျောင်းသား ပရိုဖိုင်' : 'Student profile'}</span>
              <h2 id="student-profile-name">{primaryName}</h2>
              <p className="student-modal-name-en">{secondaryName}</p>

              <div className="student-modal-meta">
                <span>
                  <CalendarDays size={18} />
                  <span><small>{lang === 'MY' ? 'ပညာသင်နှစ်' : 'Academic year'}</small><strong>{student.year}</strong></span>
                </span>
                <span>
                  <Award size={18} />
                  <span><small>{lang === 'MY' ? 'ဂုဏ်ထူးဘာသာ' : 'Distinctions'}</small><strong>{student.distinctions} {lang === 'MY' ? 'ဘာသာ' : 'subjects'}</strong></span>
                </span>
              </div>

              <div className="student-modal-subjects">
                <h3><GraduationCap size={16} />{lang === 'MY' ? 'ဂုဏ်ထူးရ ဘာသာရပ်များ' : 'Distinction subjects'}</h3>
                <ul className="student-subject-list">
                  {subjects.map((subject, index) => (
                    <motion.li
                      key={`${student.id}-${subject}`}
                      className="student-subject-badge"
                      initial={{ opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.28,
                        delay: reduceMotion ? 0 : 0.16 + index * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Sparkles size={12} aria-hidden="true" />
                      {subject}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
