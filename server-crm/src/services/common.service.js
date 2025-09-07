import { format, isValid } from "date-fns";
export class CommonService {
  static formatDate(date) {
    return isValid(date) ? format(date, "MMM d, yyyy, h:mm:ss a") : "";
  }
}
