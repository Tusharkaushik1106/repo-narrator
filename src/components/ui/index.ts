/**
 * Graffico UI Kit — barrel export
 *
 * Import anything from "@/components/ui":
 *   import { Button, Card, Modal } from "@/components/ui"
 */

// ── Utilities ──────────────────────────────────────────────────────────────
export { cn } from "@/lib/utils";

// ── Button ─────────────────────────────────────────────────────────────────
export { Button, IconButton } from "./button";
export type { ButtonProps, IconButtonProps, ButtonVariant, ButtonSize } from "./button";

// ── Input / Textarea ───────────────────────────────────────────────────────
export { Input, Textarea } from "./input";
export type { InputProps, TextareaProps, InputVariant, InputSize } from "./input";

// ── Select ─────────────────────────────────────────────────────────────────
export { Select } from "./select";
export type { SelectProps, SelectOption } from "./select";

// ── Card ───────────────────────────────────────────────────────────────────
export { Card, CardHeader, CardBody, CardFooter, Badge } from "./card";
export type { CardProps, CardVariant, CardHeaderProps, CardFooterProps, BadgeProps, BadgeVariant } from "./card";

// ── Modal ──────────────────────────────────────────────────────────────────
export { Modal, ConfirmModal } from "./modal";
export type { ModalProps, ConfirmModalProps, ModalSize } from "./modal";

// ── Navbar ─────────────────────────────────────────────────────────────────
export { Navbar, NavBrand } from "./navbar";
export type { NavbarProps, NavBrandProps, NavItem } from "./navbar";

// ── Typography ─────────────────────────────────────────────────────────────
export {
  Heading,
  Body,
  Lead,
  Label,
  Eyebrow,
  InlineCode,
  CodeBlock,
  Divider,
  Blockquote,
} from "./typography";
export type { HeadingProps, BodyProps, LabelProps, DividerProps } from "./typography";

// ── Layout / Container ─────────────────────────────────────────────────────
export { Container, Section, Stack, Grid, PageHeader } from "./container";
export type {
  ContainerProps,
  ContainerSize,
  SectionProps,
  SectionSpacing,
  StackProps,
  StackGap,
  GridProps,
  GridCols,
  PageHeaderProps,
} from "./container";

// ── Form ───────────────────────────────────────────────────────────────────
export {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormSection,
  CheckboxField,
  RadioField,
} from "./form";
export type {
  FormProps,
  FormFieldProps,
  FormLabelProps,
  FormMessageProps,
  FormSectionProps,
  CheckboxFieldProps,
  RadioFieldProps,
} from "./form";

// ── Background ─────────────────────────────────────────────────────────────
export { NeuralBackground } from "./neural-background";

// ── Theme ───────────────────────────────────────────────────────────────────
export { ThemeToggle } from "./theme-toggle";
export type { ThemeToggleProps } from "./theme-toggle";
