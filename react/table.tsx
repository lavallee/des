/**
 * Design System — DataTable (TanStack Table v8)
 *
 * Full-featured data table with sorting, filtering, column visibility,
 * row selection, and optional virtual scrolling for large datasets.
 *
 * Dependencies:
 *   @tanstack/react-table   ^8.x
 *   @tanstack/react-virtual ^3.x  (only needed for <DataTableVirtual>)
 *   lucide-react
 *
 * CSS: components.css (.data-table, .table-scroll, .col--*, .filter-bar, ...)
 *      radix.css (.ds-menu-*, .ds-popover-*)
 *
 * Usage:
 *   import { useDataTable, DataTableColumnHeader, DataTableViewOptions,
 *            DataTableToolbar, DataTable } from './table'
 *
 *   const columns: ColumnDef<Row>[] = [
 *     { accessorKey: 'name', header: (ctx) => <DataTableColumnHeader column={ctx.column} title="Name" /> },
 *     { accessorKey: 'score', header: (ctx) => <DataTableColumnHeader column={ctx.column} title="Score" />,
 *       meta: { numeric: true } },
 *   ]
 *
 *   function MyTable() {
 *     const table = useDataTable({ data, columns })
 *     return <DataTable table={table} />
 *   }
 */

import * as React from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  type Column,
  type Table as TTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  EyeOff,
  Settings2,
  X,
  Check,
} from 'lucide-react'
import { cn } from './components'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './radix'
import { Popover, PopoverContent, PopoverTrigger } from './radix'
import { Checkbox } from './radix'
import { Button } from './components'

// ── TypeScript augmentation ────────────────────────────────────────────────

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends unknown, TValue> {
    align?: 'left' | 'right' | 'center'
    numeric?: boolean
    className?: string
  }
}


// ── useDataTable hook ──────────────────────────────────────────────────────

export interface UseDataTableOptions<TData> {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  initialSorting?: SortingState
  initialColumnFilters?: ColumnFiltersState
  initialVisibility?: VisibilityState
  enableRowSelection?: boolean
}

export function useDataTable<TData>({
  data,
  columns,
  initialSorting = [],
  initialColumnFilters = [],
  initialVisibility = {},
  enableRowSelection = false,
}: UseDataTableOptions<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialColumnFilters)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialVisibility)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return table
}


// ── DataTableColumnHeader ──────────────────────────────────────────────────

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={cn(className)}>{title}</span>
  }

  const sorted = column.getIsSorted()

  return (
    <button
      className={cn('col--sortable-btn', className)}
      onClick={column.getToggleSortingHandler()}
      title={sorted === 'asc' ? 'Sort descending' : sorted === 'desc' ? 'Clear sort' : 'Sort ascending'}
    >
      {title}
      {sorted === 'asc' ? (
        <ArrowUp size={12} />
      ) : sorted === 'desc' ? (
        <ArrowDown size={12} />
      ) : (
        <ArrowUpDown size={12} style={{ opacity: 0.4 }} />
      )}
    </button>
  )
}


// ── DataTableViewOptions ───────────────────────────────────────────────────

interface DataTableViewOptionsProps<TData> {
  table: TTable<TData>
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="filter-input" style={{ gap: 6 }}>
          <Settings2 size={14} />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide())
          .map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              checked={col.getIsVisible()}
              onCheckedChange={(value) => col.toggleVisibility(!!value)}
            >
              {col.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


// ── DataTableFacetedFilter ─────────────────────────────────────────────────

interface DataTableFacetedFilterProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  options: { label: string; value: string; icon?: React.ReactNode }[]
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facetedValues = column.getFacetedUniqueValues()
  const selectedValues = new Set(column.getFilterValue() as string[])

  function toggle(value: string) {
    const next = new Set(selectedValues)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    column.setFilterValue(next.size > 0 ? Array.from(next) : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={cn('filter-input', selectedValues.size > 0 && 'filter-input--active')}>
          {title}
          {selectedValues.size > 0 && (
            <span className="filter-chip" style={{ marginLeft: 4, cursor: 'default' }}>
              {selectedValues.size}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ padding: 'var(--space-1) 0', minWidth: 180 }}>
        <div style={{ padding: '5px var(--space-3)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-dim)', fontWeight: 'var(--weight-medium)' }}>
          {title}
        </div>
        {selectedValues.size > 0 && (
          <>
            <button
              className="ds-menu-item"
              onClick={() => column.setFilterValue(undefined)}
              style={{ width: '100%', color: 'var(--text-dim)', fontSize: 'var(--text-xs)' }}
            >
              <X size={12} />
              Clear filter
            </button>
            <div className="ds-menu-separator" />
          </>
        )}
        {options.map((opt) => {
          const isSelected = selectedValues.has(opt.value)
          const count = facetedValues.get(opt.value) ?? 0
          return (
            <button
              key={opt.value}
              className={cn('ds-menu-item', isSelected && 'ds-menu-item--selected')}
              onClick={() => toggle(opt.value)}
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isSelected && <Check size={11} style={{ color: 'var(--accent-text)' }} />}
                </span>
                {opt.icon}
                {opt.label}
              </span>
              {count > 0 && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}


// ── DataTableToolbar ───────────────────────────────────────────────────────

export interface DataTableToolbarProps<TData> {
  table: TTable<TData>
  globalFilterPlaceholder?: string
  children?: React.ReactNode
  showViewOptions?: boolean
}

export function DataTableToolbar<TData>({
  table,
  globalFilterPlaceholder = 'Search…',
  children,
  showViewOptions = true,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter

  return (
    <div className="filter-bar">
      <input
        className="filter-input"
        placeholder={globalFilterPlaceholder}
        value={table.getState().globalFilter ?? ''}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        style={{ minWidth: 180 }}
      />
      {children}
      {isFiltered && (
        <button
          className="filter-clear"
          onClick={() => {
            table.resetColumnFilters()
            table.setGlobalFilter('')
          }}
        >
          <X size={12} />
          Reset
        </button>
      )}
      {showViewOptions && (
        <div style={{ marginLeft: 'auto' }}>
          <DataTableViewOptions table={table} />
        </div>
      )}
    </div>
  )
}


// ── DataTable ──────────────────────────────────────────────────────────────

export interface DataTableProps<TData> {
  table: TTable<TData>
  className?: string
  onRowClick?: (row: TData) => void
  emptyMessage?: string
}

export function DataTable<TData>({
  table,
  className,
  onRowClick,
  emptyMessage = 'No results.',
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows

  return (
    <div className="table-scroll">
      <table className={cn('data-table', className)}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      meta?.numeric || meta?.align === 'right' ? 'col--num' : undefined,
                      meta?.align === 'center' ? 'col--center' : undefined,
                      meta?.className,
                    )}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta
                  return (
                    <td
                      key={cell.id}
                      className={cn(
                        meta?.numeric || meta?.align === 'right' ? 'col--num' : undefined,
                        meta?.align === 'center' ? 'col--center' : undefined,
                        meta?.className,
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-dim)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}


// ── DataTableVirtual ───────────────────────────────────────────────────────
// Pattern B: CSS grid tbody layout with absolute-positioned rows.
// Use for datasets > ~500 rows where DOM count matters.
// The scroll container must have a fixed height (pass via className or style).

export interface DataTableVirtualProps<TData> {
  table: TTable<TData>
  estimateSize?: number
  className?: string
  containerClassName?: string
  containerStyle?: React.CSSProperties
  onRowClick?: (row: TData) => void
}

export function DataTableVirtual<TData>({
  table,
  estimateSize = 36,
  className,
  containerClassName,
  containerStyle,
  onRowClick,
}: DataTableVirtualProps<TData>) {
  const rows = table.getRowModel().rows
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateSize,
    overscan: 10,
  })

  const virtualRows = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  // Padding rows substitute for untranslated empty space at top/bottom
  const paddingTop = virtualRows.length > 0 ? (virtualRows[0]?.start ?? 0) : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end ?? 0)
      : 0

  const visibleColumns = table.getVisibleLeafColumns()

  return (
    <div
      ref={scrollRef}
      className={cn('table-scroll', containerClassName)}
      style={{ overflow: 'auto', position: 'relative', ...containerStyle }}
    >
      <table className={cn('data-table', className)} style={{ display: 'grid' }}>
        <thead style={{ display: 'grid', position: 'sticky', top: 0, zIndex: 1 }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} style={{ display: 'flex', width: '100%' }}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta
                return (
                  <th
                    key={header.id}
                    className={cn(
                      meta?.numeric || meta?.align === 'right' ? 'col--num' : undefined,
                      meta?.align === 'center' ? 'col--center' : undefined,
                      meta?.className,
                    )}
                    style={{ display: 'flex', width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody
          style={{
            display: 'grid',
            height: `${totalSize}px`,
            position: 'relative',
          }}
        >
          {paddingTop > 0 && (
            <tr style={{ display: 'flex', height: paddingTop }}>
              <td style={{ flex: 1 }} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index]!
            return (
              <tr
                key={row.id}
                data-index={virtualRow.index}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                ref={virtualizer.measureElement}
                style={{
                  display: 'flex',
                  position: 'absolute',
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                  cursor: onRowClick ? 'pointer' : undefined,
                }}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta
                  const col = visibleColumns.find((c) => c.id === cell.column.id)
                  return (
                    <td
                      key={cell.id}
                      className={cn(
                        meta?.numeric || meta?.align === 'right' ? 'col--num' : undefined,
                        meta?.align === 'center' ? 'col--center' : undefined,
                        meta?.className,
                      )}
                      style={{ display: 'flex', alignItems: 'center', width: col?.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                })}
              </tr>
            )
          })}
          {paddingBottom > 0 && (
            <tr style={{ display: 'flex', height: paddingBottom }}>
              <td style={{ flex: 1 }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}


// ── Row selection column helper ────────────────────────────────────────────
// Include in your columns array to add a checkbox select-all / select-row column.

export function createSelectColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  }
}
