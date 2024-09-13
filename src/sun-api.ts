import { z } from 'zod';

const RawSunDatum = z.object({
  results: z.object({
    date: z.string(),
    sunrise: z.string(),
    sunset: z.string(),
  }),
});
export type RawSunDatum = z.infer<typeof RawSunDatum>;

export type SunDatum = RawSunDatum['results'];
export type SunData = Map<string, SunDatum>;

async function getSunDatum(date: string): Promise<SunDatum> {
  // Location is Oakland, CA
  const datum = await myFetch(`https://api.sunrisesunset.io/json?lat=37.8044&lng=-122.2712&date=${date}`)
  return RawSunDatum.parse(datum).results;
}

export async function getSunData(dates: string[]): Promise<SunData> {
  const data: SunDatum[] = [];
  for (const date of dates) {
    data.push(await getSunDatum(date));
  }
  const result: SunData = new Map();
  for (const datum of data) {
    result.set(datum.date, datum);
  }
  return result;
}

async function myFetch<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (res.status === 200) {
    return res.json();
  } else {
    return Promise.reject(await res.json());
  }
}
