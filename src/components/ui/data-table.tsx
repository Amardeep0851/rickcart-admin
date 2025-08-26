"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  Row,
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
import { Input } from "@/components/ui/input";
import AlertModel from "./alert-model";

interface DataProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  onDelete: (rows: string[]) => void;
  disabled: boolean;
}

function DataTable<TData extends { id: string }, TValue>({
  data,
  columns,
  searchKey,
  onDelete,
  disabled,
}: DataProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [ids, setIds] = useState<string[] | []>([]);
  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });
  const handleDelete = () => {
    onDelete(ids);
  };
  return (
    <>
      <AlertModel
        title={`Confirm Deletion of rows`}
        description={`Are you sure you want to permanently delete rows? Once deleted, this information cannot be recovered. Please confirm your decision before proceeding.`}
        onClose={() => {
          setIsOpen(false);
          setIds([]);
        }}
        onComfirm={handleDelete}
        isOpen={isOpen}
        disabled={disabled}
      />
      <div>
        <div className="block lg:flex lg:justify-between space-y-4 py-4">
          <Input
            placeholder={`Search in table with ${searchKey}`}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="w-full lg:w-sm"
          />

          <Button
            variant="destructive"
            disabled={
              !table.getFilteredSelectedRowModel().rows.length || disabled
            }
            onClick={() => {
              const ids = table.getFilteredSelectedRowModel().rows.map((row) => row?.original.id);
              setIds(ids);
              setIsOpen(true);
              table.resetRowSelection();
            }}
            className="w-full lg:w-auto cursor-pointer"
          >
            {`Delete ${table.getSelectedRowModel().rows.length} ${
              table.getSelectedRowModel().rows.length < 2 ? "row" : "rows"
            }`}
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroups) => (
            <TableRow key={headerGroups.id}>
              {headerGroups.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="nth-[1]:w-10 last-of-type:w-10"
                >
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
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-6 my-5"
              >
                No Result.
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <div className="flex justify-end gap-x-4 mt-8 pb-10">
        <Button
          variant="default"
          className="cursor-pointer"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <Button
          variant="default"
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
