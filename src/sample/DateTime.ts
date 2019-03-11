import { PromoProgrammeType } from './Programme';
import moment from 'moment';
export interface DateTimeTypes {
  start: number;
  end: number;
}

export interface DateTime {
  date: DateTimeTypes;
  time: DateTimeTypes[];
}

export class DateTimeValidator {
  static validate(arg: DateTime, now: any): boolean {
    //get now
    let current = now
      ? now
      : {
          timestamp: moment().valueOf(),
          hour: moment().hour()
        };
    //validate date
    if (arg.date.start <= current.timestamp && arg.date.end >= current.timestamp) {
      //validate hour
      if (arg.time) {
        let inTime = false;
        arg.time.forEach(time => {
          if (time.start <= current.hour && time.end >= current.hour) inTime = true;
        });
        return inTime;
      } else return true;
    }

    return false;
  }
}
