import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, MessageCircle, RotateCcw, ChevronDown } from 'lucide-react';
import { weddingDetails as d } from '../data/weddingDetails.js';

const copy = {
 en: {
  view:'View details', calendar:'Add to calendar', location:'Open location', rsvp:'RSVP on WhatsApp', replay:'Replay opening',
  eyebrow:'WITH JOYFUL HEARTS AND GRATEFUL PRAYERS', heading:'Wedding Invitation',
  message:'With the blessings of Allah and the love of our families, we invite you to celebrate our wedding.',
  dateLabel:'THE WEDDING DAY', families:'Together with their families', celebration:'THE CELEBRATION',
  title:'A day to remember', translation:'May Allah bless them, shower His blessings upon them, and unite them in goodness.',
  hosts:'Hosted with love by', language:'اردو میں دیکھیں'
 },
 ur: {
  view:'تقریب کی تفصیلات', calendar:'کیلنڈر میں شامل کریں', location:'مقام دیکھیں', rsvp:'واٹس ایپ پر جواب دیں', replay:'دعوت دوبارہ کھولیں',
  eyebrow:'خوشی اور دعاؤں کے ساتھ', heading:'دعوتِ نکاح',
  message:'اللہ تعالیٰ کے فضل و کرم اور اپنے اہلِ خانہ کی محبت کے ساتھ، ہم آپ کو اپنی شادی کی خوشیوں میں شرکت کی دعوت دیتے ہیں۔',
  dateLabel:'تقریبِ نکاح', families:'اپنے اہلِ خانہ کے ہمراہ', celebration:'خوشی کا دن',
  title:'ایک یادگار دن', translation:'اللہ تعالیٰ ان دونوں کو برکت عطا فرمائے، ان پر اپنی رحمت نازل فرمائے اور انہیں خیر کے ساتھ جمع رکھے۔',
  hosts:'محبت کے ساتھ میزبان', language:'View in English'
 }
};
function makeCalendar(){
 if(!d.date)return;
 const start=new Date(`${d.date}T12:00:00`); if(Number.isNaN(start.getTime()))return;
 const end=new Date(start.getTime()+2*60*60*1000);
 const fmt=x=>x.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 const escape=s=>String(s).replace(/\\/g,'\\\\').replace(/,/g,'\\,').replace(/;/g,'\\;').replace(/\n/g,'\\n');
 const body=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Nikah Invitation//EN','BEGIN:VEVENT',`DTSTART:${fmt(start)}`,`DTEND:${fmt(end)}`,`SUMMARY:${escape(d.groom+' & '+d.bride+' — Wedding')}`,`LOCATION:${escape(d.venue)}`,`DESCRIPTION:${escape(d.message)}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
 const url=URL.createObjectURL(new Blob([body],{type:'text/calendar;charset=utf-8'})); const a=document.createElement('a');a.href=url;a.download='wedding-invitation.ics';a.click();URL.revokeObjectURL(url);
}
export default function InvitationCard({ onReplay }){
 const [lang,setLang]=useState('en'); const t=copy[lang]; const ur=lang==='ur';
 const mapUrl=d.mapQuery?(d.mapQuery.startsWith('http')?d.mapQuery:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.mapQuery)}`):'';
 const whatsapp=d.rsvpPhone?`https://wa.me/${d.rsvpPhone.replace(/\\D/g,'')}?text=${encodeURIComponent(`Assalamu Alaikum, thank you for inviting me to the wedding of ${d.groom} and ${d.bride}. I would like to RSVP.`)}`:'';
 const formattedDate=d.date?new Date(d.date+'T12:00:00').toLocaleDateString(ur?'ur-PK':'en',{day:'numeric',month:'long',year:'numeric'}):'[Wedding Date]';
 return <motion.main className={`invitation-page ${ur?'invitation-page--urdu':''}`} lang={ur?'ur':'en'} dir={ur?'rtl':'ltr'} initial={{opacity:0,y:26,scale:.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.9,ease:[.2,.7,.2,1]}}>
  <div className="language-switch" aria-label="Choose invitation language"><button className={!ur?'active':''} onClick={()=>setLang('en')} aria-pressed={!ur}>English</button><button className={ur?'active':''} onClick={()=>setLang('ur')} aria-pressed={ur}>اردو</button></div>
  <div className="invitation-paper"><div className="paper-ornament paper-ornament--top">❧</div>
   <p className="bismillah" lang="ar" dir="rtl">{d.invocation}</p>
   <p className="invocation-translation">{ur?'اللہ کے نام سے جو نہایت مہربان، رحم فرمانے والا ہے':d.invocationEnglish}</p>
   <div className="tiny-divider"><span/><i>✦</i><span/></div><p className="eyebrow">{t.eyebrow}</p>
   <h1>{ur?'دعوتِ نکاح':<>Wedding <em>Invitation</em></>}</h1>
   <p className="invitation-copy">{ur?t.message:d.message}</p>
   <div className="couple-names"><span>{d.groom}</span><i>&</i><span>{d.bride}</span></div>
   <div className="tiny-divider"><span/><i>❦</i><span/></div>
   <p className="event-date">{ur?'بروز '+(d.day==='Sunday'?'اتوار':d.day):d.day}</p><p className="event-date-large">{formattedDate}</p><p className="event-time">{d.time}</p>
   <div className="venue-block"><MapPin size={17} strokeWidth={1.4}/><p>{d.venue}</p></div>
   {d.showHosts&&<p className="hosts">{t.hosts}<br/><strong>{d.hosts}</strong></p>}
   <div className="paper-ornament paper-ornament--bottom">❧</div>
  </div>
  <nav className="invitation-actions" aria-label="Invitation actions">
   <button onClick={()=>document.getElementById('event-details')?.scrollIntoView({behavior:'smooth',block:'center'})}><ChevronDown size={16}/>{t.view}</button>
   <button onClick={makeCalendar} disabled={!d.date} title={!d.date?'Add the wedding date in weddingDetails.js':''}><CalendarDays size={16}/>{t.calendar}</button>
   <a href={mapUrl||undefined} aria-disabled={!mapUrl} onClick={e=>!mapUrl&&e.preventDefault()} target="_blank" rel="noreferrer"><MapPin size={16}/>{t.location}</a>
   <a href={whatsapp||undefined} aria-disabled={!whatsapp} onClick={e=>!whatsapp&&e.preventDefault()} target="_blank" rel="noreferrer"><MessageCircle size={16}/>{t.rsvp}</a>
   <button onClick={onReplay}><RotateCcw size={16}/>{t.replay}</button>
  </nav>
  <section className="event-details" id="event-details"><p className="eyebrow">{t.celebration}</p><h2>{t.title}</h2><p>{formattedDate} <span>·</span> {d.time}</p><p>{d.venue}</p><p className="closing-dua" lang="ar" dir="rtl">بارك الله لهما وبارك عليهما وجمع بينهما في خير</p><p className="closing-translation">{t.translation}</p></section>
  <footer>{ur?'دعاؤں اور محبت کے ساتھ':'MADE WITH LOVE · بِسْمِ اللَّهِ'}</footer>
 </motion.main>;
}
