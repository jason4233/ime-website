interface AdminPageShellProps {
  title: string;
  description: string;
  icon: string;
}

export function AdminPageShell({ title, description, icon }: AdminPageShellProps) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif-tc text-2xl text-ivory font-semibold flex items-center gap-3">
          <span>{icon}</span>
          {title}
        </h1>
        <p className="text-caption text-ivory/30 mt-1 font-body">
          {description}
        </p>
      </div>

      {/* Placeholder — 下一階段填入 CRUD 表格 */}
      <div className="border border-dashed border-ivory/10 rounded-lg p-12 text-center">
        <p className="text-ivory/20 font-body text-sm">
          CRUD 功能將在下一階段實作
        </p>
      </div>
    </div>
  );
}
