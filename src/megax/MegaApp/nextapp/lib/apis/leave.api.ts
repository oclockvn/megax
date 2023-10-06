import api from "@/lib/api";
import { Result } from "@/lib/models/common.model";
import { Leave, LeaveRequest } from "../models/leave.model";

export async function fetchLeaves() {
  // const res = await api.get<Leave[]>("api/leaves");
  // return res.data;
  const list = JSON.parse(`[{
    "id": 1,
    "reason": "Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus.",
    "leaveDate": "10/16/2022",
    "leaveDay": 2,
    "type": 3,
    "status": 2
  }, {
    "id": 2,
    "reason": "Donec posuere metus vitae ipsum.",
    "leaveDate": "5/15/2023",
    "leaveDay": 1,
    "type": 1,
    "status": 2
  }, {
    "id": 3,
    "reason": "In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem.",
    "leaveDate": "11/14/2022",
    "leaveDay": 1,
    "type": 3,
    "status": 2
  }, {
    "id": 4,
    "reason": "Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
    "leaveDate": "10/29/2022",
    "leaveDay": 2,
    "type": 0,
    "status": 2
  }, {
    "id": 5,
    "reason": "Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat.",
    "leaveDate": "7/2/2023",
    "leaveDay": 2,
    "type": 1,
    "status": 0
  }, {
    "id": 6,
    "reason": "Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem. Sed sagittis.",
    "leaveDate": "12/15/2022",
    "leaveDay": 1,
    "type": 1,
    "status": 1
  }, {
    "id": 7,
    "reason": "Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor.",
    "leaveDate": "12/18/2022",
    "leaveDay": 3,
    "type": 3,
    "status": 2
  }, {
    "id": 8,
    "reason": "Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.",
    "leaveDate": "3/6/2023",
    "leaveDay": 1,
    "type": 3,
    "status": 2
  }, {
    "id": 9,
    "reason": "Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy.",
    "leaveDate": "8/9/2023",
    "leaveDay": 3,
    "type": 3,
    "status": 0
  }, {
    "id": 10,
    "reason": "Quisque id justo sit amet sapien dignissim vestibulum.",
    "leaveDate": "9/2/2023",
    "leaveDay": 1,
    "type": 0,
    "status": 2
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
