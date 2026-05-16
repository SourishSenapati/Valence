"use client";

import { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassButton } from "@/components/ui/GlassButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Check, X, Edit2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner or similar for notifications

export function ApprovalTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});

  const fetchData = async () => {
    try {
      const res = await fetch("/api/manager/approvals");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (goalId: string, action: string, extraData: any = {}) => {
    try {
      const path = action === "APPROVE" ? "/api/goals/approve" : "/api/manager/approvals";
      const payload = action === "APPROVE" 
        ? { goalId, newWeightage: extraData.weightage, newTarget: extraData.targetValue }
        : { goalId, action, ...extraData };

      const res = await fetch(path, {
        method: "POST", // The approve API uses POST
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchData();
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "employee.name",
      header: "Employee",
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-white">{row.original.employee.name}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{row.original.employee.department}</p>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Goal Title",
      cell: ({ row }) => <p className="font-medium text-gray-300">{row.original.title}</p>,
    },
    {
      accessorKey: "weightage",
      header: "Weightage (%)",
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id;
        return isEditing ? (
          <input
            type="number"
            className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm outline-none focus:border-accent-blue"
            value={editValues.weightage ?? row.original.weightage}
            onChange={(e) => setEditValues({ ...editValues, weightage: Number(e.target.value) })}
          />
        ) : (
          <span className="font-mono text-accent-blue font-bold">{row.original.weightage}%</span>
        );
      },
    },
    {
      accessorKey: "targetValue",
      header: "Target",
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id;
        return isEditing ? (
          <input
            type="number"
            className="w-24 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm outline-none focus:border-accent-blue"
            value={editValues.targetValue ?? row.original.targetValue}
            onChange={(e) => setEditValues({ ...editValues, targetValue: Number(e.target.value) })}
          />
        ) : (
          <span className="font-mono text-white">{row.original.targetValue}</span>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id;
        return (
          <div className="flex items-center justify-end gap-2">
            {isEditing ? (
              <>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAction(row.original.id, "UPDATE", editValues)}
                  className="p-2 text-accent-green"
                >
                  <Save className="w-4 h-4" />
                </GlassButton>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingId(null)}
                  className="p-2 text-gray-500"
                >
                  <X className="w-4 h-4" />
                </GlassButton>
              </>
            ) : (
              <>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingId(row.original.id);
                    setEditValues({ weightage: row.original.weightage, targetValue: row.original.targetValue });
                  }}
                  className="p-2 text-gray-500 hover:text-white"
                >
                  <Edit2 className="w-4 h-4" />
                </GlassButton>
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAction(row.original.id, "APPROVE")}
                  className="px-3 text-accent-green border-accent-green/20"
                >
                  Approve
                </GlassButton>
                <GlassButton
                  variant="danger"
                  size="sm"
                  onClick={() => handleAction(row.original.id, "REJECT")}
                  className="px-3"
                >
                  Reject
                </GlassButton>
              </>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Hydrating Approval Queue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">Pending Approvals</h2>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {data.length} Goals Awaiting Action
        </div>
      </div>

      <GlassPanel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/5">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="group hover:bg-white/[0.02] transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No pending goals found in your queue.
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
