import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EnvelopeExperience from './components/EnvelopeExperience.jsx';
import InvitationCard from './components/InvitationCard.jsx';
export default function App(){
 const [opened,setOpened]=useState(false); const replay=()=>{setOpened(false);window.scrollTo({top:0,behavior:'smooth'});};
 return <div className="site-shell"><AnimatePresence mode="wait">{!opened?<motion.div key="envelope" exit={{opacity:0,scale:1.015}} transition={{duration:.45}}><EnvelopeExperience onOpen={()=>setOpened(true)}/></motion.div>:<motion.div key="invitation" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.45}}><div className="invitation-backdrop"/><InvitationCard onReplay={replay}/></motion.div>}</AnimatePresence></div>;
}