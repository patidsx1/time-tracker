import { AfterViewInit, Component,  OnInit } from '@angular/core';
import { TaskHistory, TimeTracker } from '../models/time-tracker.interface';
import { TimeTrackerService } from '../services/time-tracker.service';

@Component({
  selector: 'app-time-tracker',
  templateUrl: './time-tracker.component.html',
  styleUrls: ['./time-tracker.component.scss'],
})
export class TimeTrackerComponent implements OnInit, AfterViewInit {
  taskList: Array<TimeTracker> = [];
  interval: any;
  newTask: string = '';
  totalTime: number = 0;
  constructor(private TimeTrackerService: TimeTrackerService) {}

  ngOnInit() {

    this.taskList = this.getData();
    if (this.taskList.length) {
      this.taskList.map((task) => {
        if (task.buttonText == 'Stop') {
          task.buttonText = 'Start';
          task.timer = '00:00:00';
          task.history = task.history.filter(
            (hist:any) => hist.startDateAndTime && hist.stopDateAndTime
          );
          if (task.interval) {
            clearInterval(task.interval);
          }
        }
      });
    }
    this.setData();
    this.calculateTotalTime();
  }

  ngAfterViewInit(): void {
    const modal = document.getElementById('staticBackdrop');
   if(modal)
    modal.addEventListener('hidden.bs.modal', () =>{
      this.addTask();
  });

  }

  getData() {
    return this.TimeTrackerService.getData();
  }

  setData() {
    this.TimeTrackerService.setData(this.taskList);
  }

  timer(index: number) {
    this.taskList[index].buttonText == 'Start'
      ? this.startTimer(index)
      : this.stopTimer(index);
  }

  startTimer(index: number) {
    this.taskList[index].buttonText = 'Stop';
    let seconds = 0;
    this.taskList[index].interval = setInterval(() => {
      seconds++;
      this.taskList[index].timer = this.formatTime(seconds);
    }, 1000);

    this.updateHistory(index, 'start');
  }

  stopTimer(index: number) {
    clearInterval(this.taskList[index].interval);
    this.taskList[index].buttonText = 'Start';
    this.taskList[index].timer = '00:00:00';
    this.updateHistory(index, 'end');
  }

  formatTime(timeInSeconds: number): string {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(
      seconds
    )}`;
  }

  padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  updateHistory(index: number, type: string) {
    let date =
      new Date().toLocaleDateString('en-US') +
      ' ' +
      new Date().toLocaleTimeString('en-US', { hour12: false });
    if (type == 'start')
      this.taskList[index].history.push(
        new TaskHistory({ startDateAndTime: date, stopDateAndTime: null })
      );
    else {
      let histIndex = this.taskList[index].history.findIndex(
        (t:any) => t.stopDateAndTime == null
      );
      this.taskList[index].history[histIndex].stopDateAndTime = date;
    }

    this.setData();
    this.calculateTotalTime();
  }

  deleteTask(index: number) {
    this.taskList.splice(index, 1);
    this.setData();
    this.calculateTotalTime();
  }

  addTask() {
    if(this.newTask)
    {
      this.taskList.push(
        new TimeTracker({
          task: this.newTask
        })
      );
      this.newTask = '';
      this.setData();

    }
  

  }
  calculateTotalTime() {
    if (this.taskList.length) {
      let timediff: number = 0;
      this.taskList.forEach((task) => {
        if (task.history.length)
          task.history.forEach((hist:any) => {
            if (hist.stopDateAndTime && hist.startDateAndTime)
              timediff +=
                new Date(hist.stopDateAndTime).getTime() -
                new Date(hist.startDateAndTime).getTime();
          });
      });
      this.totalTime =  parseFloat((timediff / (1000 * 60 * 60)).toFixed(3));
    } else {
      this.totalTime = 0;
    }
  }

  addSpace(str:string){
    return str.replace(/:/g, " : ") 
  }

}