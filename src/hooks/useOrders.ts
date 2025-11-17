import { useQuery } from "@tanstack/react-query";

export const useOrders = (userId: string) => {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${userId}`);

      if (!res.ok) throw new Error("Failed to fetch orders");

      return res.json();
    },
    enabled: !!userId,
  });
};
