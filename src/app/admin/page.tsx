import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { reviews: true } } },
  });

  return <AdminDashboard initialRestaurants={restaurants} />;
}
