import type { Config } from './config.ts';
import type { OutputDataset, UnknownDataset } from './dataset.ts';
import type { BaseIssue } from './issue.ts';
import type { StandardSchemaProps } from './standard.ts';

/**
 * Base schema type.
 */
export interface BaseSchema<
  TInput,
  TOutput,
  TIssue extends BaseIssue<unknown>,
> {
  /**
   * The object kind.
   */
  readonly kind: 'schema';
  /**
   * The schema type.
   */
  readonly type: string;
  /**
   * The schema reference.
   */
  readonly reference: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => BaseSchema<unknown, unknown, BaseIssue<unknown>>;
  /**
   * The expected property.
   */
  readonly expects: string;
  /**
   * Whether it's async.
   */
  readonly async: false;
  /**
   * The Standard Schema properties.
   *
   * @internal
   */
  readonly '~standard': StandardSchemaProps<TInput, TOutput>;
  /**
   * Parses unknown input values.
   *
   * @param dataset The input dataset.
   * @param config The configuration.
   *
   * @returns The output dataset.
   *
   * @internal
   */
  readonly '~run': (
    dataset: UnknownDataset,
    config: Config<BaseIssue<unknown>>
  ) => OutputDataset<TOutput, TIssue>;
  /**
   * The input, output and issue type.
   *
   * @internal
   */
  readonly '~types'?:
    | {
        readonly input: TInput;
        readonly output: TOutput;
        readonly issue: TIssue;
      }
    | undefined;
}

/**
 * Base schema async type.
 */
export interface BaseSchemaAsync<
  TInput,
  TOutput,
  TIssue extends BaseIssue<unknown>,
> extends Omit<
    BaseSchema<TInput, TOutput, TIssue>,
    'reference' | 'async' | '~run'
  > {
  /**
   * The schema reference.
   */
  readonly reference: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) =>
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>;
  /**
   * Whether it's async.
   */
  readonly async: true;
  /**
   * Parses unknown input values.
   *
   * @param dataset The input dataset.
   * @param config The configuration.
   *
   * @returns The output dataset.
   *
   * @internal
   */
  readonly '~run': (
    dataset: UnknownDataset,
    config: Config<BaseIssue<unknown>>
  ) => Promise<OutputDataset<TOutput, TIssue>>;
}

/**
 * Generic schema type.
 */
export interface GenericSchema<
  TInput = unknown,
  TOutput = TInput,
  TIssue extends BaseIssue<unknown> = BaseIssue<unknown>,
> extends BaseSchema<TInput, TOutput, TIssue> {}

/**
 * Generic schema async type.
 */
export interface GenericSchemaAsync<
  TInput = unknown,
  TOutput = TInput,
  TIssue extends BaseIssue<unknown> = BaseIssue<unknown>,
> extends BaseSchemaAsync<TInput, TOutput, TIssue> {}
