import React from "react";

export interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export function DataTable({ 
  title, 
  columns, 
  data 
}: { 
  title?: string; 
  columns: Column[]; 
  data: any[]; 
}) {
  return (
    <div className="w-full bg-background border border-border-light rounded-2xl overflow-hidden shadow-sm">
      {title && (
        <div className="px-6 py-4 border-b border-border-light bg-foreground/[0.01]">
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-light bg-foreground/[0.02]">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 text-[11px] font-semibold text-foreground/60 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-foreground/50">
                  No data available.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-foreground/[0.01] transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-foreground/80 whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
