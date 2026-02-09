'use client';
import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { motion } from "framer-motion";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <motion.div 
        initial={{ opacity: 0, y: 24 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className={styles.container}
      >
        <header className={styles.header}>
          <p className={styles.kicker}>BNSINFO</p>
          <h1 className={styles.title}>BNSINFO के बारे में</h1>
          <p className={styles.subtitle}>
            भारतीय न्याय संहिता 2023 (BNS) की साफ़, विश्वसनीय और खोज योग्य जानकारी के लिए एक आधुनिक मंच।
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaChip}>BNS केंद्रित</span>
            <span className={styles.metaChip}>तेज़ खोज</span>
            <span className={styles.metaChip}>सरल व्याख्या</span>
          </div>
        </header>
        
        <Card className={styles.card}>
          <CardContent className={styles.cardContent}>
            <p className={styles.paragraph}>
              <strong>BNSINFO</strong> एक कानूनी ज्ञान मंच है जो <strong>भारतीय न्याय संहिता 2023</strong> पर केंद्रित है। हमारा लक्ष्य BNS की धाराओं, प्रावधानों और संबंधित संदर्भों को सरल भाषा में प्रस्तुत करना है ताकि वकील, छात्र, शोधकर्ता और सामान्य पाठक आसानी से समझ सकें।
            </p>

            <div className={styles.split}>
              <div className={styles.panel}>
                <h3 className={styles.panelTitle}>हम क्या देते हैं</h3>
                <p className={styles.panelText}>
                  BNS की धाराओं की स्पष्ट जानकारी, संदर्भ सामग्री, और तेज़ खोज ताकि ज़रूरी जानकारी तुरंत मिल सके।
                </p>
              </div>
              <div className={styles.panel}>
                <h3 className={styles.panelTitle}>हमारा दृष्टिकोण</h3>
                <p className={styles.panelText}>
                  जटिल कानूनी भाषा को सरल और उपयोगी बनाना, ताकि हर उपयोगकर्ता आत्मविश्वास के साथ जानकारी प्राप्त कर सके।
                </p>
              </div>
            </div>

            <div className={styles.callout}>
              <h3 className={styles.calloutTitle}>हमारा मिशन</h3>
              <p className={styles.calloutText}>
                भारतीय न्याय संहिता से जुड़ी जानकारी को साफ़, सुलभ और भरोसेमंद बनाना — यही BNSINFO का उद्देश्य है।
              </p>
            </div>

            <p className={styles.closing}>
              BNSINFO — आपकी BNS जानकारी का भरोसेमंद स्रोत।
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
