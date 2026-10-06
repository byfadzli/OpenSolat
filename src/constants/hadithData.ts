export interface HadithItem {
  id: string;
  category: 'Solat' | 'Akhlak' | 'Niat' | 'Puasa' | 'Zikir & Doa' | 'Kebaikan';
  categoryEn?: string;
  arabic: string;
  malay: string;
  english?: string;
  sourceAuthority: string;
  narrator: string;
  narratorEn?: string;
  status: string;
  statusEn?: string;
  lessons: string[];
  lessonsEn?: string[];
}

export const AUTHENTICATED_JAKIM_HADITH: HadithItem[] = [
  {
    id: 'hadith_01',
    category: 'Niat',
    categoryEn: 'Intention',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    malay: 'Sesungguhnya setiap amalan itu bergantung kepada niat, dan sesungguhnya bagi setiap orang apa yang dia niatkan.',
    english: 'Actions are according to intentions, and every person will get what he intended.',
    sourceAuthority: 'JAKIM e-Maktabah / Sahih Bukhari (No. 1) & Sahih Muslim (No. 1907)',
    narrator: 'Diriwayatkan daripada Amirul Mukminin Umar Al-Khattab RA',
    narratorEn: 'Narrated by the Commander of the Faithful, Umar ibn al-Khattab RA',
    status: 'Sahih (Muttafaq \'Alaih)',
    statusEn: 'Authentic (Agreed Upon)',
    lessons: [
      'Niat ikhlas adalah asas penerimaan semua amalan ibadah di sisi Allah SWT.',
      'Amalan yang zahirnya bernilai duniawi boleh menjadi ibadah yang berpahala dengan niat yang soleh.',
      'Menjauhi riyak (menunjuk-nunjuk) dan ujub dalam menuntut keredhaan Allah.',
    ],
    lessonsEn: [
      'Sincere intention is the foundation for the acceptance of all worship deeds by Allah SWT.',
      'Worldly actions can turn into rewarded acts of worship with righteous intentions.',
      'Avoid ostentation (showing off) and arrogance in seeking Allah\'s pleasure.',
    ],
  },
  {
    id: 'hadith_02',
    category: 'Solat',
    categoryEn: 'Prayer',
    arabic: 'الصَّلَوَاتُ الْخَمْسُ وَالْجُمُعَةُ إِلَى الْجُمُعَةِ وَرَمَضَانُ إِلَى رَمَضَانَ مُكَفِّرَاتٌ مَا بَيْنَهُنَّ إِذَا اجْتُنِبَتِ الْكَبَائِرُ',
    malay: 'Solat fardhu lima waktu, antara satu Jumaat ke satu Jumaat yang lain, dan antara Ramadan ke Ramadan berikutnya adalah penghapus bagi dosa-dosa kecil di antaranya selama mana dijauhi dosa-dosa besar.',
    english: 'The five daily prayers, Friday to Friday, and Ramadan to Ramadan are an expiation for what is between them, as long as major sins are avoided.',
    sourceAuthority: 'Jabatan Kemajuan Islam Malaysia (JAKIM) e-Hadith / Sahih Muslim (No. 233)',
    narrator: 'Diriwayatkan daripada Abu Hurairah RA',
    narratorEn: 'Narrated by Abu Hurairah RA',
    status: 'Sahih',
    statusEn: 'Authentic',
    lessons: [
      'Kemuliaan solat lima waktu sebagai pembersih jiwa dan penghapus dosa-dosa harian.',
      'Ganjaran istimewa menghadiri Solat Jumaat dan menyempurnakan Ramadan.',
      'Dosa besar memerlukan taubat nasuha yang bersungguh-sungguh.',
    ],
    lessonsEn: [
      'The nobility of the five daily prayers as a purifier of the soul and expiation of daily minor sins.',
      'Special spiritual rewards for attending Friday prayers and completing Ramadan.',
      'Major sins require sincere and dedicated repentance (Tawbah Nasuha).',
    ],
  },
  {
    id: 'hadith_03',
    category: 'Solat',
    categoryEn: 'Prayer',
    arabic: 'أَحَبُّ الْأَعْمَالِ إِلَى اللهِ الصَّلَاةُ عَلَى وَقْتِهَا، ثُمَّ بِرُّ الْوَالِدَيْنِ، ثُمَّ الْجِهَادُ فِي سَبِيلِ اللهِ',
    malay: 'Amalan yang paling dicintai di sisi Allah adalah menunaikan solat pada awal waktunya, kemudian berbakti kepada kedua ibu bapa, kemudian berjihad pada jalan Allah.',
    english: 'The deeds most beloved to Allah are: performing prayer on its time, then being good and dutiful to parents, then striving in the cause of Allah.',
    sourceAuthority: 'Pejabat Mufti Wilayah Persekutuan (Bayan Linnas) / Sahih al-Bukhari (No. 527) & Muslim (No. 85)',
    narrator: 'Diriwayatkan daripada Abdullah bin Mas\'ud RA',
    narratorEn: 'Narrated by Abdullah ibn Mas\'ud RA',
    status: 'Sahih',
    statusEn: 'Authentic',
    lessons: [
      'Keutamaan mendirikan solat tepat pada waktunya berbanding menangguhkannya.',
      'Tinggi dan mulianya kedudukan berbakti serta menggembirakan hati ibu bapa.',
      'Menjaga disiplin masa ibadah melahirkan peribadi Muslim yang cemerlang.',
    ],
    lessonsEn: [
      'The supreme virtue of establishing prayer on time rather than delaying it.',
      'The noble and lofty status of honoring and bringing joy to parents.',
      'Upholding punctual prayer discipline fosters exemplary Muslim character.',
    ],
  },
  {
    id: 'hadith_04',
    category: 'Zikir & Doa',
    categoryEn: 'Zikir & Dua',
    arabic: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ الْعَظِيمِ',
    malay: 'Dua kalimah yang ringan di atas lidah, berat pada timbangan amal (Mizan), dan sangat dicintai oleh Allah yang Maha Pemurah: Subhanallahi wa bihamdih, Subhanallahil-Adzim.',
    english: 'Two phrases that are light on the tongue, heavy in the Balance, and beloved to the Most Merciful: Subhanallahi wa bihamdihi, Subhanallahil-Azim.',
    sourceAuthority: 'JAKIM e-Hadith / Sahih al-Bukhari (No. 6406) & Muslim (No. 2694)',
    narrator: 'Diriwayatkan daripada Abu Hurairah RA',
    narratorEn: 'Narrated by Abu Hurairah RA',
    status: 'Sahih (Muttafaq \'Alaih)',
    statusEn: 'Authentic (Agreed Upon)',
    lessons: [
      'Kemurahan rahmat Allah yang melipatgandakan pahala pada amalan yang mudah diamalkan.',
      'Anjuran membasahi lidah dengan tasbih dan tahmid sepanjang masa terluang.',
      'Pemberat timbangan kebajikan di Padang Mahsyar kelak.',
    ],
    lessonsEn: [
      'The vast mercy of Allah in multiplying great rewards for effortless deeds.',
      'Encouragement to keep the tongue moist with tasbih and praise of Allah at all times.',
      'Heavy weights in the scale of good deeds on the Day of Judgment.',
    ],
  },
  {
    id: 'hadith_05',
    category: 'Akhlak',
    categoryEn: 'Morals',
    arabic: 'إِنَّ مِنْ أَحَبِّكُمْ إِلَيَّ وَأَقْرَبِكُمْ مِنِّي مَجْلِسًا يَوْمَ الْقِيَامَةِ أَحَاسِنَكُمْ أَخْلَاقًا',
    malay: 'Sesungguhnya orang yang paling aku kasihi di antara kamu dan yang paling dekat tempat duduknya denganku pada hari kiamat adalah orang yang paling baik akhlaknya dalam kalangan kamu.',
    english: 'Indeed, the most beloved of you to me and the closest of you to me on the Day of Resurrection will be those of you who have the best character.',
    sourceAuthority: 'Koleksi Hadith Sahih JAKIM / Sunan al-Tirmidhi (No. 2018), dinilai Hasan Sahih',
    narrator: 'Diriwayatkan daripada Jabir bin Abdillah RA',
    narratorEn: 'Narrated by Jabir ibn Abdillah RA',
    status: 'Hasan Sahih',
    statusEn: 'Good Authentic (Hasan Sahih)',
    lessons: [
      'Akhlak mulia mencerminkan kesempurnaan iman seseorang hamba.',
      'Berlemah lembut, santun tutur kata, dan menjauhi permusuhan sesama manusia.',
      'Jaminan kebersamaan bersama Rasulullah SAW di syurga bagi yang berakhlak terpuji.',
    ],
    lessonsEn: [
      'Noble character reflects the perfection and depth of faith.',
      'Being gentle, gracious in speech, and avoiding conflict among people.',
      'Promise of proximity to the Prophet SAW in Paradise for those of sublime character.',
    ],
  },
  {
    id: 'hadith_06',
    category: 'Puasa',
    categoryEn: 'Fasting',
    arabic: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    malay: 'Barangsiapa yang berpuasa Ramadan dengan penuh keimanan dan mengharapkan pahala keredhaan Allah, nescaya diampunkan dosa-dosanya yang telah lalu.',
    english: 'Whoever fasts Ramadan out of sincere faith and in the hope of reward from Allah, his previous sins will be forgiven.',
    sourceAuthority: 'Jabatan Agama Islam Wilayah Persekutuan (JAWI) / Sahih al-Bukhari (No. 38)',
    narrator: 'Diriwayatkan daripada Abu Hurairah RA',
    narratorEn: 'Narrated by Abu Hurairah RA',
    status: 'Sahih',
    statusEn: 'Authentic',
    lessons: [
      'Puasa bukan sekadar menahan lapar dan dahaga, tetapi menjaga seluruh pancaindera daripada maksiat.',
      'Ihtisab iaitu mengharap ganjaran semata-mata daripada Allah SWT tanpa keluh kesah.',
      'Kelebihan pengampunan dosa secara menyeluruh bagi yang menghidupkan Ramadan.',
    ],
    lessonsEn: [
      'Fasting is not just abstaining from food and drink, but guarding all senses from transgression.',
      'Ihtisab means anticipating rewards solely from Allah without complaint.',
      'Complete forgiveness of past minor sins for revitalizing Ramadan.',
    ],
  },
  {
    id: 'hadith_07',
    category: 'Kebaikan',
    categoryEn: 'Kindness',
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    malay: 'Tidak sempurna iman seseorang daripada kamu sehinggalah dia menyayangi untuk saudaranya apa yang dia sayangi untuk dirinya sendiri.',
    english: 'None of you truly believes until he loves for his brother what he loves for himself.',
    sourceAuthority: 'JAKIM e-Maktabah / Sahih al-Bukhari (No. 13) & Muslim (No. 45)',
    narrator: 'Diriwayatkan daripada Anas bin Malik RA',
    narratorEn: 'Narrated by Anas ibn Malik RA',
    status: 'Sahih (Muttafaq \'Alaih)',
    statusEn: 'Authentic (Agreed Upon)',
    lessons: [
      'Kepentingan memperkukuh tali persaudaraan sesama Muslim tanpa hasad dengki.',
      'Gembira melihat nikmat dan kebaikan yang dikurniakan Allah kepada orang lain.',
      'Sentiasa membantu dan prihatin terhadap kesusahan saudara seagama.',
    ],
    lessonsEn: [
      'The importance of strengthening brotherhood among Muslims without envy.',
      'Rejoicing in the blessings and goodness bestowed by Allah upon others.',
      'Always assisting and showing compassion for the hardships of fellow believers.',
    ],
  },
  {
    id: 'hadith_08',
    category: 'Zikir & Doa',
    categoryEn: 'Zikir & Dua',
    arabic: 'مَنْ قَالَ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ فِي يَوْمٍ مِائَةَ مَرَّةٍ حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ',
    malay: 'Barangsiapa yang membaca Subhanallahi wa bihamdih 100 kali dalam sehari, nescaya dihapuskan segala kesalahannya walaupun sebanyak buih di lautan.',
    english: 'Whoever says "Subhanallahi wa bihamdihi" 100 times a day will have his sins wiped away, even if they are like the foam of the sea.',
    sourceAuthority: 'JAKIM e-Hadith / Sahih al-Bukhari (No. 6405) & Muslim (No. 2691)',
    narrator: 'Diriwayatkan daripada Abu Hurairah RA',
    narratorEn: 'Narrated by Abu Hurairah RA',
    status: 'Sahih',
    statusEn: 'Authentic',
    lessons: [
      'Fadhilat istimewa mengamalkan tasbih 100 kali setiap pagi dan petang.',
      'Rahmat keampunan Allah yang Maha Luas melampaui dosa-dosa kecil hamba-Nya.',
      'Dapat diamalkan dengan mudah menggunakan tasbih digital pada bila-bila masa.',
    ],
    lessonsEn: [
      'Special virtues of reciting tasbih 100 times every morning and evening.',
      'The immense mercy of Allah forgiving sins for easy daily remembrance.',
      'Conveniently practiced at any moment using digital tasbih.',
    ],
  },
];
