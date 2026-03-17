"use client";
"use no memo";

import { Input } from "@/components/ui/input";
import { DataTable as DataTableCore } from "../../../../../components/data-table/data-table";
import { DataTablePagination } from "../../../../../components/data-table/data-table-pagination";
import { DataTableViewOptions } from "../../../../../components/data-table/data-table-view-options";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { transactionColumns } from "./columns";

export function TransactionsTable({ transactions = [] }) {
	const table = useDataTableInstance({
		data: transactions,
		columns: transactionColumns,
		enableRowSelection: false,
		getRowId: (row, index) => row.id?.toString() ?? String(index),
	});

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex items-center justify-between gap-2'>
				<Input
					placeholder='Filtrer par type...'
					value={
						table.getColumn("transaction_type")?.getFilterValue() ??
						""
					}
					onChange={(e) =>
						table
							.getColumn("transaction_type")
							?.setFilterValue(e.target.value)
					}
					className='max-w-xs'
				/>
				<DataTableViewOptions table={table} />
			</div>
			<DataTableCore table={table} columns={transactionColumns} />
			<DataTablePagination table={table} />
		</div>
	);
}
