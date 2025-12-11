declare module '@mui/icons-material' {
  import { SvgIconProps } from '@mui/material';
  import { OverridableComponent } from '@mui/material/OverridableComponent';

  export interface SvgIconTypeMap {
    props: SvgIconProps;
    defaultComponent: 'svg';
  }

  type SvgIcon = OverridableComponent<SvgIconTypeMap>;

  export const Search: SvgIcon;
  export const ShoppingCart: SvgIcon;
  export const AccountCircle: SvgIcon;
  export const Menu: SvgIcon;
  export const Close: SvgIcon;
  export const Home: SvgIcon;
  export const Category: SvgIcon;
  export const Store: SvgIcon;
  export const Receipt: SvgIcon;
  export const Visibility: SvgIcon;
  export const VisibilityOff: SvgIcon;
  export const Facebook: SvgIcon;
  export const Google: SvgIcon;
  export const Twitter: SvgIcon;
  export const Phone: SvgIcon;
  export const Email: SvgIcon;
  export const LocalShipping: SvgIcon;
  export const Security: SvgIcon;
  export const Refresh: SvgIcon;
  export const Star: SvgIcon;
  export const ExpandMore: SvgIcon;
  export const Message: SvgIcon;
  export const FavoriteBorder: SvgIcon;
  export const Share: SvgIcon;
  export const ShoppingBag: SvgIcon;
  export const CheckCircle: SvgIcon;
  export const Cancel: SvgIcon;
  export const Replay: SvgIcon;
  export const Edit: SvgIcon;
  export const Delete: SvgIcon;
  export const Add: SvgIcon;
  export const Remove: SvgIcon;
  export const LocalOffer: SvgIcon;
  export const ViewList: SvgIcon;
  export const ViewModule: SvgIcon;
  export const Help: SvgIcon;
  export const Logout: SvgIcon;
  export const FlashOn: SvgIcon;
  export const FilterList: SvgIcon;
  export const Person: SvgIcon;
  export const LocationOn: SvgIcon;
  export const Favorite: SvgIcon;
  export const Settings: SvgIcon;
  export const Payment: SvgIcon;
  export const Instagram: SvgIcon;
  export const YouTube: SvgIcon;
}
