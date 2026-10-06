export interface QuranVerseItem {
  verseNumber: number;
  arabic: string;
  rumi?: string;
  translationMalay: string;
  translationEn: string;
}

export interface BundledSurahData {
  number: number;
  isComplete: boolean;
  verses: QuranVerseItem[];
}

export interface QuranSurahItem {
  id: string;
  number: number;
  name: string;
  nameEn: string;
  nameArabic: string;
  versesCount: number;
  revelationType: 'Makkah' | 'Madinah';
  theme: string;
  themeEn: string;
  virtue: string;
  virtueEn: string;
  verses: QuranVerseItem[];
}

/**
 * Surah Al-Fatihah (Complete 7 Verses)
 */
const SURAH_01_VERSES: QuranVerseItem[] = [
  {
    verseNumber: 1,
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    rumi: 'Bismillahir-Rahmanir-Rahim',
    translationMalay: 'Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani.',
    translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
  },
  {
    verseNumber: 2,
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    rumi: 'Al-hamdu lillahi Rabbil-\'alamin',
    translationMalay: 'Segala puji tertentu bagi Allah, Tuhan yang memelihara dan mentadbirkan sekalian alam.',
    translationEn: 'All praise is due to Allah, Lord of the worlds.',
  },
  {
    verseNumber: 3,
    arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
    rumi: 'Ar-Rahmanir-Rahim',
    translationMalay: 'Yang Maha Pemurah, lagi Maha Mengasihani.',
    translationEn: 'The Entirely Merciful, the Especially Merciful.',
  },
  {
    verseNumber: 4,
    arabic: 'مَالِكِ يَوْمِ الدِّينِ',
    rumi: 'Maliki yawmid-din',
    translationMalay: 'Yang Menguasai pemerintahan hari Pembalasan (hari Akhirat).',
    translationEn: 'Sovereign of the Day of Recompense.',
  },
  {
    verseNumber: 5,
    arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    rumi: 'Iyyaka na\'budu wa iyyaka nasta\'in',
    translationMalay: 'Engkaulah sahaja yang kami sembah, dan kepada Engkaulah sahaja kami memohon pertolongan.',
    translationEn: 'It is You we worship and You we ask for help.',
  },
  {
    verseNumber: 6,
    arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    rumi: 'Ihdinas-siratal-mustaqim',
    translationMalay: 'Tunjukkanlah kami jalan yang lurus.',
    translationEn: 'Guide us to the straight path.',
  },
  {
    verseNumber: 7,
    arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    rumi: 'Siratalladhina an\'amta \'alayhim ghayril-maghdubi \'alayhim wa lad-dallin',
    translationMalay: 'Iaitu jalan orang-orang yang Engkau telah kurniakan nikmat kepada mereka, bukan (jalan) orang-orang yang dimurkai dan bukan pula (jalan) orang-orang yang sesat.',
    translationEn: 'The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.',
  },
];

/**
 * Surah Al-Mulk (Complete All 30 Verses)
 */
const SURAH_67_VERSES: QuranVerseItem[] = [
  {
    verseNumber: 1,
    arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    rumi: 'Tabarakalladhi biyadihil-mulku wa Huwa \'ala kulli shay\'in qadir',
    translationMalay: 'Maha Berkat serta Maha Tinggilah kelebihan Tuhan yang di dalam genggaman kekuasaan-Nya memerintah kerajaan sekalian alam, dan Dia Maha Berkuasa atas tiap-tiap sesuatu.',
    translationEn: 'Blessed is He in whose hand is dominion, and He is over all things omnipotent.',
  },
  {
    verseNumber: 2,
    arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ',
    rumi: 'Alladhi khalaqal-mawta wal-hayata liyabluwakum ayyukum ahsanu \'amala, wa Huwal-\'Azizul-Ghafur',
    translationMalay: 'Dialah yang telah mentakdirkan adanya mati dan hidup untuk menguji kamu: siapakah di antara kamu yang lebih baik amalnya; dan Dia Maha Kuasa, lagi Maha Pengampun.',
    translationEn: 'He who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving.',
  },
  {
    verseNumber: 3,
    arabic: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ',
    rumi: 'Alladhi khalaqa sab\'a samawatin tibaqa, ma tara fi khalqir-Rahmani min tafawut, farji\'il-basara hal tara min futur',
    translationMalay: 'Dialah yang telah menciptakan tujuh petala langit berlapis-lapis; kamu tidak melihat sebarang ketidaksempurnaan pada ciptaan Yang Maha Pemurah. Pandanglah berulang kali: adakah kamu melihat sebarang kecacatan?',
    translationEn: 'Who created seven heavens in layers. You see no imperfection in the creation of the Most Merciful. So look again; do you see any flaws?',
  },
  {
    verseNumber: 4,
    arabic: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ',
    rumi: 'Thummarji\'il-basara karratayni yanqalib ilaykal-basaru khasi\'aw-wa huwa hasir',
    translationMalay: 'Kemudian pandanglah sekali lagi berulang-ulang, nescaya pandanganmu akan kembali kepadamu dalam keadaan hampa dan letih lesu.',
    translationEn: 'Then return your vision twice again. Your vision will return to you humbled while it is fatigued.',
  },
  {
    verseNumber: 5,
    arabic: 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ',
    rumi: 'Wa laqad zayyannas-sama\'ad-dunya bimasabiha wa ja\'alnaha rujumal-lish-shayatini wa a\'tadna lahum \'adhabas-sa\'ir',
    translationMalay: 'Dan sesungguhnya Kami telah menghiasi langit yang dekat dengan lampu-lampu (bintang-bintang), dan Kami jadikannya rejaman terhadap syaitan-syaitan, dan Kami sediakan bagi mereka azab neraka yang menyala-nyala.',
    translationEn: 'And We have certainly beautified the nearest heaven with stars and have made them missiles against devils, and We have prepared for them the punishment of the Blaze.',
  },
  {
    verseNumber: 6,
    arabic: 'وَلِلَّذِينَ كَفَرُوا بِرَبِّهِمْ عَذَابُ جَهَنَّمَ ۖ وَبِئْسَ الْمَصِيرُ',
    rumi: 'Wa lilladhina kafaru bi-Rabbihim \'adhabu jahannama wa bi\'sal-masir',
    translationMalay: 'Dan bagi orang-orang yang kufur ingkar kepada Tuhan mereka disediakan azab neraka Jahannam, dan itulah seburuk-buruk tempat kembali.',
    translationEn: 'And for those who disbelieved in their Lord is the punishment of Hell, and wretched is the destination.',
  },
  {
    verseNumber: 7,
    arabic: 'إِذَا أُلْقُوا فِيهَا سَمِعُوا لَهَا شَهِيقًا وَهِيَ تَفُورُ',
    rumi: 'Idha ulqu fiha sami\'u laha shahiqaw-wa hiya tafur',
    translationMalay: 'Apabila mereka dicampakkan ke dalamnya, mereka mendengar suaranya yang mengerikan sedang ia menggelegak.',
    translationEn: 'When they are thrown into it, they hear from it a dreadful inhaling while it boils up.',
  },
  {
    verseNumber: 8,
    arabic: 'تَكَادُ تَمَيَّزُ مِنَ الْغَيْظِ ۖ كُلَّمَا أُلْقِيَ فِيهَا فَوْجٌ سَأَلَهُمْ خَزَنَتُهَا أَلَمْ يَأْتِكُمْ نَذِيرٌ',
    rumi: 'Takadu tamayyazu minal-ghayz, kullama ulqiya fiha fawjun sa\'alahum khazanatuha alam ya\'tikum nadhir',
    translationMalay: 'Hampir-hampir ia pecah berkecai kerana marahnya. Tiap-tiap kali dicampakkan ke dalamnya sekumpulan manusia, penjaga-penjaganya bertanya: Tidakkah kamu pernah didatangi seorang pemberi amaran?',
    translationEn: 'It almost bursts with rage. Every time a company is thrown into it, its keepers ask them: "Did there not come to you a warner?"',
  },
  {
    verseNumber: 9,
    arabic: 'قَالُوا بَلَىٰ قَدْ جَاءَنَا نَذِيرٌ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ اللَّهُ مِن شَيْءٍ إِنْ أَنتُمْ إِلَّا فِي ضَلَالٍ كَبِيرٍ',
    rumi: 'Qalu bala qad ja\'ana nadhirun fa-kadhdhabna wa qulna ma nazzalallahu min shay\'in in antum illa fi dalalin kabir',
    translationMalay: 'Mereka menjawab: Benar, sesungguhnya telah datang kepada kami seorang pemberi amaran, lalu kami mendustakannya dan berkata: Allah tidak menurunkan sesuatu pun, kamu tidak lain hanyalah di dalam kesesatan yang besar.',
    translationEn: 'They will say: "Yes, a warner had come to us, but we denied and said: Allah has not sent down anything. You are not but in great error."',
  },
  {
    verseNumber: 10,
    arabic: 'وَقَالُوا لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا كُنَّا فِي أَصْحَابِ السَّعِيرِ',
    rumi: 'Wa qalu law kunna nasma\'u aw na\'qilu ma kunna fi ashabis-sa\'ir',
    translationMalay: 'Dan mereka berkata: Kalaulah kami dahulu mendengar atau menggunakan akal fikiran, tentulah kami tidak termasuk dalam kalangan penghuni neraka yang menyala-nyala ini.',
    translationEn: 'And they will say: "If only we had been listening or reasoning, we would not be among the companions of the Blaze."',
  },
  {
    verseNumber: 11,
    arabic: 'فَاعْتَرَفُوا بِذَنبِهِمْ فَسُحْقًا لِّأَصْحَابِ السَّعِيرِ',
    rumi: 'Fa\'tarafu bidhanbihim fasuhqal-li\'ashabis-sa\'ir',
    translationMalay: 'Maka mereka mengakui dosa-dosa mereka. Oleh itu kebinasaanlah bagi penghuni neraka.',
    translationEn: 'And they will admit their sin, so away with the companions of the Blaze.',
  },
  {
    verseNumber: 12,
    arabic: 'إِنَّ الَّذِينَ يَخْشَوْنَ رَبَّهُم بِالْغَيْبِ لَهُم مَّغْفِرَةٌ وَأَجْرٌ كَبِيرٌ',
    rumi: 'Innal-ladhina yakhshawna Rabbahum bil-ghaybi lahum maghfiratuw-wa ajrun kabir',
    translationMalay: 'Sesungguhnya orang-orang yang takut kepada Tuhan mereka semasa mereka tidak dilihat orang, mereka beroleh keampunan dan pahala yang besar.',
    translationEn: 'Indeed, those who fear their Lord unseen will have forgiveness and great reward.',
  },
  {
    verseNumber: 13,
    arabic: 'وَأَسِرُّوا قَوْلَكُمْ أَوِ اجْهَرُوا بِهِ ۖ إِنَّهُ عَلِيمٌ بِذَاتِ الصُّدُورِ',
    rumi: 'Wa asirru qawlakum awijharu bihi, innahu \'Alimum-bidhatis-sudur',
    translationMalay: 'Dan rahsiakanlah perkataan kamu atau zahirkanlah; sesungguhnya Allah Maha Mengetahui akan segala isi hati.',
    translationEn: 'And conceal your speech or publicize it; indeed, He is Knowing of that within the breasts.',
  },
  {
    verseNumber: 14,
    arabic: 'أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ',
    rumi: 'Ala ya\'lamu man khalaqa wa Huwal-Latiful-Khabir',
    translationMalay: 'Tidakkah Allah yang menciptakan sekalian makhluk itu mengetahui? Sedangkan Dia Maha Halus lagi Maha Mendalam Pengetahuan-Nya.',
    translationEn: 'Does He who created not know, while He is the Subtle, the Acquainted?',
  },
  {
    verseNumber: 15,
    arabic: 'هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا فَامْشُوا فِي مَنَاكِبِهَا وَكُلُوا مِن رِّزْقِهِ ۖ وَإِلَيْهِ النُّشُورُ',
    rumi: 'Huwal-ladhi ja\'ala lakumul-arda dhalulan famshu fi manakibiha wa kulu mir-rizqihi wa ilayhin-nushur',
    translationMalay: 'Dialah yang menjadikan bumi ini mudah digunakan bagi kamu, maka berjalanlah di segenap penjurunya serta makanlah dari rezeki yang dikurniakan Allah; dan kepada-Nyalah tempat kembali.',
    translationEn: 'It is He who made the earth tame for you - so walk among its slopes and eat of His provision - and to Him is the resurrection.',
  },
  {
    verseNumber: 16,
    arabic: 'أَأَمِنتُم مَّن فِي السَّمَاءِ أَن يَخْسِفَ بِكُمُ الْأَرْضَ فَإِذَا هِيَ تَمُورُ',
    rumi: 'A\'amintum man fis-sama\'i ay-yakhsifa bikumul-arda fa-idha hiya tamur',
    translationMalay: 'Patutkah kamu merasa aman terhadap Tuhan yang berkuasa di langit bahawa Dia tidak akan menenggelamkan kamu ke dalam bumi, tiba-tiba bumi itu bergoyang hebat?',
    translationEn: 'Do you feel secure that He who is in the heaven will not cause the earth to swallow you when suddenly it sways?',
  },
  {
    verseNumber: 17,
    arabic: 'أَمْ أَمِنتُم مَّن فِي السَّمَاءِ أَن يُرْسِلَ عَلَيْكُمْ حَاصِبًا ۖ فَسَتَعْلَمُونَ كَيْفَ نَذِيرِ',
    rumi: 'Am amintum man fis-sama\'i ay-yursila \'alaykum hasiba, fa-sata\'lamuna kayfa nadhir',
    translationMalay: 'Atau patutkah kamu merasa aman terhadap Tuhan yang berkuasa di langit bahawa Dia tidak akan menghantarkan kepada kamu angin ribut yang menghujani batu? Kelak kamu akan mengetahui bagaimana dahsyatnya amaran-Ku.',
    translationEn: 'Or do you feel secure that He who is in the heaven will not send against you a storm of stones? Then you would know how [terrible] was My warning.',
  },
  {
    verseNumber: 18,
    arabic: 'وَلَقَدْ كَذَّبَ الَّذِينَ مِن قَبْلِهِمْ فَكَيْفَ كَانَ نَكِيرِ',
    rumi: 'Wa laqad kadhdhabal-ladhina min qablihim fa-kayfa kana nakir',
    translationMalay: 'Dan sesungguhnya orang-orang sebelum mereka telah mendustakan, maka perhatikanlah bagaimana kemurkaan-Ku.',
    translationEn: 'And already had those before them denied, and how [terrible] was My reproach.',
  },
  {
    verseNumber: 19,
    arabic: 'أَوَلَمْ يَرَوْا إِلَى الطَّيْرِ فَوْقَهُمْ صَافَّاتٍ وَيَقْبِضْنَ ۚ مَا يُمْسِكُهُنَّ إِلَّا الرَّحْمَٰنُ ۚ إِنَّهُ بِكُلِّ شَيْءٍ بَصِيرٌ',
    rumi: 'Awalam yaraw ilat-tayri fawqahum saffatiw-wa yaqbidn, ma yumsikuhunna illar-Rahman, innahu bikulli shay\'im-basir',
    translationMalay: 'Tidakkah mereka memerhatikan burung-burung yang terbang di atas mereka dengan mengembangkan dan menutup sayapnya? Tiada yang menahannya melainkan Yang Maha Pemurah. Sesungguhnya Dia Maha Melihat segala sesuatu.',
    translationEn: 'Do they not see the birds above them with wings outspread and [then] folding in? None holds them up except the Most Merciful. Indeed, He is of all things Seeing.',
  },
  {
    verseNumber: 20,
    arabic: 'أَمَّنْ هَٰذَا الَّذِي هُوَ جُندٌ لَّكُمْ يَنصُرُكُم مِّن دُونِ الرَّحْمَٰنِ ۚ إِنِ الْكَافِرُونَ إِلَّا فِي غُرُورٍ',
    rumi: 'Amman hadhal-ladhi huwa jundul-lakum yansurukum min dunir-Rahman, inil-kafiruna illa fi ghurur',
    translationMalay: 'Siapakah tentera yang dapat menolong kamu selain daripada Yang Maha Pemurah? Orang-orang kafir tidak lain hanyalah tenggelam dalam tipu daya.',
    translationEn: 'Or who is it that could be an army for you to aid you other than the Most Merciful? The disbelievers are not but in delusion.',
  },
  {
    verseNumber: 21,
    arabic: 'أَمَّنْ هَٰذَا الَّذِي يَرْزُقُكُمْ إِنْ أَمْسَكَ رِزْقَهُ ۚ بَل لَّجُّوا فِي عُتُوٍّ وَنُفُورٍ',
    rumi: 'Amman hadhal-ladhi yarzuqukum in amsaka rizqah, bal lajju fi \'utuwwiw-wa nufur',
    translationMalay: 'Atau siapakah yang dapat memberi rezeki kepada kamu jika Allah menahan rezeki-Nya? Bahkan mereka terus-menerus dalam kedegilan dan lari dari kebenaran.',
    translationEn: 'Or who is it that could provide for you if He withheld His provision? But they have persisted in insolence and aversion.',
  },
  {
    verseNumber: 22,
    arabic: 'أَفَمَن يَمْشِي مُكِبًّا عَلَىٰ وَجْهِهِ أَهْدَىٰ أَمَّن يَمْشِي سَوِيًّا عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ',
    rumi: 'Afamay-yamshi mukibban \'ala wajhihi ahda ammay-yamshi sawiyyan \'ala siratim-mustaqim',
    translationMalay: 'Maka adakah orang yang berjalan tersungkur di atas mukanya lebih terpimpin, atau orang yang berjalan tegak di atas jalan yang lurus?',
    translationEn: 'Then is one who walks fallen on his face better guided or one who walks upright on a straight path?',
  },
  {
    verseNumber: 23,
    arabic: 'قُلْ هُوَ الَّذِي أَنشَأَكُمْ وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ ۖ قَلِيلًا مَّا تَشْكُرُونَ',
    rumi: 'Qul Huwal-ladhi ansha\'akum wa ja\'ala lakumus-sam\'a wal-absara wal-af\'idah, qalilam-ma tashkurun',
    translationMalay: 'Katakanlah: Dialah yang menciptakan kamu dan mengurniakan pendengaran, penglihatan, serta hati nurani; amat sedikit kamu bersyukur.',
    translationEn: 'Say: "It is He who has produced you and made for you hearing and vision and hearts; little are you grateful."',
  },
  {
    verseNumber: 24,
    arabic: 'قُلْ هُوَ الَّذِي ذَرَأَكُمْ فِي الْأَرْضِ وَإِلَيْهِ تُحْشَرُونَ',
    rumi: 'Qul Huwal-ladhi dhara\'akum fil-ardi wa ilayhi tuhsharun',
    translationMalay: 'Katakanlah: Dialah yang membiakkan kamu di bumi, dan kepada-Nyalah kamu akan dihimpunkan.',
    translationEn: 'Say: "It is He who has multiplied you throughout the earth, and to Him you will be gathered."',
  },
  {
    verseNumber: 25,
    arabic: 'وَيَقُولُونَ مَتَىٰ هَٰذَا الْوَعْدُ إِن كُنتُمْ صَادِقِينَ',
    rumi: 'Wa yaquluna mata hadhal-wa\'du in kuntum sadiqin',
    translationMalay: 'Dan mereka bertanya: Bilakah datangnya janji (kiamat) ini jika betul kamu orang-orang yang benar?',
    translationEn: 'And they say: "When is this promise, if you should be truthful?"',
  },
  {
    verseNumber: 26,
    arabic: 'قُلْ إِنَّمَا الْعِلْمُ عِندَ اللَّهِ وَإِنَّمَا أَنَا نَذِيرٌ مُّبِينٌ',
    rumi: 'Qul innamal-\'ilmu \'indallahi wa innama ana nadhirum-mubin',
    translationMalay: 'Katakanlah: Sesungguhnya pengetahuan tentang hal itu hanya ada di sisi Allah, dan aku hanyalah seorang pemberi amaran yang jelas.',
    translationEn: 'Say: "The knowledge is only with Allah, and I am only a clear warner."',
  },
  {
    verseNumber: 27,
    arabic: 'فَلَمَّا رَأَوْهُ زُلْفَةً سِيئَتْ وُجُوهُ الَّذِينَ كَفَرُوا وَقِيلَ هَٰذَا الَّذِي كُنتُم بِهِ تَدَّعُونَ',
    rumi: 'Falamma ra\'awhu zulfatan si\'at wujuhul-ladhina kafaru wa qila hadhal-ladhi kuntum bihi tadda\'un',
    translationMalay: 'Apabila mereka melihat azab itu sudah dekat, muramlah muka orang-orang kafir itu, dan dikatakan: Inilah perkara yang kamu minta dahulu!',
    translationEn: 'But when they see it approaching, the faces of those who disbelieve will be distressed and it will be said: "This is that for which you used to call."',
  },
  {
    verseNumber: 28,
    arabic: 'قُلْ أَرَأَيْتُمْ إِنْ أَهْلَكَنِيَ اللَّهُ وَمَن مَّعِيَ أَوْ رَحِمَنَا فَمَن يُجِيرُ الْكَافِرِينَ مِنْ عَذَابٍ أَلِيمٍ',
    rumi: 'Qul ara\'aytum in ahlakaniyallahu wa mam-ma\'iya aw rahimana famay-yujirul-kafirina min \'adhabin alim',
    translationMalay: 'Katakanlah: Khabarkan kepadaku, jika Allah mematikan daku dan orang-orang yang bersamaku atau mengasihani kami, maka siapakah yang dapat melindungi orang kafir dari azab yang pedih?',
    translationEn: 'Say: "Have you considered: whether Allah should cause my death and those with me or have mercy upon us, who can protect the disbelievers from a painful punishment?"',
  },
  {
    verseNumber: 29,
    arabic: 'قُلْ هُوَ الرَّحْمَٰنُ آمَنَّا بِهِ وَعَلَيْهِ تَوَكَّلْنَا ۖ فَسَتَعْلَمُونَ مَنْ هُوَ فِي ضَلَالٍ مُّبِينٍ',
    rumi: 'Qul Huwar-Rahmanu amanna bihi wa \'alayhi tawakkalna, fasata\'lamuna man huwa fi dalalim-mubin',
    translationMalay: 'Katakanlah: Dialah Yang Maha Pemurah; kami beriman kepada-Nya dan kepada-Nyalah kami bertawakkal. Kelak kamu akan mengetahui siapakah yang berada dalam kesesatan yang nyata.',
    translationEn: 'Say: "He is the Most Merciful; we have believed in Him, and upon Him we have relied. And you will know who it is that is in clear error."',
  },
  {
    verseNumber: 30,
    arabic: 'قُلْ أَرَأَيْتُمْ إِنْ أَصْبَحَ مَاؤُكُمْ غَوْرًا فَمَن يَأْتِيكُم بِمَاءٍ مَّعِينٍ',
    rumi: 'Qul ara\'aytum in asbaha ma\'ukum ghawran famay-ya\'tikum bima\'im-ma\'in',
    translationMalay: 'Katakanlah: Khabarkan kepadaku, jika air kamu meresap hilang ke dalam bumi, maka siapakah yang dapat mendatangkan air yang mengalir kepada kamu?',
    translationEn: 'Say: "Have you considered: if your water was to become sunken into the earth, then who could bring you flowing water?"',
  },
];

/**
 * Surah Al-Kahf (Verses 1 to 10 - Shield against Dajjal)
 */
const SURAH_18_VERSES: QuranVerseItem[] = [
  {
    verseNumber: 1,
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا ۜ',
    rumi: 'Alhamdulillahilladhi anzala \'ala \'abdihil-kitaba wa lam yaj\'al lahu \'iwaja',
    translationMalay: 'Segala puji bagi Allah yang telah menurunkan kepada hamba-Nya (Muhammad), Kitab suci Al-Quran, dan tidak menjadikan padanya sebarang kebengkokan.',
    translationEn: 'All praise is due to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.',
  },
  {
    verseNumber: 2,
    arabic: 'قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا',
    rumi: 'Qayyimal-liyundhira ba\'san shadidam-mil-ladunhu wa yubash-shiral-mu\'mininal-ladhina ya\'malunas-salihati anna lahum ajran hasana',
    translationMalay: '(Kitab) yang lurus untuk memberi amaran tentang azab yang pedih dari sisi Allah, dan memberi berita gembira kepada orang-orang yang beriman lagi mengerjakan amal-amal soleh, bahawa mereka akan beroleh balasan yang baik.',
    translationEn: '[He has made it] straight, to warn of severe punishment from Him and to give good tidings to the believers who do righteous deeds that they will have a good reward.',
  },
  {
    verseNumber: 3,
    arabic: 'مَّاكِثِينَ فِيهِ أَبَدًا',
    rumi: 'Makithina fihi abada',
    translationMalay: 'Mereka kekal di dalamnya selama-lamanya.',
    translationEn: 'They will remain therein forever.',
  },
  {
    verseNumber: 4,
    arabic: 'وَيُنذِرَ الَّذِينَ قَالُوا اتَّخَذَ اللَّهُ وَلَدًا',
    rumi: 'Wa yundhiral-ladhina qalut-takhadhallahu walada',
    translationMalay: 'Dan untuk memberi amaran kepada orang-orang yang berkata: "Allah mempunyai anak".',
    translationEn: 'And to warn those who say, "Allah has taken a son."',
  },
  {
    verseNumber: 5,
    arabic: 'مَّا لَهُم بِهِ مِنْ عِلْمٍ وَلَا لِآبَائِهِمْ ۚ كَبُرَتْ كَلِمَةً تَخْرُجُ مِنْ أَفْوَاهِهِمْ ۚ إِن يَقُولُونَ إِلَّا كَذِبًا',
    rumi: 'Ma lahum bihi min \'ilmiw-wa la li\'aba\'ihim, kaburat kalimatan takhruju min afwahihim, iy-yaquluna illa kadhiba',
    translationMalay: 'Mereka sama sekali tidak mempunyai pengetahuan tentang hal itu, begitu juga nenek moyang mereka. Alangkah besarnya perkataan dusta yang keluar dari mulut mereka; mereka hanyalah mengatakan perkara yang dusta.',
    translationEn: 'They have no knowledge thereof, nor did their fathers. Grave is the word that comes out of their mouths; they speak not except a lie.',
  },
  {
    verseNumber: 6,
    arabic: 'فَلَعَلَّكَ بَاخِعٌ نَّفْسَكَ عَلَىٰ آثَارِهِمْ إِن لَّمْ يُؤْمِنُوا بِهَٰذَا الْحَدِيثِ أَسَفًا',
    rumi: 'Fala\'allaka bakhi\'un-nafsaka \'ala atharihim il-lam yu\'minu bihadhal-hadithi asafa',
    translationMalay: 'Maka barangkali engkau (wahai Muhammad) akan membinasakan dirimu kerana menanggung duka cita terhadap jejak langkah mereka, jika mereka tidak beriman kepada keterangan Al-Quran ini.',
    translationEn: 'Then perhaps you would kill yourself through grief over them, [O Muhammad], if they do not believe in this message, [and] out of sorrow.',
  },
  {
    verseNumber: 7,
    arabic: 'إِنَّا جَعَلْنَا مَا عَلَى الْأَرْضِ زِينَةً لَّهَا لِنَبْلُوَهُمْ أَيُّهُمْ أَحْسَنُ عَمَلًا',
    rumi: 'Inna ja\'alna ma \'alal-ardi zinatal-laha linabluwahum ayyuhum ahsanu \'amala',
    translationMalay: 'Sesungguhnya Kami telah jadikan apa yang ada di muka bumi sebagai perhiasan baginya, kerana Kami hendak menguji mereka, siapakah di antaranya yang lebih baik amalnya.',
    translationEn: 'Indeed, We have made that which is on the earth adornment for it that We may test them [as to] which of them is best in deed.',
  },
  {
    verseNumber: 8,
    arabic: 'وَإِنَّا لَجَاعِلُونَ مَا عَلَيْهَا صَعِيدًا جُرُزًا',
    rumi: 'Wa inna laja\'iluna ma \'alayha sa\'idan juruza',
    translationMalay: 'Dan sesungguhnya Kami akan jadikan apa yang ada di atasnya tanah yang tandus lagi kering kontang.',
    translationEn: 'And indeed, We will make that which is upon it [into] a barren ground.',
  },
  {
    verseNumber: 9,
    arabic: 'أَمْ حَسِبْتَ أَنَّ أَصْحَابَ الْكَهْفِ وَالرَّقِيمِ كَانُوا مِنْ آيَاتِنَا عَجَبًا',
    rumi: 'Am hasibta anna ashabal-kahfi war-raqimi kanu min ayatina \'ajaba',
    translationMalay: 'Adakah engkau menyangka bahawa kisah Ashabul Kahfi dan Ar-Raqim itu termasuk tanda-tanda kekuasaan Kami yang amat menakjubkan?',
    translationEn: 'Or have you thought that the companions of the cave and the inscription were, among Our signs, a wonder?',
  },
  {
    verseNumber: 10,
    arabic: 'إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا',
    rumi: 'Idh awal-fityatu ilal-kahfi fa-qalu Rabbana atina mil-ladunka rahmataw-wa hayyi\' lana min amrina rashada',
    translationMalay: '(Ingatkanlah peristiwa) ketika beberapa orang pemuda berlindung ke dalam gua, lalu berdoa: "Wahai Tuhan kami! Kurniakanlah kami rahmat dari sisi-Mu, dan berilah kemudahan serta bimbingan yang betul bagi urusan kami."',
    translationEn: 'When the youths retreated to the cave and said: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance."',
  },
];

/**
 * Surah 112: Al-Ikhlas (Complete 4 Verses)
 */
const SURAH_112_VERSES: QuranVerseItem[] = [
  {
    verseNumber: 1,
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    rumi: 'Qul Huwallahu Ahad',
    translationMalay: 'Katakanlah (wahai Muhammad): Dialah Allah, Yang Maha Esa.',
    translationEn: 'Say: He is Allah, [who is] One.',
  },
  {
    verseNumber: 2,
    arabic: 'اللَّهُ الصَّمَدُ',
    rumi: 'Allahus-Samad',
    translationMalay: 'Allah tempat bergantung segala sesuatu.',
    translationEn: 'Allah, the Eternal Refuge.',
  },
  {
    verseNumber: 3,
    arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    rumi: 'Lam yalid wa lam yulad',
    translationMalay: 'Dia tiada beranak dan tidak pula diperanakkan.',
    translationEn: 'He neither begets nor is born.',
  },
  {
    verseNumber: 4,
    arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    rumi: 'Wa lam yakul-lahu kufuwan ahad',
    translationMalay: 'Dan tidak ada seorang pun yang setara atau sekufu dengan Dia.',
    translationEn: 'Nor is there to Him any equivalent.',
  },
];

/**
 * Surah 113: Al-Falaq (Complete 5 Verses)
 */
const SURAH_113_VERSES: QuranVerseItem[] = [
  {
    verseNumber: 1,
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    rumi: 'Qul a\'udhu bi-Rabbil-falaq',
    translationMalay: 'Katakanlah: Aku berlindung kepada Tuhan yang menguasai fajar subuh.',
    translationEn: 'Say: I seek refuge in the Lord of daybreak.',
  },
  {
    verseNumber: 2,
    arabic: 'مِن شَرِّ مَا خَلَقَ',
    rumi: 'Min sharri ma khalaq',
    translationMalay: 'Dari kejahatan makhluk yang Dia ciptakan.',
    translationEn: 'From the evil of that which He created.',
  },
  {
    verseNumber: 3,
    arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
    rumi: 'Wa min sharri ghasiqin idha waqab',
    translationMalay: 'Dan dari kejahatan malam apabila telah gelap gelita.',
    translationEn: 'And from the evil of darkness when it settles.',
  },
  {
    verseNumber: 4,
    arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
    rumi: 'Wa min sharrin-naffathati fil-\'uqad',
    translationMalay: 'Dan dari kejahatan tukang sihir yang menghembus pada ikatan-ikatan buhul.',
    translationEn: 'And from the evil of the blowers in knots.',
  },
  {
    verseNumber: 5,
    arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    rumi: 'Wa min sharri hasidin idha hasad',
    translationMalay: 'Dan dari kejahatan orang yang dengki apabila dia berdengki.',
    translationEn: 'And from the evil of an envier when he envies.',
  },
];

/**
 * Surah 114: An-Nas (Complete 6 Verses)
 */
const SURAH_114_VERSES: QuranVerseItem[] = [
  {
    verseNumber: 1,
    arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    rumi: 'Qul a\'udhu bi-Rabbin-nas',
    translationMalay: 'Katakanlah: Aku berlindung kepada Tuhan sekalian manusia.',
    translationEn: 'Say: I seek refuge in the Lord of mankind.',
  },
  {
    verseNumber: 2,
    arabic: 'مَلِكِ النَّاسِ',
    rumi: 'Malikin-nas',
    translationMalay: 'Raja yang menguasai sekalian manusia.',
    translationEn: 'The Sovereign of mankind.',
  },
  {
    verseNumber: 3,
    arabic: 'إِلَٰهِ النَّاسِ',
    rumi: 'Ilahin-nas',
    translationMalay: 'Tuhan yang disembah sekalian manusia.',
    translationEn: 'The God of mankind.',
  },
  {
    verseNumber: 4,
    arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
    rumi: 'Min sharril-waswasil-khannas',
    translationMalay: 'Dari kejahatan bisikan syaitan pembisik yang bersembunyi.',
    translationEn: 'From the evil of the retreating whisperer.',
  },
  {
    verseNumber: 5,
    arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
    rumi: 'Alladhi yuwaswisu fi sudurin-nas',
    translationMalay: 'Yang membisikkan kejahatan ke dalam dada manusia.',
    translationEn: 'Who whispers evil into the breasts of mankind.',
  },
  {
    verseNumber: 6,
    arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
    rumi: 'Minal-jinnati wan-nas',
    translationMalay: 'Iaitu dari golongan jin dan manusia.',
    translationEn: 'From among the jinn and mankind.',
  },
];

/**
 * Surah 108: Al-Kawthar (Complete 3 Verses)
 */
const SURAH_108_VERSES: QuranVerseItem[] = [
  {
    verseNumber: 1,
    arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
    rumi: 'Inna a\'taynalkal-kawthar',
    translationMalay: 'Sesungguhnya Kami telah mengurniakan kepadamu (wahai Muhammad) nikmat yang amat banyak (Al-Kawthar).',
    translationEn: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
  },
  {
    verseNumber: 2,
    arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
    rumi: 'Fasalli li-Rabbika wanhar',
    translationMalay: 'Oleh itu, kerjakanlah solat kerana Tuhanmu semata-mata, dan sembelihlah korban.',
    translationEn: 'So pray to your Lord and sacrifice [to Him alone].',
  },
  {
    verseNumber: 3,
    arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
    rumi: 'Inna shani\'aka huwal-abtar',
    translationMalay: 'Sesungguhnya orang yang membencimu, dialah yang terputus dari segala kebaikan.',
    translationEn: 'Indeed, your enemy is the one cut off.',
  },
];

/**
 * Surah 103: Al-Asr (Complete 3 Verses)
 */
const SURAH_103_VERSES: QuranVerseItem[] = [
  {
    verseNumber: 1,
    arabic: 'وَالْعَصْرِ',
    rumi: 'Wal-\'asr',
    translationMalay: 'Demi masa!',
    translationEn: 'By time,',
  },
  {
    verseNumber: 2,
    arabic: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
    rumi: 'Innal-insana lafi khusr',
    translationMalay: 'Sesungguhnya manusia itu benar-benar berada dalam kerugian,',
    translationEn: 'Indeed, mankind is in loss,',
  },
  {
    verseNumber: 3,
    arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
    rumi: 'Illal-ladhina amanu wa \'amilus-salihati wa tawisaw bil-haqqi wa tawisaw bis-sabr',
    translationMalay: 'Kecuali orang-orang yang beriman dan beramal soleh, serta berpesan-pesan dengan kebenaran dan berpesan-pesan dengan kesabaran.',
    translationEn: 'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.',
  },
];

/**
 * Complete Bundled Surah Mapping for fast offline access
 */
export const BUNDLED_QURAN_SURAHS: Record<number, BundledSurahData> = {
  1: { number: 1, isComplete: true, verses: SURAH_01_VERSES },
  67: { number: 67, isComplete: true, verses: SURAH_67_VERSES },
  18: { number: 18, isComplete: false, verses: SURAH_18_VERSES },
  103: { number: 103, isComplete: true, verses: SURAH_103_VERSES },
  108: { number: 108, isComplete: true, verses: SURAH_108_VERSES },
  112: { number: 112, isComplete: true, verses: SURAH_112_VERSES },
  113: { number: 113, isComplete: true, verses: SURAH_113_VERSES },
  114: { number: 114, isComplete: true, verses: SURAH_114_VERSES },
};

/**
 * Selected Surahs list for quick selector chips in MoreScreen
 */
export const SELECTED_QURAN_SURAHS: QuranSurahItem[] = [
  {
    id: 'surah_67',
    number: 67,
    name: 'Al-Mulk',
    nameEn: 'The Sovereignty',
    nameArabic: 'المُلْك',
    versesCount: 30,
    revelationType: 'Makkah',
    theme: 'Kekuasaan mutlak Allah ke atas hidup, mati, dan alam semesta',
    themeEn: 'Absolute sovereignty of Allah over life, death, and the universe',
    virtue: 'Penyelamat dan pembela dari azab kubur jika diamalkan setiap malam (Sunan Tirmidhi).',
    virtueEn: 'Protector and intercessor against the punishment of the grave when recited nightly.',
    verses: SURAH_67_VERSES,
  },
  {
    id: 'surah_01',
    number: 1,
    name: 'Al-Fatihah',
    nameEn: 'The Opening',
    nameArabic: 'الفَاتِحَة',
    versesCount: 7,
    revelationType: 'Makkah',
    theme: 'Pembuka Al-Quran, induk solat & pujian kepada Allah',
    themeEn: 'The Opening, pillar of prayer & divine praise',
    virtue: 'Rukun solat fardhu dan sunat, penyembuh rohani dan jasmani.',
    virtueEn: 'Essential pillar of prayer, spiritual cure and enlightenment.',
    verses: SURAH_01_VERSES,
  },
  {
    id: 'surah_18',
    number: 18,
    name: 'Al-Kahf',
    nameEn: 'The Cave',
    nameArabic: 'الكَهْف',
    versesCount: 110,
    revelationType: 'Makkah',
    theme: 'Keteguhan iman pemuda Ashabul Kahf & benteng fitnah akhir zaman',
    themeEn: 'Firmness of faith and protection from end-times trials',
    virtue: 'Penyelamat daripada fitnah Dajjal jika menghafal atau membaca 10 ayat pertama (Sahih Muslim).',
    virtueEn: 'Protection from the trial of Dajjal when memorizing or reciting the first 10 verses.',
    verses: SURAH_18_VERSES,
  },
  {
    id: 'surah_112',
    number: 112,
    name: 'Al-Ikhlas',
    nameEn: 'The Sincerity',
    nameArabic: 'الإِخْلَاص',
    versesCount: 4,
    revelationType: 'Makkah',
    theme: 'Kemurnian tauhid dan keesaan mutlak Allah SWT',
    themeEn: 'Purity of monotheism and absolute oneness of Allah',
    virtue: 'Ganjaran membacanya menyamai sepertiga daripada Al-Quran.',
    virtueEn: 'Reward of reciting it equals one-third of the entire Quran.',
    verses: SURAH_112_VERSES,
  },
  {
    id: 'surah_113',
    number: 113,
    name: 'Al-Falaq',
    nameEn: 'The Daybreak',
    nameArabic: 'الفَلَق',
    versesCount: 5,
    revelationType: 'Makkah',
    theme: 'Perlindungan daripada kejahatan makhluk, sihir dan hasad dengki',
    themeEn: 'Seeking refuge from evil of creation, witchcraft, and envy',
    virtue: 'Benteng utama perlindungan rohani daripada sihir dan hasad.',
    virtueEn: 'Supreme fortress of protection against evil eye and occult harms.',
    verses: SURAH_113_VERSES,
  },
  {
    id: 'surah_114',
    number: 114,
    name: 'An-Nas',
    nameEn: 'Mankind',
    nameArabic: 'النَّاس',
    versesCount: 6,
    revelationType: 'Makkah',
    theme: 'Perlindungan daripada bisikan jahat syaitan dan godaan manusia',
    themeEn: 'Refuge in the Sovereign of mankind from whispering devils',
    virtue: 'Penutup Al-Quran; perlindungan menyeluruh dari bisikan was-was.',
    virtueEn: 'The seal of the Quran; universal protection from whispering malice.',
    verses: SURAH_114_VERSES,
  },
  {
    id: 'surah_108',
    number: 108,
    name: 'Al-Kawthar',
    nameEn: 'Abundance',
    nameArabic: 'الكَوْثَر',
    versesCount: 3,
    revelationType: 'Makkah',
    theme: 'Kurniaan sungai Al-Kawthar dan perintah solat serta korban',
    themeEn: 'Bestowal of Al-Kawthar and command of prayer and sacrifice',
    virtue: 'Penghibur duka lara orang beriman.',
    virtueEn: 'Immense divine solace and good tidings for believers.',
    verses: SURAH_108_VERSES,
  },
  {
    id: 'surah_103',
    number: 103,
    name: 'Al-\'Asr',
    nameEn: 'The Declining Day',
    nameArabic: 'العَصْر',
    versesCount: 3,
    revelationType: 'Makkah',
    theme: 'Nilai masa dan prinsip keselamatan dari kerugian hakiki',
    themeEn: 'Value of time and foundation of salvation from eternal loss',
    virtue: 'Mencukupi sebagai panduan pedoman hidup manusia beriman.',
    virtueEn: 'A complete manifesto for righteous living.',
    verses: SURAH_103_VERSES,
  },
];
