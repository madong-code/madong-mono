export interface NoticeRow {
  id: string;
  message_id?: null | string;
  title: string;
  type: number;
  content: any;
  enabled: number;
  created_by: null | string;
  updated_by: null | string;
  created_date: string;
  updated_date: null | string;
  created_dept: null | string;
  remark: null | string;
}
