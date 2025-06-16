import { Component, effect, inject, input } from '@angular/core';
import { Task, TaskService } from '../../data-access/task.service';
import { RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { CommonModule, TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [RouterLink, CommonModule, TitleCasePipe, UpperCasePipe],
  templateUrl: './table.component.html',
  styles: ``,
})
export class TableComponent {
  private _taskService = inject(TaskService);

  tasks = input.required<Task[]>();

  get sortedTasks(): Task[] {
    const priorityOrder = { alta: 1, media: 2, baja: 3 };

    return this.tasks()
      .slice()
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  delete(id: string) {
    this._taskService
      .delete(id)
      .then(() => {
        toast.success('Tarea eliminada');
      })
      .catch(() => {
        toast.error('Error al eliminar la tarea');
      });
  }

  selectedTask: Task | null = null;
  isModalOpen = false;

  showDueDate(task: Task) {
    this.selectedTask = task;
    this.isModalOpen = true;

    const modal = document.getElementById('default-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
