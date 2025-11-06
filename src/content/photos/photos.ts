// Auto-generated photos data - DO NOT EDIT MANUALLY
// Run 'python3 scripts/process_photos.py' to regenerate

export interface PhotoData {
  filename: string;
  exportName: string;
  date: string;
  location: string;
}

export const photosData: PhotoData[] = [
  {
    filename: "DSCF4288.webp",
    exportName: "Dscf4288",
    date: "2025-11-06T20:44:32.169724",
    location: "Walensee, Switzerland",
  },
  {
    filename: "DSCF4292.webp",
    exportName: "Dscf4292",
    date: "2025-11-06T20:43:32.812229",
    location: "Walensee, Switzerland",
  },
  {
    filename: "DSCF4269.webp",
    exportName: "Dscf4269",
    date: "2025-11-06T20:43:11.137666",
    location: "Walensee, Switzerland",
  },
  {
    filename: "DSCF4105.webp",
    exportName: "Dscf4105",
    date: "2025-11-03T20:44:55.061424",
    location: "Venice, Italy",
  },
  {
    filename: "DSCF3953.webp",
    exportName: "Dscf3953",
    date: "2025-11-03T20:43:37.842229",
    location: "Venice, Italy",
  },
  {
    filename: "temple.webp",
    exportName: "Temple",
    date: "2025-07-06T00:16:47.466115",
    location: "Kyoto, Japan",
  },
  {
    filename: "kamakura.webp",
    exportName: "Kamakura",
    date: "2025-07-06T00:16:39.057017",
    location: "Kamakura, Japan",
  },
  {
    filename: "seven_eleven.webp",
    exportName: "SevenEleven",
    date: "2025-07-06T00:16:52.179718",
    location: "Tokyo, Japan",
  },
  {
    filename: "store.webp",
    exportName: "Store",
    date: "2025-07-06T00:16:50.043696",
    location: "Tokyo, Japan",
  },
  {
    filename: "vending_machine.webp",
    exportName: "VendingMachine",
    date: "2025-07-06T00:16:45.282754",
    location: "Tokyo, Japan",
  },
  {
    filename: "well_cafe.webp",
    exportName: "WellCafe",
    date: "2025-05-16T18:29:12.957759",
    location: "Toronto, Canada",
  },
  {
    filename: "vintage_tv.webp",
    exportName: "VintageTv",
    date: "2025-05-16T18:29:12.936118",
    location: "Toronto, Canada",
  },
  {
    filename: "umbrellas.webp",
    exportName: "Umbrellas",
    date: "2025-05-16T18:29:12.915298",
    location: "Nassau, Bahamas",
  },
  {
    filename: "street_art.webp",
    exportName: "StreetArt",
    date: "2025-05-16T18:29:12.878564",
    location: "New York City, New York",
  },
  {
    filename: "soho.webp",
    exportName: "Soho",
    date: "2025-05-16T18:29:12.845551",
    location: "New York City, New York",
  },
  {
    filename: "nyc_starbucks.webp",
    exportName: "NycStarbucks",
    date: "2025-05-16T18:29:12.817077",
    location: "New York City, New York",
  },
  {
    filename: "south_beach.webp",
    exportName: "SouthBeach",
    date: "2025-05-16T18:29:12.852392",
    location: "Miami, Florida",
  },
  {
    filename: "old_car.webp",
    exportName: "OldCar",
    date: "2025-05-16T18:29:12.822759",
    location: "Miami, Florida",
  },
  {
    filename: "stairs2.webp",
    exportName: "Stairs2",
    date: "2025-05-16T18:29:12.871325",
    location: "Toronto, Canada",
  },
  {
    filename: "stairs.webp",
    exportName: "Stairs",
    date: "2025-05-16T18:29:12.862098",
    location: "Toronto, Canada",
  },
  {
    filename: "library_study.webp",
    exportName: "LibraryStudy",
    date: "2025-05-16T18:29:12.804773",
    location: "Toronto, Canada",
  },
  {
    filename: "gallery_wall.webp",
    exportName: "GalleryWall",
    date: "2025-05-16T18:29:12.796359",
    location: "Toronto, Canada",
  },
];

// Get photos sorted by date (newest first) - already sorted in data
export function getPhotosSortedByDate(): PhotoData[] {
  return [...photosData];
}

// Get photos from a specific year
export function getPhotosByYear(year: number): PhotoData[] {
  return photosData.filter(
    (photo) => new Date(photo.date).getFullYear() === year,
  );
}

// Get available years
export function getAvailableYears(): number[] {
  const years = new Set(
    photosData.map((photo) => new Date(photo.date).getFullYear()),
  );
  return Array.from(years).sort((a, b) => b - a);
}

// Get photos from a specific month
export function getPhotosByMonth(year: number, month: number): PhotoData[] {
  return photosData.filter((photo) => {
    const date = new Date(photo.date);
    return date.getFullYear() === year && date.getMonth() === month - 1;
  });
}
