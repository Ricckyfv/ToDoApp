import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Task, TaskCreate, TaskService } from '../../data-access/task.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.component.html',
  styles: ``,
  providers: [TaskService],
})
export default class TaskFormComponent {
  private _formBuilder = inject(FormBuilder);
  private _taskService = inject(TaskService);
  private _router = inject(Router);

  loading = signal(false);

  idTask = input.required<string>();

  form = this._formBuilder.group({
    title: this._formBuilder.control('', Validators.required),
    completed: this._formBuilder.control(false, Validators.required),
    category: ['', Validators.required],
    priority: ['media', Validators.required],
    dueDate: ['']
  });

  constructor() {
    effect(() => {
      //console.log(this.idTask());

      const id = this.idTask();
      if (id) {
        this.getTask(id);
      }
    });
  }

  async getTask(id: string) {
    const taskSnapshot = await this._taskService.getTask(id);

    if (!taskSnapshot.exists()) return;

    const task = taskSnapshot.data() as Task;

    this.form.patchValue(task);
  }

  async submit() {
    if (this.form.invalid) return;

    try {
      this.loading.set(true);
      const { title, completed, dueDate } = this.form.value;
      const task: TaskCreate = {
        title: title || '',
        completed: !!completed, //If it is true, it will be true, if it is false, it will be false, because we use doble negation
        category: this.form.value.category || '',
        priority: (this.form.get('priority')?.value as 'alta' | 'media' | 'baja') || 'media',
        dueDate: dueDate || ''
      };

      const id = this.idTask();

      if (id) {
        await this._taskService.update(task, id);
      } else {
        await this._taskService.create(task);
      }

      toast.success(`Task ${id ? 'editadp' : 'creado'} correctamente`);
      this._router.navigateByUrl('/tasks');
    } catch (error) {
      toast.error('Error al crear o editar la tarea');
    } finally {
      this.loading.set(false);
    }
  }
}
