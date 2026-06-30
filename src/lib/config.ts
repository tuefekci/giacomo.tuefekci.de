import { dev } from '$app/environment'
import * as json_resume from '../data/resume.json';

const resume = json_resume.default;

export const title = resume.basics.name + '´s Blog'
export const description = resume.basics.summary;
export const url = dev ? 'http://localhost:5173/' : 'https://giacomo.tuefekci.de/'