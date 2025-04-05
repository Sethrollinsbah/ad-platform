// src/lib/data/site-content.ts

export const siteContent = {
  // Company Info
  companyName: 'ResAds',
  
  // Hero Section
  hero: {
    headline: {
      prefix: 'Serve Up',
      highlight: 'Sizzling',
      suffix: 'Restaurant Ads'
    },
    description: 'We cook up mouth-watering ads that bring hungry customers to your restaurant. Our secret sauce? Eye-catching designs and targeted campaigns that work.',
    cta: {
      primary: 'Start Your Campaign',
      secondary: 'See How It Works'
    }
  },
  
  // Navigation
  nav: {
    links: [
      { text: 'Features', href: '#features' },
      { text: 'How It Works', href: '#howItWorks' },
      { text: 'Pricing', href: '#pricing' },
      { text: 'Testimonials', href: '#testimonials' }
    ],
    ctaButton: {
      text: 'Get Started',
      href: '#contact'
    }
  },
  
  // Stats Section
  stats: [
    { value: '3.2x', label: 'ROI Average' },
    { value: '+45%', label: 'Foot Traffic' },
    { value: '400+', label: 'Happy Clients' },
    { value: '95%', label: 'Retention Rate' }
  ],
  
  // Features Section
  features: {
    title: 'Our Secret Ingredients',
    subtitle: 'What makes our ad campaigns so delicious',
    items: [
      {
        icon: '🎯',
        title: 'Targeted Campaigns',
        description: 'We serve your ads to the perfect audience, ensuring your marketing budget is spent efficiently.',
        color: 'red'
      },
      {
        icon: '🎨',
        title: 'Eye-Catching Design',
        description: 'Our creative team cooks up designs that make mouths water and phones ring for reservations.',
        color: 'blue'
      },
      {
        icon: '📊',
        title: 'Data-Driven Results',
        description: 'We measure everything so you can see exactly how many customers your campaigns are bringing in.',
        color: 'amber'
      }
    ]
  },
  
  // How It Works Section
  howItWorks: {
    title: 'How It Works',
    subtitle: 'Our simple recipe for restaurant advertising success',
    steps: [
      {
        number: 1,
        title: 'Discovery',
        description: 'We learn about your restaurant, audience, and goals.'
      },
      {
        number: 2,
        title: 'Strategy',
        description: 'Our team creates a custom campaign strategy for your needs.'
      },
      {
        number: 3,
        title: 'Launch',
        description: 'We deploy your ads across targeted platforms and networks.'
      },
      {
        number: 4,
        title: 'Optimize',
        description: 'We continuously monitor and improve your campaign performance.'
      }
    ]
  },
  
  // Pricing Section
  pricingData: {
		title: 'Transparent CPM Pricing',
		subtitle: 'Get more bang for your buck with our impression-based pricing',
		plans: [
			{
				id: 'local',
				name: 'Local Reach',
				badge: 'STARTER',
				price: '$12.50',
				cpmValue: 12.5,
				period: 'CPM',
				details: 'Starting at $499/mo',
				minBudget: 499,
				features: [
					'Targeted local audience',
					'Neighborhood geofencing',
					'Mobile-optimized ads',
					'Weekly performance reports',
					'~40,000 monthly impressions'
				],
				impressions: 40000,
				savings: 'Save up to 35% vs traditional platforms',
				isPopular: false
			},
			{
				id: 'regional',
				name: 'Regional Impact',
				badge: 'POPULAR',
				price: '$11.25',
				cpmValue: 11.25,
				period: 'CPM',
				details: 'Starting at $899/mo',
				minBudget: 899,
				features: [
					'Wider geo-targeting options',
					'Cross-platform campaign distribution',
					'Custom audience segments',
					'Advanced performance dashboard',
					'~80,000 monthly impressions'
				],
				impressions: 80000,
				savings: 'Save up to 45% vs traditional platforms',
				isPopular: true
			},
			{
				id: 'maximum',
				name: 'Maximum Exposure',
				badge: 'PREMIUM',
				price: '$9.99',
				cpmValue: 9.99,
				period: 'CPM',
				details: 'Starting at $1,499/mo',
				minBudget: 1499,
				features: [
					'Multi-location targeting',
					'Premium placement inventory',
					'Competitor conquest targeting',
					'Full-service campaign management',
					'~150,000 monthly impressions'
				],
				impressions: 150000,
				savings: 'Save up to 55% vs traditional platforms',
				isPopular: false
			}
		]
	},
  
  // Testimonials Section
  testimonials: {
    title: 'Happy Customers',
    subtitle: 'Don\'t just take our word for it',
    items: [
      {
        quote: 'Our restaurant traffic doubled in just two months after working with ResAds. Their team really understands how to reach hungry customers.',
        name: 'Maria Rodriguez',
        company: 'Taco Fiesta'
      },
      {
        quote: 'The creative designs they made for our Italian restaurant perfectly captured our authentic vibe. Our ROI has been incredible!',
        name: 'Marco Bianchi',
        company: 'Pasta Paradise'
      },
      {
        quote: 'As a small family diner, we were struggling to compete with big chains. ResAds helped us find our audience and now we\'re booked every weekend!',
        name: 'Sarah Johnson',
        company: 'Hometown Diner'
      }
    ]
  },
  
  // Contact Form
  contact: {
    title: 'Ready to Get Started?',
    subtitle: 'Fill out the form below and we\'ll be in touch within 24 hours',
    submitButtonText: 'Let\'s Cook Up Some Ads!',
    packageOptions: [
      { value: 'appetizer', label: 'Appetizer - $499/mo' },
      { value: 'main-course', label: 'Main Course - $899/mo' },
      { value: 'full-menu', label: 'Full Menu - $1499/mo' },
      { value: 'custom', label: 'Custom Solution' }
    ]
  },
  
  // Footer
  footer: {
    description: 'Helping restaurants attract more customers with delicious advertising that works.',
    sections: [
      {
        title: 'Services',
        links: [
          { text: 'Features', href: '#features' },
          { text: 'How It Works', href: '#howItWorks' },
          { text: 'Pricing', href: '#pricing' },
          { text: 'Testimonials', href: '#testimonials' }
        ]
      },
      // {
      //   title: 'Resources',
      //   links: [
      //     { text: 'Case Studies', href: '#' },
      //     { text: 'Marketing Tips', href: '#' },
      //     { text: 'Industry Reports', href: '#' },
      //     { text: 'Help Center', href: '#' }
      //   ]
      // }
    ],
    contact: {
      title: 'Contact',
      email: 'hello@resads.com',
      phone: '(555) 123-4567',
      address: [
        'Building Street',
        'Miami, Fl 33333'
      ]
    },
    copyright: '© 2025 ResAds. All rights reserved.',
    socialLinks: [
      { name: 'Facebook', href: '#' },
      { name: 'Instagram', href: '#' },
      { name: 'Twitter', href: '#' },
      { name: 'LinkedIn', href: '#' }
    ]
  }
};
