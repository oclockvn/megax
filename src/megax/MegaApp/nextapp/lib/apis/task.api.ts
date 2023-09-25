import api, { upload } from "@/lib/api";
import { Filter, PagedResult, Result } from "@/lib/models/common.model";
import { User, UserDeviceRecord } from "@/lib/models/user.model";
import { normalizeDateTimePayload, qs, toFormData } from "../util";
import { AxiosError,  } from "axios";
import { Contact } from "../models/contact.model";
import { Document as UserDocument } from "../models/document.model";
import { Time, Task, SubTask, SubTaskAction, SubTaskActionResult } from "../models/task.model";

export async function fetchTasks(filter: Partial<Filter> | undefined) {
  const src = JSON.parse(`
  [{
    "id": 1,
    "title": "sed nisl nunc rhoncus dui vel sem sed sagittis nam congue risus semper porta",
    "project": "Domainer",
    "client": "Gigashots",
    "time": 57.28,
    "reference": "http://odnoklassniki.ru/sapien/urna/pretium/nisl/ut.json"
  }, {
    "id": 2,
    "title": "eleifend pede libero quis orci nullam molestie nibh in lectus pellentesque at nulla suspendisse potenti cras",
    "project": "Opela",
    "client": "Ntag",
    "time": 72.21,
    "reference": "http://bloglines.com/justo/sit/amet/sapien/dignissim/vestibulum.png"
  }, {
    "id": 3,
    "title": "lobortis sapien sapien non mi integer ac neque duis bibendum morbi non quam",
    "project": "Aerified",
    "client": "Dazzlesphere",
    "time": 96.68,
    "reference": "https://opera.com/eu/interdum/eu.json"
  }, {
    "id": 4,
    "title": "mus etiam vel augue vestibulum rutrum rutrum neque",
    "project": "Zoolab",
    "client": "Brainbox",
    "time": 94.98,
    "reference": "http://slideshare.net/commodo/placerat.jsp"
  }, {
    "id": 5,
    "title": "quis libero nullam sit amet turpis elementum ligula",
    "project": "Lotlux",
    "client": "Ntag",
    "time": 41.64,
    "reference": "https://mozilla.org/vulputate.xml"
  }, {
    "id": 6,
    "title": "augue luctus tincidunt nulla mollis molestie",
    "project": "Flexidy",
    "client": "Tagchat",
    "time": 99.88,
    "reference": "https://sina.com.cn/felis/eu/sapien/cursus/vestibulum.aspx"
  }, {
    "id": 7,
    "title": "quisque porta volutpat erat quisque erat eros viverra eget congue eget semper rutrum",
    "project": "Duobam",
    "client": "Oyoyo",
    "time": 97.88,
    "reference": "http://skyrock.com/lobortis/est/phasellus/sit/amet/erat.js"
  }, {
    "id": 8,
    "title": "tempor convallis nulla neque libero convallis eget eleifend",
    "project": "Matsoft",
    "client": "DabZ",
    "time": 31.97,
    "reference": "https://jimdo.com/condimentum/neque/sapien/placerat.aspx"
  }, {
    "id": 9,
    "title": "quam suspendisse potenti nullam porttitor lacus at turpis donec posuere metus vitae ipsum aliquam non mauris",
    "project": "Konklux",
    "client": "Livepath",
    "time": 5.1,
    "reference": "https://salon.com/turpis/nec/euismod/scelerisque/quam/turpis.js"
  }, {
    "id": 10,
    "title": "magna bibendum imperdiet nullam orci pede venenatis non sodales sed tincidunt eu felis",
    "project": "Bamity",
    "client": "Ntag",
    "time": 93.57,
    "reference": "http://yelp.com/massa/donec/dapibus/duis/at/velit.xml"
  }]`)

  const todos = src.map((x: any) => {
    let t = x as Task;
    t.time = new Time(Number( x.time ));

    return t;
  })
  console.log(`fetching todos`);

  return await Promise.resolve(todos);
  // const res = await api.get<Todo[]>("api/todos?" + qs(filter));
  // return res.data;
}

export async function deleteTask(id: number) {
  // const res = await api.delete<Result<boolean>>(`api/todos/${id}`);
  // return res.data;
  return Promise.resolve({ code: '', data: id, success: true } as Result<number>)
}

export async function saveSubTask(subtask: SubTask) {
  // const res = await api.delete<Result<boolean>>(`api/todos/${id}`);
  // return res.data;
  return Promise.resolve({ code: '', data: { ...subtask, id: subtask.id || Date.now() }, success: true } as Result<SubTask>)
}

export async function handleSubTaskAction(id: number, taskId:number, action: SubTaskAction) {
  // const res = await api.delete<Result<boolean>>(`api/todos/${id}`);
  // return res.data;
  return Promise.resolve({ code: '', data: { id, action, taskId }, success: true } as Result<SubTaskActionResult>)
}
