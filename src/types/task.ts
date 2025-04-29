
export interface Task {
  id: string;
  title: string;
  description: string;
  startDate?: string; // ISO string format
  dueDate: string; // ISO string format
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  createdAt: string; // ISO string format
  assignedTo?: string; // User ID
}
