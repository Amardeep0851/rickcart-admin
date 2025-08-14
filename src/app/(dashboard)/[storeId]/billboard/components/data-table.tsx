import React from 'react';
import { 
  getCoreRowModel, 
  getFilteredRowModel, 
  useReactTable, 
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { BillboardDataProps } from "./coulmn";

interface DataProps<TData, TValue>{
  columns:ColumnDef<TData, TValue>[];
  data:TData[];
}

function DataTable<TData, TValue>({data, columns}:DataProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel:getCoreRowModel(),
    getFilteredRowModel:getFilteredRowModel(),

  })
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroups) => (
          <TableRow key={headerGroups.id}>
            {headerGroups.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      {table.getRowModel().rows.length ? (
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length}>No Result.</TableCell>
          </TableRow>
        </TableBody>
      )}
    </Table>
  );
}

export default DataTable