import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { httpGetTotalAmountPaidToday } from "../../api/metrics.api";
import DashboardCardInvoice from "./DashboardCardInvoice";
import { useInvoiceStore } from "../../Store/invoiceStore";
import { useEffect } from "react";
import Figures from "../../constants/figures/Figures";

function DashboardTotalAmountPaid() {
  const reloadInvoiceList = useInvoiceStore((state) => state.reloadInvoiceList);

  useEffect(() => {
    refetch();
  }, [reloadInvoiceList]);

  const { isLoading, isError, refetch, data } = useQuery({
    queryKey: ["DashboardTotalAmountPaidReceived"],
    queryFn: getDashboardTotalAmountPaid,
    enabled: true,
    staleTime: 1000 * 60 * 30, // Stale time of 30 minutes
  });

  async function getDashboardTotalAmountPaid(page = 0) {
    const response = await httpGetTotalAmountPaidToday();
    return response.data;
  }

  return (
    <View>
      {isLoading || (
        <DashboardCardInvoice
          Title={"Total Amount in Paid Today"}
          ImageIcon={Figures.MoneyHand}
          HeightIcon={65}
          WidthIcon={80}
          CountFontSize={55}
          AmountToDisplay={data.metric}
          size={35}
        />
      )}
    </View>
  );
}

export default DashboardTotalAmountPaid;
