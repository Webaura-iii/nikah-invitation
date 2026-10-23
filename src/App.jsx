import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CalendarDays, Clock3, MapPin, ChevronDown, ArrowUp, Check, Languages, Heart, Volume2, VolumeX, RotateCcw, Flower2, Sparkles, Menu, X } from 'lucide-react'

const wedding = {
  groom: '[Groom’s Name]',
  bride: '[Bride’s Name]',
  date: '', // Set an ISO date/time with timezone, e.g. 2027-02-14T18:00:00+05:30
  nikah: { title: 'The Nikah Ceremony', dateLabel: '[Day, Date]', time: '[Time]', venue: '[Venue Name]', address: '[Full venue address, City, Country]', mapUrl: '' },
  walima: { enabled: false, title: 'The Walima', dateLabel: '[Day, Date]', time: '[Time]', venue: '[Venue Name]', address: '[Full venue address]', mapUrl: '' },
  initials: 'بِسْمِ اللَّهِ',
  storyEnabled: false,
  story: ''
}

const translations = {
  en: {
    name:'English',dir:'ltr',instruction:'A beautiful beginning awaits.',open:'Open your invitation',tap:'Tap the seal to open',bismillah:'In the name of Allah, the Most Gracious, the Most Merciful',
    together:'With the blessings of Allah and the love of our families, we joyfully invite you to celebrate the Nikah of',
    invite:'Together with our families, we invite you to share in the joy of our Nikah and wedding celebration.',
    details:'The Celebration',nikah:'The Nikah Ceremony',date:'Date',time:'Time',venue:'Venue',location:'View Location',calendar:'Add to Calendar',countdown:'Until our special day',days:'Days',hours:'Hours',minutes:'Minutes',seconds:'Seconds',notSet:'Our special date will be shared soon.',story:'Our Story',rsvpTitle:'We Would Be Honoured by Your Presence',rsvpText:'Kindly let us know if you can join us in celebrating this blessed occasion.',guest:'Your name',phone:'Phone number (optional)',attendance:'Will you be joining us?',yes:'Joyfully accepts',no:'Regretfully declines',guests:'Number of guests',message:'A message or dua for the couple (optional)',send:'Send RSVP',sending:'Preparing…',honest:'RSVP submission is not connected yet. Please contact the hosts directly to confirm your attendance.',success:'Your response has been prepared. Please send it to the hosts directly.',required:'Please enter your name and attendance choice.',closing:'Your presence, love, and prayers mean the world to us.',dua:'May Allah bless this union with love, mercy, tranquility, and barakah.',back:'Return to invitation',reopen:'Revisit the invitation',made:'Made with love and duas',ourNames:'The beginning of forever',storyPlaceholder:'Add your story here in the wedding configuration.',download:'Download calendar event'
  },
  ur: {
    name:'اردو',dir:'rtl',instruction:'ایک خوبصورت آغاز آپ کا منتظر ہے۔',open:'اپنا دعوت نامہ کھولیں',tap:'مہر کو چھو کر دعوت نامہ کھولیں',bismillah:'اللہ کے نام سے جو نہایت مہربان، رحم فرمانے والا ہے',
    together:'اللہ کی رحمتوں اور اپنے خاندانوں کی محبت کے ساتھ، ہم آپ کو اپنے نکاح کی خوشی میں شرکت کی دعوت دیتے ہیں۔',
    invite:'ہم اپنے خاندانوں کے ساتھ آپ کو اپنے نکاح اور شادی کی خوشیوں میں شریک ہونے کی دعوت دیتے ہیں۔',
    details:'تقریب کی تفصیلات',nikah:'تقریبِ نکاح',date:'تاریخ',time:'وقت',venue:'مقام',location:'مقام دیکھیں',calendar:'کیلنڈر میں شامل کریں',countdown:'ہمارے خاص دن تک',days:'دن',hours:'گھنٹے',minutes:'منٹ',seconds:'سیکنڈ',notSet:'تقریب کی تاریخ جلد بتائی جائے گی۔',story:'ہماری کہانی',rsvpTitle:'آپ کی شرکت ہمارے لیے باعثِ مسرت ہوگی',rsvpText:'براہِ کرم اس مبارک موقع پر اپنی شرکت کے بارے میں آگاہ فرمائیں۔',guest:'آپ کا نام',phone:'فون نمبر (اختیاری)',attendance:'کیا آپ تشریف لائیں گے؟',yes:'خوشی سے شرکت کریں گے',no:'معذرت کے ساتھ شرکت نہیں کر سکیں گے',guests:'مہمانوں کی تعداد',message:'جوڑے کے لیے پیغام یا دعا (اختیاری)',send:'جواب بھیجیں',sending:'تیار ہو رہا ہے…',honest:'جواب بھیجنے کا نظام ابھی منسلک نہیں ہے۔ براہِ کرم شرکت کی تصدیق میزبانوں سے براہِ راست کریں۔',success:'آپ کا جواب تیار ہے۔ براہِ کرم اسے میزبانوں کو براہِ راست بھیجیں۔',required:'براہِ کرم اپنا نام اور شرکت کا انتخاب درج کریں۔',closing:'آپ کی موجودگی، محبت اور دعائیں ہمارے لیے بہت قیمتی ہیں۔',dua:'اللہ تعالیٰ اس رشتے میں محبت، رحمت، سکون اور برکت عطا فرمائے۔',back:'دعوت نامے پر واپس جائیں',reopen:'دعوت نامہ دوبارہ دیکھیں',made:'محبت اور دعاؤں کے ساتھ',ourNames:'ہمیشہ کے سفر کا آغاز',storyPlaceholder:'اپنی کہانی یہاں شامل کریں۔',download:'کیلنڈر دعوت نامہ ڈاؤن لوڈ کریں'
  },
  ar: {
    name:'العربية',dir:'rtl',instruction:'بداية جميلة بانتظاركم.',open:'افتحوا دعوتكم',tap:'اضغطوا على الختم لفتح الدعوة',bismillah:'بسم الله الرحمن الرحيم',
    together:'بفضل الله ومحبة عائلتينا، يسعدنا دعوتكم لمشاركتنا فرحة عقد قراننا.',
    invite:'يسرّنا مع عائلتينا دعوتكم لمشاركتنا فرحة عقد القران والاحتفال بهذه المناسبة المباركة.',
    details:'تفاصيل الاحتفال',nikah:'حفل عقد القران',date:'التاريخ',time:'الوقت',venue:'المكان',location:'عرض الموقع',calendar:'أضف إلى التقويم',countdown:'حتى يومنا المميز',days:'أيام',hours:'ساعات',minutes:'دقائق',seconds:'ثوانٍ',notSet:'سنشارككم موعد مناسبتنا قريبًا.',story:'قصتنا',rsvpTitle:'يشرفنا حضوركم ومشاركتكم فرحتنا',rsvpText:'نرجو إبلاغنا إن كنتم ستشاركوننا هذه المناسبة المباركة.',guest:'الاسم',phone:'رقم الهاتف (اختياري)',attendance:'هل ستتمكنون من الحضور؟',yes:'يسعدنا الحضور',no:'نعتذر عن الحضور',guests:'عدد الضيوف',message:'رسالة أو دعاء للعروسين (اختياري)',send:'إرسال الرد',sending:'جارٍ التجهيز…',honest:'لم يتم ربط إرسال الردود بعد. يرجى تأكيد الحضور مباشرةً مع أصحاب الدعوة.',success:'تم تجهيز ردكم. يرجى إرساله إلى أصحاب الدعوة مباشرةً.',required:'يرجى إدخال الاسم واختيار حالة الحضور.',closing:'حضوركم ومحبتكم ودعواتكم تعني لنا الكثير.',dua:'نسأل الله أن يبارك هذا الاتحاد بالمحبة والرحمة والسكينة والبركة.',back:'العودة إلى الدعوة',reopen:'إعادة مشاهدة الدعوة',made:'صُنعت بمحبة ودعوات صادقة',ourNames:'بداية العمر معًا',storyPlaceholder:'أضيفوا قصتكم هنا في إعدادات الدعوة.',download:'تنزيل دعوة التقويم'
  }
}
const floralA = 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=650&q=85'
const floralB = 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=650&q=85'
const curtain = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=85'

function Rose({className=''}) { return <img className={'rose '+className} src={floralA} alt="" aria-hidden="true" loading="lazy" /> }
function FloralCorners(){return <><Rose className="rose-tl"/><Rose className="rose-tr"/><Rose className="rose-bl"/><Rose className="rose-br"/></>}
function Divider({small=false}) { return <div className={'ornament '+(small?'ornament-small':'')} aria-hidden="true"><span/><Flower2 size={small?13:17} strokeWidth={1}/><span/></div> }
function Section({id,children,className=''}) {return <section id={id} className={'paper-section '+className}><div className="paper-border"/><FloralCorners/>{children}</section>}
function IconSeal({children}) {return <span className="seal-icon">{children}</span>}

export default function App(){
  const [lang,setLang]=useState(()=>localStorage.getItem('nikah-language')||'en')
  const [opened,setOpened]=useState(false)
  const [opening,setOpening]=useState(false)
  const [active,setActive]=useState('home')
  const [now,setNow]=useState(Date.now())
  const [rsvp,setRsvp]=useState({name:'',phone:'',attendance:'',guests:'1',message:''})
  const [notice,setNotice]=useState('')
  const [menuOpen,setMenuOpen]=useState(false)
  const reduceMotion=useReducedMotion()
  const t=translations[lang]
  const isRtl=t.dir==='rtl'
  useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=t.dir;document.body.dataset.lang=lang;localStorage.setItem('nikah-language',lang)},[lang,t.dir])
  useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id)},[])
  const target=useMemo(()=>wedding.date?new Date(wedding.date).getTime():null,[ ])
  const remaining=target?Math.max(0,target-now):null
  const countdown=remaining===null?null:{days:Math.floor(remaining/86400000),hours:Math.floor(remaining/3600000)%24,minutes:Math.floor(remaining/60000)%60,seconds:Math.floor(remaining/1000)%60}
  function openInvitation(){if(opening||opened)return;setOpening(true);setTimeout(()=>{setOpened(true);setOpening(false);document.getElementById('invitation')?.scrollIntoView({behavior:reduceMotion?'auto':'smooth'})},reduceMotion?0:1450)}
  function jump(id){setActive(id);setMenuOpen(false);document.getElementById(id)?.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'})}
  function calendarDownload(){
    if(!wedding.date){setNotice(t.notSet);return}
    const start=new Date(wedding.date),end=new Date(start.getTime()+2*60*60*1000)
    const fmt=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')
    const esc=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;')
    const body=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Nikah Invitation//EN','BEGIN:VEVENT','UID:nikah-'+start.getTime()+'@invitation','DTSTAMP:'+fmt(new Date()),'DTSTART:'+fmt(start),'DTEND:'+fmt(end),'SUMMARY:'+esc(wedding.nikah.title+' — '+wedding.groom+' & '+wedding.bride),'LOCATION:'+esc(wedding.nikah.venue+', '+wedding.nikah.address),'END:VEVENT','END:VCALENDAR'].join('\r\n')
    const url=URL.createObjectURL(new Blob([body],{type:'text/calendar;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='nikah-invitation.ics';a.click();URL.revokeObjectURL(url)
  }
  function submitRsvp(e){e.preventDefault();if(!rsvp.name.trim()||!rsvp.attendance){setNotice(t.required);return}setNotice(t.honest)}
  return <main className={isRtl?'rtl':''}>
    <div className="language-switch" aria-label="Choose language">
      <Languages size={15} strokeWidth={1.4}/>{Object.entries(translations).map(([key,v])=><button key={key} onClick={()=>setLang(key)} aria-pressed={lang===key} className={lang===key?'selected':''}>{v.name}</button>)}
    </div>
    <AnimatePresence>
    {!opened&&<motion.div className="opening-screen" initial={{opacity:1}} exit={{opacity:0,scale:1.025}} transition={{duration:.85}} aria-label="Open wedding invitation">
      <div className="curtain-photo" style={{backgroundImage:`linear-gradient(180deg,rgba(250,248,244,.35),rgba(250,248,244,.82)),url("${curtain}")`}}/>
      <motion.div className="curtain curtain-left" animate={opening?{x:'-100%'}:{x:0}} transition={{duration:1.5,ease:[.7,0,.2,1]}}/>
      <motion.div className="curtain curtain-right" animate={opening?{x:'100%'}:{x:0}} transition={{duration:1.5,ease:[.7,0,.2,1]}}/>
      <Rose className="intro-rose intro-rose-left"/><Rose className="intro-rose intro-rose-right"/>
      <motion.div className="opening-content" animate={opening?{y:-45,scale:.96,opacity:0}:{y:0,scale:1,opacity:1}} transition={{duration:.65,delay:opening?.55:0}}>
        <p className="opening-kicker">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p className="opening-caption">{t.instruction}</p>
        <motion.button className={'envelope '+(opening?'is-opening':'')} onClick={openInvitation} aria-label={t.open} disabled={opening} whileHover={reduceMotion?{}:{y:-5,rotateX:2}} whileTap={{scale:.975}} style={{perspective:1000}}>
          <span className="envelope-paper"><span className="envelope-monogram">{wedding.initials}</span><span className="envelope-line"/></span>
          <span className="envelope-back"/>
          <motion.span className="envelope-flap" animate={opening?{rotateX:-178}:{rotateX:0}} transition={{duration:.75,delay:.22}}/>
          <motion.span className="invitation-insert" animate={opening?{y:-115,scale:1.06}:{y:0,scale:1}} transition={{duration:.8,delay:.55,ease:[.2,.7,.2,1]}}><span>بِسْمِ اللَّهِ</span><i>Wedding Invitation</i><span className="insert-rule"/></motion.span>
          <motion.span className="wax-seal" animate={opening?{scale:1.35,rotate:20,opacity:0}:{scale:[1,1.035,1]}} transition={opening?{duration:.3}:{duration:2.8,repeat:Infinity,ease:'easeInOut'}}><span>ن</span></motion.span>
        </motion.button>
        <p className="tap-hint"><Sparkles size={13}/>{t.tap}</p>
        <p className="opening-names">{wedding.bride} <span>&</span> {wedding.groom}</p>
      </motion.div>
      <div className="opening-footnote">A PERSONAL INVITATION · MADE WITH LOVE</div>
    </motion.div>}
    </AnimatePresence>
    <AnimatePresence>
    {opened&&<motion.div className="main-experience" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.8}}>
      <header className="top-nav">
        <button className="brand-mark" onClick={()=>jump('invitation')} aria-label={t.back}>ن</button>
        <nav className={menuOpen?'nav-links nav-open':'nav-links'} aria-label="Invitation sections">
          <button onClick={()=>jump('invitation')}>{t.back}</button><button onClick={()=>jump('details')}>{t.details}</button><button onClick={()=>jump('rsvp')}>RSVP</button>
        </nav>
        <button className="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label={menuOpen?'Close menu':'Open menu'}>{menuOpen?<X size={20}/>:<Menu size={20}/>}</button>
        <button className="reopen-button" onClick={()=>{setOpened(false);setOpening(false);window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'})}}><RotateCcw size={13}/><span>{t.reopen}</span></button>
      </header>
      <Section id="invitation" className="hero-section">
        <motion.div className="hero-content" initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} variants={{hidden:{opacity:0,y:22},show:{opacity:1,y:0,transition:{staggerChildren:.12,duration:.7}}}}>
          <motion.p variants={fadeUp} className="arabic-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</motion.p>
          <motion.p variants={fadeUp} className="eyebrow">{t.bismillah}</motion.p>
          <Divider/>
          <motion.p variants={fadeUp} className="invitation-copy">{t.together}</motion.p>
          <motion.div variants={fadeUp} className="couple-names"><span>{wedding.bride}</span><i>&</i><span>{wedding.groom}</span></motion.div>
          <Divider/>
          <motion.p variants={fadeUp} className="invitation-copy lower-copy">{t.invite}</motion.p>
          <motion.div variants={fadeUp} className="blessing-mark">❧</motion.div>
          <motion.button variants={fadeUp} className="text-link" onClick={()=>jump('details')}>{t.details}<ChevronDown size={15}/></motion.button>
        </motion.div>
        <div className="side-note">بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا</div>
      </Section>
      <Section id="details" className="details-section">
        <div className="section-heading"><span className="eyebrow">A DAY TO REMEMBER</span><h2>{t.details}</h2><Divider/></div>
        <div className="detail-emblem"><IconSeal><CalendarDays size={23}/></IconSeal></div>
        <p className="event-title">{t.nikah}</p>
        <div className="event-date">{wedding.nikah.dateLabel}</div>
        <div className="event-meta">
          <div><Clock3 size={19}/><span>{t.time}</span><strong>{wedding.nikah.time}</strong></div>
          <div><MapPin size={19}/><span>{t.venue}</span><strong>{wedding.nikah.venue}</strong></div>
        </div>
        <p className="address">{wedding.nikah.address}</p>
        <div className="action-row">
          <button className="outline-button" onClick={calendarDownload}><CalendarDays size={15}/>{t.calendar}</button>
          {wedding.nikah.mapUrl&&<a className="outline-button" href={wedding.nikah.mapUrl} target="_blank" rel="noreferrer"><MapPin size={15}/>{t.location}</a>}
        </div>
        {wedding.walima.enabled&&<div className="walima-block"><Divider small/><h3>{wedding.walima.title}</h3><p>{wedding.walima.dateLabel} · {wedding.walima.time}</p><strong>{wedding.walima.venue}</strong><p>{wedding.walima.address}</p></div>}
        <p className="presence-note">{t.closing}</p>
      </Section>
      <Section id="countdown" className="countdown-section">
        <span className="eyebrow">{t.countdown}</span><h2>{t.ourNames}</h2><Divider/>
        {countdown?<div className="countdown-grid">{Object.entries(countdown).map(([key,val])=><div key={key} className="count-unit"><strong>{String(val).padStart(2,'0')}</strong><span>{t[key]}</span></div>)}</div>:<p className="not-configured">{t.notSet}</p>}
        <div className="tiny-crescent">☾</div>
      </Section>
      {wedding.storyEnabled&&<Section id="story" className="story-section"><span className="eyebrow">{t.story}</span><h2>{t.story}</h2><Divider/><p>{wedding.story||t.storyPlaceholder}</p></Section>}
      <Section id="rsvp" className="rsvp-section">
        <span className="eyebrow">KINDLY REPLY</span><h2>{t.rsvpTitle}</h2><Divider/><p className="rsvp-intro">{t.rsvpText}</p>
        <form className="rsvp-form" onSubmit={submitRsvp}>
          <label>{t.guest}<input required value={rsvp.name} onChange={e=>setRsvp({...rsvp,name:e.target.value})} autoComplete="name" /></label>
          <label>{t.phone}<input type="tel" value={rsvp.phone} onChange={e=>setRsvp({...rsvp,phone:e.target.value})} autoComplete="tel" /></label>
          <fieldset><legend>{t.attendance}</legend><label className="radio-label"><input type="radio" name="attendance" value="yes" checked={rsvp.attendance==='yes'} onChange={e=>setRsvp({...rsvp,attendance:e.target.value})}/><span>{t.yes}</span></label><label className="radio-label"><input type="radio" name="attendance" value="no" checked={rsvp.attendance==='no'} onChange={e=>setRsvp({...rsvp,attendance:e.target.value})}/><span>{t.no}</span></label></fieldset>
          <label>{t.guests}<select value={rsvp.guests} onChange={e=>setRsvp({...rsvp,guests:e.target.value})}>{[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
          <label>{t.message}<textarea rows="3" value={rsvp.message} onChange={e=>setRsvp({...rsvp,message:e.target.value})}/></label>
          <button className="submit-button" type="submit">{t.send}<span>↗</span></button>
          <p className="form-note">{t.honest}</p>
          {notice&&<p role="status" className="form-notice">{notice}</p>}
        </form>
      </Section>
      <Section id="closing" className="closing-section">
        <div className="closing-flourish">❧</div><p className="arabic-bismillah">بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا</p><h2>{t.closing}</h2><p className="closing-dua">{t.dua}</p><Divider/><p className="closing-couple">{wedding.bride} <span>&</span> {wedding.groom}</p><p className="made">{t.made}</p><button className="text-link" onClick={()=>jump('invitation')}><ArrowUp size={15}/>{t.back}</button>
      </Section>
      <footer className="footer-note"><span>بِسْمِ اللَّهِ</span><p>AN INVITATION FROM THE HEART</p></footer>
    </motion.div>}
    </AnimatePresence>
  </main>
}
const fadeUp={hidden:{opacity:0,y:14},show:{opacity:1,y:0,transition:{duration:.65,ease:[.22,1,.36,1]}}}
