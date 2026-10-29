// Style for top-level nav links; NavLink passes { isActive }
export const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-plum ${isActive ? "text-plum" : "text-gray-900"}`;
