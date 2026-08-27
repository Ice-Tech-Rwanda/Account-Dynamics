// Local type workaround for lucide-react icons that exist at runtime
// but whose types can't be resolved from the monolithic d.ts file.
import type { ForwardRefExoticComponent, SVGProps, RefAttributes } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
} & RefAttributes<SVGSVGElement>;

type LucideIcon = ForwardRefExoticComponent<IconProps>;

// These icons exist in lucide-react at runtime but TS can't resolve them
// from the single-line export in the .d.ts file.
declare module "lucide-react" {
  export const Briefcase: LucideIcon;
  export const LayoutGrid: LucideIcon;
  export const Wallet: LucideIcon;
  export const Cpu: LucideIcon;
  export const Cog: LucideIcon;
  export const Cloud: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Shield: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Calculator: LucideIcon;
  export const Store: LucideIcon;
}
