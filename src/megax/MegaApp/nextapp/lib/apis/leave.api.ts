import api from "@/lib/api";
import { Result } from "@/lib/models/common.model";
import { Leave, LeaveRequest } from "../models/leave.model";

export async function fetchLeaves() {
  // const res = await api.get<Leave[]>("api/leaves");
  // return res.data;
  const list = JSON.parse(`[{
    "id": 1,
    "reason": "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",
    "leaveDate": "8/11/2023",
    "leaveDay": 3,
    "type": "Annual"
  }, {
    "id": 2,
    "reason": "Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla.",
    "leaveDate": "4/30/2023",
    "leaveDay": 3,
    "type": "Other"
  }, {
    "id": 3,
    "reason": "Praesent blandit lacinia erat.",
    "leaveDate": "6/14/2023",
    "leaveDay": 1,
    "type": "Other"
  }, {
    "id": 4,
    "reason": "Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo.",
    "leaveDate": "3/5/2023",
    "leaveDay": 3,
    "type": "Paid"
  }, {
    "id": 5,
    "reason": "Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti.",
    "leaveDate": "7/26/2023",
    "leaveDay": 1,
    "type": "TimeInLieu"
  }, {
    "id": 6,
    "reason": "Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.",
    "leaveDate": "1/30/2023",
    "leaveDay": 1,
    "type": "Annual"
  }, {
    "id": 7,
    "reason": "Nunc purus. Phasellus in felis.",
    "leaveDate": "8/23/2023",
    "leaveDay": 2,
    "type": "Annual"
  }, {
    "id": 8,
    "reason": "Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim.",
    "leaveDate": "12/23/2022",
    "leaveDay": 1,
    "type": "Other"
  }, {
    "id": 9,
    "reason": "Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus.",
    "leaveDate": "6/5/2023",
    "leaveDay": 1,
    "type": "Paid"
  }, {
    "id": 10,
    "reason": "Mauris lacinia sapien quis libero.",
    "leaveDate": "4/15/2023",
    "leaveDay": 3,
    "type": "Annual"
  }]`) as Leave[];

  return list;
}

export async function submitLeave(request: LeaveRequest) {
  // const res = await api.delete<Result<boolean>>(`api/todos/${id}`);
  // return res.data;
  return Promise.resolve({
    code: "",
    data: {...request, id: Date.now() },
    success: true,
  } as Result<Leave>);
}
