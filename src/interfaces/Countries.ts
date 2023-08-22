export interface Root {
  countries: Country[]
}

export interface Country {
  id: string
  two_letter_abbreviation: string
  three_letter_abbreviation: string
  full_name_locale: string
  available_regions?: AvailableRegion[] | null
  __typename: string
}

export interface AvailableRegion {
  id: string
  code: string
  name: string
  __typename: string
}