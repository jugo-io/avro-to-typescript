import { AvroRecord } from './AvroRecord';

export abstract class BaseAvroRecord implements AvroRecord {
  public static readonly subject: string = '';
  public static readonly schema = {};

  public abstract schema(): any;

  public abstract subject(): string;
}
