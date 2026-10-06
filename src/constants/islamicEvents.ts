export interface IslamicEvent {
  id: string;
  name: string;
  nameEn?: string;
  nameArabic: string;
  hijriDay: number;
  hijriMonth: number; // 1 = Muharram, ..., 12 = Zulhijjah
  hijriMonthName: string;
  isHolidayMalaysia: boolean;
  description: string;
  descriptionEn?: string;
  sunnahDeeds: string[];
  sunnahDeedsEn?: string[];
}

export const HIJRI_MONTH_NAMES = [
  'Muharram',
  'Safar',
  'Rabiulawal',
  'Rabiulakhir',
  'Jamadilawal',
  'Jamadilakhir',
  'Rejab',
  'Syaaban',
  'Ramadan',
  'Syawal',
  'Zulkaedah',
  'Zulhijjah',
];

export const HIJRI_MONTH_NAMES_EN = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Ula',
  'Jumada al-Akhirah',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qa'dah",
  'Dhu al-Hijjah',
];

export const MALAYSIAN_ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: 'awal_muharram',
    name: 'Awal Muharram (Maal Hijrah)',
    nameEn: 'Awal Muharram (Islamic New Year)',
    nameArabic: 'رأس السنة الهجرية',
    hijriDay: 1,
    hijriMonth: 1,
    hijriMonthName: 'Muharram',
    isHolidayMalaysia: true,
    description: 'Permulaan tahun baru dalam kalendar Hijrah memperingati peristiwa hijrah Nabi Muhammad SAW dari Makkah ke Madinah.',
    descriptionEn: 'The beginning of the Hijri new year commemorating the migration of Prophet Muhammad SAW from Makkah to Madinah.',
    sunnahDeeds: [
      'Membaca Doa Akhir Tahun dan Doa Awal Tahun',
      'Memperbanyakkan puasa sunat sepanjang bulan Muharram',
      'Bermuhasabah dan berazam mempertingkatkan ketaqwaan',
    ],
    sunnahDeedsEn: [
      'Reciting the Year-End and New Year prayers',
      'Observing voluntary fasts throughout Muharram',
      'Self-reflection and resolving to elevate piety',
    ],
  },
  {
    id: 'hari_asyura',
    name: 'Hari Asyura (10 Muharram)',
    nameEn: 'Day of Ashura (10 Muharram)',
    nameArabic: 'يوم عاشوراء',
    hijriDay: 10,
    hijriMonth: 1,
    hijriMonthName: 'Muharram',
    isHolidayMalaysia: false,
    description: 'Hari ke-10 Muharram di mana Nabi Musa AS diselamatkan daripada Firaun. Dianjurkan berpuasa sunat.',
    descriptionEn: 'The 10th of Muharram when Prophet Musa AS was saved from Pharaoh. Voluntary fasting is highly recommended.',
    sunnahDeeds: [
      'Puasa sunat hari ke-9 (Tasu\'a) dan ke-10 (Asyura)',
      'Memperluaskan nafkah kepada ahli keluarga',
      'Memperbanyakkan sedekah dan taubat',
    ],
    sunnahDeedsEn: [
      'Voluntary fasting on the 9th (Tasu\'a) and 10th (Ashura)',
      'Generosity in providing for one\'s family',
      'Abundant charity and sincere repentance',
    ],
  },
  {
    id: 'maulidur_rasul',
    name: 'Maulidur Rasul SAW',
    nameEn: 'Mawlid al-Nabi (Prophet\'s Birthday)',
    nameArabic: 'مولد النبي صلى الله عليه وسلم',
    hijriDay: 12,
    hijriMonth: 3,
    hijriMonthName: 'Rabiulawal',
    isHolidayMalaysia: true,
    description: 'Hari memperingati kelahiran junjungan besar Nabi Muhammad SAW pada 12 Rabiulawal Tahun Gajah.',
    descriptionEn: 'Commemorating the birth of our beloved Prophet Muhammad SAW on 12 Rabi\' al-Awwal in the Year of the Elephant.',
    sunnahDeeds: [
      'Memperbanyakkan selawat dan salam ke atas Baginda SAW',
      'Menghayati sirah dan akhlak Rasulullah',
      'Menghadiri majlis ilmu dan tazkirah',
    ],
    sunnahDeedsEn: [
      'Multiplying salawat and blessings upon the Prophet SAW',
      'Reflecting upon the Seerah and sublime character of Rasulullah',
      'Attending knowledge gatherings and spiritual reminders',
    ],
  },
  {
    id: 'israk_mikraj',
    name: 'Israk dan Mikraj',
    nameEn: 'Isra\' and Mi\'raj',
    nameArabic: 'الإسراء والمعراج',
    hijriDay: 27,
    hijriMonth: 7,
    hijriMonthName: 'Rejab',
    isHolidayMalaysia: true,
    description: 'Perjalanan agung Rasulullah SAW dari Masjidil Haram ke Masjidil Aqsa dan diangkat ke Sidratul Muntaha menerima kefardhuan Solat 5 Waktu.',
    descriptionEn: 'The miraculous journey of Rasulullah SAW from Masjid al-Haram to Masjid al-Aqsa and ascension to Sidrat al-Muntaha, receiving the five daily prayers.',
    sunnahDeeds: [
      'Mempertingkatkan kualiti solat fardhu dan solat sunat',
      'Menghayati hikmah pensyariatan solat lima waktu',
      'Beristighfar dan memperbanyakkan doa di bulan Rejab',
    ],
    sunnahDeedsEn: [
      'Elevating the quality of obligatory and voluntary prayers',
      'Reflecting on the divine wisdom of the 5 daily prayers',
      'Seeking forgiveness (Istighfar) and abundant dua in Rajab',
    ],
  },
  {
    id: 'nisfu_syaaban',
    name: 'Malam Nisfu Syaaban',
    nameEn: 'Night of Mid-Sha\'ban (Nisfu Syaaban)',
    nameArabic: 'ليلة نصف شعبان',
    hijriDay: 15,
    hijriMonth: 8,
    hijriMonthName: 'Syaaban',
    isHolidayMalaysia: false,
    description: 'Malam pertengahan bulan Syaaban yang penuh keberkatan dan pengampunan dosa oleh Allah SWT.',
    descriptionEn: 'The blessed 15th night of Sha\'ban filled with divine mercy and forgiveness from Allah SWT.',
    sunnahDeeds: [
      'Menghidupkan malam dengan solat sunat, tilawah al-Quran dan doa',
      'Membaca Surah Yasin 3 kali dengan niat diberkati umur, rezeki dan husnul khatimah',
      'Berpuasa pada siang harinya',
    ],
    sunnahDeedsEn: [
      'Reviving the night with voluntary prayers, Quran recitation and supplication',
      'Reciting Surah Ya-Sin with sincere intentions for blessed life and sustenance',
      'Fasting during the following day',
    ],
  },
  {
    id: 'awal_ramadan',
    name: 'Awal Ramadan (Hari Pertama Berpuasa)',
    nameEn: 'First Day of Ramadan Fasting',
    nameArabic: 'أول رمضان المبارك',
    hijriDay: 1,
    hijriMonth: 9,
    hijriMonthName: 'Ramadan',
    isHolidayMalaysia: true,
    description: 'Hari pertama umat Islam wajib menunaikan ibadah puasa di bulan Ramadan al-Mubarak.',
    descriptionEn: 'The first day of obligatory fasting in the holy month of Ramadan al-Mubarak.',
    sunnahDeeds: [
      'Berniat puasa sebulan dan setiap malam',
      'Solat sunat Terawih dan Witir berjemaah',
      'Tadarus dan khatam al-Quran',
      'Menyegerakan berbuka dan melewatkan sahur',
    ],
    sunnahDeedsEn: [
      'Formulating the fasting intention for the month and nightly',
      'Taraweeh and Witr congregation prayers',
      'Quran recitation and study',
      'Hastening Iftar and delaying Suhoor',
    ],
  },
  {
    id: 'nuzul_quran',
    name: 'Hari Nuzul Al-Quran',
    nameEn: 'Nuzul Al-Quran Day',
    nameArabic: 'نزول القرآن الكريم',
    hijriDay: 17,
    hijriMonth: 9,
    hijriMonthName: 'Ramadan',
    isHolidayMalaysia: true,
    description: 'Peringatan peristiwa turunnya ayat al-Quran pertama (Surah Al-Alaq 1-5) kepada Nabi Muhammad SAW di Gua Hira\'.',
    descriptionEn: 'Commemoration of the revelation of the first verses of the Holy Quran (Surah Al-Alaq 1-5) in the Cave of Hira.',
    sunnahDeeds: [
      'Memperbanyakkan tilawah dan tadabbur kalamullah',
      'I\'tikaf di masjid terutama pada 10 malam terakhir',
      'Memburu ganjaran Malam Lailatul Qadar',
    ],
    sunnahDeedsEn: [
      'Abundant recitation and contemplation of the Quran',
      'I\'tikaf in the mosque, particularly during the last 10 nights',
      'Seeking the unmatched blessings of Laylatul Qadr',
    ],
  },
  {
    id: 'aidilfitri_1',
    name: 'Hari Raya Aidilfitri (1 Syawal)',
    nameEn: 'Eid al-Fitr (1st Day of Shawwal)',
    nameArabic: 'عيد الفطر المبارك',
    hijriDay: 1,
    hijriMonth: 10,
    hijriMonthName: 'Syawal',
    isHolidayMalaysia: true,
    description: 'Hari kemenangan umat Islam setelah sebulan menyempurnakan ibadah puasa Ramadan.',
    descriptionEn: 'The day of victory and celebration for Muslims upon completing the blessed month of Ramadan.',
    sunnahDeeds: [
      'Membayar Zakat Fitrah sebelum solat Hari Raya',
      'Mengalunkan Takbir Raya bermula terbenam matahari akhir Ramadan',
      'Mandi sunat dan memakai pakaian terbaik yang bersih',
      'Menunaikan Solat Sunat Aidilfitri dan khutbah',
      'Mengeratkan silaturrahim dan memaafkan sesama insan',
    ],
    sunnahDeedsEn: [
      'Discharging Zakat al-Fitr before the Eid prayer',
      'Chanting Takbir Raya starting at sunset of the last day of Ramadan',
      'Performing ritual bath and wearing one\'s best clean attire',
      'Offering the Eid al-Fitr prayer and listening to the sermon',
      'Fostering kinship, forgiving, and visiting loved ones',
    ],
  },
  {
    id: 'aidilfitri_2',
    name: 'Hari Raya Aidilfitri Hari Kedua (2 Syawal)',
    nameEn: 'Eid al-Fitr (2nd Day of Shawwal)',
    nameArabic: 'ثاني أيام عيد الفطر',
    hijriDay: 2,
    hijriMonth: 10,
    hijriMonthName: 'Syawal',
    isHolidayMalaysia: true,
    description: 'Hari kedua sambutan Hari Raya Aidilfitri di Malaysia.',
    descriptionEn: 'The second day of Eid al-Fitr festivities in Malaysia.',
    sunnahDeeds: [
      'Ziarah menziarahi sanak-saudara dan jiran tetangga',
      'Bersedekah dan menjamu makanan',
    ],
    sunnahDeedsEn: [
      'Visiting extended family, friends and neighbors',
      'Giving charity and hosting meals for guests',
    ],
  },
  {
    id: 'hari_arafah',
    name: 'Hari Wukuf / Puasa Sunat Hari Arafah',
    nameEn: 'Day of Arafah (Hajj Wukuf & Fasting)',
    nameArabic: 'يوم عرفة',
    hijriDay: 9,
    hijriMonth: 12,
    hijriMonthName: 'Zulhijjah',
    isHolidayMalaysia: true,
    description: 'Kemuncak ibadah Haji wukuf di Arafah. Sangat dianjurkan berpuasa bagi orang yang tidak mengerjakan haji.',
    descriptionEn: 'The pinnacle of the Hajj pilgrimage at Mount Arafah. Voluntary fasting is immensely rewarding for non-pilgrims.',
    sunnahDeeds: [
      'Berpuasa Sunat Hari Arafah (menghapuskan dosa setahun lalu dan setahun akan datang)',
      'Memperbanyakkan doa, zikir La ilaha illallah dan istighfar',
    ],
    sunnahDeedsEn: [
      'Fasting on the Day of Arafah (expiating sins of the previous and coming year)',
      'Prolific supplication, Istighfar and reciting the best Dhikr',
    ],
  },
  {
    id: 'aidiladha',
    name: 'Hari Raya Aidiladha (Hari Raya Korban)',
    nameEn: 'Eid al-Adha (Feast of Sacrifice)',
    nameArabic: 'عيد الأضحى المبارك',
    hijriDay: 10,
    hijriMonth: 12,
    hijriMonthName: 'Zulhijjah',
    isHolidayMalaysia: true,
    description: 'Hari Raya Korban memperingati pengorbanan Nabi Ibrahim AS dan Nabi Ismail AS.',
    descriptionEn: 'The Feast of Sacrifice commemorating the devotion of Prophet Ibrahim AS and Prophet Ismail AS.',
    sunnahDeeds: [
      'Mengumandangkan Takbir Muqayyad selepas setiap solat fardhu sehingga Asar 13 Zulhijjah',
      'Solat Sunat Aidiladha',
      'Melaksanakan ibadah korban dan mengagihkan daging kepada fakir miskin',
    ],
    sunnahDeedsEn: [
      'Chanting Takbir Muqayyad after each fardhu prayer until Asr on 13 Dhu al-Hijjah',
      'Attending Eid al-Adha congregational prayer',
      'Performing Qurbani sacrifice and distributing meat to the needy',
    ],
  },
  {
    id: 'tasyrik',
    name: 'Hari-Hari Tasyrik (11, 12, 13 Zulhijjah)',
    nameEn: 'Days of Tashreeq (11, 12, 13 Dhu al-Hijjah)',
    nameArabic: 'أيام التشريق',
    hijriDay: 11,
    hijriMonth: 12,
    hijriMonthName: 'Zulhijjah',
    isHolidayMalaysia: false,
    description: 'Tiga hari selepas Aidiladha di mana diharamkan berpuasa dan disunatkan makan minum serta bertakbir.',
    descriptionEn: 'Three days following Eid al-Adha when fasting is forbidden and eating, drinking, and glorifying Allah are prescribed.',
    sunnahDeeds: [
      'Menyembelih korban',
      'Melaungkan takbir selepas solat fardhu',
      'Diharamkan berpuasa pada hari-hari ini',
    ],
    sunnahDeedsEn: [
      'Continuing Qurbani sacrifice rituals',
      'Proclaiming Takbir after obligatory prayers',
      'Fasting is prohibited during these days',
    ],
  },
];

export interface TakbirRayaData {
  title: string;
  titleEn?: string;
  arabicFull: string[];
  rumiFull: string[];
  translationMalay: string[];
  translationEnglish?: string[];
  virtue: string;
  virtueEn?: string;
}

export const TAKBIR_RAYA_DATA: TakbirRayaData = {
  title: 'Alunan Takbir Hari Raya (Aidilfitri & Aidiladha)',
  titleEn: 'Eid Takbir Recitation (Aidilfitri & Aidiladha)',
  arabicFull: [
    'اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ، اللهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ.',
    'اللهُ أَكْبَرُ كَبِيرًا، وَالْحَمْدُ لِلَّهِ كَثِيرًا، وَسُبْحَانَ اللهِ بُكْرَةً وَأَصِيلًا.',
    'لَا إِلَهَ إِلَّا اللهُ وَلَا نَعْبُدُ إِلَّا إِيَّاهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ.',
    'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ، صَدَقَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَأَعَزَّ جُنْدَهُ وَهَزَمَ الْأَحْزَابَ وَحْدَهُ.',
    'لَا إِلَهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ، اللهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ.',
  ],
  rumiFull: [
    'Allahu Akbar, Allahu Akbar, Allahu Akbar. La ilaha illallahu wallahu Akbar. Allahu Akbar wa lillahil-hamd.',
    'Allahu Akbaru kabira, wal-hamdu lillahi kathira, wa Subhanallahi bukrataw-wa-asila.',
    'La ilaha illallahu wa la na\'budu illa iyyah, mukhlisina lahud-dina walaw karihal-kafirun.',
    'La ilaha illallahu wahdah, sadaqa wa\'dah, wa nasara \'abdah, wa a\'azza jundahu wa hazamal-ahzaba wahdah.',
    'La ilaha illallahu wallahu Akbar, Allahu Akbar wa lillahil-hamd.',
  ],
  translationMalay: [
    'Allah Maha Besar, Allah Maha Besar, Allah Maha Besar. Tiada Tuhan melainkan Allah, dan Allah Maha Besar. Allah Maha Besar dan bagi Allah segala puji-pujian.',
    'Allah Maha Besar sebesar-besarnya, dan segala puji bagi Allah sebanyak-banyaknya, dan Maha Suci Allah pada waktu pagi dan petang.',
    'Tiada Tuhan melainkan Allah, dan kami tidak menyembah melainkan kepada-Nya dengan ikhlas menjalankan agama, walaupun orang-orang kafir membencinya.',
    'Tiada Tuhan melainkan Allah yang Maha Esa, yang menepati janji-Nya, menolong hamba-Nya, memuliakan tentera-Nya, dan mengalahkan musuh-musuh sekutu dengan sendirinya.',
    'Tiada Tuhan melainkan Allah dan Allah Maha Besar, Allah Maha Besar dan bagi Allah segala puji-pujian.',
  ],
  translationEnglish: [
    'Allah is the Greatest, Allah is the Greatest, Allah is the Greatest. There is no deity except Allah, and Allah is the Greatest. Allah is the Greatest and all praise belongs to Allah.',
    'Allah is truly the Greatest, abundant praise belongs to Allah, and glory be to Allah morning and evening.',
    'There is no deity except Allah, and we worship none but Him, dedicating our faith purely to Him even if disbelievers detest it.',
    'There is no deity except Allah alone; He fulfilled His promise, granted victory to His servant, honored His troops, and defeated the factions alone.',
    'There is no deity except Allah and Allah is the Greatest; Allah is the Greatest and all praise belongs to Allah.',
  ],
  virtue:
    'Disunatkan melaungkan takbir bagi Hari Raya Aidilfitri bermula terbenam matahari akhir Ramadan hingga imam memulakan solat sunat Aidilfitri. Bagi Hari Raya Aidiladha, Takbir Muqayyad disunatkan selepas setiap solat fardhu bermula Subuh Hari Arafah (9 Zulhijjah) sehingga waktu Asar Hari Tasyrik terakhir (13 Zulhijjah).',
  virtueEn:
    'It is recommended to recite Takbir for Eid al-Fitr starting at sunset of the final Ramadan day until the imam commences the Eid prayer. For Eid al-Adha, Takbir Muqayyad is recited after every fardhu prayer from Fajr of the Day of Arafah (9 Dhu al-Hijjah) until Asr on the final Day of Tashreeq (13 Dhu al-Hijjah).',
};
