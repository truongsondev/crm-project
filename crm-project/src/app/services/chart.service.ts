import { Injectable } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
@Injectable({ providedIn: 'root' })
export class ChartService {
  initChart(labelChart: string, colorChart: string) {
    const configChart: ChartData<any> = {
      labels: [],
      datasets: [
        {
          label: labelChart,
          data: [],
          backgroundColor: colorChart,
        },
      ],
    };

    return configChart;
  }
}
