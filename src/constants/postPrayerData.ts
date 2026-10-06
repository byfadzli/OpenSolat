export interface PostPrayerStep {
  step: number;
  title: string;
  titleEn: string;
  repeat: number;
  arabic: string;
  rumi: string;
  translationMalay: string;
  translationEn: string;
  fadhilat?: string;
  fadhilatEn?: string;
}

export const POST_PRAYER_WIRID: PostPrayerStep[] = [
  {
    step: 1,
    title: 'Istighfar (3 Kali)',
    titleEn: 'Seeking Forgiveness (Istighfar 3x)',
    repeat: 3,
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    rumi: 'Astaghfirullahal-\'Azim, alladhi la ilaha illa Huwal-Hayyul-Qayyum, wa atubu ilayh.',
    translationMalay: 'Aku memohon keampunan kepada Allah Yang Maha Agung, yang tiada Tuhan selain Dia, Yang Maha Hidup lagi Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya.',
    translationEn: 'I seek the forgiveness of Allah the Magnificent, none has the right to be worshipped except Him, the Ever-Living, the Sustainer of all existence, and I repent unto Him.',
    fadhilat: 'Rasulullah SAW membaca istighfar 3 kali sebaik selesai memberi salam.',
    fadhilatEn: 'The Prophet SAW would seek forgiveness 3 times immediately after ending prayer.',
  },
  {
    step: 2,
    title: 'Pujian Kesejahteraan (Allahumma Antas Salam)',
    titleEn: 'Supplication for Peace (Antas Salam)',
    repeat: 1,
    arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    rumi: 'Allahumma Antas-Salamu wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram.',
    translationMalay: 'Ya Allah, Engkaulah As-Salam (Yang Maha Menyelamatkan), dan daripada Engkaulah keselamatan. Maha Berkat Engkau, wahai Tuhan Pemilik Kebesaran dan Kemuliaan.',
    translationEn: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of majesty and honor.',
    fadhilat: 'Hadith Riwayat Muslim (No. 591).',
    fadhilatEn: 'Reported in Sahih Muslim (No. 591).',
  },
  {
    step: 3,
    title: 'Pengakuan Tauhid & Kekuasaan',
    titleEn: 'Declaration of Divine Sovereignty',
    repeat: 1,
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    rumi: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa \'ala kulli shay\'in qadir. Allahumma la mani\'a lima a\'tayta, wa la mu\'tiya lima mana\'ta, wa la yanfa\'u dhal-jaddi minkal-jadd.',
    translationMalay: 'Tiada Tuhan melainkan Allah semata-mata, tiada sekutu bagi-Nya. Bagi-Nyalah kerajaan dan kepujian dan Dia Maha Berkuasa atas setiap sesuatu. Ya Allah! Tiada siapa yang dapat menghalang apa yang Engkau berikan, dan tiada siapa yang dapat memberi apa yang Engkau halang, dan tidaklah memberi faedah nasib kekayaan seseorang di sisi-Mu melainkan dengan rahmat-Mu.',
    translationEn: 'None has the right to be worshipped except Allah alone, without partner. To Him belongs the dominion and to Him belongs praise, and He is over all things omnipotent. O Allah, none can prevent what You give, and none can give what You prevent, and no fortune can benefit the fortunate against You.',
  },
  {
    step: 4,
    title: 'Ayatul Kursi',
    titleEn: 'Ayatul Kursi (Verse of the Throne)',
    repeat: 1,
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ ... وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    rumi: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum... Wa Huwal-\'Aliyyul-\'Azim.',
    translationMalay: 'Allah, tiada Tuhan melainkan Dia, Yang Tetap Hidup lagi Kekal mentadbirkan sekalian makhluk... Dan Dialah Yang Maha Tinggi, lagi Maha Besar.',
    translationEn: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence... And He is the Most High, the Most Great.',
    fadhilat: 'Barangsiapa membaca Ayatul Kursi setiap kali selepas solat fardhu, tiada yang menghalangnya masuk Syurga melainkan kematian (Sunan An-Nasa\'i).',
    fadhilatEn: 'Whoever recites Ayatul Kursi after each obligatory prayer, nothing stands between him and Paradise except death (Sunan An-Nasa\'i).',
  },
  {
    step: 5,
    title: 'Tasbih, Tahmid & Takbir (33 Kali Setiap Satu)',
    titleEn: 'Tasbih, Tahmid & Takbir (33x each)',
    repeat: 33,
    arabic: 'سُبْحَانَ اللَّهِ (٣٣x) ۝ الْحَمْدُ لِلَّهِ (٣٣x) ۝ اللَّهُ أَكْبَرُ (٣٣x)',
    rumi: 'Subhanallah (33x), Alhamdulillah (33x), Allahu Akbar (33x).',
    translationMalay: 'Maha Suci Allah (33 kali), Segala puji bagi Allah (33 kali), Allah Maha Besar (33 kali).',
    translationEn: 'Glory be to Allah (33 times), All praise is due to Allah (33 times), Allah is the Greatest (33 times).',
    fadhilat: 'Digenapkan yang ke-100 dengan tahlil; diampunkan segala dosa walaupun sebanyak buih di lautan (Sahih Muslim).',
    fadhilatEn: 'Completed to 100 with Tahlil; all sins forgiven even if they equal the foam of the ocean (Sahih Muslim).',
  },
  {
    step: 6,
    title: 'Pelengkap Seratus (Penyempurna Zikir)',
    titleEn: 'Completer to 100 (Final Tahlil)',
    repeat: 1,
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    rumi: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa \'ala kulli shay\'in qadir.',
    translationMalay: 'Tiada Tuhan melainkan Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nyalah kerajaan dan bagi-Nyalah kepujian, dan Dia Maha Kuasa atas segala sesuatu.',
    translationEn: 'There is no deity except Allah alone, without partner. To Him belongs all kingdom and to Him belongs all praise, and He is over all things omnipotent.',
  },
  {
    step: 7,
    title: 'Doa Selepas Solat (Keluarga, Keberkatan & Pengampunan)',
    titleEn: 'Comprehensive Post-Prayer Supplication',
    repeat: 1,
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، حَمْدًا يُوَافِي نِعَمَهُ وَيُكَافِئُ مَزِيدَهُ. يَا رَبَّنَا لَكَ الْحَمْدُ كَمَا يَنْبَغِي لِجَلَالِ وَجْهِكَ وَلِعَظِيمِ سُلْطَانِكَ. اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ. اللَّهُمَّ إِنَّا نَسْأَلُكَ سَلَامَةً فِي الدِّينِ، وَعَافِيَةً فِي الْجَسَدِ، وَزِيَادَةً فِي الْعِلْمِ، وَبَرَكَةً فِي الرِّزْقِ، وَتَوْبَةً قَبْلَ الْمَوْتِ، وَرَحْمَةً عِنْدَ الْمَوْتِ، وَمَغْفِرَةً بَعْدَ الْمَوْتِ. رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.',
    rumi: 'Alhamdulillahi Rabbil-\'Alamin, hamday-yuwafi ni\'amahu wa yukafi\'u mazidah. Ya Rabbana lakal-hamdu kama yambaghi lijalali wajhika wa li\'azimi sultanik. Allahumma salli \'ala sayyidina Muhammadin wa \'ala ali sayyidina Muhammad. Allahumma inna nas\'aluka salamatan fid-din, wa \'afiyatan fil-jasad, wa ziyadatan fil-\'ilm, wa barakatan fir-rizq, wa tawbatan qablal-mawt, wa rahmatan \'indal-mawt, wa maghfiratam-ba\'dal-mawt. Rabbana atina fid-dunya hasanataw-wa fil-akhirati hasanataw-wa qina \'adhaban-nar.',
    translationMalay: 'Segala puji bagi Allah Tuhan sekalian alam, pujian yang menyempurnakan segala nikmat-Nya. Ya Allah, selawat dan salam ke atas junjungan kami Nabi Muhammad SAW dan ahli keluarga Baginda. Ya Allah! Kami memohon kepada-Mu keselamatan dalam agama, kesihatan pada jasad, penambahan ilmu, keberkatan pada rezeki, taubat sebelum mati, rahmat semasa mati, dan keampunan selepas mati. Wahai Tuhan kami! Kurniakanlah kami kebaikan di dunia dan kebaikan di akhirat serta peliharalah kami dari azab api neraka.',
    translationEn: 'All praise is for Allah, Lord of the worlds, praise matching His favors and compensating His additions. O Allah, send peace and blessings upon our master Muhammad and his family. O Allah, we ask You for soundness in faith, well-being in the body, increase in knowledge, blessings in sustenance, repentance before death, mercy at the time of death, and forgiveness after death. Our Lord! Grant us good in this world and good in the Hereafter, and save us from the torment of the Fire.',
  },
];
