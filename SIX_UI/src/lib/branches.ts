export interface BranchNote {
  id: string
  title: string
  excerpt: string
  author: string
  dept: string
  date: string
  type: 'Policy' | 'Process' | 'Technical' | 'Methodology' | 'Market Brief' | 'Q&A'
  tags: string[]
  verified: boolean
  sources: string[]
  focusArea: string[]
}

export interface SixBranch {
  code: string          // ISO 2-letter
  name: string          // Country name
  city: string          // Primary city
  flag: string          // Path to SVG in /flags/
  description: string
  established: string
  headcount: string
  focus: string[]
  address: string
  website: string
  notes: BranchNote[]
}

export const SIX_BRANCHES: SixBranch[] = [
  {
    code: 'CH',
    name: 'Switzerland',
    city: 'Zurich',
    flag: '/flags/ch.svg',
    description:
      'SIX Group\'s global headquarters. Home to the Swiss Exchange (SIX Swiss Exchange), the SIX Payment Services division, and the centralised technology platform serving the Swiss financial centre.',
    established: '1930',
    headcount: '3,500+',
    focus: ['Swiss Exchange', 'Payment Services', 'Financial Information', 'Corporate HQ'],
    address: 'Hardturmstrasse 201, 8005 Zurich, Switzerland',
    website: 'https://www.six-group.com',
    notes: [
      {
        id: 'ch-1',
        title: 'Swiss Exchange Trading Rules & Market Structure',
        excerpt: 'Comprehensive overview of SIX Swiss Exchange trading segments, order types, continuous trading hours, and the blue-chip SMI index composition methodology.',
        author: 'Jacob Gertel',
        dept: 'Exchange Operations',
        date: 'Jan 2026',
        type: 'Technical',
        tags: ['Swiss Exchange', 'Trading', 'SMI', 'Market Structure'],
        verified: true,
        sources: ['Confluence: Exchange/TradingRules', 'SharePoint: Markets/Docs'],
        focusArea: ['Swiss Exchange'],
      },
      {
        id: 'ch-2',
        title: 'Swiss Payment Services — Interbank Clearing SIC System',
        excerpt: 'Operational guide to SIC (Swiss Interbank Clearing), the real-time gross settlement system operated by SIX on behalf of the Swiss National Bank. Covers settlement windows, messaging standards, and participant onboarding.',
        author: 'Katharina Voegtle',
        dept: 'Payment Services',
        date: 'Dec 2025',
        type: 'Process',
        tags: ['SIC', 'Payments', 'RTGS', 'Clearing'],
        verified: true,
        sources: ['Confluence: Payments/SIC', 'PDF: SIC_Operations_Manual_v6'],
        focusArea: ['Payment Services'],
      },
      {
        id: 'ch-3',
        title: 'Corporate Governance Framework — Board & Committee Structure',
        excerpt: 'SIX Group AG governance documentation covering the Board of Directors composition, key committees (Audit, Risk, Remuneration), and delegation of authority thresholds.',
        author: 'Mirko Silvestri',
        dept: 'Corporate Governance',
        date: 'Feb 2026',
        type: 'Policy',
        tags: ['Governance', 'Board', 'Compliance', 'Corporate'],
        verified: true,
        sources: ['SharePoint: Legal/Governance', 'Confluence: Corp/Structure'],
        focusArea: ['Corporate HQ'],
      },
      {
        id: 'ch-4',
        title: 'Financial Information Global Reference Data Standards',
        excerpt: 'SIX Financial Information\'s reference data product suite: security identifiers (VALOR, ISIN, SEDOL), instrument classification, corporate actions taxonomy, and data licensing model.',
        author: 'Jennifer Chang',
        dept: 'Financial Information',
        date: 'Nov 2025',
        type: 'Technical',
        tags: ['Reference Data', 'ISIN', 'Corporate Actions', 'Data Standards'],
        verified: true,
        sources: ['Confluence: FI/DataProducts', 'SharePoint: Products/RefData'],
        focusArea: ['Financial Information'],
      },
    ],
  },
  {
    code: 'ES',
    name: 'Spain',
    city: 'Madrid',
    flag: '/flags/es.svg',
    description:
      'Operator of BME (Bolsas y Mercados Españoles), the operator of Spain\'s securities exchanges and financial markets. SIX acquired BME in 2020, making it one of the leading pan-European exchange operators.',
    established: '2020 (BME since 1831)',
    headcount: '600+',
    focus: ['BME Exchange', 'Equity & Derivatives Markets', 'Post-trade Services', 'Market Data'],
    address: 'Plaza de la Lealtad 1, 28014 Madrid, Spain',
    website: 'https://www.bolsasymercados.es',
    notes: [
      {
        id: 'es-1',
        title: 'BME Bolsa de Madrid — Equity Market Microstructure',
        excerpt: 'Detailed breakdown of the Spanish continuous market (SIBE), trading bands, auction mechanisms, and the IBEX 35 index rebalancing process managed by BME Indices.',
        author: 'Magdalena Tuta',
        dept: 'Exchange Operations — Madrid',
        date: 'Jan 2026',
        type: 'Technical',
        tags: ['BME', 'IBEX 35', 'SIBE', 'Equity Markets'],
        verified: true,
        sources: ['Confluence: BME/Markets', 'SharePoint: ES/TradingDocs'],
        focusArea: ['BME Exchange', 'Equity & Derivatives Markets'],
      },
      {
        id: 'es-2',
        title: 'BME Clearing — Central Counterparty Services Overview',
        excerpt: 'Overview of BME Clearing\'s CCP services for equities, derivatives, energy, and repos. Covers margin methodology, default waterfall, and cross-border interoperability agreements.',
        author: 'Jacob Gertel',
        dept: 'Post-Trade — Madrid',
        date: 'Dec 2025',
        type: 'Process',
        tags: ['CCP', 'Clearing', 'Derivatives', 'Post-Trade'],
        verified: true,
        sources: ['Confluence: BME/Clearing', 'PDF: BMEClearing_Rules_2025'],
        focusArea: ['Post-trade Services', 'Equity & Derivatives Markets'],
      },
      {
        id: 'es-3',
        title: 'SIX x BME Integration Roadmap — Technology Synergies',
        excerpt: 'Post-acquisition technology integration milestones: shared data infrastructure, unified market data APIs, and co-located matching engine timelines across Zurich and Madrid.',
        author: 'Mirko Silvestri',
        dept: 'Integration Programme',
        date: 'Feb 2026',
        type: 'Methodology',
        tags: ['Integration', 'Technology', 'Roadmap', 'SIX-BME'],
        verified: false,
        sources: ['Confluence: Integration/Roadmap', 'MS Teams: Integration_PMO'],
        focusArea: ['BME Exchange', 'Market Data'],
      },
    ],
  },
  {
    code: 'ZA',
    name: 'South Africa',
    city: 'Johannesburg',
    flag: '/flags/za.svg',
    description:
      'SIX Financial Information South Africa provides reference data, pricing, and corporate actions data for African and global markets, supporting local asset managers, banks, and financial institutions.',
    established: '2005',
    headcount: '150+',
    focus: ['Financial Data', 'Reference Data', 'Corporate Actions', 'African Market Coverage'],
    address: '1 Woodmead Drive, Woodmead, Johannesburg, South Africa',
    website: 'https://www.six-group.com/en/products-services/financial-information.html',
    notes: [
      {
        id: 'za-1',
        title: 'African Market Data Coverage — JSE & Regional Exchanges',
        excerpt: 'SIX coverage of Johannesburg Stock Exchange (JSE) securities, Namibia Stock Exchange, Zimbabwe Stock Exchange, and other SADC-region markets. Includes pricing frequencies, corporate actions, and instrument count.',
        author: 'Jennifer Chang',
        dept: 'Financial Information — Johannesburg',
        date: 'Jan 2026',
        type: 'Market Brief',
        tags: ['JSE', 'Africa', 'Market Data', 'Coverage'],
        verified: true,
        sources: ['Confluence: ZA/Coverage', 'SharePoint: Africa/MarketData'],
        focusArea: ['African Market Coverage', 'Financial Data'],
      },
      {
        id: 'za-2',
        title: 'FSCA Regulatory Compliance — South Africa Data Operations',
        excerpt: 'Guide to Financial Sector Conduct Authority (FSCA) obligations for financial data providers operating in South Africa, covering licensing, data residency requirements, and reporting mandates.',
        author: 'Jacob Gertel',
        dept: 'Legal & Compliance — Johannesburg',
        date: 'Nov 2025',
        type: 'Policy',
        tags: ['FSCA', 'Regulatory', 'South Africa', 'Compliance'],
        verified: true,
        sources: ['SharePoint: ZA/Compliance', 'PDF: FSCA_DataProvider_Guide'],
        focusArea: ['Financial Data', 'Reference Data'],
      },
    ],
  },
  {
    code: 'AE',
    name: 'UAE',
    city: 'Dubai',
    flag: '/flags/ae.svg',
    description:
      'SIX\'s Middle East hub serving Gulf Cooperation Council (GCC) financial markets. Provides financial information services, market data distribution, and payment solutions across the MENA region.',
    established: '2010',
    headcount: '80+',
    focus: ['MENA Market Data', 'Payment Solutions', 'GCC Financial Services', 'Digital Infrastructure'],
    address: 'DIFC, Gate Village 5, Dubai, UAE',
    website: 'https://www.six-group.com',
    notes: [
      {
        id: 'ae-1',
        title: 'GCC Market Data Coverage — DFM, ADX & Tadawul',
        excerpt: 'Scope of SIX Financial Information data coverage across the Dubai Financial Market (DFM), Abu Dhabi Securities Exchange (ADX), Saudi Tadawul, Kuwait Stock Exchange, and Bahrain Bourse.',
        author: 'Mirko Silvestri',
        dept: 'Financial Information — Dubai',
        date: 'Jan 2026',
        type: 'Market Brief',
        tags: ['DFM', 'Tadawul', 'GCC', 'Market Data'],
        verified: true,
        sources: ['Confluence: AE/Coverage', 'SharePoint: MENA/Markets'],
        focusArea: ['MENA Market Data', 'GCC Financial Services'],
      },
      {
        id: 'ae-2',
        title: 'DIFC Operations — Regulatory Sandbox & FinTech Partnerships',
        excerpt: 'Overview of SIX activities within the Dubai International Financial Centre (DIFC) regulatory sandbox, including active FinTech co-development agreements and digital asset pilot initiatives.',
        author: 'Katharina Voegtle',
        dept: 'Strategy — Dubai',
        date: 'Feb 2026',
        type: 'Methodology',
        tags: ['DIFC', 'FinTech', 'Digital Assets', 'Partnerships'],
        verified: false,
        sources: ['Confluence: AE/Strategy', 'MS Teams: MENA_Strategy'],
        focusArea: ['Digital Infrastructure', 'Payment Solutions'],
      },
    ],
  },
  {
    code: 'SG',
    name: 'Singapore',
    city: 'Singapore',
    flag: '/flags/sg.svg',
    description:
      'SIX\'s Asia-Pacific centre of operations. Delivers financial information, exchange data feeds, and digital asset services across APAC markets, with a growing focus on tokenisation and digital finance.',
    established: '2008',
    headcount: '120+',
    focus: ['APAC Market Data', 'Digital Assets', 'Exchange Data Feeds', 'Tokenisation'],
    address: '1 Raffles Place, #20-61 One Raffles Place, Singapore 048616',
    website: 'https://www.six-group.com',
    notes: [
      {
        id: 'sg-1',
        title: 'SIX Digital Exchange (SDX) — Singapore Operations Brief',
        excerpt: 'Overview of SDX\'s regulated digital asset exchange and CSD activities, Singapore MAS licensing status, active tokenised asset classes (bonds, funds), and the connection to SDX\'s Zurich infrastructure.',
        author: 'Jennifer Chang',
        dept: 'Digital Assets — Singapore',
        date: 'Feb 2026',
        type: 'Technical',
        tags: ['SDX', 'Digital Assets', 'Tokenisation', 'MAS'],
        verified: true,
        sources: ['Confluence: SG/SDX', 'SharePoint: DigitalAssets/SG'],
        focusArea: ['Digital Assets', 'Tokenisation'],
      },
      {
        id: 'sg-2',
        title: 'APAC Market Data Feed Architecture — SGX, ASX & Regional Exchanges',
        excerpt: 'Technical documentation of SIX real-time and end-of-day data feed delivery for Singapore Exchange (SGX), Australian Securities Exchange (ASX), Hong Kong Stock Exchange, and Tokyo Stock Exchange.',
        author: 'Mirko Silvestri',
        dept: 'Real-Time Services — Singapore',
        date: 'Jan 2026',
        type: 'Technical',
        tags: ['SGX', 'ASX', 'APAC', 'Data Feeds'],
        verified: true,
        sources: ['Confluence: SG/Feeds', 'SharePoint: APAC/Infrastructure'],
        focusArea: ['APAC Market Data', 'Exchange Data Feeds'],
      },
      {
        id: 'sg-3',
        title: 'MAS Regulatory Framework — Digital Token Service Providers',
        excerpt: 'Compliance briefing on the Monetary Authority of Singapore\'s Payment Services Act licensing requirements for digital token exchanges, with specific implications for SDX Singapore operations.',
        author: 'Jacob Gertel',
        dept: 'Legal & Compliance — Singapore',
        date: 'Dec 2025',
        type: 'Policy',
        tags: ['MAS', 'Regulatory', 'Digital Tokens', 'PSA'],
        verified: true,
        sources: ['SharePoint: SG/Compliance', 'PDF: MAS_PSA_Guidance_2025'],
        focusArea: ['Digital Assets', 'Tokenisation'],
      },
    ],
  },
]
