import { MenuItem } from '../types/navigation';

export const menuItems: MenuItem[] = [
  { 
    name: 'Home', 
    href: '/', 
    hasDropdown: false 
  },
  { 
    name: 'About', 
    href: '/about', 
    hasDropdown: true,
    dropdownItems: [
      { name: 'Information', href: '/about/overview' },
      { name: 'What we do', href: '/about/team' },
    ]
  },
  { 
    name: 'Media', 
    href: '/media', 
    hasDropdown: false
  },
  { 
    name: 'Gallery', 
    href: '/gallery', 
    hasDropdown: false
  },
  { 
    name: 'Activities', 
    href: '/activities', 
    hasDropdown: false
  },
  { 
    name: 'Team', 
    href: '/team', 
    hasDropdown: false
  },
  { 
    name: 'Other', 
    href: '/other', 
    hasDropdown: true,
    dropdownItems: [
      { name: 'Notices', href: '/events/notices' },
      { name: 'Publications', href: '/events/publications' }
    ]
  },
  { 
    name: 'Reach Us', 
    href: '/reach-us', 
    hasDropdown: false 
  },
];

