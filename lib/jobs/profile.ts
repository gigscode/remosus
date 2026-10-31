export type JobCategory =
  | 'all'
  | 'development'
  | 'automation'
  | 'email'
  | 'website'
  | 'design'
  | 'content'
  | 'community'
  | 'marketing'

export type TargetJobCategory = Exclude<JobCategory, 'all'>

export const jobCategories: { id: JobCategory; label: string }[] = [
  { id: 'all', label: 'All priority searches' },
  { id: 'development', label: 'Full-stack & frontend' },
  { id: 'automation', label: 'AI & business automation' },
  { id: 'email', label: 'Email & Klaviyo' },
  { id: 'website', label: 'Websites & e-commerce' },
  { id: 'design', label: 'Design & landing pages' },
  { id: 'content', label: 'Specialist writing' },
  { id: 'community', label: 'Community & moderation' },
  { id: 'marketing', label: 'Marketing & growth' },
]

export const targetJobCategories: { id: TargetJobCategory; label: string }[] = [
  { id: 'development', label: 'Full-stack & frontend' },
  { id: 'automation', label: 'AI & business automation' },
  { id: 'email', label: 'Email & Klaviyo' },
  { id: 'website', label: 'Websites & e-commerce' },
  { id: 'design', label: 'Design & landing pages' },
  { id: 'content', label: 'Specialist writing' },
  { id: 'community', label: 'Community & moderation' },
  { id: 'marketing', label: 'Marketing & growth' },
]

type SearchLane = {
  id: TargetJobCategory
  titleRolePhrases: string[]
  titleRoleWords: string[]
  detailRolePhrases: string[]
  skillPhrases: string[]
}

const searchLanes: SearchLane[] = [
  {
    id: 'development',
    titleRolePhrases: [
      'full stack developer', 'fullstack developer', 'full stack engineer', 'fullstack engineer',
      'full stack web developer', 'frontend developer', 'front end developer', 'frontend engineer', 'front end engineer',
      'web developer', 'website developer', 'web application developer',
      'react developer', 'react frontend developer', 'react engineer',
      'next js developer', 'next js website developer', 'next js engineer',
      'typescript developer', 'supabase developer', 'mvp developer', 'saas developer',
      'dashboard developer', 'admin panel developer', 'edtech developer', 'ecommerce developer',
      'e commerce developer', 'api integration developer', 'web app maintenance',
      'web application maintenance', 'website performance optimisation', 'website performance optimization',
      'website bug fixes', 'website maintenance',
      'website designer and developer',
      'figma to code', 'frontend implementation', 'responsive ui implementation',
      'figma to react', 'figma to next js', 'responsive web design',
    ],
    titleRoleWords: ['developer', 'engineer'],
    detailRolePhrases: [
      'full stack development', 'frontend development', 'front end development',
      'web application development', 'web app development', 'build web applications',
      'building web applications', 'build web apps', 'building web apps',
      'implement responsive interfaces', 'turn figma designs into code',
      'figma to code', 'third party api integration',
      'admin panel development', 'dashboard development', 'edtech platform development',
      'website performance optimisation', 'website performance optimization',
      'website bug fixes', 'web app maintenance', 'website maintenance',
      'figma to react', 'figma to next js', 'responsive web design',
    ],
    skillPhrases: [
      'react', 'react js', 'next js', 'nextjs', 'typescript', 'supabase',
      'tailwind css', 'figma to code', 'responsive frontend', 'responsive ui',
      'api integration', 'web application', 'web app', 'full stack development',
      'admin panel', 'dashboard', 'edtech', 'mvp', 'saas', 'web app maintenance',
      'website maintenance', 'website performance', 'website bug fixes',
      'figma to react', 'figma to next js', 'responsive web design',
      'ecommerce', 'e commerce',
    ],
  },
  {
    id: 'automation',
    titleRolePhrases: [
      'ai integration developer', 'ai automation developer', 'automation developer',
      'workflow automation specialist', 'crm automation specialist', 'automation consultant',
      'marketing automation specialist', 'webhook integration developer',
      'webhook integration specialist', 'business automation specialist',
      'crm integration specialist', 'ai integration specialist',
      'automation engineer', 'integration engineer', 'workflow engineer',
      'abandoned cart automation', 'welcome flow setup',
      'customer retention automation', 'email deliverability specialist',
      'esp migration specialist',
    ],
    titleRoleWords: ['automation', 'integration', 'workflow', 'crm'],
    detailRolePhrases: [
      'business process automation', 'automate business workflows',
      'automating business workflows', 'workflow automation',
      'crm integration', 'lead capture automation', 'follow up automation',
      'webhook integration', 'connect third party apis', 'ai integration',
      'abandoned cart automation', 'welcome flow setup',
      'customer retention automation', 'email deliverability',
      'esp migration',
    ],
    skillPhrases: [
      'api integration', 'webhook', 'crm', 'lead capture', 'workflow automation',
      'business automation', 'openai', 'llm integration', 'third party apis', 'ai integration',
      'abandoned cart automation', 'welcome flow setup',
      'customer retention automation', 'email deliverability',
      'esp migration',
    ],
  },
  {
    id: 'email',
    titleRolePhrases: [
      'klaviyo specialist', 'klaviyo email', 'email automation specialist',
      'email marketing designer', 'email designer', 'email copywriter',
      'email lifecycle specialist', 'email marketing specialist',
      'klaviyo flow specialist', 'email flows specialist', 'email campaign designer',
      'klaviyo developer', 'klaviyo flow builder', 'email template developer',
      'ecommerce email marketing', 'e commerce email marketing',
      'figma email campaign designer', 'email marketing copywriter',
      'lifecycle marketing specialist', 'abandoned cart automation',
      'welcome flow setup', 'customer retention automation',
      'email deliverability specialist', 'esp migration specialist',
    ],
    titleRoleWords: ['email', 'klaviyo', 'lifecycle', 'retention'],
    detailRolePhrases: [
      'email marketing design', 'email campaign design', 'email automation',
      'email lifecycle automation', 'email flow production', 'email copywriting',
      'ecommerce email marketing', 'e commerce email marketing',
      'abandoned cart automation', 'welcome flow setup',
      'customer retention automation', 'email deliverability',
      'esp migration', 'email template development', 'email marketing',
    ],
    skillPhrases: [
      'klaviyo', 'email design', 'figma email', 'email template',
      'abandoned cart', 'welcome flow', 'welcome sequence', 'email lifecycle',
      'email campaign', 'email copywriting', 'email automation',
      'lifecycle marketing',
      'abandoned cart automation', 'welcome flow setup',
      'customer retention automation', 'email deliverability',
      'esp migration', 'email template development', 'email marketing',
    ],
  },
  {
    id: 'website',
    titleRolePhrases: [
      'wordpress developer', 'wordpress website maintenance', 'wordpress maintenance',
      'wordpress support specialist', 'woocommerce developer', 'woocommerce store setup',
      'wordpress website designer',
      'ecommerce website developer', 'e commerce website developer',
      'online store developer', 'landing page developer', 'wordpress support',
      'woocommerce specialist', 'website maintenance specialist',
      'web app maintenance specialist', 'conversion focused landing page developer',
      'website developer', 'ecommerce developer', 'e commerce developer',
      'webflow developer', 'website performance optimisation', 'website performance optimization',
      'website bug fixes',
      'landing page redesign', 'conversion focused landing pages',
      'website designer and developer', 'website redesign specialist',
      'marketing website developer', 'webflow developer',
      'wordpress website designer', 'wordpress ecommerce', 'wordpress e commerce',
      'wordpress landing page', 'elementor developer',
      'wordpress speed optimisation', 'wordpress speed optimization',
      'wordpress bug fixes', 'wordpress website redesign',
      'woocommerce product upload', 'wordpress seo',
      'wordpress to next js migration',
    ],
    titleRoleWords: ['wordpress', 'woocommerce', 'website', 'ecommerce', 'landing page', 'online store'],
    detailRolePhrases: [
      'wordpress website development', 'wordpress website maintenance',
      'woocommerce store setup', 'ecommerce website development',
      'e commerce website development', 'online store development',
      'landing page development', 'website maintenance',
      'landing page redesign', 'conversion focused landing pages',
      'website redesign', 'marketing website development',
      'wordpress website design', 'wordpress ecommerce',
      'wordpress e commerce', 'wordpress landing page',
      'elementor development', 'wordpress speed optimisation',
      'wordpress speed optimization', 'wordpress bug fixes',
      'woocommerce product upload', 'wordpress seo',
      'wordpress to next js migration',
      'webflow development', 'website performance optimisation',
      'website performance optimization', 'website bug fixes',
    ],
    skillPhrases: [
      'wordpress', 'woocommerce', 'website maintenance', 'landing page',
      'ecommerce website', 'e commerce website', 'online store',
      'website redesign', 'marketing website', 'webflow',
      'elementor', 'wordpress speed', 'wordpress bug fixes',
      'woocommerce product upload', 'wordpress seo', 'wordpress to next js',
      'conversion focused landing pages',
      'ecommerce', 'e commerce', 'website performance',
      'website',
    ],
  },
  {
    id: 'design',
    titleRolePhrases: [
      'ui ux designer', 'ux ui designer', 'ui designer', 'ux designer',
      'web designer', 'landing page designer', 'marketing designer',
      'social media graphic designer', 'static ad creative designer',
      'static ad designer', 'social media designer', 'figma email designer',
      'email marketing designer', 'graphic designer',
      'digital ad designer', 'brand identity designer',
      'logo designer', 'presentation designer', 'figma email campaign designer',
      'ecommerce creative designer', 'e commerce creative designer',
      'ai ad creative designer', 'ai ugc video creator',
      'ai video ads creator', 'short form video editor', 'content designer',
      'landing page designer',
    ],
    titleRoleWords: ['designer', 'design', 'figma', 'graphic'],
    detailRolePhrases: [
      'landing page design', 'landing page redesign', 'marketing design',
      'static ad creative', 'social media graphics', 'email design',
      'saas interface design', 'design systems implementation',
      'user interface design', 'user experience design',
      'brand identity design', 'logo design', 'presentation design',
      'digital ad design', 'ecommerce creative', 'e commerce creative',
      'ai ad creative', 'ai ugc video', 'ai video ads',
      'short form video editing', 'content design',
    ],
    skillPhrases: [
      'figma', 'ui ux', 'user interface', 'user experience',
      'landing page design', 'marketing design', 'static ad creative',
      'social media graphics', 'email design', 'design systems',
      'marketing designer',
      'brand identity', 'logo design', 'presentation design',
      'digital ad', 'ecommerce creative', 'e commerce creative',
      'ai ad creative', 'ai ugc video', 'ai video ads',
      'short form video', 'content design', 'graphic designer',
      'logo designer', 'presentation designer', 'social media graphic designer',
    ],
  },
  {
    id: 'content',
    titleRolePhrases: [
      'email copywriter', 'landing page copywriter', 'website copywriter',
      'technical content writer', 'technical writer', 'content strategist',
      'content writer', 'email marketing copywriter',
      'social media content creator', 'social media manager',
      'content marketing assistant', 'saas content writer',
      'content repurposing specialist', 'ai content creator',
      'digital marketing assistant',
      'social media coordinator', 'tiktok content creator', 'instagram content creator',
      'youtube content creator', 'video content creator', 'ugc creator',
      'short form content creator', 'podcast coordinator',
      'newsletter writer', 'newsletter editor',
    ],
    detailRolePhrases: [
      'email copywriting', 'landing page copywriting', 'website copywriting',
      'technical content writing', 'content strategy',
      'social media content creation', 'social media management',
      'content marketing assistance', 'saas content writing',
      'content repurposing', 'ai content creation',
      'digital marketing assistance',
      'tiktok content creation', 'instagram content creation',
      'youtube content creation', 'short form video content',
      'ugc content', 'podcast coordination', 'newsletter writing', 'newsletter editing',
    ],
    skillPhrases: [
      'email copywriting', 'landing page copywriting', 'website copywriting',
      'email copy', 'landing page copy', 'website copy',
      'technical content', 'content strategy', 'copywriting',
      'content writing', 'content writer', 'social media content',
      'social media management', 'social media manager',
      'content marketing', 'saas content', 'content repurposing',
      'ai content', 'digital marketing',
      'tiktok', 'instagram', 'youtube content', 'short form video',
      'ugc', 'podcast', 'newsletter', 'social media coordinator',
    ],
    titleRoleWords: ['copywriter', 'writer', 'content', 'strategist', 'coordinator'],
  },
  {
    id: 'community',
    titleRolePhrases: [
      'community manager', 'community coordinator', 'online community manager',
      'community moderator', 'chat moderator', 'discord moderator',
      'reddit moderator', 'forum moderator', 'social media moderator',
      'content moderator', 'platform moderator', 'trust and safety specialist',
      'community builder', 'community lead', 'head of community',
      'community engagement specialist', 'community operations manager',
      'community support specialist',
    ],
    titleRoleWords: ['moderator', 'community', 'moderation'],
    detailRolePhrases: [
      'community management', 'community moderation', 'chat moderation',
      'forum moderation', 'content moderation', 'discord community',
      'community engagement', 'trust and safety', 'community building',
      'online community', 'community growth', 'community support',
    ],
    skillPhrases: [
      'community management', 'discord', 'slack community', 'reddit',
      'forum moderation', 'chat moderation', 'content moderation',
      'community engagement', 'trust and safety', 'community coordinator',
      'community builder', 'online community', 'community moderator',
      'discord moderator', 'community manager',
    ],
  },
  {
    id: 'marketing',
    titleRolePhrases: [
      'digital marketing manager', 'digital marketing specialist', 'digital marketing coordinator',
      'growth marketer', 'growth hacker', 'performance marketer',
      'seo specialist', 'seo manager', 'sem specialist',
      'paid ads specialist', 'google ads specialist', 'facebook ads specialist',
      'meta ads specialist', 'paid media specialist', 'paid search specialist',
      'brand marketer', 'marketing analyst', 'marketing strategist',
      'demand generation specialist', 'lead generation specialist',
      'affiliate marketing manager', 'affiliate manager',
      'product marketing manager', 'product marketer',
      'marketing manager', 'marketing coordinator',
      'inbound marketing specialist', 'outbound marketing specialist',
      'b2b marketing specialist', 'b2c marketing specialist',
    ],
    titleRoleWords: ['marketer', 'marketing', 'seo', 'sem', 'ads'],
    detailRolePhrases: [
      'digital marketing', 'performance marketing', 'growth marketing',
      'seo strategy', 'search engine optimisation', 'search engine optimization',
      'paid advertising', 'google ads', 'facebook ads', 'meta ads',
      'demand generation', 'lead generation', 'affiliate marketing',
      'product marketing', 'brand marketing', 'marketing strategy',
      'marketing analytics', 'conversion rate optimization',
      'b2b marketing', 'b2c marketing', 'inbound marketing', 'outbound marketing',
    ],
    skillPhrases: [
      'digital marketing', 'seo', 'sem', 'google ads', 'facebook ads',
      'meta ads', 'paid advertising', 'growth hacking', 'performance marketing',
      'demand generation', 'lead generation', 'affiliate marketing',
      'brand marketing', 'marketing strategy', 'marketing analytics',
      'product marketing', 'conversion rate optimization',
      'search engine optimisation', 'search engine optimization',
      'b2b marketing', 'inbound marketing',
    ],
  },
]

const socialGraphicsEvidence = [
  'marketing design', 'static ad creative', 'social media graphics',
  'advertising creative', 'brand assets',
]

const productDesignEvidence = [
  'figma', 'ui ux', 'user experience', 'user interface',
  'saas interface design', 'design systems',
]

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function containsPhrase(text: string, phrase: string) {
  return ` ${text} `.includes(` ${normalize(phrase)} `)
}

function hasAnyPhrase(text: string, phrases: string[]) {
  return phrases.some((phrase) => containsPhrase(text, phrase))
}

export function getTargetJobCategories(
  title: string,
  details = '',
  metadata: string[] = [],
): TargetJobCategory[] {
  const normalizedTitle = normalize(title)
  const normalizedDetails = normalize([details, ...metadata].join(' '))
  const normalizedDescription = normalize(details)
  const combinedText = `${normalizedTitle} ${normalizedDetails}`
  const titleHasSpecificWebRole = hasAnyPhrase(normalizedTitle, [
    'full stack', 'fullstack', 'front end', 'frontend', 'react', 'next js',
  ])

  if (
    containsPhrase(normalizedTitle, 'shopify')
    || /\.net\b/i.test(title)
    || (containsPhrase(normalizedTitle, 'software engineer') && !titleHasSpecificWebRole)
  ) {
    return []
  }

  const matches = searchLanes
    .filter((lane) => {
      const titleHasRoleWord = hasAnyPhrase(normalizedTitle, lane.titleRoleWords)
      const roleMatches = hasAnyPhrase(normalizedTitle, lane.titleRolePhrases)
        || (titleHasRoleWord && hasAnyPhrase(normalizedDescription, lane.detailRolePhrases))
      const skillMatches = hasAnyPhrase(combinedText, lane.skillPhrases)
      return roleMatches && skillMatches
    })
    .map((lane) => lane.id)

  if (
    containsPhrase(normalizedTitle, 'product designer')
    && hasAnyPhrase(normalizedDetails, productDesignEvidence)
  ) {
    matches.push('design')
  }

  if (
    containsPhrase(normalizedTitle, 'graphic designer')
    && hasAnyPhrase(normalizedDetails, socialGraphicsEvidence)
  ) {
    matches.push('design')
  }

  return Array.from(new Set(matches))
}

export function isTargetJob(title: string, details = '', metadata: string[] = []) {
  return getTargetJobCategories(title, details, metadata).length > 0
}
