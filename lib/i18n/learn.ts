import type { Lang } from "@/lib/khmer/constants"

/** Prose for the /learn guide. Month lengths, animal and sak names come from the engine. */

export interface Term {
  term: string
  romanized?: string
  text: string
}

export interface LearnContent {
  toc: string
  intro: { title: string; body: string[] }
  phases: { title: string; body: string[] }
  months: { title: string; body: string[]; columns: [string, string, string, string]; spans: string[]; note: string }
  leap: { title: string; body: string; rows: { name: string; days: string; text: string }[] }
  holyDays: { title: string; body: string[] }
  years: { title: string; items: Term[]; animalsTitle: string; saksTitle: string }
  newYear: { title: string; body: string; days: Term[] }
  reading: { title: string; body: string; parts: [string, string, string, string, string, string] }
  festivals: { title: string; columns: [string, string]; rows: { name: string; when: string }[]; link: string }
  glossary: { title: string; terms: Term[] }
}

const GLOSSARY_KM: Term[] = [
  { term: "ចន្ទគតិ", romanized: "Chanthakati", text: "ប្រតិទិនរាប់ខែតាមដំណើរព្រះចន្ទ" },
  { term: "សុរិយគតិ", romanized: "Sorakati", text: "ប្រតិទិនរាប់តាមព្រះអាទិត្យ (គ្រិស្តសករាជ)" },
  { term: "កើត", romanized: "Kert", text: "ពាក់កណ្តាលខែដែលព្រះចន្ទភ្លឺកាន់តែធំ (១–១៥)" },
  { term: "រោច", romanized: "Roech", text: "ពាក់កណ្តាលខែដែលព្រះចន្ទរួមតូចវិញ (១–១៤ ឬ ១៥)" },
  { term: "ពេញបូណ៌មី", romanized: "Penh Borami", text: "ព្រះចន្ទពេញវង់ ត្រូវនឹង ១៥កើត" },
  { term: "ថ្ងៃដាច់ខែ", romanized: "Thngai Dach Khe", text: "ថ្ងៃចុងក្រោយនៃខែ ពេលព្រះចន្ទងងឹត" },
  { term: "ខែគត់", romanized: "Khe Kot", text: "ខែមាន ៣០ ថ្ងៃ បញ្ចប់នៅ ១៥រោច" },
  { term: "ខែខ្វះ", romanized: "Khe Khvah", text: "ខែមាន ២៩ ថ្ងៃ បញ្ចប់នៅ ១៤រោច" },
  { term: "ថ្ងៃសីល", romanized: "Thngai Sel", text: "ថ្ងៃកាន់សីល៖ ៨កើត ១៥កើត ៨រោច និងថ្ងៃចុងខែ" },
  { term: "អធិកមាស", romanized: "Athikameas", text: "ឆ្នាំមានខែអាសាឍពីរដង (៣៨៤ ថ្ងៃ)" },
  { term: "ចន្ទ្រាធិមាស", romanized: "Chantrathimeas", text: "ឆ្នាំដែលខែជេស្ឋមាន ៣០ ថ្ងៃ (៣៥៥ ថ្ងៃ)" },
  { term: "ពុទ្ធសករាជ (ព.ស.)", romanized: "Puttho Sakarach", text: "ឆ្នាំរាប់ចាប់ពីព្រះពុទ្ធបរិនិព្វាន" },
  { term: "ចុល្លសករាជ (ច.ស.)", romanized: "Chulla Sakarach", text: "សករាជតូច ស្មើ ព.ស. ដក ១១៨២" },
  { term: "ស័ក", romanized: "Sak", text: "វដ្ត ១០ ឆ្នាំ តាមលេខចុងក្រោយនៃ ច.ស." },
  { term: "មហាសង្ក្រាន្ត", romanized: "Moha Songkran", text: "ថ្ងៃទីមួយនៃបុណ្យចូលឆ្នាំ ពេលទេវតាថ្មីចុះមក" },
  { term: "វារៈឡើងស័ក", romanized: "Virak Laeung Sak", text: "ថ្ងៃចុងក្រោយនៃបុណ្យចូលឆ្នាំ ពេលប្តូរស័ក" },
]

const GLOSSARY_EN: Term[] = [
  { term: "ចន្ទគតិ", romanized: "Chanthakati", text: "The lunar calendar, counting months by the moon" },
  { term: "សុរិយគតិ", romanized: "Sorakati", text: "The solar (Gregorian) calendar" },
  { term: "កើត", romanized: "Kert", text: "The waxing half of a month, days 1–15" },
  { term: "រោច", romanized: "Roech", text: "The waning half of a month, days 1–14 or 1–15" },
  { term: "ពេញបូណ៌មី", romanized: "Penh Borami", text: "Full moon, on 15 Kert" },
  { term: "ថ្ងៃដាច់ខែ", romanized: "Thngai Dach Khe", text: "The last day of the month, at the new moon" },
  { term: "ខែគត់", romanized: "Khe Kot", text: "A full 30-day month, ending on 15 Roech" },
  { term: "ខែខ្វះ", romanized: "Khe Khvah", text: "A short 29-day month, ending on 14 Roech" },
  { term: "ថ្ងៃសីល", romanized: "Thngai Sel", text: "Buddhist holy day: 8 and 15 Kert, 8 Roech and the last day" },
  { term: "អធិកមាស", romanized: "Athikameas", text: "Leap-month year with two Asadh months (384 days)" },
  { term: "ចន្ទ្រាធិមាស", romanized: "Chantrathimeas", text: "Leap-day year where Jesth has 30 days (355 days)" },
  { term: "ពុទ្ធសករាជ", romanized: "Puttho Sakarach", text: "Buddhist Era, counted from the Buddha's passing" },
  { term: "ចុល្លសករាជ", romanized: "Chulla Sakarach", text: "Lesser Era, equal to the Buddhist Era minus 1182" },
  { term: "ស័ក", romanized: "Sak", text: "A 10-year cycle named by the last digit of the Lesser Era" },
  { term: "មហាសង្ក្រាន្ត", romanized: "Moha Songkran", text: "First day of Khmer New Year, when the new Tevada arrives" },
  { term: "វារៈឡើងស័ក", romanized: "Virak Laeung Sak", text: "Last day of Khmer New Year, when the sak changes" },
]

export const LEARN: Record<Lang, LearnContent> = {
  km: {
    toc: "មាតិកា",
    intro: {
      title: "ចន្ទគតិខ្មែរ ជាអ្វី?",
      body: [
        "ចន្ទគតិ គឺជាប្រតិទិនប្រពៃណីខ្មែរ ដែលរាប់ខែតាមដំណើររបស់ព្រះចន្ទ។ ខែនីមួយៗចាប់ផ្តើមនៅពេលព្រះចន្ទងងឹត ហើយមាន ២៩ ឬ ៣០ ថ្ងៃ។",
        "ដើម្បីកុំឲ្យឆ្នាំឃ្លាតពីរដូវកាល ប្រតិទិននេះបន្ថែមខែ ឬថ្ងៃម្តងម្កាល ដូច្នេះវាជាប្រតិទិនចន្ទ-សុរិយគតិ។",
        "សព្វថ្ងៃ កម្ពុជាប្រើប្រតិទិនសុរិយគតិសម្រាប់ការងាររដ្ឋ ប៉ុន្តែប្រើចន្ទគតិសម្រាប់ពិធីបុណ្យសាសនា ថ្ងៃសីល និងប្រពៃណីផ្សេងៗ។",
      ],
    },
    phases: {
      title: "កើត និង រោច",
      body: [
        "ខែចន្ទគតិនីមួយៗចែកជាពីរពាក់កណ្តាល។ កើត ជាថ្ងៃដែលព្រះចន្ទភ្លឺកាន់តែធំឡើង ពី ១កើត ដល់ ១៥កើត ដែលជាថ្ងៃពេញបូណ៌មី។",
        "រោច ជាថ្ងៃដែលព្រះចន្ទរួមតូចវិញ ពី ១រោច ដល់ ១៤រោច ឬ ១៥រោច ដែលជាថ្ងៃដាច់ខែ។ ឧទាហរណ៍ «៣កើត» មានន័យថា ថ្ងៃទីបី នៃពេលព្រះចន្ទកំពុងកើត។",
      ],
    },
    months: {
      title: "ខែទាំង ១២ ខែគត់ និងខែខ្វះ",
      body: [
        "ខែគត់ មាន ៣០ ថ្ងៃ (បញ្ចប់នៅ ១៥រោច) ហើយ ខែខ្វះ មាន ២៩ ថ្ងៃ (បញ្ចប់នៅ ១៤រោច)។ ខែទាំងពីរប្រភេទឆ្លាស់គ្នា ព្រោះរយៈពេលពីព្រះចន្ទងងឹតមួយទៅមួយទៀតគឺប្រហែល ២៩.៥ ថ្ងៃ។",
      ],
      columns: ["ខែ", "English", "ចំនួនថ្ងៃ", "ប្រហែលខែសុរិយគតិ"],
      spans: ["វិច្ឆិកា–ធ្នូ", "ធ្នូ–មករា", "មករា–កុម្ភៈ", "កុម្ភៈ–មីនា", "មីនា–មេសា", "មេសា–ឧសភា", "ឧសភា–មិថុនា", "មិថុនា–កក្កដា", "កក្កដា–សីហា", "សីហា–កញ្ញា", "កញ្ញា–តុលា", "តុលា–វិច្ឆិកា"],
      note: "ខែសុរិយគតិដែលត្រូវគ្នាប្រែប្រួលប្រហែលពីរបីសប្តាហ៍ពីឆ្នាំមួយទៅឆ្នាំមួយ។",
    },
    leap: {
      title: "អធិកមាស និង ចន្ទ្រាធិមាស",
      body: "ឆ្នាំចន្ទគតិធម្មតាខ្លីជាងឆ្នាំសុរិយគតិប្រហែល ១១ ថ្ងៃ។ ដើម្បីទូទាត់ ឆ្នាំខ្លះត្រូវបន្ថែមថ្ងៃ ឬខែ។ ឆ្នាំមួយមិនអាចមានទាំងពីរក្នុងពេលតែមួយបានទេ។",
      rows: [
        { name: "ឆ្នាំធម្មតា", days: "៣៥៤ ថ្ងៃ", text: "ខែទាំង ១២ ឆ្លាស់គ្នា ៣០ និង ២៩ ថ្ងៃ។" },
        { name: "ចន្ទ្រាធិមាស", days: "៣៥៥ ថ្ងៃ", text: "ខែជេស្ឋ មាន ៣០ ថ្ងៃ ជំនួសឲ្យ ២៩ ថ្ងៃ។" },
        { name: "អធិកមាស", days: "៣៨៤ ថ្ងៃ", text: "ខែអាសាឍ មានពីរដង គឺ បឋមាសាឍ និង ទុតិយាសាឍ ដែលមាន ៣០ ថ្ងៃម្នាក់ៗ។" },
      ],
    },
    holyDays: {
      title: "ថ្ងៃសីល",
      body: [
        "ថ្ងៃសីល ជាថ្ងៃដែលពុទ្ធបរិស័ទទៅវត្ត ស្តាប់ធម៌ និងកាន់សីល។ ក្នុងមួយខែមាន ៤ ថ្ងៃ៖ ៨កើត ១៥កើត ៨រោច និងថ្ងៃចុងខែ។",
        "ថ្ងៃចុងខែគឺ ១៤រោច ក្នុងខែខ្វះ ឬ ១៥រោច ក្នុងខែគត់។ ក្នុងប្រតិទិន ថ្ងៃសីលត្រូវបានសម្គាល់ដោយចំណុចពណ៌លឿងទុំ។",
      ],
    },
    years: {
      title: "ពុទ្ធសករាជ ចុល្លសករាជ ស័ក និងឆ្នាំសត្វ",
      items: [
        { term: "ពុទ្ធសករាជ (ព.ស.)", text: "រាប់ចាប់ពីព្រះពុទ្ធបរិនិព្វាន ហើយប្តូរនៅថ្ងៃ ១រោច ខែពិសាខ គឺមួយថ្ងៃក្រោយបុណ្យវិសាខបូជា។ មុនថ្ងៃនោះ ព.ស. = គ.ស. + ៥៤៣ ក្រោយនោះ = គ.ស. + ៥៤៤។" },
        { term: "ចុល្លសករាជ (ច.ស.)", text: "ស្មើនឹង ព.ស. ដក ១១៨២ ហើយប្តូរនៅថ្ងៃឡើងស័ក។" },
        { term: "ឆ្នាំសត្វ", text: "វដ្ត ១២ ឆ្នាំ ប្តូរនៅថ្ងៃមហាសង្ក្រាន្ត (ចូលឆ្នាំខ្មែរ) មិនមែនថ្ងៃទី ១ មករាទេ។" },
        { term: "ស័ក", text: "វដ្ត ១០ ឆ្នាំ យកតាមលេខខ្ទង់ចុងក្រោយនៃចុល្លសករាជ ហើយប្តូរនៅថ្ងៃឡើងស័ក។" },
      ],
      animalsTitle: "ឆ្នាំសត្វទាំង ១២",
      saksTitle: "ស័កទាំង ១០ (តាមលេខចុងក្រោយនៃ ច.ស.)",
    },
    newYear: {
      title: "បុណ្យចូលឆ្នាំខ្មែរ",
      body: "បុណ្យចូលឆ្នាំខ្មែរ ជាពេលព្រះអាទិត្យចូលរាសីមេស ជាធម្មតានៅថ្ងៃទី ១៣ ឬ ១៤ ខែមេសា។ ពេលវេលាទេវតាថ្មីចុះមកត្រូវបានគណនាយ៉ាងជាក់លាក់ ហើយបុណ្យនេះមាន ៣ ឬ ៤ ថ្ងៃ។",
      days: [
        { term: "មហាសង្ក្រាន្ត", text: "ថ្ងៃទីមួយ ពេលទេវតាថ្មីចុះមកថែរក្សាពិភពលោកមួយឆ្នាំ។ ឆ្នាំសត្វប្តូរនៅថ្ងៃនេះ។" },
        { term: "វារៈវ័នបត", text: "ថ្ងៃកណ្តាល មាន ១ ឬ ២ ថ្ងៃ សម្រាប់ធ្វើបុណ្យ និងជួបជុំគ្រួសារ។" },
        { term: "វារៈឡើងស័ក", text: "ថ្ងៃចុងក្រោយ ពេលស័ក និងចុល្លសករាជប្តូរទៅឆ្នាំថ្មី។" },
      ],
    },
    reading: {
      title: "របៀបអានកាលបរិច្ឆេទចន្ទគតិ",
      body: "កាលបរិច្ឆេទចន្ទគតិពេញលេញមានផ្នែកជាច្រើន។ ខាងក្រោមនេះជាថ្ងៃនេះ ដែលបំបែកជាផ្នែកៗ៖",
      parts: ["ថ្ងៃក្នុងសប្តាហ៍", "ថ្ងៃ និង កើត/រោច", "ខែចន្ទគតិ", "ឆ្នាំសត្វ", "ស័ក", "ពុទ្ធសករាជ"],
    },
    festivals: {
      title: "បុណ្យសំខាន់ៗតាមចន្ទគតិ",
      columns: ["បុណ្យ", "កាលបរិច្ឆេទចន្ទគតិ"],
      rows: [
        { name: "មាឃបូជា", when: "១៥កើត ខែមាឃ" },
        { name: "វិសាខបូជា", when: "១៥កើត ខែពិសាខ" },
        { name: "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល", when: "៤រោច ខែពិសាខ" },
        { name: "ភ្ជុំបិណ្ឌ", when: "១៤រោច ដល់ ១កើត ខែអស្សុជ (ថ្ងៃធំ ១៥រោច ខែភទ្របទ)" },
        { name: "បុណ្យអុំទូក", when: "១៤កើត ដល់ ១រោច ខែកត្តិក" },
      ],
      link: "មើលកាលបរិច្ឆេទបុណ្យឆ្នាំនេះ",
    },
    glossary: { title: "វចនានុក្រមពាក្យ", terms: GLOSSARY_KM },
  },
  en: {
    toc: "On this page",
    intro: {
      title: "What is the Khmer lunar calendar?",
      body: [
        "Chanthakati (ចន្ទគតិ) is the traditional Khmer calendar. It counts months by the moon: each month starts at the new moon and lasts 29 or 30 days.",
        "So the year doesn't drift away from the seasons, an extra day or month is added from time to time, which makes it a lunisolar calendar.",
        "Cambodia uses the Gregorian calendar for civil life, but the lunar calendar sets Buddhist festivals, holy days and many traditions.",
      ],
    },
    phases: {
      title: "Kert (កើត) and Roech (រោច)",
      body: [
        "Every lunar month has two halves. Kert is the waxing half, when the moon grows, from 1 Kert to 15 Kert, the full moon.",
        "Roech is the waning half, when the moon shrinks, from 1 Roech to 14 or 15 Roech, the new moon. For example, “3 Kert” means the third day of the waxing moon.",
      ],
    },
    months: {
      title: "The 12 months, full and short",
      body: [
        "A full month (ខែគត់) has 30 days and ends on 15 Roech. A short month (ខែខ្វះ) has 29 days and ends on 14 Roech. They alternate because one moon cycle is about 29.5 days.",
      ],
      columns: ["Month", "Khmer", "Days", "Roughly in Gregorian"],
      spans: ["Nov–Dec", "Dec–Jan", "Jan–Feb", "Feb–Mar", "Mar–Apr", "Apr–May", "May–Jun", "Jun–Jul", "Jul–Aug", "Aug–Sep", "Sep–Oct", "Oct–Nov"],
      note: "The matching Gregorian months shift by a few weeks from year to year.",
    },
    leap: {
      title: "Leap months and leap days",
      body: "A plain lunar year is about 11 days shorter than a solar year. To catch up, some years get an extra day or an extra month, never both in the same year.",
      rows: [
        { name: "Regular year", days: "354 days", text: "Twelve months alternating 30 and 29 days." },
        { name: "Chantrathimeas (ចន្ទ្រាធិមាស)", days: "355 days", text: "Jesth gets 30 days instead of 29." },
        { name: "Athikameas (អធិកមាស)", days: "384 days", text: "Asadh appears twice, as Pathamasadh and Tutiyasadh, 30 days each." },
      ],
    },
    holyDays: {
      title: "Buddhist holy days (ថ្ងៃសីល)",
      body: [
        "On holy days Buddhists go to the pagoda, listen to sermons and keep the precepts. Each month has four: 8 Kert, 15 Kert, 8 Roech and the last day of the month.",
        "The last day is 14 Roech in a short month or 15 Roech in a full month. In the calendar, holy days are marked with an amber dot.",
      ],
    },
    years: {
      title: "Buddhist Era, Lesser Era, sak and animal years",
      items: [
        { term: "Buddhist Era (ពុទ្ធសករាជ)", text: "Counted from the Buddha's passing. It changes on 1 Roech of Pisakh, the day after Visak Bochea: before that BE = AD + 543, after it BE = AD + 544." },
        { term: "Lesser Era (ចុល្លសករាជ)", text: "Equals the Buddhist Era minus 1182 and changes on Virak Laeung Sak." },
        { term: "Animal year", text: "A 12-year cycle that changes at Khmer New Year (Moha Songkran), not on 1 January." },
        { term: "Sak (ស័ក)", text: "A 10-year cycle named by the last digit of the Lesser Era. It also changes on Virak Laeung Sak." },
      ],
      animalsTitle: "The 12 animal years",
      saksTitle: "The 10 saks (by last digit of the Lesser Era)",
    },
    newYear: {
      title: "Khmer New Year",
      body: "Khmer New Year marks the sun entering Aries, usually on 13 or 14 April. The exact moment the new Tevada (guardian angel) arrives is calculated each year, and the celebration lasts three or four days.",
      days: [
        { term: "Moha Songkran (មហាសង្ក្រាន្ត)", text: "Day one, when the new Tevada arrives to watch over the year. The animal year changes here." },
        { term: "Virak Vanabat (វារៈវ័នបត)", text: "One or two middle days for merit-making and family gatherings." },
        { term: "Virak Laeung Sak (វារៈឡើងស័ក)", text: "The last day, when the sak and the Lesser Era move to the new year." },
      ],
    },
    reading: {
      title: "How to read a lunar date",
      body: "A full lunar date has several parts. Here is today, split into its pieces:",
      parts: ["Weekday", "Day and phase", "Lunar month", "Animal year", "Sak", "Buddhist Era"],
    },
    festivals: {
      title: "Major lunar festivals",
      columns: ["Festival", "Lunar date"],
      rows: [
        { name: "Meak Bochea", when: "15 Kert of Meak" },
        { name: "Visak Bochea", when: "15 Kert of Pisakh" },
        { name: "Royal Ploughing Ceremony", when: "4 Roech of Pisakh" },
        { name: "Pchum Ben", when: "14 Roech of Phatrabot to 1 Kert of Assoch (main day 15 Roech)" },
        { name: "Water Festival", when: "14 Kert to 1 Roech of Kadeuk" },
      ],
      link: "See this year's festival dates",
    },
    glossary: { title: "Glossary", terms: GLOSSARY_EN },
  },
}
