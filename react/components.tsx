/**
 * Design System — React Components
 *
 * Headless-first: logic and accessibility via Radix Primitives,
 * styling via CSS custom properties from tokens.css + class names from components.css.
 * Variants managed by CVA (class-variance-authority).
 *
 * Dependencies: @radix-ui/react-*, class-variance-authority, clsx, tailwind-merge
 * All components expect tokens.css and components.css to be loaded globally.
 *
 * Usage: copy this file into your project's components/ directory and adjust imports.
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'

// ── Utility ────────────────────────────────────────────────────────────────

/** Merge class names, resolving Tailwind conflicts if using Tailwind */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return clsx(inputs)
}


// ── Badge ──────────────────────────────────────────────────────────────────

const badgeVariants = cva('badge', {
  variants: {
    intent: {
      success:   'badge--success',
      warning:   'badge--warning',
      error:     'badge--error',
      info:      'badge--info',
      neutral:   'badge--neutral',
      accent:    'badge--accent',
      verified:  'badge--verified',
      pending:   'badge--pending',
      dropped:   'badge--dropped',
      active:    'badge--active',
      draft:     'badge--draft',
    },
  },
  defaultVariants: { intent: 'neutral' },
})

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ intent, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ intent }), className)} {...props} />
}


// ── ScoreBadge ─────────────────────────────────────────────────────────────

/** Automatically assigns hi/mid/lo/na band based on value and thresholds. */
export interface ScoreBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number | null | undefined
  hiThreshold?: number  // default 0.70
  midThreshold?: number // default 0.40
  format?: (v: number) => string
}

export function ScoreBadge({
  value,
  hiThreshold = 0.70,
  midThreshold = 0.40,
  format = (v) => v.toFixed(2),
  className,
  ...props
}: ScoreBadgeProps) {
  if (value == null) {
    return <span className={cn('score score--na', className)} {...props}>—</span>
  }
  const band = value >= hiThreshold ? 'hi' : value >= midThreshold ? 'mid' : 'lo'
  return (
    <span className={cn(`score score--${band}`, className)} {...props}>
      {format(value)}
    </span>
  )
}


// ── Tag ────────────────────────────────────────────────────────────────────

export function Tag({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('tag', className)} {...props} />
}


// ── Button ─────────────────────────────────────────────────────────────────

const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary:     'btn--primary',
      secondary:   'btn--secondary',
      ghost:       'btn--ghost',
      destructive: 'btn--destructive',
    },
    size: {
      sm:   'btn--sm',
      md:   '',
      lg:   'btn--lg',
      icon: 'btn--icon',
    },
  },
  defaultVariants: { variant: 'secondary', size: 'md' },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}


// ── StatCard ───────────────────────────────────────────────────────────────

export interface StatCardProps {
  value: React.ReactNode
  label: string
  delta?: string
  deltaDir?: 'up' | 'down'
  valueIntent?: 'default' | 'success' | 'warning' | 'error' | 'accent'
  className?: string
}

export function StatCard({ value, label, delta, deltaDir, valueIntent = 'default', className }: StatCardProps) {
  const valueClass = cn(
    'stat-card__value',
    valueIntent !== 'default' && `stat-card__value--${valueIntent}`,
  )
  return (
    <div className={cn('stat-card', className)}>
      <div className={valueClass}>{value}</div>
      <div className="stat-card__label">{label}</div>
      {delta && (
        <div className={cn('stat-card__delta', deltaDir && `stat-card__delta--${deltaDir}`)}>
          {delta}
        </div>
      )}
    </div>
  )
}

export function StatGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('stat-grid', className)}>{children}</div>
}


// ── Callout ────────────────────────────────────────────────────────────────

const calloutVariants = cva('callout', {
  variants: {
    intent: {
      info:    'callout--info',
      warning: 'callout--warning',
      success: 'callout--success',
      error:   'callout--error',
    },
  },
  defaultVariants: { intent: 'info' },
})

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {}

export function Callout({ intent, className, ...props }: CalloutProps) {
  return <div className={cn(calloutVariants({ intent }), className)} {...props} />
}


// ── Kbd ────────────────────────────────────────────────────────────────────

export function Kbd({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <kbd className={cn('kbd', className)} {...props}>{children}</kbd>
}


// ── ScoreBar ───────────────────────────────────────────────────────────────

export interface ScoreBarProps {
  value: number      // 0–1
  label?: string
  showValue?: boolean
  hiThreshold?: number
  midThreshold?: number
  className?: string
}

export function ScoreBar({
  value,
  label,
  showValue = false,
  hiThreshold = 0.70,
  midThreshold = 0.40,
  className,
}: ScoreBarProps) {
  const band = value >= hiThreshold ? 'hi' : value >= midThreshold ? 'mid' : 'lo'
  const pct = `${Math.round(value * 100)}%`

  if (label || showValue) {
    return (
      <div className={cn('score-bar-labeled', className)}>
        <div className="score-bar-labeled__header">
          {label && <span>{label}</span>}
          {showValue && <span className="score-bar-labeled__val">{pct}</span>}
        </div>
        <div className="score-bar">
          <div className={`score-bar__fill score-bar__fill--${band}`} style={{ width: pct }} />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('score-bar', className)}>
      <div className={`score-bar__fill score-bar__fill--${band}`} style={{ width: pct }} />
    </div>
  )
}


// ── Timeline ───────────────────────────────────────────────────────────────

export interface TimelineItem {
  id: string
  text: React.ReactNode
  status?: 'verified' | 'pending' | 'dropped' | 'neutral'
  source?: string
}

export interface TimelineYearProps {
  year: string | number
  items: TimelineItem[]
}

export function Timeline({ years }: { years: TimelineYearProps[] }) {
  return (
    <div className="timeline">
      {years.map((y) => (
        <div key={y.year} className="timeline-year">
          <div className="timeline-year__label">{y.year}</div>
          <ul className="timeline-items">
            {y.items.map((item) => (
              <li key={item.id} className="timeline-item">
                {item.status && item.status !== 'neutral' && (
                  <Badge intent={item.status} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                )}
                {item.text}
                {item.source && (
                  <span className="timeline-item__source">{item.source}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}


// ── PulseDot ───────────────────────────────────────────────────────────────

export function PulseDot({ intent = 'success' }: { intent?: 'success' | 'warning' | 'error' }) {
  return (
    <span
      className={cn('pulse-dot', intent !== 'success' && `pulse-dot--${intent}`)}
    />
  )
}


// ── DataTable ──────────────────────────────────────────────────────────────
// Thin wrapper — use TanStack Table for the actual table logic.
// This provides the CSS class wiring.

export interface Column<T> {
  key: keyof T
  header: string
  align?: 'left' | 'right' | 'center'
  mono?: boolean
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  onSort?: (key: keyof T) => void
  sortKey?: keyof T
  sortDir?: 'asc' | 'desc'
  className?: string
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  rows,
  onSort,
  sortKey,
  sortDir,
  className,
}: DataTableProps<T>) {
  return (
    <div className="table-scroll">
      <table className={cn('data-table', className)}>
        <thead>
          <tr>
            {columns.map((col) => {
              const isSort = sortKey === col.key
              const sortClass = onSort
                ? isSort
                  ? sortDir === 'asc' ? 'col--sort-asc' : 'col--sort-desc'
                  : 'col--sort-none col--sortable'
                : undefined
              return (
                <th
                  key={String(col.key)}
                  className={cn(
                    col.align === 'right' ? 'col--num' : undefined,
                    col.align === 'center' ? 'col--center' : undefined,
                    col.sortable && sortClass,
                  )}
                  onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                >
                  {col.header}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn(
                    col.align === 'right' ? 'col--num' : undefined,
                    col.align === 'center' ? 'col--center' : undefined,
                    col.mono ? 'col--mono' : undefined,
                  )}
                >
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


// ── FilterBar ──────────────────────────────────────────────────────────────

export interface ActiveFilter {
  key: string
  label: string
  value: string
}

export interface FilterBarProps {
  children: React.ReactNode          // inputs, selects
  activeFilters?: ActiveFilter[]
  onRemoveFilter?: (key: string) => void
  onClearAll?: () => void
  className?: string
}

export function FilterBar({ children, activeFilters, onRemoveFilter, onClearAll, className }: FilterBarProps) {
  return (
    <div className={cn('filter-bar', className)}>
      {children}
      {activeFilters?.map((f) => (
        <span key={f.key} className="filter-chip" onClick={() => onRemoveFilter?.(f.key)}>
          {f.label}: {f.value}
          <span className="filter-chip__remove">×</span>
        </span>
      ))}
      {activeFilters && activeFilters.length > 0 && onClearAll && (
        <button className="filter-clear" onClick={onClearAll}>clear all</button>
      )}
    </div>
  )
}

export function FilterInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('filter-input', props.className)} {...props} />
}

export function FilterSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn('filter-select', props.className)} {...props} />
}


// ── Decision Workspace ────────────────────────────────────────────────────

export interface DecisionHeaderProps {
  kicker?: string
  title: React.ReactNode
  lede?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function DecisionHeader({ kicker, title, lede, children, className }: DecisionHeaderProps) {
  return (
    <header className={cn('decision-header', className)}>
      <div className="decision-header__copy">
        {kicker && <div className="decision-header__kicker">{kicker}</div>}
        <h1 className="decision-header__title">{title}</h1>
        {lede && <p className="decision-header__lede">{lede}</p>}
      </div>
      {children}
    </header>
  )
}

export interface SegmentedNavItem {
  label: string
  href: string
  count?: React.ReactNode
  active?: boolean
}

export function SegmentedNav({ items, label }: { items: SegmentedNavItem[]; label: string }) {
  return (
    <nav className="segmented-nav" aria-label={label}>
      {items.map((item) => (
        <a key={item.href} href={item.href} className={cn('segmented-nav__item', item.active && 'is-active')}>
          {item.label}
          {item.count != null && <span className="segmented-nav__count">{item.count}</span>}
        </a>
      ))}
    </nav>
  )
}

export function DecisionLayout({ rail, children, className }: { rail: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('decision-layout', className)}>
      <aside className="decision-rail">{rail}</aside>
      <div>{children}</div>
    </div>
  )
}

export interface DecisionBriefStep {
  term: string
  description: React.ReactNode
}

export interface DecisionBriefProps {
  index?: string
  kicker: string
  title: React.ReactNode
  copy?: React.ReactNode
  steps: DecisionBriefStep[]
  className?: string
}

export function DecisionBrief({ index = '01', kicker, title, copy, steps, className }: DecisionBriefProps) {
  return (
    <section className={cn('decision-brief', className)}>
      <div className="decision-brief__kicker"><span className="decision-brief__index">{index}</span>{kicker}</div>
      <h2 className="decision-brief__title">{title}</h2>
      {copy && <p className="decision-brief__copy">{copy}</p>}
      <dl className="decision-brief__steps">
        {steps.map((step) => (
          <div className="decision-brief__step" key={step.term}>
            <dt className="decision-brief__term">{step.term}</dt>
            <dd className="decision-brief__description">{step.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function DecisionListHeader({ primary, note }: { primary: React.ReactNode; note?: React.ReactNode }) {
  return (
    <div className="decision-list-header">
      <div className="decision-list-header__primary">{primary}</div>
      {note && <span className="decision-list-header__note">{note}</span>}
    </div>
  )
}

export interface DecisionCardProps {
  rank?: string
  selection?: React.ReactNode
  children: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function DecisionCard({ rank, selection, children, action, className }: DecisionCardProps) {
  return (
    <article className={cn('decision-card', className)}>
      <div className="decision-card__layout">
        {(rank || selection) && <div className="decision-card__rail">{rank && <span className="decision-card__rank">{rank}</span>}{selection}</div>}
        <div className="decision-card__body">{children}</div>
        {action && <div className="decision-card__action">{action}</div>}
      </div>
    </article>
  )
}

export function DecisionRationale({ label = 'Why here', copy, score }: { label?: string; copy: React.ReactNode; score?: React.ReactNode }) {
  return (
    <div className="decision-rationale">
      <span className="decision-rationale__label">{label}</span>
      <span className="decision-rationale__copy">{copy}</span>
      {score}
    </div>
  )
}


// ── Typed Record Lists ────────────────────────────────────────────────────

export interface RecordSectionProps {
  kicker?: string
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function RecordSection({ kicker, title, description, action, children, className }: RecordSectionProps) {
  return (
    <section className={cn('record-section', className)}>
      <header className="record-section__header">
        <div className="record-section__copy">
          {kicker && <div className="record-section__kicker">{kicker}</div>}
          <h2 className="record-section__title">{title}</h2>
          {description && <p className="record-section__description">{description}</p>}
        </div>
        {action}
      </header>
      <div className="record-list">{children}</div>
    </section>
  )
}

export interface RecordItemProps {
  kind: React.ReactNode
  state?: React.ReactNode
  age?: React.ReactNode
  title: React.ReactNode
  children?: React.ReactNode
  meta?: React.ReactNode
  detailsLabel?: React.ReactNode
  details?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function RecordItem({ kind, state, age, title, children, meta, detailsLabel, details, actions, className }: RecordItemProps) {
  return (
    <article className={cn('record-item', !actions && 'record-item--compact', className)}>
      <div className="record-item__marker">
        <span className="record-item__kind">{kind}</span>
        {state && <span className="record-item__state">{state}</span>}
        {age && <span className="record-item__age">{age}</span>}
      </div>
      <div className="record-item__content">
        <h3 className="record-item__title">{title}</h3>
        {children && <div className="record-item__summary">{children}</div>}
        {details && (
          <details className="record-item__details">
            <summary>{detailsLabel || 'Read full record'}</summary>
            <div className="record-item__details-body">{details}</div>
          </details>
        )}
        {meta && <div className="record-item__meta">{meta}</div>}
      </div>
      {actions && <div className="record-item__actions">{actions}</div>}
    </article>
  )
}


// ── Breadcrumb ─────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumb">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="breadcrumb__sep">›</span>}
          {item.href && i < items.length - 1 ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            <span className={i === items.length - 1 ? 'breadcrumb__current' : undefined}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}


// ── ReadingGuide ───────────────────────────────────────────────────────────

export interface ReadingGuideEntry {
  color: string
  label: string
}

export interface ReadingGuideProps {
  description: React.ReactNode
  legend?: ReadingGuideEntry[]
  note?: string
}

export function ReadingGuide({ description, legend, note }: ReadingGuideProps) {
  return (
    <div className="reading-guide">
      <span className="reading-guide__label">How to read</span>
      <span>{description}</span>
      {legend?.map((entry) => (
        <span key={entry.label}>
          <span
            className="reading-guide__swatch"
            style={{ background: entry.color }}
          />
          {entry.label}
        </span>
      ))}
      {note && <span className="text-dim text-xs">{note}</span>}
    </div>
  )
}


// ── DetailRow ──────────────────────────────────────────────────────────────

export interface DetailRowProps {
  name: React.ReactNode
  description?: string
  badge?: React.ReactNode
  value?: React.ReactNode
  twoCol?: boolean
}

export function DetailRow({ name, description, badge, value, twoCol }: DetailRowProps) {
  return (
    <div className={cn('detail-row', twoCol && 'detail-row--two-col')}>
      <div>
        <div className="detail-row__name">{name}</div>
        {description && <div className="detail-row__desc">{description}</div>}
      </div>
      {badge && <div>{badge}</div>}
      {value && <div className="detail-row__count">{value}</div>}
    </div>
  )
}
