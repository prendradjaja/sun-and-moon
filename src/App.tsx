import { useState, useEffect } from 'react'
import { lunarCalendar } from './lunar-calendar';
import { fullMoon, newMoon } from './moon-emojis';
import { getSunData, SunDatum, SunData } from './sun-api';
import { format, parseISO } from 'date-fns';

function App() {
  const [sunData, setSunData] = useState<SunData>(new Map())

  useEffect(() => {
    const dates = lunarCalendar.map(row => row.date);
    getSunData(dates)
    .then(setSunData)
  }, []);

  return <>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Sunrise</th>
          <th>Sunset</th>
        </tr>
      </thead>
      <tbody>
        {lunarCalendar.map(row =>
          <tr key={row.date} className={
            (row.isDST ? 'is-dst ' : ' ') +
            row.type
          }>
            <td>
              {row.type === 'full-moon' ? fullMoon : newMoon}
              {' '}
              {formatDate(row.date)}
            </td>
            <td>{formatTime(sunData.get(row.date)?.sunrise)}</td>
            <td>{formatTime(sunData.get(row.date)?.sunset)}</td>
          </tr>
        )}
      </tbody>
    </table>
  </>
}

function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "MMMM d - EEE");
}

function formatTime(timeString?: string): string {
  if (!timeString) {
    return '';
  }
  let [hms, ampm] = timeString.split(' ');
  ampm = ampm.toLowerCase();
  const [h, m, s] = hms.split(':');
  return `${h}:${m} ${ampm}`;
}

export default App
