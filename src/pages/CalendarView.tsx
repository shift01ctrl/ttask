
import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameDay } from "date-fns";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import PageLayout from "@/components/layout/PageLayout";
import TaskDialog from "@/components/tasks/TaskDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

const CalendarView = () => {
  const { tasks } = useTaskContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);
  
  const handleAddTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const previousMonth = () => {
    setCurrentMonth((prev) => addDays(prev, -30));
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => addDays(prev, 30));
  };

  const getTasksByDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "";
    }
  };

  return (
    <PageLayout title="Calendar View">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 mt-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-medium text-sm py-2 bg-gray-50"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const dayTasks = getTasksByDate(day);
          const isToday = isSameDay(day, new Date());
          
          // Calculate offset for the first week
          const startOffset = days[0].getDay();
          if (index === 0) {
            const offsetCells = Array.from({ length: startOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="border rounded-md p-1 min-h-[120px] bg-gray-50 opacity-50"></div>
            ));
            
            if (offsetCells.length > 0) {
              return [...offsetCells, 
                <div
                  key={day.toString()}
                  className={cn(
                    "border rounded-md p-1 min-h-[120px]",
                    isToday && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={cn("text-sm font-medium", isToday && "text-primary")}>
                      {format(day, "d")}
                    </span>
                    <span className="text-xs text-gray-500">
                      {dayTasks.length > 0 && `${dayTasks.length} task(s)`}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "p-1 rounded text-xs cursor-pointer hover:bg-gray-100",
                          getPriorityColor(task.priority)
                        )}
                        onClick={() => handleEditTask(task)}
                      >
                        <div className="truncate">{task.title}</div>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <Badge
                        variant="outline"
                        className="w-full justify-center text-xs"
                      >
                        +{dayTasks.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              ];
            }
          }
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "border rounded-md p-1 min-h-[120px]",
                isToday && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={cn("text-sm font-medium", isToday && "text-primary")}>
                  {format(day, "d")}
                </span>
                <span className="text-xs text-gray-500">
                  {dayTasks.length > 0 && `${dayTasks.length} task(s)`}
                </span>
              </div>
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "p-1 rounded text-xs cursor-pointer hover:bg-gray-100",
                      getPriorityColor(task.priority)
                    )}
                    onClick={() => handleEditTask(task)}
                  >
                    <div className="truncate">{task.title}</div>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <Badge
                    variant="outline"
                    className="w-full justify-center text-xs"
                  >
                    +{dayTasks.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        editingTask={editingTask}
      />
    </PageLayout>
  );
};

export default CalendarView;
