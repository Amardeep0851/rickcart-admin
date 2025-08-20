"use client";
import React from "react";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function DataTable<TData, TValue>({ data, columns }: DataProps<TData, TValue>) {

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>( [] )

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state:{
      columnFilters
    }
  });
  return (
    <>
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
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow >
              <TableCell colSpan={columns.length} className="text-center py-6 my-5">
                No Result.
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <div className="flex justify-end gap-x-4 mt-8">
        <Button 
        variant="default" 
        className="cursor-pointer"
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}>
          Previous 
        </Button>
        <Button variant="default"
        className="cursor-pointer"
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
        >
          Next 
        </Button>
      </div>
    </>
  );
}

export default DataTable;
