export interface MathuratVerse {
  id: string;
  title: string;
  titleEn: string;
  arabic: string;
  rumi: string;
  translationMalay: string;
  translationEn: string;
  repeatCount: number;
  timeOfDay: 'both' | 'morning' | 'evening';
  note?: string;
  noteEn?: string;
}

export const AL_MATHURAT_DATA: MathuratVerse[] = [
  {
    id: 'm_01',
    title: 'Surah Al-Fatihah',
    titleEn: 'Surah Al-Fatihah (The Opening)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    rumi: 'Bismillahir-Rahmanir-Rahim. Alhamdulillahi Rabbil-\'Alamin. Ar-Rahmanir-Rahim. Maliki Yawmid-Din. Iyyaka na\'budu wa iyyaka nasta\'in. Ihdinas-siratal mustaqim. Siratalladhina an\'amta \'alaihim, ghairil maghdubi \'alaihim waladh-dhallin. (Amin)',
    translationMalay: 'Dengan nama Allah Yang Maha Pemurah lagi Maha Mengasihani. Segala puji bagi Allah Tuhan sekalian alam. Yang Maha Pemurah lagi Maha Mengasihani. Pemerintah hari Pembalasan. Engkaulah sahaja yang kami sembah dan kepada Engkaulah sahaja kami memohon pertolongan. Tunjukkanlah kami jalan yang lurus. Iaitu jalan orang-orang yang Engkau telah kurniakan nikmat kepada mereka, bukan (jalan) orang-orang yang dimurkai dan bukan pula (jalan) orang-orang yang sesat.',
    translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. All praise is due to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path. The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.',
    repeatCount: 1,
    timeOfDay: 'both',
  },
  {
    id: 'm_02',
    title: 'Surah Al-Baqarah (Ayat 1 - 5)',
    titleEn: 'Surah Al-Baqarah (Verses 1 - 5)',
    arabic: 'الم ۝ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ۝ الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ ۝ وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ ۝ أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ',
    rumi: 'Alif-Lam-Mim. Dhalikal-kitabu la rayba fih, hudal-lil-muttaqin. Alladhina yu\'minuna bil-ghaybi wa yuqimunas-salata wa mimma razaqnahum yunfiqun. Walladhina yu\'minuna bima unzila ilaika wa ma unzila min qablika wa bil-akhirati hum yuqinun. Ula\'ika \'ala hudam-mir-Rabbihim wa ula\'ika humul-muflihun.',
    translationMalay: 'Alif Lam Mim. Kitab ini tidak ada sebarang keraguan padanya; menjadi petunjuk bagi orang-orang yang bertaqwa. Iaitu orang-orang yang beriman kepada perkara-perkara yang ghaib, mendirikan solat, dan mendermakan sebahagian dari rezeki yang Kami berikan. Dan orang-orang yang beriman kepada Kitab yang diturunkan kepadamu serta Kitab-kitab terdahulu, dan mereka yakin akan hari akhirat. Merekalah yang berada di atas petunjuk dari Tuhan mereka dan merekalah orang-orang yang berjaya.',
    translationEn: 'Alif, Lam, Meem. This is the Book about which there is no doubt, a guidance for those conscious of Allah. Who believe in the unseen, establish prayer, and spend out of what We have provided for them. And who believe in what has been revealed to you and what was revealed before you, and of the Hereafter they are certain. Those are upon right guidance from their Lord, and it is those who are the successful.',
    repeatCount: 1,
    timeOfDay: 'both',
  },
  {
    id: 'm_03',
    title: 'Ayatul Kursi (Surah Al-Baqarah: 255)',
    titleEn: 'Ayatul Kursi (Verse of the Throne)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    rumi: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta\'khudhuhu sinatuw-wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa\'u \'indahu illa bi-idhnih. Ya\'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi-shay\'im-min \'ilmihi illa bima sha\'. Wasi\'a kursiyyuhus-samawati wal-ard, wa la ya\'uduhu hifzuhuma, wa Huwal-\'Aliyyul-\'Azim.',
    translationMalay: 'Allah, tiada Tuhan melainkan Dia, Yang Tetap Hidup, Yang Kekal selama-lamanya mentadbirkan sekalian makhluk. Tiada mengantuk dan tiada tidur. Kepunyaan-Nya apa yang ada di langit dan di bumi. Tiada sesiapa yang dapat memberi syafaat di sisi-Nya melainkan dengan izin-Nya. Allah mengetahui apa yang ada di hadapan mereka dan apa yang ada di belakang mereka, sedang mereka tidak mengetahui sesuatu pun dari ilmu Allah melainkan apa yang dikehendaki-Nya. Luasnya Kursi Allah meliputi langit dan bumi; dan tiadalah menjadi keberatan kepada Allah menjaga serta memelihara keduanya. Dan Dialah Yang Maha Tinggi, lagi Maha Besar.',
    translationEn: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    repeatCount: 1,
    timeOfDay: 'both',
  },
  {
    id: 'm_04',
    title: 'Surah Al-Ikhlas',
    titleEn: 'Surah Al-Ikhlas (Sincerity)',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    rumi: 'Qul Huwallahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakul-lahu kufuwan ahad.',
    translationMalay: 'Katakanlah: Dialah Allah, Yang Maha Esa. Allah adalah tempat bergantung segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan. Dan tidak ada seorang pun yang setara dengan Dia.',
    translationEn: 'Say: He is Allah, [who is] One. Allah, the Eternal Refuge. He neither begets nor is born. Nor is there to Him any equivalent.',
    repeatCount: 3,
    timeOfDay: 'both',
    note: 'Dibaca 3 kali pagi dan petang untuk perlindungan menyeluruh.',
    noteEn: 'Recite 3 times morning and evening for comprehensive protection.',
  },
  {
    id: 'm_05',
    title: 'Surah Al-Falaq',
    titleEn: 'Surah Al-Falaq (The Daybreak)',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    rumi: 'Qul a\'udhu bi-Rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-\'uqad. Wa min sharri hasidin idha hasad.',
    translationMalay: 'Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh. Dari kejahatan makhluk yang Dia ciptakan. Dan dari kejahatan malam apabila telah gelap gulita. Dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul. Dan dari kejahatan pendengki apabila dia dengki.',
    translationEn: 'Say: I seek refuge in the Lord of daybreak. From the evil of that which He created. And from the evil of darkness when it settles. And from the evil of the blowers in knots. And from the evil of an envier when he envies.',
    repeatCount: 3,
    timeOfDay: 'both',
  },
  {
    id: 'm_06',
    title: 'Surah An-Nas',
    titleEn: 'Surah An-Nas (Mankind)',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
    rumi: 'Qul a\'udhu bi-Rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.',
    translationMalay: 'Katakanlah: Aku berlindung kepada Tuhan sekalian manusia. Raja manusia. Sembahan manusia. Dari kejahatan bisikan syaitan yang bersembunyi. Yang membisikkan kejahatan ke dalam dada manusia. Dari golongan jin dan manusia.',
    translationEn: 'Say: I seek refuge in the Lord of mankind. The Sovereign of mankind. The God of mankind. From the evil of the retreating whisperer. Who whispers evil into the breasts of mankind. From among the jinn and mankind.',
    repeatCount: 3,
    timeOfDay: 'both',
  },
  {
    id: 'm_07',
    title: 'Doa Memulakan Pagi / Petang',
    titleEn: 'Morning & Evening Affirmation',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    rumi: 'Asbahna wa asbahal-mulku lillah (Amsayna wa amsal-mulku lillahi fi masaa\'), walhamdulillahi, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa \'ala kulli shay\'in qadir.',
    translationMalay: 'Kami memasuki pagi ini dan kerajaan seluruhnya adalah milik Allah (atau petang ini bagi zikir petang). Segala puji bagi Allah, tiada Tuhan melainkan Allah yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nyalah kerajaan dan bagi-Nyalah kepujian, dan Dia Maha Berkuasa atas setiap sesuatu.',
    translationEn: 'We have entered upon the morning and the kingdom belongs to Allah (or evening in evening recital). All praise is due to Allah, there is no deity except Allah alone, without partner. To Him belongs the dominion and to Him belongs praise, and He is over all things omnipotent.',
    repeatCount: 1,
    timeOfDay: 'both',
  },
  {
    id: 'm_08',
    title: 'Doa Perlindungan Keseluruhan (Bismillahilladhi)',
    titleEn: 'Ultimate Protection Prayer',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    rumi: 'Bismillahilladhi la yadurru ma\'asmihi shay\'un fil-ardi wa la fis-sama\'i wa Huwas-Sami\'ul-\'Alim.',
    translationMalay: 'Dengan nama Allah yang dengan nama-Nya tidak ada sesuatu pun di bumi dan di langit yang dapat mendatangkan bahaya, dan Dialah Yang Maha Mendengar lagi Maha Mengetahui.',
    translationEn: 'In the Name of Allah, with Whose Name nothing upon earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
    repeatCount: 3,
    timeOfDay: 'both',
    note: 'Barangsiapa membacanya 3 kali pada pagi dan petang, tiada kemudaratan yang dapat menimpanya.',
    noteEn: 'Whoever recites it three times morning and evening, nothing will harm them.',
  },
  {
    id: 'm_09',
    title: 'Redha Terhadap Allah, Islam & Nabi SAW',
    titleEn: 'Contentment in Allah, Islam & the Prophet',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا وَرَسُولًا',
    rumi: 'Radhitu billahi Rabba, wa bil-Islami dina, wa bi-Muhammadin sallallahu \'alayhi wa sallama nabiyyaw-wa rasula.',
    translationMalay: 'Aku redha Allah sebagai Tuhanku, Islam sebagai agamaku, dan Muhammad SAW sebagai Nabi dan Rasulku.',
    translationEn: 'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace and blessings be upon him) as my Prophet and Messenger.',
    repeatCount: 3,
    timeOfDay: 'both',
    note: 'Allah berhak untuk meredhai orang yang mengucapkannya pada hari Kiamat.',
    noteEn: 'Allah has promised to please whoever recites this on the Day of Resurrection.',
  },
  {
    id: 'm_10',
    title: 'Tasbih & Pujian Menyamai Seluruh Ciptaan',
    titleEn: 'Glorification Equaling All Creation',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
    rumi: 'Subhanallahi wa bihamdihi: \'adada khalqih, wa rida nafsih, wa zinata \'arshih, wa midada kalimatih.',
    translationMalay: 'Maha Suci Allah dan segala puji bagi-Nya: sebanyak bilangan makhluk-Nya, seredha diri-Nya, seberat timbangan Arasy-Nya, dan sebanyak tinta kalimat-kalimat-Nya.',
    translationEn: 'Glory be to Allah and all praise is His: by the count of His creation, by His self-pleasure, by the weight of His Throne, and by the ink of His words.',
    repeatCount: 3,
    timeOfDay: 'morning',
    note: 'Zikir yang ganjarannya melebihi ibadah berjam-jam (Sahih Muslim).',
    noteEn: 'A dhikr whose reward surpasses hours of continuous prayer (Sahih Muslim).',
  },
];
