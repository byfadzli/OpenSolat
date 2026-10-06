export interface ManzilSection {
  id: string;
  surah: string;
  surahEn: string;
  ayatRange: string;
  arabic: string;
  rumi: string;
  translationMalay: string;
  translationEn: string;
  virtue?: string;
  virtueEn?: string;
}

export const MANZIL_DATA: ManzilSection[] = [
  {
    id: 'manzil_01',
    surah: 'Surah Al-Fatihah',
    surahEn: 'Surah Al-Fatihah',
    ayatRange: 'Ayat 1 - 7',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    rumi: 'Bismillahir-Rahmanir-Rahim. Alhamdulillahi Rabbil-\'Alamin. Ar-Rahmanir-Rahim. Maliki Yawmid-Din. Iyyaka na\'budu wa iyyaka nasta\'in. Ihdinas-siratal mustaqim. Siratalladhina an\'amta \'alaihim, ghairil maghdubi \'alaihim waladh-dhallin.',
    translationMalay: 'Dengan nama Allah Yang Maha Pemurah lagi Maha Mengasihani. Segala puji bagi Allah Tuhan sekalian alam. Yang Maha Pemurah lagi Maha Mengasihani. Pemerintah hari Pembalasan. Engkaulah sahaja yang kami sembah dan kepada Engkaulah sahaja kami memohon pertolongan. Tunjukkanlah kami jalan yang lurus. Iaitu jalan orang-orang yang Engkau telah kurniakan nikmat kepada mereka, bukan (jalan) orang-orang yang dimurkai dan bukan pula (jalan) orang-orang yang sesat.',
    translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. All praise is due to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path. The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.',
    virtue: 'Ummul Kitab dan penawar (asy-Syifa\') bagi segala jenis penyakit rohani dan jasmani.',
    virtueEn: 'The Mother of the Book and spiritual cure (al-Syifa\') for spiritual and bodily afflictions.',
  },
  {
    id: 'manzil_02',
    surah: 'Surah Al-Baqarah',
    surahEn: 'Surah Al-Baqarah',
    ayatRange: 'Ayat 1 - 5',
    arabic: 'الم ۝ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ۝ الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ ۝ وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ ۝ أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ',
    rumi: 'Alif-Lam-Mim. Dhalikal-kitabu la rayba fih, hudal-lil-muttaqin. Alladhina yu\'minuna bil-ghaybi wa yuqimunas-salata wa mimma razaqnahum yunfiqun. Walladhina yu\'minuna bima unzila ilaika wa ma unzila min qablika wa bil-akhirati hum yuqinun. Ula\'ika \'ala hudam-mir-Rabbihim wa ula\'ika humul-muflihun.',
    translationMalay: 'Alif Lam Mim. Kitab ini tidak ada sebarang keraguan padanya; menjadi petunjuk bagi orang-orang yang bertaqwa. Merekalah yang beroleh kejayaan.',
    translationEn: 'Alif, Lam, Meem. This is the Book about which there is no doubt, a guidance for those conscious of Allah. It is those who are successful.',
    virtue: 'Pembuka ketenangan hati dan mengusir gangguan syaitan dari kediaman.',
    virtueEn: 'Opens tranquility in the heart and expels devilish whisperings from dwellings.',
  },
  {
    id: 'manzil_03',
    surah: 'Surah Al-Baqarah (Ayatul Kursi & Penutup)',
    surahEn: 'Surah Al-Baqarah (Ayatul Kursi & Adjacent)',
    ayatRange: 'Ayat 255 - 257',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    rumi: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta\'khudhuhu sinatuw-wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa\'u \'indahu illa bi-idhnih. Ya\'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi-shay\'im-min \'ilmihi illa bima sha\'. Wasi\'a kursiyyuhus-samawati wal-ard, wa la ya\'uduhu hifzuhuma, wa Huwal-\'Aliyyul-\'Azim.',
    translationMalay: 'Allah, tiada Tuhan melainkan Dia, Yang Tetap Hidup, Yang Kekal selama-lamanya mentadbirkan sekalian makhluk... Luasnya Kursi Allah meliputi langit dan bumi; dan Dialah Yang Maha Tinggi, lagi Maha Besar.',
    translationEn: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence... His Kursi extends over the heavens and the earth, and He is the Most High, the Most Great.',
    virtue: 'Ayat paling agung dalam Al-Quran; syaitan tidak mampu menghampiri pembacanya.',
    virtueEn: 'The greatest verse in the Quran; devils cannot approach its reciter.',
  },
  {
    id: 'manzil_04',
    surah: 'Surah Al-Baqarah (Akhir Surah)',
    surahEn: 'Surah Al-Baqarah (Conclusion)',
    ayatRange: 'Ayat 284 - 286',
    arabic: 'لِّلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ ... رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    rumi: 'Lillahi ma fis-samawati wa ma fil-ard... Rabbana la tu\'akhidhna in-nasina aw akhta\'na. Rabbana wa la tahmil \'alayna isran kama hamaltahu \'alalladhina min qablina. Rabbana wa la tuhammilna ma la taqata lana bih. Wa\'fu \'anna, waghfir lana, warhamna. Anta mawlana fansurna \'alal-qawmil-kafirin.',
    translationMalay: 'Kepunyaan Allahlah segala yang ada di langit dan di bumi... Wahai Tuhan kami! Janganlah Engkau hukum kami jika kami lupa atau kami tersalah. Ya Tuhan kami, janganlah Engkau bebankan kepada kami bebanan yang berat sebagaimana Engkau bebankan kepada orang-orang terdahulu sebelum kami. Wahai Tuhan kami! Janganlah Engkau pikulkan kepada kami apa yang kami tidak terdaya memikulnya. Dan maafkanlah kami, ampunkanlah kami, dan rahmatilah kami. Engkaulah Penolong kami; oleh itu, tolonglah kami mencapai kemenangan terhadap kaum yang kafir.',
    translationEn: 'To Allah belongs whatever is in the heavens and whatever is in the earth... Our Lord, do not impose blame upon us if we forget or make a mistake. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us, and forgive us, and have mercy upon us. You are our protector, so give us victory over the disbelieving people.',
    virtue: 'Barangsiapa membaca dua ayat terakhir Al-Baqarah pada waktu malam, nescaya kedua-duanya mencukupinya dari segala kejahatan (Sahih Bukhari).',
    virtueEn: 'Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him against all harm (Sahih Bukhari).',
  },
  {
    id: 'manzil_05',
    surah: 'Surah Ali \'Imran',
    surahEn: 'Surah Ali \'Imran',
    ayatRange: 'Ayat 18, 26 - 27',
    arabic: 'شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ قَائِمًا بِالْقِسْطِ ۚ لَا إِلَٰهَ إِلَّا هُوَ الْعَزِيزُ الْحَكِيمُ ۝ قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ وَتَنزِعُ الْمُلْكَ مِمَّن تَشَاءُ وَتُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ ۖ بِيَدِكَ الْخَيْرُ ۖ إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    rumi: 'Shahidallahu annahu la ilaha illa Huwa wal-mala\'ikatu wa ulul-\'ilmi qa\'imam-bil-qist, la ilaha illa Huwal-\'Azizul-Hakim. Qulillahumma Malikal-mulki tu\'til-mulka man tasha\'u wa tanzi\'ul-mulka mimman tasha\', wa tu\'izzu man tasha\'u wa tudhillu man tasha\', biyadikal-khayr, innaka \'ala kulli shay\'in qadir.',
    translationMalay: 'Allah menegaskan bahawasanya tiada Tuhan yang berhak disembah melainkan Dia, dan malaikat-malaikat serta orang-orang yang berilmu juga mengakui yang demikian... Katakanlah: Wahai Tuhan yang mempunyai kuasa pemerintahan! Engkaulah yang memberi kuasa pemerintahan kepada sesiapa yang Engkau kehendaki, dan Engkaulah yang mencabut kuasa pemerintahan dari sesiapa yang Engkau kehendaki... Sesungguhnya Engkau Maha Kuasa atas tiap-tiap sesuatu.',
    translationEn: 'Allah witnesses that there is no deity except Him, and [so do] the angels and those of knowledge - [that He is] maintaining [creation] in justice... Say, "O Allah, Owner of Sovereignty, You give sovereignty to whom You will and You take sovereignty away from whom You will... Indeed, You are over all things omnipotent."',
    virtue: 'Memperteguh ketauhidan, melepaskan kesulitan hutang dan kesempitan rezeki.',
    virtueEn: 'Strengthens monotheism, relieves debt difficulties, and expands sustenance.',
  },
  {
    id: 'manzil_06',
    surah: 'Surah As-Saffat',
    surahEn: 'Surah As-Saffat',
    ayatRange: 'Ayat 1 - 11',
    arabic: 'وَالصَّافَّاتِ صَفًّا ۝ فَالزَّاجِرَاتِ زَجْرًا ۝ فَالتَّالِيَاتِ ذِكْرًا ۝ إِنَّ إِلَٰهَكُمْ لَوَاحِدٌ ۝ رَّبُّ السَّمَاوَاتِ وَالْأَرْضِ وَمَا بَيْنَهُمَا وَرَبُّ الْمَشَارِقِ ۝ إِنَّا زَيَّنَّا السَّمَاءَ الدُّنْيَا بِزِينَةٍ الْكَوَاكِبِ ۝ وَحِفْظًا مِّن كُلِّ شَيْطَانٍ مَّارِدٍ',
    rumi: 'Was-saffati saffa. Faz-zajirati zajra. Fat-taliyati dhikra. Inna Ilahakum lawahid. Rabbus-samawati wal-ardi wa ma baynahuma wa Rabbul-mashariq. Inna zayyannas-sama\'ad-dunya bizinatinil-kawakib. Wa hifzam-min kulli shaytanim-marid.',
    translationMalay: 'Demi malaikat yang berbaris dengan bersaf-saf. Dan demi malaikat yang melarang dengan keras. Dan demi malaikat yang membaca peringatan. Sesungguhnya Tuhan kamu adalah Maha Esa... Dan Kami telah memeliharanya dari setiap syaitan yang derhaka.',
    translationEn: 'By those angels lined up in rows. And those who drive away the clouds. And those who recite the message. Indeed, your God is One... And as protection against every rebellious devil.',
    virtue: 'Benteng yang sangat ampuh daripada gangguan sihir, jin jahat, dan hasad dengki.',
    virtueEn: 'A mighty fortress against witchcraft, malevolent jinn, and evil eye.',
  },
  {
    id: 'manzil_07',
    surah: 'Surah Al-Hasyr (Akhir Surah)',
    surahEn: 'Surah Al-Hashr (Conclusion)',
    ayatRange: 'Ayat 21 - 24',
    arabic: 'لَوْ أَنزَلْنَا هَٰذَا الْقُرْآنَ عَلَىٰ جَبَلٍ لَّرَأَيْتَهُ خَاشِعًا مُّتَصَدِّعًا مِّنْ خَشْيَةِ اللَّهِ ۚ ... هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ ۖ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ ۖ هُوَ الرَّحْمَٰنُ الرَّحِيمُ ۝ هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ ۚ سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ',
    rumi: 'Law anzalna hadhal-Qur\'ana \'ala jabalil-lara\'aytahu khashi\'am-mutasaddi\'am-min khashyatillah... Huwallahulladhi la ilaha illa Huwa, \'Alimul-ghaybi wash-shahadah, Huwar-Rahmanur-Rahim. Huwallahulladhi la ilaha illa Huwal-Malikul-Quddusus-Salamul-Mu\'minul-Muhayminul-\'Azizul-Jabbarul-Mutakabbir. Subhanallahi \'amma yushrikun.',
    translationMalay: 'Sekiranya Kami turunkan Al-Quran ini ke atas sebuah gunung, nescaya engkau melihat gunung itu khusyuk serta pecah belah kerana takut kepada Allah... Dialah Allah, Yang Tiada Tuhan melainkan Dia; Raja Yang Maha Menguasai, Maha Suci, Maha Menyelamatkan, Maha Melimpahkan Keamanan, Maha Mengawasi, Maha Kuasa, Maha Gagah, Maha Megah. Maha Suci Allah dari apa yang mereka sekutukan.',
    translationEn: 'Had We sent down this Quran upon a mountain, you would have seen it humbled and coming apart from fear of Allah... He is Allah, other than whom there is no deity, the Sovereign, the Pure, the Perfection, the Bestower of Faith, the Overseer, the Exalted in Might, the Compeller, the Superior. Exalted is Allah above whatever they associate with Him.',
    virtue: 'Malaikat berselawat dan memohon keampunan bagi pembacanya (Sunan Tirmidhi).',
    virtueEn: 'Angels send blessings and seek forgiveness for its reciter (Sunan Tirmidhi).',
  },
  {
    id: 'manzil_08',
    surah: 'Surah 3 Qul (Al-Ikhlas, Al-Falaq, An-Nas)',
    surahEn: 'Surah 3 Qul (Al-Ikhlas, Al-Falaq, An-Nas)',
    ayatRange: 'Penutup Manzil',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ ...',
    rumi: 'Qul Huwallahu Ahad... Qul A\'udhu bi-Rabbil-Falaq... Qul A\'udhu bi-Rabbin-Nas...',
    translationMalay: 'Katakanlah: Dialah Allah, Yang Maha Esa... Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh... Katakanlah: Aku berlindung kepada Tuhan sekalian manusia...',
    translationEn: 'Say: He is Allah, [who is] One... Say: I seek refuge in the Lord of daybreak... Say: I seek refuge in the Lord of mankind...',
    virtue: 'Melindungi pembacanya daripada sebarang bahaya, mata jahat (ain), dan sihir.',
    virtueEn: 'Protects the reciter from all harm, the evil eye (ayn), and occult afflictions.',
  },
];
