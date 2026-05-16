import { ApprovalTable } from "@/components/manager/ApprovalTable";

export default function ApprovalsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight italic">Approval Engine</h1>
        <p className="text-gray-400 mt-2">Audit and approve performance targets for your reporting personnel.</p>
      </div>
      
      <ApprovalTable />
    </div>
  );
}
