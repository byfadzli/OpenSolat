export interface JakimZone {
  code: string;
  state: string;
  locations: string;
  latitude: number;
  longitude: number;
}

export const JAKIM_ZONES: JakimZone[] = [
  // Wilayah Persekutuan
  {
    code: 'WLY01',
    state: 'Wilayah Persekutuan',
    locations: 'Kuala Lumpur, Putrajaya',
    latitude: 3.139,
    longitude: 101.6869,
  },
  {
    code: 'WLY02',
    state: 'Wilayah Persekutuan',
    locations: 'Labuan',
    latitude: 5.2831,
    longitude: 115.2308,
  },

  // Selangor
  {
    code: 'SGR01',
    state: 'Selangor',
    locations: 'Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, Shah Alam',
    latitude: 3.0738,
    longitude: 101.5183,
  },
  {
    code: 'SGR02',
    state: 'Selangor',
    locations: 'Kuala Selangor, Sabak Bernam',
    latitude: 3.3444,
    longitude: 101.2568,
  },
  {
    code: 'SGR03',
    state: 'Selangor',
    locations: 'Klang, Kuala Langat',
    latitude: 3.0449,
    longitude: 101.4456,
  },

  // Johor
  {
    code: 'JHR01',
    state: 'Johor',
    locations: 'Pulau Aur dan Pulau Pemanggil',
    latitude: 2.446,
    longitude: 104.519,
  },
  {
    code: 'JHR02',
    state: 'Johor',
    locations: 'Johor Bahru, Kota Tinggi, Pasir Gudang, Kulai',
    latitude: 1.4927,
    longitude: 103.7414,
  },
  {
    code: 'JHR03',
    state: 'Johor',
    locations: 'Kluang, Pontian',
    latitude: 2.0306,
    longitude: 103.3189,
  },
  {
    code: 'JHR04',
    state: 'Johor',
    locations: 'Batu Pahat, Muar, Segamat, Tangkak',
    latitude: 1.8548,
    longitude: 102.9325,
  },

  // Kedah
  {
    code: 'KDH01',
    state: 'Kedah',
    locations: 'Kota Setar, Kubang Pasu, Pokok Sena (Bandar Alor Setar)',
    latitude: 6.1248,
    longitude: 100.3678,
  },
  {
    code: 'KDH02',
    state: 'Kedah',
    locations: 'Kuala Muda, Yan, Pendang',
    latitude: 5.647,
    longitude: 100.4877,
  },
  {
    code: 'KDH03',
    state: 'Kedah',
    locations: 'Padang Terap, Sik',
    latitude: 6.208,
    longitude: 100.706,
  },
  {
    code: 'KDH04',
    state: 'Kedah',
    locations: 'Baling',
    latitude: 5.6766,
    longitude: 100.9167,
  },
  {
    code: 'KDH05',
    state: 'Kedah',
    locations: 'Bandar Baharu, Kulim',
    latitude: 5.3718,
    longitude: 100.5546,
  },
  {
    code: 'KDH06',
    state: 'Kedah',
    locations: 'Langkawi',
    latitude: 6.35,
    longitude: 99.8,
  },
  {
    code: 'KDH07',
    state: 'Kedah',
    locations: 'Puncak Gunung Jerai',
    latitude: 5.795,
    longitude: 100.434,
  },

  // Kelantan
  {
    code: 'KTN01',
    state: 'Kelantan',
    locations: 'Bachok, Kota Bharu, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Kuala Krai, Mukim Chiku',
    latitude: 6.1254,
    longitude: 102.2386,
  },
  {
    code: 'KTN02',
    state: 'Kelantan',
    locations: 'Gua Musang (Mukim Galas dan Bertam), Jeli',
    latitude: 4.8823,
    longitude: 101.9644,
  },

  // Melaka
  {
    code: 'MLK01',
    state: 'Melaka',
    locations: 'Seluruh Negeri Melaka',
    latitude: 2.1896,
    longitude: 102.2501,
  },

  // Negeri Sembilan
  {
    code: 'NGS01',
    state: 'Negeri Sembilan',
    locations: 'Tampin, Jempol',
    latitude: 2.4701,
    longitude: 102.2302,
  },
  {
    code: 'NGS02',
    state: 'Negeri Sembilan',
    locations: 'Jelebu, Kuala Pilah, Port Dickson, Rembau, Seremban',
    latitude: 2.7258,
    longitude: 101.9424,
  },

  // Pahang
  {
    code: 'PHG01',
    state: 'Pahang',
    locations: 'Pulau Tioman',
    latitude: 2.7904,
    longitude: 104.1698,
  },
  {
    code: 'PHG02',
    state: 'Pahang',
    locations: 'Kuantan, Pekan, Rompin, Muadzam Shah',
    latitude: 3.8077,
    longitude: 103.326,
  },
  {
    code: 'PHG03',
    state: 'Pahang',
    locations: 'Jerantut, Temerloh, Maran, Bera, Chenor, Jengka',
    latitude: 3.4506,
    longitude: 102.4175,
  },
  {
    code: 'PHG04',
    state: 'Pahang',
    locations: 'Bentong, Lipis, Raub',
    latitude: 3.5222,
    longitude: 101.9085,
  },
  {
    code: 'PHG05',
    state: 'Pahang',
    locations: 'Genting Sempah, Janda Baik, Bukit Tinggi',
    latitude: 3.3135,
    longitude: 101.8654,
  },
  {
    code: 'PHG06',
    state: 'Pahang',
    locations: 'Cameron Highlands, Genting Highlands, Bukit Fraser',
    latitude: 4.4716,
    longitude: 101.3764,
  },

  // Perlis
  {
    code: 'PLS01',
    state: 'Perlis',
    locations: 'Kangar, Padang Besar, Arau',
    latitude: 6.4449,
    longitude: 100.1986,
  },

  // Pulau Pinang
  {
    code: 'PNG01',
    state: 'Pulau Pinang',
    locations: 'Seluruh Negeri Pulau Pinang',
    latitude: 5.4164,
    longitude: 100.3327,
  },

  // Perak
  {
    code: 'PRK01',
    state: 'Perak',
    locations: 'Tapah, Slim River, Tanjung Malim',
    latitude: 4.1983,
    longitude: 101.2588,
  },
  {
    code: 'PRK02',
    state: 'Perak',
    locations: 'Kuala Kangsar, Sg. Siput, Ipoh, Batu Gajah, Kampar',
    latitude: 4.5975,
    longitude: 101.0901,
  },
  {
    code: 'PRK03',
    state: 'Perak',
    locations: 'Lenggong, Pengkalan Hulu, Grik',
    latitude: 5.429,
    longitude: 101.129,
  },
  {
    code: 'PRK04',
    state: 'Perak',
    locations: 'Temengor, Belum',
    latitude: 5.568,
    longitude: 101.354,
  },
  {
    code: 'PRK05',
    state: 'Perak',
    locations: 'Teluk Intan, Bagan Datuk, Kg. Gajah, Seri Iskandar, Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor',
    latitude: 4.0259,
    longitude: 101.0213,
  },
  {
    code: 'PRK06',
    state: 'Perak',
    locations: 'Selama, Taiping, Bagan Serai, Parit Buntar',
    latitude: 4.85,
    longitude: 100.7333,
  },
  {
    code: 'PRK07',
    state: 'Perak',
    locations: 'Bukit Larut',
    latitude: 4.8622,
    longitude: 100.7936,
  },

  // Sabah
  {
    code: 'SBH01',
    state: 'Sabah',
    locations: 'Bahagian Sandakan (Timur), Bukit Garam, Semawang, Temanggong, Tambisan, Bandar Sandakan, Sukau',
    latitude: 5.8394,
    longitude: 118.1172,
  },
  {
    code: 'SBH02',
    state: 'Sabah',
    locations: 'Beluran, Telupid, Pinangah, Terusan, Kuamut, Bahagian Sandakan (Barat)',
    latitude: 5.535,
    longitude: 117.15,
  },
  {
    code: 'SBH03',
    state: 'Sabah',
    locations: 'Lahad Datu, Silabukan, Kunak, Sahabat, Semporna, Tungku, Bahagian Tawau (Timur)',
    latitude: 5.0268,
    longitude: 118.327,
  },
  {
    code: 'SBH04',
    state: 'Sabah',
    locations: 'Bandar Tawau, Balung, Merotai, Kalabakan, Bahagian Tawau (Barat)',
    latitude: 4.2447,
    longitude: 117.8912,
  },
  {
    code: 'SBH05',
    state: 'Sabah',
    locations: 'Kudat, Kota Marudu, Pitas, Pulau Banggi, Bahagian Kudat',
    latitude: 6.8837,
    longitude: 116.8466,
  },
  {
    code: 'SBH06',
    state: 'Sabah',
    locations: 'Gunung Kinabalu',
    latitude: 6.075,
    longitude: 116.5583,
  },
  {
    code: 'SBH07',
    state: 'Sabah',
    locations: 'Kota Kinabalu, Ranau, Kota Belud, Tuaran, Penampang, Papar, Putatan, Bahagian Pantai Barat',
    latitude: 5.9804,
    longitude: 116.0735,
  },
  {
    code: 'SBH08',
    state: 'Sabah',
    locations: 'Pensiangan, Keningau, Tambunan, Nabawan, Bahagian Pendalaman (Atas)',
    latitude: 5.3442,
    longitude: 116.1603,
  },
  {
    code: 'SBH09',
    state: 'Sabah',
    locations: 'Beaufort, Kuala Penyu, Sipitang, Tenom, Long Pa Sia, Membakut, Weston, Bahagian Pendalaman (Bawah)',
    latitude: 5.3473,
    longitude: 115.7431,
  },

  // Sarawak
  {
    code: 'SWK01',
    state: 'Sarawak',
    locations: 'Limbang, Lawas, Sundar, Trusan',
    latitude: 4.75,
    longitude: 115.0,
  },
  {
    code: 'SWK02',
    state: 'Sarawak',
    locations: 'Miri, Niah, Bekenu, Sibuti, Marudi',
    latitude: 4.3995,
    longitude: 113.9914,
  },
  {
    code: 'SWK03',
    state: 'Sarawak',
    locations: 'Pandan, Belaga, Suai, Tatau, Sebauh, Bintulu',
    latitude: 3.1667,
    longitude: 113.0333,
  },
  {
    code: 'SWK04',
    state: 'Sarawak',
    locations: 'Sibu, Mukah, Dalat, Song, Igan, Oya, Balingian, Kanowit, Kapit',
    latitude: 2.2878,
    longitude: 111.8305,
  },
  {
    code: 'SWK05',
    state: 'Sarawak',
    locations: 'Sarikei, Matu, Julau, Rajang, Daro, Bintangor, Belawai',
    latitude: 2.1167,
    longitude: 111.5167,
  },
  {
    code: 'SWK06',
    state: 'Sarawak',
    locations: 'Lubok Antu, Sri Aman, Roban, Debak, Betong, Saratuk, Kabong, Lingga',
    latitude: 1.2333,
    longitude: 111.4667,
  },
  {
    code: 'SWK07',
    state: 'Sarawak',
    locations: 'Serian, Simunjan, Samarahan, Sebuyau, Meludam',
    latitude: 1.1667,
    longitude: 110.5667,
  },
  {
    code: 'SWK08',
    state: 'Sarawak',
    locations: 'Kuching, Bau, Lundu, Sematan',
    latitude: 1.5533,
    longitude: 110.3592,
  },
  {
    code: 'SWK09',
    state: 'Sarawak',
    locations: 'Zon Khas (Kg. Patarikan)',
    latitude: 1.5,
    longitude: 110.4,
  },

  // Terengganu
  {
    code: 'TRG01',
    state: 'Terengganu',
    locations: 'Kuala Terengganu, Marang, Kuala Nerus',
    latitude: 5.3117,
    longitude: 103.1324,
  },
  {
    code: 'TRG02',
    state: 'Terengganu',
    locations: 'Besut, Setiu',
    latitude: 5.6667,
    longitude: 102.6667,
  },
  {
    code: 'TRG03',
    state: 'Terengganu',
    locations: 'Hulu Terengganu',
    latitude: 5.0667,
    longitude: 102.9333,
  },
  {
    code: 'TRG04',
    state: 'Terengganu',
    locations: 'Dungun, Kemaman',
    latitude: 4.775,
    longitude: 103.4167,
  },
];

export const DEFAULT_ZONE: JakimZone = JAKIM_ZONES[0]; // WLY01

export const getZoneByCode = (code: string): JakimZone => {
  return JAKIM_ZONES.find(z => z.code.toUpperCase() === code.toUpperCase()) || DEFAULT_ZONE;
};

export const findNearestZone = (lat: number, lng: number): JakimZone => {
  let nearest = JAKIM_ZONES[0];
  let minDistance = Infinity;

  // Haversine distance
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  for (const zone of JAKIM_ZONES) {
    const dLat = toRad(zone.latitude - lat);
    const dLon = toRad(zone.longitude - lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat)) * Math.cos(toRad(zone.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;

    if (dist < minDistance) {
      minDistance = dist;
      nearest = zone;
    }
  }

  return nearest;
};
