import { prisma } from "@/lib/prisma";

async function getStats() {
  try {
    const [pendingAppointments, totalAppointments, applications] = await Promise.all([
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.appointment.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.distributorApplication.count({ where: { status: "PENDING" } }),
    ]);

    return { pendingAppointments, totalAppointments, applications };
  } catch {
    // DB 還沒連線時顯示預設值
    return { pendingAppointments: 0, totalAppointments: 0, applications: 0 };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "待處理預約",
      value: stats.pendingAppointments,
      color: "text-gold",
      bgColor: "bg-gold/10",
      borderColor: "border-gold/20",
    },
    {
      label: "本月預約數",
      value: stats.totalAppointments,
      color: "text-ivory",
      bgColor: "bg-ivory/5",
      borderColor: "border-ivory/10",
    },
    {
      label: "待審加盟申請",
      value: stats.applications,
      color: "text-rose-nude",
      bgColor: "bg-rose-nude/10",
      borderColor: "border-rose-nude/20",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif-tc text-2xl text-ivory font-semibold">
          後台總覽
        </h1>
        <p className="text-caption text-ivory/30 mt-1 font-body">
          歡迎回來，以下是目前的營運狀態。
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.bgColor} border ${card.borderColor} rounded-lg p-6
                       transition-all duration-300 hover:border-opacity-40`}
          >
            <p className="text-overline text-ivory/40 uppercase font-body mb-3">
              {card.label}
            </p>
            <p className={`font-display text-4xl font-bold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="/admin/appointments"
          className="block p-5 bg-ivory/5 border border-ivory/8 rounded-lg
                     hover:border-gold/30 hover:bg-gold/5
                     transition-all duration-300
                     focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40"
        >
          <h3 className="text-ivory font-sans-tc font-medium mb-1">📅 預約管理</h3>
          <p className="text-caption text-ivory/30 font-body">查看並處理顧客預約</p>
        </a>
        <a
          href="/admin/applications"
          className="block p-5 bg-ivory/5 border border-ivory/8 rounded-lg
                     hover:border-gold/30 hover:bg-gold/5
                     transition-all duration-300
                     focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40"
        >
          <h3 className="text-ivory font-sans-tc font-medium mb-1">🤝 加盟申請</h3>
          <p className="text-caption text-ivory/30 font-body">審核經銷夥伴申請</p>
        </a>
      </div>
    </div>
  );
}
