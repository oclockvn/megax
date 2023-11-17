"use client";

import Grid from "@mui/material/Grid";

const LeaveCardLoading = dynamic(
  () => import("@/components/common/skeletons/LeaveCardLoading")
);
const LeaveCard = dynamic(() => import("@/components/portal/leave/LeaveCard"));

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { fetchRequestingLeaves } from "@/lib/apis/leave.api";
import { Leave } from "@/lib/models/leave.model";
import { useEffect, useState } from "react";
import { MagicMotion } from "react-magic-motion";

export default function RequestPage() {
  const [items, setItems] = useState<Leave[]>([]);
  const {
    isLoading: loading,
    data,
    status,
  } = useQuery({
    queryKey: ["portal/request"],
    queryFn: () => fetchRequestingLeaves(),
  });

  const onResponded = (leave: Pick<Leave, "id" | "status">) => {
    setItems(prev => prev.filter(x => x.id !== leave.id));
  };

  useEffect(() => {
    if (status === "success") {
      setItems(data || []);
    }
  }, [status, data]);

  return (
    <>
      <div className="container mx-auto py-4">
        <Grid container>
          <Grid item xs={12} sm={4}>
            <h3 className="font-bold text-lg">
              Leave requests ({items.length})
            </h3>
            {loading ? (
              <LeaveCardLoading count={3} />
            ) : (
              Number(items.length) > 0 && (
                <MagicMotion>
                  <div>
                    {items.map(l => (
                      <div key={l.id} className="mt-4">
                        <LeaveCard key="exclude" leave={l} onResponded={onResponded} />
                      </div>
                    ))}
                  </div>
                </MagicMotion>
              )
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
}
