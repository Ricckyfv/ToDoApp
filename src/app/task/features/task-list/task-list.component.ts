import { Component, inject } from '@angular/core';
import { TableComponent } from "../../ui/table/table.component";
import { RouterLink } from '@angular/router';
import { TaskService } from '../../data-access/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TableComponent, RouterLink],
  templateUrl: './task-list.component.html',
  styles: ``,
  providers: [TaskService]
})
export default class TaskListComponent {

  _taskService = inject(TaskService);

  tasks = this._taskService.getTasks;

}
