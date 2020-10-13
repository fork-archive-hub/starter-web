import { RouteComponentProps } from 'react-router-dom';

export interface StateRoot {}

export interface PropsRoot extends RouteComponentProps {}

export interface StringIndexable<T = any> {
  [key: string]: T;
}

export interface EnvValues extends StringIndexable<string> {
  port: string;
  portApi: string;
  apiBaseUrl: string;
}
