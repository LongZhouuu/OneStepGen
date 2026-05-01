export const focusMapSources = [
  {
    id: 'coworking',
    label: 'Coworking Spaces',
    // Copy file to: public/focus-data/coworking-spaces.csv
    url: '/focus-data/coworking-spaces.csv',
    format: 'csv',
    fieldMap: {
      name: 'Organisation',
      lat: 'latitude',
      lng: 'longitude',
      website: 'Website',
      category: '',
      address: 'Address',
    },
  },
  {
    id: 'libraries',
    label: 'Libraries',
    // Copy file to: public/focus-data/melbourne_city_libraries.csv
    url: '/focus-data/melbourne_city_libraries.csv',
    format: 'csv',
    fieldMap: {
      name: 'Name',
      lat: 'latitude',
      lng: 'longitude',
      website: '',
      category: '',
      address: 'Address',
    },
  },
  {
    id: 'relax',
    label: 'Relax Areas',
    // Copy file to: public/focus-data/landmarks.csv
    url: '/focus-data/landmarks.csv',
    format: 'csv',
    fieldMap: {
      name: 'Feature Name',
      latLng: 'Co-ordinates',
      website: '',
      category: 'Sub Theme',
      address: '',
    },
    includeKeywords: ['park', 'garden', 'reserve', 'library', 'community', 'square'],
  },
]
