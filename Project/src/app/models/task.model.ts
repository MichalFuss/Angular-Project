export class getTaskModel {
    id: number;
    project_id: number;
    title: string;
    description: string;
    status: "todo" | "in_progress" | "done";
    priority: "low" | "normal" | "high";
    assignee_id: number;
    due_date: Date;
    order_index: number;
    created_at: Date;
    updated_at: Date;
}
export class postTaskModel {

      projectId: number;
      title: string;
      description: string;
      status: "todo" | "in_progress" | "done";
      priority: "low" | "normal" | "high";
      assigneeId: number;
      dueDate: Date;
      orderIndex: number

}
export class patchTaskModel {
    title: string;
    description: string;
    status: "todo" | "in_progress" | "done";
    priority: "low" | "normal" | "high";
    assignee_id: number;
    due_date: Date;
    order_index: number;
}
