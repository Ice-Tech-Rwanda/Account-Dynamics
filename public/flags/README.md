# Country flags

`rw.svg`, `tz.svg`, `ke.svg`, `ug.svg` are the 4:3 country flag assets used by
`src/components/shared/CountryFlag.tsx`.

- Source: [`flag-icons`](https://github.com/lipis/flag-icons) v7.3.2 via jsDelivr
- Licence: MIT (see `LICENSE.txt`); the flag artwork itself is public domain
- 4:3 (640x480) variants, loaded with `next/image` using `unoptimized` because
  the Next image optimizer rejects SVG sources
- They are rendered as static assets, so add new countries by dropping the file
  in here and mapping its ISO 3166-1 alpha-2 code in `FLAG_SOURCES`
