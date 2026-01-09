export interface DropdownItem {
  name: string;
  href: string;
}

export interface MenuItem {
  name: string;
  href: string;
  hasDropdown: boolean;
  dropdownItems?: DropdownItem[];
}

