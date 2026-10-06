export interface MusafirTopic {
  id: string;
  title: string;
  titleEn?: string;
  summary: string;
  summaryEn?: string;
  points: string[];
  pointsEn?: string[];
  intentFormulas?: {
    prayer: string;
    prayerEn?: string;
    type: string;
    typeEn?: string;
    arabic: string;
    rumi: string;
    translation: string;
    translationEn?: string;
  }[];
}

export const MUSAFIR_GUIDE: MusafirTopic[] = [
  {
    id: 'syarat_musafir',
    title: 'Syarat-Syarat Keharusan Solat Jamak & Qasar',
    titleEn: 'Conditions for Permissibility of Jamak & Qasar Prayers',
    summary: 'Rukhsah (keringanan) solat semasa bermusafir menurut Mazhab Syafi\'i sah dengan syarat berikut:',
    summaryEn: 'Rukhsah (concession) for prayers while traveling according to the Shafi\'i school is valid under the following conditions:',
    points: [
      'Perjalanan melebihi 2 Marhalah: bersamaan sekurang-kurangnya 81 km (atau kira-kira 89 km menurut sebahagian ulama kontemporari).',
      'Tujuan musafir mestilah harus atau baik (bukan untuk maksiat atau kemungkaran).',
      'Telah keluar melepasi sempadan kariah/taman perumahan tempat tinggal sebelum memulakan jamak/qasar.',
      'Mengetahui destinasi yang dituju secara pasti, bukan merayau-rayau tanpa hala tuju.',
      'Masih dalam keadaan musafir sehingga takbiratul ihram solat kedua selesai (bagi Jamak).',
      'Tidak mengikut imam yang solat sempurna (Tamam) jika hendak berqasar.',
    ],
    pointsEn: [
      'Travel distance exceeds 2 Marhalah: equivalent to at least 81 km (or approx. 89 km according to contemporary scholars).',
      'The purpose of journey must be permissible or righteous (not for sins or vice).',
      'Having crossed the residential boundary/town outskirts of one\'s origin before beginning shortened/combined prayer.',
      'Definite knowledge of destination, not wandering aimlessly without a goal.',
      'Remaining in traveler status until the opening Takbir (Takbiratul Ihram) of the second prayer (for Jamak).',
      'Not following an imam who is performing the full prayer (Tamam) when shortening (Qasar).',
    ],
  },
  {
    id: 'jamak_taqdim',
    title: 'Panduan Jamak Taqdim (Himpun di Waktu Pertama)',
    titleEn: 'Guide to Jamak Taqdim (Combined in 1st Prayer Time)',
    summary: 'Menghimpunkan solat Zohor & Asar di dalam waktu Zohor, ATAU Maghrib & Isyak di dalam waktu Maghrib.',
    summaryEn: 'Combining Dhuhr & Asr within Dhuhr time, OR Maghrib & Isha within Maghrib time.',
    points: [
      'Tertib: Memulakan solat waktu pertama terlebih dahulu (cth: tunaikan Zohor dahulu, diikuti Asar).',
      'Niat Jamak di dalam solat pertama: Hendaklah berniat menghimpunkan solat kedua semasa takbiratul ihram atau sebelum memberi salam solat pertama.',
      'Muwalat (Berturut-turut): Tidak boleh diselangi masa yang panjang antara solat pertama dan kedua.',
      'Kekal berstatus musafir sehingga mengangkat takbir solat kedua.',
    ],
    pointsEn: [
      'Order: Begin with the earlier prayer first (e.g. pray Dhuhr first, followed immediately by Asr).',
      'Intention in first prayer: Make the intention to combine the second prayer during Takbiratul Ihram or before ending the first prayer.',
      'Continuity (Muwalat): No prolonged interval or excessive gap between the two prayers.',
      'Remain a traveler until entering the second prayer.',
    ],
    intentFormulas: [
      {
        prayer: 'Zohor & Asar',
        prayerEn: 'Dhuhr & Asr',
        type: 'Jamak Taqdim & Qasar',
        typeEn: 'Jamak Taqdim & Qasar',
        arabic: 'أُصَلِّي فَرْضَ الظُّهْرِ رَكْعَتَيْنِ قَصْرًا مَجْمُوعًا إِلَيْهِ الْعَصْرُ جَمْعَ تَقْدِيمٍ لِلَّهِ تَعَالَى',
        rumi: 'Usolli fardhaz-zuhri rak\'ataini qasran majmu\'an ilaihil-\'asru jam\'a taqdimin lillahi Ta\'ala',
        translation: 'Sahaja aku solat fardhu Zohor dua rakaat qasar dihimpunkan kepadanya Asar jamak taqdim kerana Allah Taala.',
        translationEn: 'I intend to pray the obligatory Dhuhr prayer, two rak\'ahs shortened (Qasar), combining with Asr (Jamak Taqdim), for the sake of Allah the Almighty.',
      },
      {
        prayer: 'Maghrib & Isyak',
        prayerEn: 'Maghrib & Isha',
        type: 'Jamak Taqdim',
        typeEn: 'Jamak Taqdim',
        arabic: 'أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مَجْمُوعًا إِلَيْهِ الْعِشَاءُ جَمْعَ تَقْدِيمٍ لِلَّهِ تَعَالَى',
        rumi: 'Usolli fardhal-maghribi thalatha raka\'atin majmu\'an ilaihil-\'isya\'u jam\'a taqdimin lillahi Ta\'ala',
        translation: 'Sahaja aku solat fardhu Maghrib tiga rakaat dihimpunkan kepadanya Isyak jamak taqdim kerana Allah Taala.',
        translationEn: 'I intend to pray the obligatory Maghrib prayer, three rak\'ahs, combining with Isha (Jamak Taqdim), for the sake of Allah the Almighty.',
      },
    ],
  },
  {
    id: 'jamak_takhir',
    title: 'Panduan Jamak Takhir (Himpun di Waktu Kedua)',
    titleEn: 'Guide to Jamak Takhir (Combined in 2nd Prayer Time)',
    summary: 'Menghimpunkan solat Zohor & Asar di dalam waktu Asar, ATAU Maghrib & Isyak di dalam waktu Isyak.',
    summaryEn: 'Combining Dhuhr & Asr within Asr time, OR Maghrib & Isha within Isha time.',
    points: [
      'Berniat Jamak Takhir dalam waktu pertama: Sebelum habis waktu pertama (cth: sebelum masuk Asar), berniat dalam hati untuk menangguhkan Zohor ke waktu Asar.',
      'Tidak disyaratkan tertib: Boleh mendahulukan Zohor atau Asar, namun mendahulukan solat empunya waktu (Zohor dahulu) adalah lebih afdhal.',
      'Tidak disyaratkan muwalat berturut-turut (namun sunat berturut-turut).',
      'Kekal berstatus musafir sehingga selesai kedua-dua solat.',
    ],
    pointsEn: [
      'Intention during first prayer period: Before the first prayer time expires (e.g. before Asr enters), make the intention to postpone Dhuhr to Asr time.',
      'Strict order not mandatory: Either prayer can be offered first, although performing the first prayer (Dhuhr) first is preferred (afdhal).',
      'Immediate continuity not strictly required (though recommended).',
      'Remain a traveler until both prayers are concluded.',
    ],
    intentFormulas: [
      {
        prayer: 'Zohor & Asar',
        prayerEn: 'Dhuhr & Asr',
        type: 'Jamak Takhir & Qasar',
        typeEn: 'Jamak Takhir & Qasar',
        arabic: 'أُصَلِّي فَرْضَ الظُّهْرِ رَكْعَتَيْنِ قَصْرًا مَجْمُوعًا إِلَى الْعَصْرِ جَمْعَ تَأْخِيرٍ لِلَّهِ تَعَالَى',
        rumi: 'Usolli fardhaz-zuhri rak\'ataini qasran majmu\'an ilal-\'asri jam\'a ta\'khirin lillahi Ta\'ala',
        translation: 'Sahaja aku solat fardhu Zohor dua rakaat qasar dihimpunkan kepada Asar jamak takhir kerana Allah Taala.',
        translationEn: 'I intend to pray the obligatory Dhuhr prayer, two rak\'ahs shortened (Qasar), combined into Asr (Jamak Takhir), for the sake of Allah the Almighty.',
      },
      {
        prayer: 'Maghrib & Isyak',
        prayerEn: 'Maghrib & Isha',
        type: 'Jamak Takhir & Qasar',
        typeEn: 'Jamak Takhir & Qasar',
        arabic: 'أُصَلِّي فَرْضَ الْعِشَاءِ رَكْعَتَيْنِ قَصْرًا مَجْمُوعًا إِلَيْهِ الْمَغْرِبُ جَمْعَ تَأْخِيرٍ لِلَّهِ تَعَالَى',
        rumi: 'Usolli fardhal-\'isya\'i rak\'ataini qasran majmu\'an ilaihil-maghribu jam\'a ta\'khirin lillahi Ta\'ala',
        translation: 'Sahaja aku solat fardhu Isyak dua rakaat qasar dihimpunkan kepadanya Maghrib jamak takhir kerana Allah Taala.',
        translationEn: 'I intend to pray the obligatory Isha prayer, two rak\'ahs shortened (Qasar), combined with Maghrib (Jamak Takhir), for the sake of Allah the Almighty.',
      },
    ],
  },
  {
    id: 'tempoh_musafir',
    title: 'Ketetapan Tempoh Musafir di Destinasi',
    titleEn: 'Duration of Traveler Status at Destination',
    summary: 'Berapa lamakah seorang musafir boleh menunaikan solat Jamak dan Qasar apabila tiba di tempat dituju?',
    summaryEn: 'How long can a traveler perform Jamak and Qasar prayers upon reaching their destination?',
    points: [
      'Niat menetap 4 hari penuh atau lebih (tidak termasuk hari sampai & hari pulang): Terputus rukhsah sebaik tiba di tempat dituju, wajib solat sempurna.',
      'Niat menetap kurang daripada 4 hari penuh: Diharuskan jamak dan qasar sepanjang tempoh tersebut (maksimum 3 hari tidak kira hari tiba dan berlepas).',
      'Tidak pasti bila urusan selesai: Boleh menjamak dan mengqasarkan solat sehingga 18 hari jika menjangkakan urusan boleh selesai bila-bila masa.',
    ],
    pointsEn: [
      'Intention to stay 4 complete days or more (excluding arrival & departure days): The concession terminates upon arrival at destination; full prayers (Tamam) are required.',
      'Intention to stay less than 4 complete days: Jamak and Qasar are permitted for the duration (maximum 3 days excluding arrival & departure).',
      'Uncertain duration of business: May combine and shorten prayers for up to 18 days if anticipating completion at any moment.',
    ],
  },
];
